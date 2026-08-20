-- =========================================================================
-- AgriSaaS - Farmer Crops Module Database Schema (MySQL)
-- Tables: farmer_crops, crop_expenses, crop_inventory, marketplace_listings
-- =========================================================================

-- 1. farmer_crops Table: Core Crop Lifecycle tracking
CREATE TABLE IF NOT EXISTS `farmer_crops` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `crop_name` VARCHAR(150) NOT NULL COMMENT 'e.g., Wheat, Sugarcane, Cotton, Rice, Maize',
  `variety` VARCHAR(100) NULL COMMENT 'e.g., Akbar 2019, CPF-249',
  `land_area_acres` DECIMAL(8, 2) NOT NULL DEFAULT 1.00 COMMENT 'Land area in Acres',
  `sowing_date` DATE NOT NULL COMMENT 'Date of sowing/plantation',
  `expected_harvest_date` DATE NOT NULL COMMENT 'Estimated harvest maturity date',
  `status` ENUM('sowing', 'vegetative', 'flowering', 'harvest_ready', 'harvested') NOT NULL DEFAULT 'sowing',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_crops` (`user_id`, `status`),
  CONSTRAINT `fk_farmer_crops_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. crop_expenses Table: Stage-wise input costs
CREATE TABLE IF NOT EXISTS `crop_expenses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `crop_id` INT UNSIGNED NOT NULL,
  `category` ENUM('Seed', 'Fertilizer', 'Pesticide', 'Tractor', 'Labor', 'Irrigation', 'Other') NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Expense amount in local currency (PKR/INR)',
  `date` DATE NOT NULL COMMENT 'Date of input expenditure',
  `description` VARCHAR(255) NULL COMMENT 'Brand/vendor details (e.g. 5 Bags Engro DAP)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_crop_expenses` (`crop_id`, `category`),
  CONSTRAINT `fk_crop_expenses_crop` FOREIGN KEY (`crop_id`) REFERENCES `farmer_crops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. crop_inventory Table: Stored harvest yield ready for consumption or sale
CREATE TABLE IF NOT EXISTS `crop_inventory` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `crop_id` INT UNSIGNED NOT NULL,
  `total_yield_kg` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Total harvested yield in Kilograms (KG)',
  `available_quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Current available stock in KG',
  `storage_location` VARCHAR(150) NULL DEFAULT 'Farm Silo #1',
  `harvest_date` DATE NOT NULL,
  `is_listed_on_marketplace` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_inventory` (`user_id`, `available_quantity`),
  CONSTRAINT `fk_crop_inventory_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_crop_inventory_crop` FOREIGN KEY (`crop_id`) REFERENCES `farmer_crops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. marketplace_listings Table: Public B2B listings for farmer harvests
CREATE TABLE IF NOT EXISTS `marketplace_listings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `crop_inventory_id` INT UNSIGNED NULL,
  `title` VARCHAR(200) NOT NULL COMMENT 'e.g., 50 Tons of Wheat for Sale',
  `category` ENUM('crops_harvest', 'dairy_cattle', 'poultry_birds', 'fish_seed', 'feed_silage', 'machinery') NOT NULL DEFAULT 'crops_harvest',
  `quantity` VARCHAR(100) NOT NULL COMMENT 'e.g., 50 Tons (50,000 kg)',
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Expected asking rate',
  `currency` VARCHAR(10) NOT NULL DEFAULT 'PKR',
  `seller_name` VARCHAR(150) NOT NULL,
  `seller_phone` VARCHAR(30) NOT NULL,
  `location_district` VARCHAR(100) NOT NULL,
  `image_url` VARCHAR(500) NULL,
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_marketplace_active` (`category`, `is_active`),
  CONSTRAINT `fk_market_listings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_market_listings_inv` FOREIGN KEY (`crop_inventory_id`) REFERENCES `crop_inventory` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
