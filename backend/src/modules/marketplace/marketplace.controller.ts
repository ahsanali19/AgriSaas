// backend/src/modules/marketplace/marketplace.controller.ts
import { Request, Response } from 'express';
import { db } from '../../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MarketplaceController {

  /**
   * POST /api/marketplace/unlock-lead
   * Monetization Route: Charges Buyer's wallet (Rs. 100 default unlock fee)
   * to unlock the direct farmer contact details for a listing.
   */
  static async unlockLead(req: Request, res: Response): Promise<void> {
    const connection = await db.getConnection();
    try {
      const { listingId, buyerId, farmerId } = req.body;
      const UNLOCK_FEE = 100.00; // Rs. 100 per lead

      if (!listingId || !buyerId) {
        res.status(400).json({
          success: false,
          message: 'Missing required parameters: listingId and buyerId are required.'
        });
        return;
      }

      await connection.beginTransaction();

      // 1. Check if lead is already unlocked for this buyer
      const [existingLead] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM marketplace_leads WHERE buyer_id = ? AND listing_id = ?`,
        [buyerId, listingId]
      );

      // Fetch the farmer's raw unmasked phone number and listing title
      const [listingRows] = await connection.query<RowDataPacket[]>(
        `SELECT l.*, u.phone_number AS farmer_phone, u.full_name AS farmer_name
         FROM marketplace_listings l
         JOIN users u ON l.farmer_id = u.id
         WHERE l.id = ?`,
        [listingId]
      );

      const listing: any = listingRows[0] || {
        id: listingId,
        farmer_id: 1,
        title: 'B2B Farm Harvest / Livestock',
        farmer_phone: '+923008472910',
        farmer_name: 'Verified Agri Producer'
      };

      if (existingLead.length > 0 && existingLead[0].status === 'unlocked') {
        await connection.commit();
        res.json({
          success: true,
          message: 'Lead was already unlocked previously.',
          alreadyUnlocked: true,
          lead: existingLead[0],
          farmerContact: {
            phone: listing.farmer_phone,
            name: listing.farmer_name,
            whatsappLink: `https://wa.me/${listing.farmer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum, I unlocked your AgriSaaS listing: ${listing.title}`)}`
          }
        });
        return;
      }

      // 2. Fetch Buyer profile & Check Wallet Balance
      const [buyerRows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM buyers WHERE id = ? FOR UPDATE`,
        [buyerId]
      );

      if (buyerRows.length === 0) {
        await connection.rollback();
        res.status(404).json({
          success: false,
          message: 'Commercial Buyer account not found.'
        });
        return;
      }

      const buyer = buyerRows[0];
      const currentWallet = Number(buyer.wallet_balance || 0);

      // Check balance
      if (currentWallet < UNLOCK_FEE && buyer.buyer_subscription_status !== 'enterprise_tier') {
        await connection.rollback();
        res.status(402).json({
          success: false,
          message: `Insufficient wallet balance (Current: Rs. ${currentWallet.toLocaleString()}). Lead unlock fee is Rs. ${UNLOCK_FEE}. Please recharge your buyer wallet.`,
          requiredAmount: UNLOCK_FEE,
          currentBalance: currentWallet
        });
        return;
      }

      // 3. Deduct Rs. 100 from Buyer Wallet
      const newWalletBalance = buyer.buyer_subscription_status === 'enterprise_tier'
        ? currentWallet // Unlimited free unlocks for enterprise tier buyers
        : currentWallet - UNLOCK_FEE;

      await connection.query(
        `UPDATE buyers 
         SET wallet_balance = ?, total_leads_unlocked = total_leads_unlocked + 1 
         WHERE id = ?`,
        [newWalletBalance, buyerId]
      );

      // 4. Insert or Update Marketplace Lead Record
      await connection.query(
        `INSERT INTO marketplace_leads (listing_id, buyer_id, farmer_id, status, unlock_fee, unlocked_at)
         VALUES (?, ?, ?, 'unlocked', ?, NOW())
         ON DUPLICATE KEY UPDATE 
           status = 'unlocked', 
           unlock_fee = VALUES(unlock_fee), 
           unlocked_at = NOW()`,
        [listingId, buyerId, farmerId || listing.farmer_id || 1, UNLOCK_FEE]
      );

      await connection.commit();

      res.json({
        success: true,
        message: 'Farmer contact details successfully unlocked!',
        feeDeducted: UNLOCK_FEE,
        remainingWalletBalance: newWalletBalance,
        farmerContact: {
          phone: listing.farmer_phone,
          name: listing.farmer_name,
          whatsappLink: `https://wa.me/${listing.farmer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum, I am a commercial buyer from AgriSaaS interested in: ${listing.title}`)}`
        }
      });
    } catch (err: any) {
      await connection.rollback();
      console.error('Error unlocking marketplace lead:', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error while unlocking lead.',
        error: err.message
      });
    } finally {
      connection.release();
    }
  }

  /**
   * GET /api/marketplace/listings
   * Fetches listings with masked phone numbers for buyers unless lead is unlocked.
   */
  static async getListings(req: Request, res: Response): Promise<void> {
    try {
      const buyerId = req.query.buyerId ? Number(req.query.buyerId) : null;
      const category = req.query.category as string;

      let query = `
        SELECT l.*, u.phone_number AS farmer_phone, u.full_name AS farmer_name
        FROM marketplace_listings l
        JOIN users u ON l.farmer_id = u.id
        WHERE l.status = 'active'
      `;
      const params: any[] = [];

      if (category && category !== 'all') {
        query += ` AND l.category = ?`;
        params.push(category);
      }

      query += ` ORDER BY l.created_at DESC`;

      const [rows] = await db.query<RowDataPacket[]>(query, params);

      // Fetch buyer's unlocked lead IDs if buyerId provided
      let unlockedListingIds = new Set<number>();
      if (buyerId) {
        const [leads] = await db.query<RowDataPacket[]>(
          `SELECT listing_id FROM marketplace_leads WHERE buyer_id = ? AND status = 'unlocked'`,
          [buyerId]
        );
        leads.forEach(l => unlockedListingIds.add(l.listing_id));
      }

      // Format response, masking phone number if locked
      const listings = rows.map(item => {
        const isUnlocked = unlockedListingIds.has(item.id);
        const rawPhone = item.farmer_phone || '+923001234567';

        return {
          id: item.id,
          title: item.title,
          category: item.category,
          price: Number(item.price),
          currency: item.currency || 'PKR',
          quantity: item.quantity,
          locationDistrict: item.location_district,
          imageUrl: item.image_url,
          description: item.description,
          sellerName: item.farmer_name || 'Verified Farmer',
          isVerifiedFarmer: Boolean(item.is_verified_farmer),
          postedDate: item.created_at,
          leadStatus: isUnlocked ? 'unlocked' : 'locked',
          // Mask phone if not unlocked by buyer
          sellerPhone: isUnlocked ? rawPhone : maskPhoneNumber(rawPhone),
          rawPhoneUnlocked: isUnlocked ? rawPhone : null
        };
      });

      res.json({
        success: true,
        count: listings.length,
        listings
      });
    } catch (err: any) {
      console.error('Error fetching marketplace listings:', err);
      res.status(500).json({
        success: false,
        message: 'Could not fetch listings.',
        error: err.message
      });
    }
  }

  /**
   * GET /api/marketplace/buyer-wallet
   * Returns buyer wallet and unlocked lead statistics.
   */
  static async getBuyerWallet(req: Request, res: Response): Promise<void> {
    try {
      const buyerId = Number(req.query.buyerId) || 1;

      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT id, mobile, name, company, buyer_subscription_status, wallet_balance, total_leads_unlocked
         FROM buyers WHERE id = ?`,
        [buyerId]
      );

      if (rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Buyer profile not found.'
        });
        return;
      }

      res.json({
        success: true,
        buyer: rows[0]
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Could not retrieve buyer wallet.',
        error: err.message
      });
    }
  }
}

/**
 * Helper: Mask phone number (e.g., '+92 300 8472910' -> '+92 300 •••••••')
 */
function maskPhoneNumber(phone: string): string {
  if (!phone) return '+92 300 •••••••';
  const prefix = phone.substring(0, Math.min(6, phone.length));
  return `${prefix} •••••••`;
}
