-- backend/database/pivot_monetization_schema.sql
-- =============================================================================
-- AgriSaaS Pivot Monetization Schema:
-- 100% Free Lifetime Farmer SaaS + B2B Marketplace Leads + Direct Agri-Sponsorships
-- Engine: MySQL 8.0+ | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- =============================================================================

USE `agrisaas_db`;

-- -----------------------------------------------------------------------------
-- 1. DEPRECATE / REMOVE FARMER SUBSCRIPTION BARRIERS
-- -----------------------------------------------------------------------------
-- Farmers now enjoy 100% free unlimited access to Dairy, Poultry, Fish, Crops & Ledger.
DROP TABLE IF EXISTS `user_subscriptions`;
DROP TABLE IF EXISTS `subscription_plans`;

-- Update users table to reflect 100% free lifetime status
ALTER TABLE `users`
  MODIFY COLUMN `role` ENUM('admin', 'farmer', 'manager', 'worker', 'buyer') NOT NULL DEFAULT 'farmer';

-- -----------------------------------------------------------------------------
-- 2. BUYERS TABLE (B2B Traders, Mills, Exporters, Wholesalers)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `buyers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mobile` VARCHAR(30) NOT NULL UNIQUE COMMENT 'Buyer WhatsApp / Phone number (E.164)',
  `name` VARCHAR(120) NOT NULL,
  `company` VARCHAR(150) NOT NULL COMMENT 'e.g. Shakarganj Sugar Mills, Al-Karam Grains Trading',
  `buyer_subscription_status` ENUM('active', 'expired', 'pay_as_you_go', 'enterprise_tier') NOT NULL DEFAULT 'pay_as_you_go',
  `wallet_balance` DECIMAL(12,2) NOT NULL DEFAULT 1000.00 COMMENT 'Prepaid credit balance in PKR for unlocking leads',
  `total_leads_unlocked` INT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('active', 'suspended', 'pending_verification') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_buyers_mobile` (`mobile`),
  INDEX `idx_buyers_company` (`company`),
  INDEX `idx_buyers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. MARKETPLACE LISTINGS TABLE (If not already created)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketplace_listings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `farmer_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('crops_harvest', 'dairy_cattle', 'poultry_birds', 'fish_seed', 'feed_silage', 'machinery') NOT NULL,
  `price` DECIMAL(14,2) NOT NULL,
  `currency` VARCHAR(5) NOT NULL DEFAULT 'PKR',
  `quantity` VARCHAR(100) NOT NULL,
  `location_district` VARCHAR(100) NOT NULL,
  `image_url` VARCHAR(500) NULL,
  `description` TEXT NULL,
  `status` ENUM('active', 'sold', 'archived') NOT NULL DEFAULT 'active',
  `is_verified_farmer` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_listings_category` (`category`, `status`),
  INDEX `idx_listings_farmer` (`farmer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. MARKETPLACE LEADS TABLE (Contact Reveal / Pay-per-Lead Monetization)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketplace_leads` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `listing_id` BIGINT UNSIGNED NOT NULL,
  `buyer_id` BIGINT UNSIGNED NOT NULL,
  `farmer_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('locked', 'unlocked') NOT NULL DEFAULT 'locked',
  `unlock_fee` DECIMAL(10,2) NOT NULL DEFAULT 100.00 COMMENT 'Lead unlock charge in PKR (e.g. Rs 100)',
  `unlocked_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_buyer_listing` (`buyer_id`, `listing_id`),
  FOREIGN KEY (`buyer_id`) REFERENCES `buyers` (`id`) ON DELETE CASCADE,
  INDEX `idx_leads_listing` (`listing_id`),
  INDEX `idx_leads_buyer` (`buyer_id`),
  INDEX `idx_leads_farmer` (`farmer_id`),
  INDEX `idx_leads_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. SPONSORSHIP BANNERS TABLE (Direct Agri-Enterprise Advertising)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sponsorship_banners` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sponsor_name` VARCHAR(150) NOT NULL COMMENT 'e.g. Engro Fertilizers, Bayer CropScience, Fauji Foods',
  `image_url` VARCHAR(500) NOT NULL,
  `placement_area` ENUM('dashboard_top', 'marketplace_sidebar', 'crops_footer', 'ledger_top') NOT NULL DEFAULT 'dashboard_top',
  `link` VARCHAR(500) NOT NULL COMMENT 'Direct sponsor landing page / WhatsApp lead line',
  `tagline` VARCHAR(255) NULL COMMENT 'Short promotional highlight for native card presentation',
  `badge_text` VARCHAR(50) NULL DEFAULT 'Verified Agri Partner',
  `cta_text` VARCHAR(50) NULL DEFAULT 'View Special Offer',
  `impressions_count` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `clicks_count` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_sponsors_placement_status` (`placement_area`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. INITIAL SEED DATA (Buyers, Direct B2B Sponsors, & Initial Listings)
-- -----------------------------------------------------------------------------

-- Seed B2B Commercial Buyers
INSERT INTO `buyers` (`id`, `mobile`, `name`, `company`, `buyer_subscription_status`, `wallet_balance`, `total_leads_unlocked`) VALUES
(1, '+923214567890', 'Haji Mohammad Rafique', 'Al-Rehman Grain Merchants & Feed Mills', 'active', 2500.00, 14),
(2, '+923337654321', 'Mian Kamran Aslam', 'Chenab Agro Exporters (Pvt) Ltd', 'pay_as_you_go', 800.00, 3),
(3, '+923009988112', 'Chaudhry Nadeem Gujjar', 'Shakarganj Sugar Procurement Unit', 'enterprise_tier', 10000.00, 48)
ON DUPLICATE KEY UPDATE `wallet_balance` = VALUES(`wallet_balance`);

-- Seed Direct B2B Agri-Sponsors
INSERT INTO `sponsorship_banners` (`id`, `sponsor_name`, `image_url`, `placement_area`, `link`, `tagline`, `badge_text`, `cta_text`, `status`) VALUES
(1, 'Engro Fertilizers', 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'dashboard_top', 'https://www.engrofertilizers.com', 'Get 10% Rebate on Engro DAP & Urea Direct Farm Bookings for Wheat & Rice season', 'Official Fertilizer Partner', 'Claim Subsidy', 'active'),
(2, 'Bayer CropScience', 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 'marketplace_sidebar', 'https://www.cropscience.bayer.pk', 'Certified Seed & Fungicide Solutions for High-Yield B2B Harvests', 'Crop Health Partner', 'Consult Agronomist', 'active'),
(3, 'Fauji Fresh n Freeze', 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 'marketplace_sidebar', 'https://www.fffl.com.pk', 'Guaranteed Buyback Contracts for Sweetcorn, Peas & Broccoli Farmers in Punjab', 'B2B Procurement', 'Register Harvest', 'active'),
(4, 'National Feeds Ltd', 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'dashboard_top', 'https://www.nationalfeeds.com', 'High-Protein Cattle Wanda & Broiler Pellets with Doorstep Farm Delivery', 'Livestock Feed Partner', 'Order Bulk Wanda', 'active')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);
