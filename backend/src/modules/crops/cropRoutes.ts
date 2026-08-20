// backend/src/modules/crops/cropRoutes.ts
import { Router } from 'express';
import {
  getFarmerCrops,
  createCrop,
  updateCrop,
  deleteCrop,
  addCropExpense,
  logCropHarvest,
  postHarvestToMarketplace
} from './cropController';

const router = Router();

// =========================================================================
// Farmer Crops API Routes
// =========================================================================

// Crop Lifecycle CRUD
router.get('/', getFarmerCrops);
router.post('/', createCrop);
router.put('/:id', updateCrop);
router.delete('/:id', deleteCrop);

// Stage-wise Crop Expenses (Seeds, Fertilizers, Tractor, Labor)
router.post('/expenses', addCropExpense);

// Harvest Logging into Inventory
router.post('/harvest', logCropHarvest);

// Marketplace Integration: Post Harvest Inventory to B2B Marketplace
router.post('/marketplace-post', postHarvestToMarketplace);

export default router;
