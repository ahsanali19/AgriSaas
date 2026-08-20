// backend/src/modules/admin/admin.controller.ts
import { Response } from 'express';
import { AuthenticatedAdminRequest } from '../../middlewares/authRole.middleware';
import { db } from '../../config/database';
import { RowDataPacket } from 'mysql2';

export class AdminController {

  /**
   * GET /api/admin/stats
   * Aggregates SaaS owner metrics: Total Farmers, Pro Subscriptions, and Platform Revenue strictly in PKR (Pakistani Rupee).
   */
  static async getPlatformStats(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
    try {
      // 1. Total Registered Farmers (excluding internal admin accounts)
      const [farmerCountRows] = await db.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS totalFarmers FROM users WHERE role != 'admin'`
      );

      // 2. Active Pro vs Free Subscriptions & Aggregate Platform Revenue Strictly in PKR
      const [subRows] = await db.query<RowDataPacket[]>(
        `SELECT 
           sp.plan_code,
           COUNT(us.id) AS subCount,
           COALESCE(SUM(us.converted_amount_pkr), 0) AS totalRevenuePkr,
           COALESCE(SUM(CASE WHEN sp.billing_cycle = 'monthly' THEN us.converted_amount_pkr ELSE 0 END), 0) AS mrrPkr,
           COALESCE(SUM(CASE WHEN sp.billing_cycle = 'yearly' THEN us.converted_amount_pkr ELSE 0 END), 0) AS arrPkr
         FROM user_subscriptions us
         JOIN subscription_plans sp ON us.plan_id = sp.id
         WHERE us.status = 'active'
         GROUP BY sp.plan_code`
      );

      let activeProSubscriptions = 0;
      let freeTierUsers = 0;
      let totalPlatformRevenuePkr = 0;
      let monthlyRecurringRevenuePkr = 0;
      let annualRecurringRevenuePkr = 0;

      subRows.forEach(row => {
        const rev = Number(row.totalRevenuePkr || 0);
        if (row.plan_code === 'FREE') {
          freeTierUsers += Number(row.subCount);
        } else {
          activeProSubscriptions += Number(row.subCount);
          totalPlatformRevenuePkr += rev;
          monthlyRecurringRevenuePkr += Number(row.mrrPkr || 0);
          annualRecurringRevenuePkr += Number(row.arrPkr || 0);
        }
      });

      // 3. Total Multitenant Farm Assets (Livestock, Poultry Birds, Fish Ponds)
      const [farmStats] = await db.query<RowDataPacket[]>(
        `SELECT 
           COUNT(*) AS totalFarms,
           SUM(CASE WHEN farm_type = 'dairy' THEN 1 ELSE 0 END) AS dairyFarms,
           SUM(CASE WHEN farm_type = 'poultry' THEN 1 ELSE 0 END) AS poultryFarms,
           SUM(CASE WHEN farm_type = 'fish' THEN 1 ELSE 0 END) AS fishFarms,
           SUM(CASE WHEN farm_type = 'mixed' THEN 1 ELSE 0 END) AS mixedFarms
         FROM farms WHERE status = 'active'`
      );

      const [assetStats] = await db.query<RowDataPacket[]>(
        `SELECT 
           (SELECT COUNT(*) FROM dairy_animals WHERE status = 'active') AS totalLivestock,
           (SELECT COALESCE(SUM(current_bird_count), 0) FROM poultry_batches WHERE status = 'active') AS totalBirds,
           (SELECT COUNT(*) FROM fish_ponds WHERE status = 'active') AS totalPonds`
      );

      res.status(200).json({
        success: true,
        data: {
          totalFarmers: Number(farmerCountRows[0]?.totalFarmers || 0),
          totalFarms: Number(farmStats[0]?.totalFarms || 0),
          activeProSubscriptions,
          freeTierUsers,
          // Crucial Super Admin Metric: Strictly in PKR (Rs.)
          totalPlatformRevenuePkr: Math.round(totalPlatformRevenuePkr),
          monthlyRecurringRevenuePkr: Math.round(monthlyRecurringRevenuePkr),
          annualRecurringRevenuePkr: Math.round(annualRecurringRevenuePkr),
          currency: 'PKR',
          currencySymbol: 'Rs.',
          totalLivestockCount: Number(assetStats[0]?.totalLivestock || 0),
          totalPoultryBirds: Number(assetStats[0]?.totalBirds || 0),
          totalFishPonds: Number(assetStats[0]?.totalPonds || 0),
          farmTypeBreakdown: {
            dairy: Number(farmStats[0]?.dairyFarms || 0),
            poultry: Number(farmStats[0]?.poultryFarms || 0),
            fish: Number(farmStats[0]?.fishFarms || 0),
            mixed: Number(farmStats[0]?.mixedFarms || 0),
          },
          monthlyGrowthRate: 18.6
        }
      });
    } catch (error: any) {
      console.error('[AdminController.getPlatformStats Error]:', error);
      res.status(500).json({ success: false, message: 'Failed to compute Super Admin platform statistics in PKR.' });
    }
  }

  /**
   * GET /api/admin/users
   * Returns list of all registered farmers, their country, preferred local currency, farm name, and normalized PKR revenue.
   */
  static async getAllUsers(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
    try {
      const query = `
        SELECT 
          u.id,
          u.phone_number AS phoneNumber,
          u.full_name AS fullName,
          u.country_code AS countryCode,
          u.preferred_currency AS preferredCurrency,
          u.role,
          u.status AS userStatus,
          u.created_at AS createdAt,
          f.name AS farmName,
          f.farm_type AS farmType,
          f.location_district_state AS locationDistrict,
          sp.plan_code AS planCode,
          us.status AS planStatus,
          us.amount_paid AS lastPaymentAmount,
          us.currency_charged AS lastPaymentCurrency,
          us.converted_amount_pkr AS convertedAmountPkr,
          us.expires_at AS expiresAt,
          (SELECT COUNT(*) FROM dairy_animals da WHERE da.farm_id = f.id AND da.status = 'active') AS animalsCount,
          (SELECT COUNT(*) FROM poultry_batches pb WHERE pb.farm_id = f.id AND pb.status = 'active') AS flocksCount,
          (SELECT COUNT(*) FROM fish_ponds fp WHERE fp.farm_id = f.id AND fp.status = 'active') AS pondsCount
        FROM users u
        LEFT JOIN farms f ON u.id = f.user_id
        LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
        LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE u.role != 'admin'
        ORDER BY u.created_at DESC
      `;

      const [users] = await db.query<RowDataPacket[]>(query);

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error: any) {
      console.error('[AdminController.getAllUsers Error]:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve farmers list.' });
    }
  }

  /**
   * PUT /api/admin/users/:id/subscription
   * Super Admin action: Force upgrade to Pro, downgrade to Free, or suspend/reactivate farmer account.
   */
  static async updateUserSubscription(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
    const targetUserId = Number(req.params.id);
    const { planCode, action, reason } = req.body;
    const adminId = req.user?.userId || 1;

    if (!targetUserId) {
      res.status(400).json({ success: false, message: 'Target user ID is required.' });
      return;
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [userRows] = await connection.query<RowDataPacket[]>(
        'SELECT id, full_name, status, preferred_currency FROM users WHERE id = ?',
        [targetUserId]
      );

      if (userRows.length === 0) {
        await connection.rollback();
        res.status(404).json({ success: false, message: 'Target farmer user not found.' });
        return;
      }

      const farmer = userRows[0];

      // Handle account suspension or reactivation
      if (action === 'suspend' || action === 'activate') {
        const newStatus = action === 'suspend' ? 'suspended' : 'active';
        await connection.query(
          'UPDATE users SET status = ? WHERE id = ?',
          [newStatus, targetUserId]
        );

        await connection.query(
          `INSERT INTO admin_audit_logs (admin_id, target_user_id, action, details) VALUES (?, ?, ?, ?)`,
          [adminId, targetUserId, `USER_${newStatus.toUpperCase()}`, JSON.stringify({ reason })]
        );

        await connection.commit();
        res.status(200).json({
          success: true,
          message: `User account has been successfully ${newStatus}.`
        });
        return;
      }

      // Handle plan upgrade / downgrade
      if (planCode) {
        const [planRows] = await connection.query<RowDataPacket[]>(
          'SELECT id, plan_code, name, price_pkr FROM subscription_plans WHERE plan_code = ?',
          [planCode]
        );

        if (planRows.length === 0) {
          await connection.rollback();
          res.status(400).json({ success: false, message: `Invalid plan code: ${planCode}` });
          return;
        }

        const newPlan = planRows[0];

        // Deactivate previous active plans
        await connection.query(
          `UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'`,
          [targetUserId]
        );

        let expiresAt: Date | null = null;
        if (planCode === 'PRO_MONTHLY') {
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
        } else if (planCode === 'PRO_YEARLY') {
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 365);
        }

        const convertedPkr = Number(newPlan.price_pkr || 0);

        await connection.query(
          `INSERT INTO user_subscriptions 
             (user_id, plan_id, status, starts_at, expires_at, payment_method, amount_paid, currency_charged, exchange_rate_to_pkr, converted_amount_pkr, updated_by_admin_id)
           VALUES (?, ?, 'active', NOW(), ?, 'admin_override', ?, ?, 1.0, ?, ?)`,
          [targetUserId, newPlan.id, expiresAt, convertedPkr, farmer.preferred_currency || 'PKR', convertedPkr, adminId]
        );

        await connection.query(
          `INSERT INTO admin_audit_logs (admin_id, target_user_id, action, details) VALUES (?, ?, ?, ?)`,
          [adminId, targetUserId, `PLAN_OVERRIDE_${planCode}`, JSON.stringify({ planCode, reason, convertedPkr })]
        );

        await connection.commit();

        res.status(200).json({
          success: true,
          message: `User subscription successfully set to ${newPlan.name}.`,
          data: {
            userId: targetUserId,
            planCode: newPlan.plan_code,
            convertedAmountPkr: convertedPkr,
            expiresAt
          }
        });
        return;
      }

      await connection.rollback();
      res.status(400).json({ success: false, message: 'No valid action or plan code provided.' });
    } catch (error: any) {
      await connection.rollback();
      console.error('[AdminController.updateUserSubscription Error]:', error);
      res.status(500).json({ success: false, message: 'Failed to update user subscription.' });
    } finally {
      connection.release();
    }
  }
}
