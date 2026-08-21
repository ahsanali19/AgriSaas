// backend/src/modules/marketplace/marketplace.routes.ts
import { Router } from 'express';
import { MarketplaceController } from './marketplace.controller';

const router = Router();

// =========================================================================
// B2B Marketplace & Lead Unlock Monetization Routes
// =========================================================================

// Unlock a farmer's direct contact lead (Deducts Rs. 100 from Buyer Wallet)
router.post('/unlock-lead', MarketplaceController.unlockLead);

// Browse listings (Farmer numbers are masked for buyers unless unlocked)
router.get('/listings', MarketplaceController.getListings);

// Get Buyer account & prepaid wallet balance
router.get('/buyer-wallet', MarketplaceController.getBuyerWallet);

export default router;
