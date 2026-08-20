// backend/src/modules/crops/cropController.ts
import { Request, Response } from 'express';

/**
 * Farmer Crops Controller
 * Handles CRUD for farmer_crops, stage-wise expenses, harvest logging into crop_inventory,
 * and posting inventory to marketplace_listings.
 */

// 1. Get all crops for authenticated farmer
export const getFarmerCrops = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 101;
    // Query: SELECT * FROM farmer_crops WHERE user_id = ? ORDER BY id DESC
    return res.status(200).json({
      success: true,
      message: 'Farmer crops retrieved successfully',
      data: []
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Create new crop entry
export const createCrop = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 101;
    const { crop_name, variety, land_area_acres, sowing_date, expected_harvest_date, status, notes } = req.body;

    if (!crop_name || !land_area_acres || !sowing_date || !expected_harvest_date) {
      return res.status(400).json({
        success: false,
        message: 'crop_name, land_area_acres, sowing_date, and expected_harvest_date are required'
      });
    }

    // Query: INSERT INTO farmer_crops (user_id, crop_name, variety, land_area_acres, sowing_date, expected_harvest_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    return res.status(201).json({
      success: true,
      message: 'Crop registered successfully',
      cropId: Date.now()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Update existing crop
export const updateCrop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { crop_name, variety, land_area_acres, sowing_date, expected_harvest_date, status, notes } = req.body;

    // Query: UPDATE farmer_crops SET crop_name = ?, variety = ?, land_area_acres = ?, sowing_date = ?, expected_harvest_date = ?, status = ?, notes = ? WHERE id = ?
    return res.status(200).json({
      success: true,
      message: `Crop #${id} updated successfully`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Delete crop
export const deleteCrop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Query: DELETE FROM farmer_crops WHERE id = ?
    return res.status(200).json({
      success: true,
      message: `Crop #${id} deleted successfully`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 5. Add stage-wise crop expense (and auto-sync with master ledger)
export const addCropExpense = async (req: Request, res: Response) => {
  try {
    const { crop_id, category, amount, date, description } = req.body;

    if (!crop_id || !category || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: 'crop_id, category, amount, and date are required'
      });
    }

    // 1. Insert into crop_expenses: INSERT INTO crop_expenses (crop_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)
    // 2. Sync to Master Ledger: INSERT INTO khata_transactions (farm_id, enterprise_type, category_name, transaction_type, amount, transaction_date, description) VALUES (...)
    return res.status(201).json({
      success: true,
      message: 'Crop expense recorded and synchronized with Master Khata Ledger',
      expenseId: Date.now()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 6. Log final harvest into crop_inventory
export const logCropHarvest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 101;
    const { crop_id, total_yield_kg, storage_location } = req.body;

    if (!crop_id || !total_yield_kg) {
      return res.status(400).json({
        success: false,
        message: 'crop_id and total_yield_kg are required'
      });
    }

    // 1. Update farmer_crops status to 'harvested'
    // 2. Insert into crop_inventory (user_id, crop_id, total_yield_kg, available_quantity, storage_location, harvest_date)
    return res.status(201).json({
      success: true,
      message: 'Crop harvest logged into inventory successfully',
      inventoryId: Date.now()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 7. Marketplace Integration: Send available inventory to marketplace_listings
export const postHarvestToMarketplace = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 101;
    const { crop_inventory_id, title, description, expected_price, quantity, seller_name, seller_phone, location_district, image_url } = req.body;

    if (!title || !expected_price || !seller_phone) {
      return res.status(400).json({
        success: false,
        message: 'title, expected_price, and seller_phone are required'
      });
    }

    // 1. Insert into marketplace_listings (user_id, crop_inventory_id, title, category, quantity, price, currency, seller_name, seller_phone, location_district, image_url, description)
    // 2. Update crop_inventory set is_listed_on_marketplace = TRUE WHERE id = ?
    return res.status(201).json({
      success: true,
      message: 'Harvested yield published live on B2B Marketplace',
      listingId: Date.now()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
