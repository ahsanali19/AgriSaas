// backend/src/modules/sponsorship/sponsorship.routes.ts
import { Router } from 'express';
import { SponsorshipController } from './sponsorship.controller';

const router = Router();

// =========================================================================
// Direct Agri-Sponsorship Banner Routes (Non-AdSense Native Ads)
// =========================================================================

// Fetch active partner banners for dashboard_top or marketplace_sidebar
router.get('/active', SponsorshipController.getActiveSponsorships);

// Track CTR clicks on sponsor banners
router.post('/:id/click', SponsorshipController.recordClick);

export default router;
