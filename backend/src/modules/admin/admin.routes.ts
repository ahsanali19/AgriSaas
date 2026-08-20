// backend/src/modules/admin/admin.routes.ts
import { Router } from 'express';
import { AdminController } from './admin.controller';
import { requireRole } from '../../middlewares/authRole.middleware';

const router = Router();

// Enforce strict Role-Based Access Control: Admin only
router.use(requireRole(['admin']));

/**
 * @route   GET /api/admin/stats
 * @desc    Get SaaS platform overview metrics (revenue, pro subscriptions, livestock counts)
 * @access  Private (Super Admin)
 */
router.get('/stats', AdminController.getPlatformStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all registered farmers, farm types, quotas, and subscription details
 * @access  Private (Super Admin)
 */
router.get('/users', AdminController.getAllUsers);

/**
 * @route   PUT /api/admin/users/:id/subscription
 * @desc    Manually override farmer subscription (Upgrade to Pro, Downgrade, Suspend account)
 * @access  Private (Super Admin)
 */
router.put('/users/:id/subscription', AdminController.updateUserSubscription);

export default router;
