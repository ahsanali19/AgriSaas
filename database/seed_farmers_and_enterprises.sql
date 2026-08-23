-- /database/seed_farmers_and_enterprises.sql
-- AgriSaaS Production & Testing Database Seeder
-- Generates 5 Realistic Pakistani/Indian Farmer Profiles, Enterprises, Livestock, Crops, Poultry, Fish Ponds & Marketplace Ads

-- 1. Table Definitions (If not existing)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    country_code VARCHAR(5) DEFAULT 'PK',
    preferred_currency VARCHAR(10) DEFAULT 'PKR',
    role ENUM('farmer', 'admin', 'buyer', 'manager', 'worker') DEFAULT 'farmer',
    password_hash VARCHAR(255) DEFAULT '$2a$12$e9g0kP...hash',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    farm_type ENUM('dairy', 'poultry', 'fish', 'crops', 'mixed') NOT NULL,
    currency VARCHAR(10) DEFAULT 'PKR',
    location_district VARCHAR(100),
    location_state VARCHAR(100),
    total_area_acres DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dairy_animals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    farm_id BIGINT NOT NULL,
    tag_number VARCHAR(50) NOT NULL,
    name_or_alias VARCHAR(100),
    species ENUM('cow', 'buffalo', 'goat', 'sheep') NOT NULL,
    breed VARCHAR(80),
    gender ENUM('female', 'male') DEFAULT 'female',
    lactation_stage ENUM('milking', 'dry', 'pregnant_milking', 'heifer', 'calf') DEFAULT 'milking',
    last_yield_liters DECIMAL(6,2) DEFAULT 0,
    status ENUM('active', 'sold', 'deceased') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crops (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    farm_id BIGINT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    land_area_acres DECIMAL(8,2) NOT NULL,
    sowing_date DATE,
    expected_harvest_date DATE,
    status ENUM('sowing', 'vegetative', 'flowering', 'harvest_ready', 'harvested') DEFAULT 'sowing',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS poultry_batches (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    farm_id BIGINT NOT NULL,
    batch_code VARCHAR(50) NOT NULL,
    bird_type ENUM('broiler', 'layer', 'desi_country') DEFAULT 'broiler',
    breed_name VARCHAR(80),
    initial_bird_count INT NOT NULL,
    current_bird_count INT NOT NULL,
    placement_date DATE NOT NULL,
    target_harvest_date DATE,
    status ENUM('active', 'harvested', 'culled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fish_ponds (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    farm_id BIGINT NOT NULL,
    pond_name_or_number VARCHAR(100) NOT NULL,
    area_sqft_or_acres DECIMAL(8,2) NOT NULL,
    area_unit ENUM('acres', 'sqft', 'marla', 'bigha') DEFAULT 'acres',
    average_depth_feet DECIMAL(5,2) DEFAULT 5.0,
    water_source VARCHAR(100),
    status ENUM('active', 'fallow_drying', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS marketplace_listings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    category ENUM('crops_harvest', 'dairy_cattle', 'poultry_birds', 'fish_seed', 'feed_silage', 'machinery') NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'PKR',
    quantity VARCHAR(100) NOT NULL,
    seller_name VARCHAR(120) NOT NULL,
    seller_phone VARCHAR(30) NOT NULL,
    location_district VARCHAR(100) NOT NULL,
    image_url TEXT,
    description TEXT,
    posted_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('active', 'sold', 'paused') DEFAULT 'active',
    views_count INT DEFAULT 0,
    inquiries_count INT DEFAULT 0,
    is_verified_farmer BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================================================
-- SEED DATA: 5 REALISTIC PAKISTANI/INDIAN FARMERS
-- =============================================================================

-- Clear previous test entries if needed
DELETE FROM marketplace_listings WHERE user_id IN (101, 102, 103, 104, 105);
DELETE FROM dairy_animals WHERE farm_id IN (101, 102, 103, 104, 105);
DELETE FROM crops WHERE user_id IN (101, 102, 103, 104, 105);
DELETE FROM poultry_batches WHERE farm_id IN (101, 102, 103, 104, 105);
DELETE FROM fish_ponds WHERE farm_id IN (101, 102, 103, 104, 105);
DELETE FROM farms WHERE user_id IN (101, 102, 103, 104, 105);
DELETE FROM users WHERE id IN (101, 102, 103, 104, 105);

-- 1. INSERT USERS
INSERT INTO users (id, phone_number, full_name, country_code, preferred_currency, role, is_verified) VALUES
(101, '+923001234567', 'Chaudhry Aslam', 'PK', 'PKR', 'farmer', TRUE),
(102, '+923219876543', 'Malik Riaz', 'PK', 'PKR', 'farmer', TRUE),
(103, '+923334567890', 'Sher Khan', 'PK', 'PKR', 'farmer', TRUE),
(104, '+923451122334', 'Ghulam Rasool', 'PK', 'PKR', 'farmer', TRUE),
(105, '+923129988776', 'Tariq Mehmood', 'PK', 'PKR', 'farmer', TRUE);

-- 2. INSERT FARMS
INSERT INTO farms (id, user_id, name, farm_type, currency, location_district, location_state, total_area_acres) VALUES
(101, 101, 'Aslam Royal Dairy Estate & Stud Farm', 'dairy', 'PKR', 'Sahiwal, Punjab', 'Punjab', 45.0),
(102, 102, 'Malik Agro & Crop Farms', 'crops', 'PKR', 'Rahim Yar Khan, Punjab', 'Punjab', 30.0),
(103, 103, 'Khyber Green Environment Controlled Poultry Farm', 'poultry', 'PKR', 'Rawalpindi / Taxila, Punjab', 'Punjab', 8.0),
(104, 104, 'Indus Crystal Aquaculture & Fish Hatchery', 'fish', 'PKR', 'Thatta, Sindh', 'Sindh', 25.0),
(105, 105, 'Mehmood Integrated Agro & Dairy Complex', 'mixed', 'PKR', 'Faisalabad, Punjab', 'Punjab', 35.0);

-- 3. INSERT FARMER 1: CHAUDHRY ASLAM (Large Dairy - 50 Cows Sample)
INSERT INTO dairy_animals (farm_id, tag_number, name_or_alias, species, breed, gender, lactation_stage, last_yield_liters, status) VALUES
(101, 'PK-SAH-001', 'Rani (Lead Milker)', 'cow', 'Sahiwal Pure', 'female', 'milking', 21.5, 'active'),
(101, 'PK-SAH-002', 'Moti (Nili Star)', 'buffalo', 'Nili-Ravi', 'female', 'milking', 16.0, 'active'),
(101, 'PK-SAH-003', 'Sitara (Pedigree)', 'cow', 'Sahiwal Pure', 'female', 'milking', 19.5, 'active'),
(101, 'PK-SAH-004', 'Surriya', 'buffalo', 'Kundi', 'female', 'dry', 0.0, 'active'),
(101, 'PK-SAH-005', 'Gori', 'cow', 'Holstein Friesian Cross', 'female', 'milking', 26.0, 'active'),
(101, 'PK-SAH-006', 'Sundri', 'cow', 'Sahiwal Pure', 'female', 'milking', 18.0, 'active'),
(101, 'PK-SAH-007', 'Kajal', 'buffalo', 'Nili-Ravi', 'female', 'milking', 15.5, 'active'),
(101, 'PK-SAH-008', 'Bano', 'cow', 'Cholistani', 'female', 'milking', 16.5, 'active'),
(101, 'PK-SAH-009', 'Shehna', 'cow', 'Sahiwal Pure', 'female', 'milking', 20.0, 'active'),
(101, 'PK-SAH-010', 'Zeenat', 'buffalo', 'Nili-Ravi', 'female', 'pregnant_milking', 13.0, 'active');

-- 4. INSERT FARMER 2: MALIK RIAZ (30 Acres Wheat & Sugarcane)
INSERT INTO crops (user_id, farm_id, crop_name, variety, land_area_acres, sowing_date, expected_harvest_date, status, notes) VALUES
(102, 102, 'Akbar Wheat 2019', 'Akbar-2019 Certified Seed', 18.0, '2025-11-15', '2026-04-20', 'harvest_ready', 'High-yielding certified wheat with rust resistance. 18 Acres.'),
(102, 102, 'Sugarcane CPF-249', 'CPF-249 Early High Sucrose', 12.0, '2025-09-10', '2026-11-25', 'vegetative', 'High sucrose recovery cane planted for sugar mill delivery. 12 Acres.');

-- 5. INSERT FARMER 3: SHER KHAN (Broiler Poultry Batch of 5000)
INSERT INTO poultry_batches (farm_id, batch_code, bird_type, breed_name, initial_bird_count, current_bird_count, placement_date, target_harvest_date, status) VALUES
(103, 'FLOCK-C500-AUG26', 'broiler', 'Cobb 500', 5000, 4890, '2026-07-20', '2026-08-25', 'active');

-- 6. INSERT FARMER 4: GHULAM RASOOL (Aquaculture Fish Ponds - Tilapia & Rohu)
INSERT INTO fish_ponds (farm_id, pond_name_or_number, area_sqft_or_acres, area_unit, average_depth_feet, water_source, status) VALUES
(104, 'Commercial Pond 1 (GIFT Tilapia)', 5.0, 'acres', 6.5, 'Indus Canal + Tube-well', 'active'),
(104, 'Commercial Pond 2 (Rohu & Mori Carp)', 6.5, 'acres', 7.0, 'Indus Canal Water', 'active'),
(104, 'Nursery Pond 3 (Fingerlings Stock)', 2.0, 'acres', 4.5, 'Tube-well Pure Sweet Water', 'active');

-- 7. INSERT FARMER 5: TARIQ MEHMOOD (Mixed Farm: 15 Dairy Animals + 10 Acres Fodder)
INSERT INTO dairy_animals (farm_id, tag_number, name_or_alias, species, breed, gender, lactation_stage, last_yield_liters, status) VALUES
(105, 'PK-FSD-01', 'Champa', 'cow', 'Sahiwal Cross', 'female', 'milking', 17.5, 'active'),
(105, 'PK-FSD-02', 'Kalo', 'buffalo', 'Nili-Ravi', 'female', 'milking', 15.0, 'active'),
(105, 'PK-FSD-03', 'Heer', 'cow', 'Holstein Cross', 'female', 'milking', 22.0, 'active'),
(105, 'PK-FSD-04', 'Gulabo', 'buffalo', 'Kundi', 'female', 'pregnant_milking', 12.0, 'active');

INSERT INTO crops (user_id, farm_id, crop_name, variety, land_area_acres, sowing_date, expected_harvest_date, status, notes) VALUES
(105, 105, 'Fodder Corn Maize (Pioneer 30Y87)', 'Pioneer 30Y87 High Biomass', 12.0, '2026-06-10', '2026-09-05', 'vegetative', 'Planted for winter corn silage bale production.');

-- 8. INSERT REALISTIC MARKETPLACE LISTINGS / ADS FOR ALL 5 FARMERS
INSERT INTO marketplace_listings (user_id, title, category, price, currency, quantity, seller_name, seller_phone, location_district, image_url, description, posted_date, status, views_count, inquiries_count, is_verified_farmer) VALUES
-- Farmer 1: Chaudhry Aslam Ads
(101, 'Pure Sahiwal Breed Milking Cows (20L Daily Yield)', 'dairy_cattle', 350000.00, 'PKR', '4 Cows (2nd Lactation)', 'Chaudhry Aslam', '+923001234567', 'Sahiwal, Punjab', 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Pedigree Sahiwal dairy cows vaccinated against FMD and LSD. High milk yield (20L daily) with 4.9% butterfat. Docile temperament and heat tolerant.', '2026-08-20', 'active', 142, 18, TRUE),
(101, 'Bulk Farm Fresh Raw Chilled Cow Milk (1,000 Litres/Day Contract)', 'crops_harvest', 190.00, 'PKR', '1,000 Litres / Day', 'Chaudhry Aslam', '+923001234567', 'Sahiwal, Punjab', 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Available for dairy processing companies and bulk sweetmakers. Stored in 4°C chilling tank. Zero adulteration, antibiotic-free.', '2026-08-21', 'active', 89, 12, TRUE),

-- Farmer 2: Malik Riaz Ads
(102, '28 Metric Tons Premium Akbar-2019 Cleaned Milling Wheat', 'crops_harvest', 3950.00, 'PKR', '28 Metric Tons (700 Bags of 40kg)', 'Malik Riaz', '+923219876543', 'Rahim Yar Khan, Punjab', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'First grade Akbar-2019 wheat crop with 11.5% moisture and high gluten content. Stored in hygienic air-cooled warehouse. Ideal for commercial flour mills.', '2026-08-18', 'active', 215, 29, TRUE),
(102, 'Sugarcane Seed Cane Sets (CPF-249 High Sucrose Variety)', 'crops_harvest', 450.00, 'PKR', '500 Maunds (Fresh Cut Seed Sets)', 'Malik Riaz', '+923219876543', 'Rahim Yar Khan, Punjab', 'https://images.unsplash.com/photo-1596785236251-71fa49ac6760?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Disease-free CPF-249 certified seed sets cut directly from 10-month healthy mother crop. 95%+ germination guarantee.', '2026-08-19', 'active', 110, 14, TRUE),

-- Farmer 3: Sher Khan Ads
(103, 'Ready for Lifting Live Broiler Chicken Lot (4,800 Birds, Avg 2.2 kg)', 'poultry_birds', 365.00, 'PKR', '4,800 Live Birds (Approx 10,500 kg)', 'Sher Khan', '+923334567890', 'Rawalpindi / Taxila, Punjab', 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Environment-controlled (EC) shed raised Cobb 500 broilers. Zero antibiotic residue in finisher stage. Ready for direct lifting by wholesalers and processing plants.', '2026-08-21', 'active', 340, 41, TRUE),
(103, 'Decomposed Organic Poultry Litter / Manure (High Nitrogen Fertilizer)', 'crops_harvest', 250.00, 'PKR', '120 Bags (40 kg each)', 'Sher Khan', '+923334567890', 'Rawalpindi / Taxila, Punjab', 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Dry, fully cured poultry litter manure rich in organic nitrogen and phosphorus for citrus orchards, wheat fields, and vegetable farms.', '2026-08-19', 'active', 78, 9, TRUE),

-- Farmer 4: Ghulam Rasool Ads
(104, 'Fresh Harvested Table-Size Rohu & Tilapia Fish (1,500 kg Lot)', 'fish_seed', 520.00, 'PKR', '1,500 kg (Live / Iced Catch)', 'Ghulam Rasool', '+923451122334', 'Thatta, Sindh', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Farm-raised sweet water Rohu (1.2kg to 1.8kg each) and Tilapia (600g+ each). Harvested to order and packed in flake ice boxes. Direct supply to Karachi wholesale fish mandi.', '2026-08-20', 'active', 189, 26, TRUE),
(104, 'High-Purity Monosex GIFT Tilapia Fingerling Seed (3 to 4 inches)', 'fish_seed', 12.00, 'PKR', '30,000 Seed Fingerlings', 'Ghulam Rasool', '+923451122334', 'Thatta, Sindh', 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Genetically improved farmed tilapia (GIFT) fingerlings conditioned for rapid weight gain. Packed in oxygenated bags for safe transportation across Pakistan.', '2026-08-18', 'active', 145, 22, TRUE),

-- Farmer 5: Tariq Mehmood Ads
(105, 'Nutritious Inoculated Corn Silage Wrapped Bales (80 kg Round Bales)', 'feed_silage', 950.00, 'PKR', '400 Wrapped Bales (80kg each)', 'Tariq Mehmood', '+923129988776', 'Faisalabad, Punjab', 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'High energy corn silage packed with European 6-layer UV stretch film. Fermented with Pioneer microbial inoculant for enhanced milk yield in dairy cows and buffaloes.', '2026-08-20', 'active', 265, 38, TRUE),
(105, 'Organic Pure Desi Cow Ghee (Bilona Method Churned)', 'crops_harvest', 2800.00, 'PKR', '50 Glass Jars (1 kg each)', 'Tariq Mehmood', '+923129988776', 'Faisalabad, Punjab', 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Traditional wood-churned A2 grass-fed Sahiwal cow ghee. Golden aroma, lab-tested 100% purity, zero preservatives.', '2026-08-21', 'active', 198, 32, TRUE);
