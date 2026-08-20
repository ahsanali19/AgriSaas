-- backend/database/schema_rbac.sql
-- =============================================================================
-- AgriSaaS Database Schema: RBAC, Global Currencies & Strict PKR SaaS Billing
-- Engine: MySQL 8.0+ | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `agrisaas_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `agrisaas_db`;

-- -----------------------------------------------------------------------------
-- 1. USERS & RBAC TABLE (With preferred_currency & is_super_admin)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone_number` VARCHAR(30) NOT NULL UNIQUE COMMENT 'E.164 phone number',
  `email` VARCHAR(150) NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `country_code` VARCHAR(5) NOT NULL DEFAULT 'PK' COMMENT 'PK, IN, US, AE, GB, etc.',
  `preferred_currency` VARCHAR(3) NOT NULL DEFAULT 'PKR' COMMENT 'Farmer local ISO currency: USD, EUR, GBP, PKR, INR, AED, CAD, AUD, etc.',
  `role` ENUM('admin', 'farmer', 'manager', 'worker') NOT NULL DEFAULT 'farmer',
  `status` ENUM('active', 'suspended', 'pending_verification') NOT NULL DEFAULT 'active',
  `is_super_admin` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_role_status` (`role`, `status`),
  INDEX `idx_users_phone` (`phone_number`),
  INDEX `idx_users_currency` (`preferred_currency`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. SUBSCRIPTION PLANS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `subscription_plans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `plan_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'FREE, PRO_MONTHLY, PRO_YEARLY',
  `name` VARCHAR(100) NOT NULL,
  `price_usd` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `price_pkr` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `billing_cycle` ENUM('lifetime', 'monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  `max_dairy_animals` INT NOT NULL DEFAULT 10 COMMENT '-1 = unlimited',
  `max_poultry_flocks` INT NOT NULL DEFAULT 2 COMMENT '-1 = unlimited',
  `max_fish_ponds` INT NOT NULL DEFAULT 2 COMMENT '-1 = unlimited',
  `has_advanced_khata` TINYINT(1) NOT NULL DEFAULT 0,
  `has_pdf_export` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. USER SUBSCRIPTIONS & MULTI-CURRENCY PAYMENTS (Stores converted_amount_pkr)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_subscriptions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `plan_id` INT UNSIGNED NOT NULL,
  `status` ENUM('active', 'expired', 'suspended', 'cancelled') NOT NULL DEFAULT 'active',
  `starts_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `payment_method` ENUM('free_grant', 'jazzcash', 'easypaisa', 'upi', 'stripe', 'bank_transfer', 'admin_override') NOT NULL DEFAULT 'free_grant',
  
  -- Multi-Currency Storage for Local Farmer & Strict PKR Super Admin
  `amount_paid` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Original amount paid in farmer local currency',
  `currency_charged` VARCHAR(3) NOT NULL DEFAULT 'PKR' COMMENT 'ISO 4217 code charged: USD, EUR, PKR, INR, etc.',
  `exchange_rate_to_pkr` DECIMAL(12,4) NOT NULL DEFAULT 1.0000 COMMENT 'Exchange rate to PKR at time of transaction',
  `converted_amount_pkr` DECIMAL(14,2) NOT NULL DEFAULT 0.00 COMMENT 'Normalized revenue in PKR for Super Admin revenue aggregation',
  
  `transaction_reference` VARCHAR(100) NULL,
  `updated_by_admin_id` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`),
  INDEX `idx_sub_user_status` (`user_id`, `status`),
  INDEX `idx_sub_converted_pkr` (`converted_amount_pkr`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. ADMIN AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` BIGINT UNSIGNED NOT NULL,
  `target_user_id` BIGINT UNSIGNED NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`),
  INDEX `idx_audit_admin` (`admin_id`),
  INDEX `idx_audit_target` (`target_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- SEED INITIAL SUPER ADMIN & SUBSCRIPTION TIERS
-- -----------------------------------------------------------------------------
INSERT INTO `users` 
  (`id`, `phone_number`, `email`, `password_hash`, `full_name`, `country_code`, `preferred_currency`, `role`, `status`, `is_super_admin`)
VALUES
  (1, '+923000000000', 'admin@agrisaas.io', '$2b$12$eD.DemoAdminHashKeyForSuperAdminPass2026', 'AgriSaaS Super Admin', 'PK', 'PKR', 'admin', 'active', 1)
ON DUPLICATE KEY UPDATE `is_super_admin` = 1, `role` = 'admin';

INSERT INTO `subscription_plans` 
  (`plan_code`, `name`, `price_usd`, `price_pkr`, `billing_cycle`, `max_dairy_animals`, `max_poultry_flocks`, `max_fish_ponds`, `has_advanced_khata`, `has_pdf_export`)
VALUES
  ('FREE', 'Free Global Kisan', 0.00, 0.00, 'lifetime', 10, 2, 2, 0, 0),
  ('PRO_MONTHLY', 'AgriSaaS Pro Monthly', 5.99, 1499.00, 'monthly', -1, -1, -1, 1, 1),
  ('PRO_YEARLY', 'AgriSaaS Pro Annual', 49.99, 14999.00, 'yearly', -1, -1, -1, 1, 1)
ON DUPLICATE KEY UPDATE `price_pkr` = VALUES(`price_pkr`);
