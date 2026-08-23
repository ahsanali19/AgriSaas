// src/data/seedData.ts
import {
  User,
  Farm,
  DairyAnimal,
  MilkLog,
  PoultryBatch,
  PoultryDailyLog,
  FishPond,
  FishSamplingLog,
  Crop,
  CropExpense,
  CropInventory,
  WarehouseInventory,
  B2BSale,
  MarketplaceListing,
  KhataTransaction
} from '../types';

export interface SeedFarmerProfile {
  user: User;
  farm: Farm;
  dairyAnimals: DairyAnimal[];
  milkLogs: MilkLog[];
  poultryBatches: PoultryBatch[];
  poultryLogs: PoultryDailyLog[];
  fishPonds: FishPond[];
  fishLogs: FishSamplingLog[];
  crops: Crop[];
  cropExpenses: CropExpense[];
  cropInventories: CropInventory[];
  warehouseInventory: WarehouseInventory[];
  b2bSales: B2BSale[];
  marketplaceListings: MarketplaceListing[];
  khataTransactions: KhataTransaction[];
}

// =============================================================================
// FARMER 1: Chaudhry Aslam
// Mobile: +923001234567 | Type: Large Dairy (50 Cows)
// =============================================================================
const aslamCows: DairyAnimal[] = Array.from({ length: 50 }, (_, i) => {
  const isSahiwal = i % 2 === 0;
  const isMilking = i < 38;
  const breed = isSahiwal ? 'Sahiwal Pure' : (i % 3 === 0 ? 'Nili-Ravi Buffalo' : 'Cholistani Cross');
  const species = breed.includes('Buffalo') ? 'buffalo' as const : 'cow' as const;
  const lactation = isMilking ? 'milking' as const : (i < 44 ? 'dry' as const : 'pregnant_milking' as const);
  const yieldVal = isMilking ? (isSahiwal ? 18 + (i % 5) : 14 + (i % 4)) : 0;
  
  return {
    id: 1000 + i + 1,
    farmId: 101,
    tagNumber: `PK-SAH-${(i + 1).toString().padStart(3, '0')}`,
    nameOrAlias: `Cattle #${i + 1} (${isSahiwal ? 'Sahiwal Queen' : 'Nili Pearl'})`,
    species,
    breed,
    gender: 'female' as const,
    lactationStage: lactation,
    lastYieldLiters: yieldVal,
    status: 'active' as const
  };
});

export const SEED_FARMER_1_ASLAM: SeedFarmerProfile = {
  user: {
    id: 101,
    phoneNumber: '+923001234567',
    fullName: 'Chaudhry Aslam',
    countryCode: 'PK',
    preferredCurrency: 'PKR',
    role: 'farmer',
    isSuperAdmin: false
  },
  farm: {
    id: 101,
    userId: 101,
    name: 'Aslam Royal Dairy Estate & Stud Farm',
    farmType: 'dairy',
    currency: 'PKR',
    locationDistrict: 'Sahiwal, Punjab',
    locationState: 'Punjab',
    totalAreaAcres: 45
  },
  dairyAnimals: aslamCows,
  milkLogs: [
    { id: 1011, farmId: 101, animalTag: 'PK-SAH-001', logDate: '2026-08-22', shift: 'morning', yieldLiters: 12.5, fatPercentage: 4.8 },
    { id: 1012, farmId: 101, animalTag: 'PK-SAH-001', logDate: '2026-08-22', shift: 'evening', yieldLiters: 9.5, fatPercentage: 4.9 },
    { id: 1013, farmId: 101, animalTag: 'PK-SAH-002', logDate: '2026-08-22', shift: 'morning', yieldLiters: 8.5, fatPercentage: 6.9 },
    { id: 1014, farmId: 101, animalTag: 'PK-SAH-002', logDate: '2026-08-22', shift: 'evening', yieldLiters: 7.0, fatPercentage: 7.1 },
    { id: 1015, farmId: 101, animalTag: 'PK-SAH-003', logDate: '2026-08-22', shift: 'morning', yieldLiters: 11.0, fatPercentage: 4.6 }
  ],
  poultryBatches: [],
  poultryLogs: [],
  fishPonds: [],
  fishLogs: [],
  crops: [],
  cropExpenses: [],
  cropInventories: [],
  warehouseInventory: [],
  b2bSales: [],
  marketplaceListings: [
    {
      id: 101,
      userId: 101,
      title: 'Pure Sahiwal Breed Milking Cows (20L Daily Yield)',
      category: 'dairy_cattle',
      price: 350000,
      currency: 'PKR',
      quantity: '4 Cows (2nd Lactation)',
      sellerName: 'Chaudhry Aslam',
      sellerPhone: '+923001234567',
      locationDistrict: 'Sahiwal, Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Pedigree Sahiwal dairy cows vaccinated against FMD and LSD. High milk yield (20L daily) with 4.9% butterfat. Docile temperament and heat tolerant.',
      postedDate: '2026-08-20',
      status: 'active',
      viewsCount: 142,
      inquiriesCount: 18,
      isVerifiedFarmer: true
    },
    {
      id: 102,
      userId: 101,
      title: 'Bulk Farm Fresh Raw Chilled Cow Milk (1,000 Litres/Day Contract)',
      category: 'crops_harvest',
      price: 190,
      currency: 'PKR',
      quantity: '1,000 Litres / Day',
      sellerName: 'Chaudhry Aslam',
      sellerPhone: '+923001234567',
      locationDistrict: 'Sahiwal, Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Available for dairy processing companies and bulk sweetmakers. Stored in 4°C chilling tank. Zero adulteration, antibiotic-free.',
      postedDate: '2026-08-21',
      status: 'active',
      viewsCount: 89,
      inquiriesCount: 12,
      isVerifiedFarmer: true
    }
  ],
  khataTransactions: [
    { id: 10101, farmId: 101, enterpriseType: 'dairy', categoryName: 'Daily Chilled Milk Dispatch to Engro/Nestlé', transactionType: 'income', amount: 190000, paymentMode: 'bank_transfer', transactionDate: '2026-08-21', partyName: 'Engro Foods Milk Chilling Center', description: '1000 Litres Bulk Milk Supply' },
    { id: 10102, farmId: 101, enterpriseType: 'dairy', categoryName: 'Corn Silage & Premium Wanda Feed Supply', transactionType: 'expense', amount: 84000, paymentMode: 'bank_transfer', transactionDate: '2026-08-19', partyName: 'Supreme Agri Feeds Sahiwal', description: '40 Bags Cattle Wanda + 2 Trucks Silage' }
  ]
};

// =============================================================================
// FARMER 2: Malik Riaz
// Mobile: +923219876543 | Type: Wheat & Sugarcane Crops (30 Acres)
// =============================================================================
export const SEED_FARMER_2_RIAZ: SeedFarmerProfile = {
  user: {
    id: 102,
    phoneNumber: '+923219876543',
    fullName: 'Malik Riaz',
    countryCode: 'PK',
    preferredCurrency: 'PKR',
    role: 'farmer',
    isSuperAdmin: false
  },
  farm: {
    id: 102,
    userId: 102,
    name: 'Malik Agro & Crop Farms',
    farmType: 'crops',
    currency: 'PKR',
    locationDistrict: 'Rahim Yar Khan, Punjab',
    locationState: 'Punjab',
    totalAreaAcres: 30
  },
  dairyAnimals: [],
  milkLogs: [],
  poultryBatches: [],
  poultryLogs: [],
  fishPonds: [],
  fishLogs: [],
  crops: [
    {
      id: 201,
      userId: 102,
      farmId: 102,
      cropName: 'Akbar Wheat 2019',
      variety: 'Akbar-2019 Certified Seed',
      landAreaAcres: 18,
      sowingDate: '2025-11-15',
      expectedHarvestDate: '2026-04-20',
      status: 'harvest_ready',
      notes: 'High yielding rust-resistant variety. Target yield: 48 Maunds per Acre.'
    },
    {
      id: 202,
      userId: 102,
      farmId: 102,
      cropName: 'Sugarcane CPF-249',
      variety: 'CPF-249 Early High Sucrose',
      landAreaAcres: 12,
      sowingDate: '2025-09-10',
      expectedHarvestDate: '2026-11-25',
      status: 'vegetative',
      notes: 'Thick cane with high sucrose recovery (11.8%). Trench planting method.'
    }
  ],
  cropExpenses: [
    { id: 2011, cropId: 201, cropName: 'Akbar Wheat 2019', category: 'Fertilizer', amount: 85000, date: '2025-12-05', description: '12 Bags DAP + 10 Bags Urea' },
    { id: 2012, cropId: 201, cropName: 'Akbar Wheat 2019', category: 'Irrigation', amount: 28000, date: '2026-01-10', description: 'Solar tube-well canal supplemental irrigation' },
    { id: 2021, cropId: 202, cropName: 'Sugarcane CPF-249', category: 'Pesticide', amount: 34000, date: '2026-03-15', description: 'Top borer spray & granule application' }
  ],
  cropInventories: [
    {
      id: 201,
      userId: 102,
      cropId: 201,
      cropName: 'Akbar Wheat 2019',
      totalYieldKg: 34500,
      availableQuantity: 28000,
      storageLocation: 'Central Farm Silo #A1',
      harvestDate: '2026-04-22',
      isListedOnMarketplace: true
    }
  ],
  warehouseInventory: [
    {
      id: 201,
      userId: 102,
      cropId: 201,
      cropName: 'Akbar Wheat 2019',
      totalYieldKg: 34500,
      storedQuantity: 28000,
      storageLocation: 'Rahim Yar Khan Grain Depot',
      packagingUnit: 'kg',
      lastUpdated: '2026-08-20'
    }
  ],
  b2bSales: [
    {
      id: 201,
      userId: 102,
      cropId: 201,
      cropName: 'Akbar Wheat 2019',
      buyerName: 'Al-Haq Flour Mills & Silos',
      buyerType: 'wholesaler',
      vehicleNumber: 'LES-9941 (10-Wheeler Trailer)',
      vehicleWeightSlip: 'SLIP-RYK-84920',
      totalWeight: 6500,
      weightUnit: 'kg',
      ratePerUnit: 100,
      grossAmount: 650000,
      commissionDeduction: 6500,
      netPayable: 643500,
      paymentStatus: 'paid',
      saleDate: '2026-05-10'
    }
  ],
  marketplaceListings: [
    {
      id: 201,
      userId: 102,
      title: '28 Metric Tons Premium Akbar-2019 Cleaned Milling Wheat',
      category: 'crops_harvest',
      price: 3950,
      currency: 'PKR',
      quantity: '28 Metric Tons (700 Bags of 40kg)',
      sellerName: 'Malik Riaz',
      sellerPhone: '+923219876543',
      locationDistrict: 'Rahim Yar Khan, Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'First grade Akbar-2019 wheat crop with 11.5% moisture and high gluten content. Stored in hygienic air-cooled warehouse. Ideal for commercial flour mills.',
      postedDate: '2026-08-18',
      status: 'active',
      viewsCount: 215,
      inquiriesCount: 29,
      isVerifiedFarmer: true
    },
    {
      id: 202,
      userId: 102,
      title: 'Sugarcane Seed Cane Sets (CPF-249 High Sucrose Variety)',
      category: 'crops_harvest',
      price: 450,
      currency: 'PKR',
      quantity: '500 Maunds (Fresh Cut Seed Sets)',
      sellerName: 'Malik Riaz',
      sellerPhone: '+923219876543',
      locationDistrict: 'Rahim Yar Khan, Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1596785236251-71fa49ac6760?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Disease-free CPF-249 certified seed sets cut directly from 10-month healthy mother crop. 95%+ germination guarantee.',
      postedDate: '2026-08-19',
      status: 'active',
      viewsCount: 110,
      inquiriesCount: 14,
      isVerifiedFarmer: true
    }
  ],
  khataTransactions: [
    { id: 20101, farmId: 102, enterpriseType: 'crops', categoryName: 'Flour Mill Grain Advance Settlement', transactionType: 'income', amount: 643500, paymentMode: 'bank_transfer', transactionDate: '2026-05-12', partyName: 'Al-Haq Flour Mills', description: 'Advance payment for 6.5 tons wheat' },
    { id: 20102, farmId: 102, enterpriseType: 'crops', categoryName: 'Tractor Diesel & Land Preparation Fuel', transactionType: 'expense', amount: 48000, paymentMode: 'cash', transactionDate: '2026-06-15', partyName: 'PSO Highway Fuel Station', description: '180 Litres Diesel for deep ripping' }
  ]
};

// =============================================================================
// FARMER 3: Sher Khan
// Mobile: +923334567890 | Type: Broiler Poultry (Batch of 5000)
// =============================================================================
export const SEED_FARMER_3_SHER_KHAN: SeedFarmerProfile = {
  user: {
    id: 103,
    phoneNumber: '+923334567890',
    fullName: 'Sher Khan',
    countryCode: 'PK',
    preferredCurrency: 'PKR',
    role: 'farmer',
    isSuperAdmin: false
  },
  farm: {
    id: 103,
    userId: 103,
    name: 'Khyber Green Environment Controlled Poultry Farm',
    farmType: 'poultry',
    currency: 'PKR',
    locationDistrict: 'Rawalpindi / Taxila, Punjab',
    locationState: 'Punjab',
    totalAreaAcres: 8
  },
  dairyAnimals: [],
  milkLogs: [],
  poultryBatches: [
    {
      id: 301,
      farmId: 103,
      batchCode: 'FLOCK-C500-AUG26',
      birdType: 'broiler',
      breedName: 'Cobb 500',
      initialBirdCount: 5000,
      currentBirdCount: 4890,
      placementDate: '2026-07-20',
      targetHarvestDate: '2026-08-25',
      status: 'active'
    }
  ],
  poultryLogs: [
    { id: 3011, batchId: 301, logDate: '2026-08-22', mortalityCount: 3, feedConsumedKg: 460, waterIntakeLiters: 1100, avgBodyWeightGrams: 2150, notes: 'Day 33. Excellent flock uniformity. Feed conversion ratio (FCR) at 1.48.' },
    { id: 3012, batchId: 301, logDate: '2026-08-21', mortalityCount: 4, feedConsumedKg: 455, waterIntakeLiters: 1080, avgBodyWeightGrams: 2080, notes: 'Day 32. Cooling pads and tunnel ventilation operating normally.' },
    { id: 3013, batchId: 301, logDate: '2026-08-20', mortalityCount: 2, feedConsumedKg: 450, waterIntakeLiters: 1060, avgBodyWeightGrams: 2010, notes: 'Day 31. Pre-market health inspection completed.' }
  ],
  fishPonds: [],
  fishLogs: [],
  crops: [],
  cropExpenses: [],
  cropInventories: [],
  warehouseInventory: [],
  b2bSales: [],
  marketplaceListings: [
    {
      id: 301,
      userId: 103,
      title: 'Ready for Lifting Live Broiler Chicken Lot (4,800 Birds, Avg 2.2 kg)',
      category: 'poultry_birds',
      price: 365,
      currency: 'PKR',
      quantity: '4,800 Live Birds (Approx 10,500 kg)',
      sellerName: 'Sher Khan',
      sellerPhone: '+923334567890',
      locationDistrict: 'Rawalpindi / Taxila, Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Environment-controlled (EC) shed raised Cobb 500 broilers. Zero antibiotic residue in finisher stage. Ready for direct lifting by wholesalers and processing plants.',
      postedDate: '2026-08-21',
      status: 'active',
      viewsCount: 340,
      inquiriesCount: 41,
      isVerifiedFarmer: true
    },
    {
      id: 302,
      userId: 103,
      title: 'Decomposed Organic Poultry Litter / Manure (High Nitrogen Fertilizer)',
      category: 'crops_harvest',
      price: 250,
      currency: 'PKR',
      quantity: '120 Bags (40 kg each)',
      sellerName: 'Sher Khan',
      sellerPhone: '+923334567890',
      locationDistrict: 'Rawalpindi / Taxila, Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Dry, fully cured poultry litter manure rich in organic nitrogen and phosphorus for citrus orchards, wheat fields, and vegetable farms.',
      postedDate: '2026-08-19',
      status: 'active',
      viewsCount: 78,
      inquiriesCount: 9,
      isVerifiedFarmer: true
    }
  ],
  khataTransactions: [
    { id: 30101, farmId: 103, enterpriseType: 'poultry', categoryName: 'Broiler Finisher Feed #3 (National Feeds)', transactionType: 'expense', amount: 312000, paymentMode: 'bank_transfer', transactionDate: '2026-08-15', partyName: 'National Poultry Feeds Rawalpindi', description: '60 Bags Finisher Feed' },
    { id: 30102, farmId: 103, enterpriseType: 'poultry', categoryName: 'Vaccines & Bio-Security Disinfectants', transactionType: 'expense', amount: 24500, paymentMode: 'cash', transactionDate: '2026-07-28', partyName: 'Vet Care Pharmacy Taxila' }
  ]
};

// =============================================================================
// FARMER 4: Ghulam Rasool
// Mobile: +923451122334 | Type: Fish Farm (Tilapia & Rohu)
// =============================================================================
export const SEED_FARMER_4_GHULAM_RASOOL: SeedFarmerProfile = {
  user: {
    id: 104,
    phoneNumber: '+923451122334',
    fullName: 'Ghulam Rasool',
    countryCode: 'PK',
    preferredCurrency: 'PKR',
    role: 'farmer',
    isSuperAdmin: false
  },
  farm: {
    id: 104,
    userId: 104,
    name: 'Indus Crystal Aquaculture & Fish Hatchery',
    farmType: 'fish',
    currency: 'PKR',
    locationDistrict: 'Thatta, Sindh',
    locationState: 'Sindh',
    totalAreaAcres: 25
  },
  dairyAnimals: [],
  milkLogs: [],
  poultryBatches: [],
  poultryLogs: [],
  fishPonds: [
    {
      id: 401,
      farmId: 104,
      pondNameOrNumber: 'Commercial Pond 1 (GIFT Tilapia)',
      areaSqftOrAcres: 5.0,
      areaUnit: 'acres',
      averageDepthFeet: 6.5,
      waterSource: 'Indus Canal + Tube-well',
      status: 'active'
    },
    {
      id: 402,
      farmId: 104,
      pondNameOrNumber: 'Commercial Pond 2 (Rohu & Mori Carp)',
      areaSqftOrAcres: 6.5,
      areaUnit: 'acres',
      averageDepthFeet: 7.0,
      waterSource: 'Indus Canal Water',
      status: 'active'
    },
    {
      id: 403,
      farmId: 104,
      pondNameOrNumber: 'Nursery Pond 3 (Fingerlings Stock)',
      areaSqftOrAcres: 2.0,
      areaUnit: 'acres',
      averageDepthFeet: 4.5,
      waterSource: 'Tube-well Pure Sweet Water',
      status: 'active'
    }
  ],
  fishLogs: [
    { id: 4011, pondId: 401, sampleDate: '2026-08-22', speciesName: 'GIFT Monosex Tilapia', avgWeightGrams: 680, dailyFeedAmountKg: 140, waterPh: 7.6, dissolvedOxygenPpm: 6.8, mortalityObserved: 0, notes: 'Healthy growth on 28% protein floating pellets. Water clarity optimal.' },
    { id: 4012, pondId: 402, sampleDate: '2026-08-20', speciesName: 'Rohu (Labeo rohita)', avgWeightGrams: 1450, dailyFeedAmountKg: 180, waterPh: 7.8, dissolvedOxygenPpm: 7.1, mortalityObserved: 1, notes: 'Carp reaching prime commercial market weight for wedding and restaurant season.' }
  ],
  crops: [],
  cropExpenses: [],
  cropInventories: [],
  warehouseInventory: [],
  b2bSales: [],
  marketplaceListings: [
    {
      id: 401,
      userId: 104,
      title: 'Fresh Harvested Table-Size Rohu & Tilapia Fish (1,500 kg Lot)',
      category: 'fish_seed',
      price: 520,
      currency: 'PKR',
      quantity: '1,500 kg (Live / Iced Catch)',
      sellerName: 'Ghulam Rasool',
      sellerPhone: '+923451122334',
      locationDistrict: 'Thatta, Sindh',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Farm-raised sweet water Rohu (1.2kg to 1.8kg each) and Tilapia (600g+ each). Harvested to order and packed in flake ice boxes. Direct supply to Karachi wholesale fish mandi.',
      postedDate: '2026-08-20',
      status: 'active',
      viewsCount: 189,
      inquiriesCount: 26,
      isVerifiedFarmer: true
    },
    {
      id: 402,
      userId: 104,
      title: 'High-Purity Monosex GIFT Tilapia Fingerling Seed (3 to 4 inches)',
      category: 'fish_seed',
      price: 12,
      currency: 'PKR',
      quantity: '30,000 Seed Fingerlings',
      sellerName: 'Ghulam Rasool',
      sellerPhone: '+923451122334',
      locationDistrict: 'Thatta, Sindh',
      imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Genetically improved farmed tilapia (GIFT) fingerlings conditioned for rapid weight gain. Packed in oxygenated bags for safe transportation across Pakistan.',
      postedDate: '2026-08-18',
      status: 'active',
      viewsCount: 145,
      inquiriesCount: 22,
      isVerifiedFarmer: true
    }
  ],
  khataTransactions: [
    { id: 40101, farmId: 104, enterpriseType: 'fish', categoryName: 'Commercial Floating Fish Pellets (Oryza Feeds)', transactionType: 'expense', amount: 165000, paymentMode: 'bank_transfer', transactionDate: '2026-08-16', partyName: 'Oryza Aqua Feeds Karachi', description: '50 Bags 28% CP Floating Feed' },
    { id: 40102, farmId: 104, enterpriseType: 'fish', categoryName: 'Fish Mandi Bulk Supply Revenue', transactionType: 'income', amount: 480000, paymentMode: 'bank_transfer', transactionDate: '2026-08-10', partyName: 'Karachi Wholesale Fish Harbor', description: 'Settlement for 1000 kg Live Rohu dispatch' }
  ]
};

// =============================================================================
// FARMER 5: Tariq Mehmood
// Mobile: +923129988776 | Type: Mixed (Dairy + Crops)
// =============================================================================
export const SEED_FARMER_5_TARIQ_MEHMOOD: SeedFarmerProfile = {
  user: {
    id: 105,
    phoneNumber: '+923129988776',
    fullName: 'Tariq Mehmood',
    countryCode: 'PK',
    preferredCurrency: 'PKR',
    role: 'farmer',
    isSuperAdmin: false
  },
  farm: {
    id: 105,
    userId: 105,
    name: 'Mehmood Integrated Agro & Dairy Complex',
    farmType: 'mixed',
    currency: 'PKR',
    locationDistrict: 'Faisalabad, Punjab',
    locationState: 'Punjab',
    totalAreaAcres: 35
  },
  dairyAnimals: [
    { id: 501, farmId: 105, tagNumber: 'PK-FSD-01', nameOrAlias: 'Champa', species: 'cow', breed: 'Sahiwal Cross', gender: 'female', lactationStage: 'milking', lastYieldLiters: 17.5, status: 'active' },
    { id: 502, farmId: 105, tagNumber: 'PK-FSD-02', nameOrAlias: 'Kalo', species: 'buffalo', breed: 'Nili-Ravi', gender: 'female', lactationStage: 'milking', lastYieldLiters: 15.0, status: 'active' },
    { id: 503, farmId: 105, tagNumber: 'PK-FSD-03', nameOrAlias: 'Heer', species: 'cow', breed: 'Holstein Friesian Cross', gender: 'female', lactationStage: 'milking', lastYieldLiters: 22.0, status: 'active' },
    { id: 504, farmId: 105, tagNumber: 'PK-FSD-04', nameOrAlias: 'Gulabo', species: 'buffalo', breed: 'Kundi', gender: 'female', lactationStage: 'pregnant_milking', lastYieldLiters: 12.0, status: 'active' },
    { id: 505, farmId: 105, tagNumber: 'PK-FSD-05', nameOrAlias: 'Bijli', species: 'cow', breed: 'Sahiwal Pure', gender: 'female', lactationStage: 'dry', lastYieldLiters: 0, status: 'active' },
    { id: 506, farmId: 105, tagNumber: 'PK-FSD-06', nameOrAlias: 'Sundri', species: 'cow', breed: 'Jersey Cross', gender: 'female', lactationStage: 'milking', lastYieldLiters: 19.0, status: 'active' },
    { id: 507, farmId: 105, tagNumber: 'PK-FSD-07', nameOrAlias: 'Rani-2', species: 'buffalo', breed: 'Nili-Ravi', gender: 'female', lactationStage: 'milking', lastYieldLiters: 14.5, status: 'active' },
    { id: 508, farmId: 105, tagNumber: 'PK-FSD-08', nameOrAlias: 'Sitara-2', species: 'cow', breed: 'Cholistani', gender: 'female', lactationStage: 'milking', lastYieldLiters: 16.0, status: 'active' },
    { id: 509, farmId: 105, tagNumber: 'PK-FSD-09', nameOrAlias: 'Shama', species: 'cow', breed: 'Sahiwal Cross', gender: 'female', lactationStage: 'milking', lastYieldLiters: 15.5, status: 'active' },
    { id: 510, farmId: 105, tagNumber: 'PK-FSD-10', nameOrAlias: 'Shehnaz', species: 'buffalo', breed: 'Nili-Ravi', gender: 'female', lactationStage: 'milking', lastYieldLiters: 13.5, status: 'active' },
    { id: 511, farmId: 105, tagNumber: 'PK-FSD-11', nameOrAlias: 'Bano', species: 'cow', breed: 'Sahiwal Pure', gender: 'female', lactationStage: 'milking', lastYieldLiters: 18.0, status: 'active' },
    { id: 512, farmId: 105, tagNumber: 'PK-FSD-12', nameOrAlias: 'Kiran', species: 'cow', breed: 'Friesian Cross', gender: 'female', lactationStage: 'milking', lastYieldLiters: 21.5, status: 'active' },
    { id: 513, farmId: 105, tagNumber: 'PK-FSD-13', nameOrAlias: 'Parveen', species: 'buffalo', breed: 'Kundi', gender: 'female', lactationStage: 'dry', lastYieldLiters: 0, status: 'active' },
    { id: 514, farmId: 105, tagNumber: 'PK-FSD-14', nameOrAlias: 'Nazia', species: 'cow', breed: 'Cholistani', gender: 'female', lactationStage: 'milking', lastYieldLiters: 14.0, status: 'active' },
    { id: 515, farmId: 105, tagNumber: 'PK-FSD-15', nameOrAlias: 'Zeenat', species: 'cow', breed: 'Sahiwal Pure', gender: 'female', lactationStage: 'milking', lastYieldLiters: 17.0, status: 'active' }
  ],
  milkLogs: [
    { id: 5011, farmId: 105, animalTag: 'PK-FSD-01', logDate: '2026-08-22', shift: 'morning', yieldLiters: 10.0, fatPercentage: 4.8 },
    { id: 5012, farmId: 105, animalTag: 'PK-FSD-01', logDate: '2026-08-22', shift: 'evening', yieldLiters: 7.5, fatPercentage: 4.9 },
    { id: 5013, farmId: 105, animalTag: 'PK-FSD-02', logDate: '2026-08-22', shift: 'morning', yieldLiters: 8.5, fatPercentage: 7.0 },
    { id: 5014, farmId: 105, animalTag: 'PK-FSD-03', logDate: '2026-08-22', shift: 'morning', yieldLiters: 13.0, fatPercentage: 4.1 }
  ],
  poultryBatches: [],
  poultryLogs: [],
  fishPonds: [],
  fishLogs: [],
  crops: [
    {
      id: 501,
      userId: 105,
      farmId: 105,
      cropName: 'Fodder Corn (Maize Pioneer 30Y87)',
      variety: 'Pioneer 30Y87 High Biomass Silage Maize',
      landAreaAcres: 12,
      sowingDate: '2026-06-10',
      expectedHarvestDate: '2026-09-05',
      status: 'vegetative',
      notes: 'Planted specifically for green chop and winter silage bunker production.'
    },
    {
      id: 502,
      userId: 105,
      farmId: 105,
      cropName: 'Super Sadabahar SSG Fodder',
      variety: 'SSG Multi-cut Hybrid',
      landAreaAcres: 8,
      sowingDate: '2026-05-01',
      expectedHarvestDate: '2026-08-30',
      status: 'flowering',
      notes: '3rd cut completed. Highly digestible sweet forage for milking herd.'
    }
  ],
  cropExpenses: [
    { id: 5011, cropId: 501, cropName: 'Fodder Corn Maize', category: 'Seed', amount: 54000, date: '2026-06-08', description: '6 Bags Pioneer Hybrid Maize' },
    { id: 5012, cropId: 501, cropName: 'Fodder Corn Maize', category: 'Fertilizer', amount: 62000, date: '2026-06-25', description: '8 Bags Urea + 4 Bags Nitrophos' }
  ],
  cropInventories: [
    {
      id: 501,
      userId: 105,
      cropId: 501,
      cropName: 'Wrapped Corn Silage Bales',
      totalYieldKg: 45000,
      availableQuantity: 38000,
      storageLocation: 'Faisalabad Silage Yard #2',
      harvestDate: '2026-07-15',
      isListedOnMarketplace: true
    }
  ],
  warehouseInventory: [
    {
      id: 501,
      userId: 105,
      cropId: 501,
      cropName: 'Wrapped Corn Silage Bales',
      totalYieldKg: 45000,
      storedQuantity: 38000,
      storageLocation: 'Faisalabad Farm Silage Depot',
      packagingUnit: 'kg',
      lastUpdated: '2026-08-21'
    }
  ],
  b2bSales: [],
  marketplaceListings: [
    {
      id: 501,
      userId: 105,
      title: 'Nutritious Inoculated Corn Silage Wrapped Bales (80 kg Round Bales)',
      category: 'feed_silage',
      price: 950,
      currency: 'PKR',
      quantity: '400 Wrapped Bales (80kg each)',
      sellerName: 'Tariq Mehmood',
      sellerPhone: '+923129988776',
      locationDistrict: 'Faisalabad, Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'High energy corn silage packed with European 6-layer UV stretch film. Fermented with Pioneer microbial inoculant for enhanced milk yield in dairy cows and buffaloes.',
      postedDate: '2026-08-20',
      status: 'active',
      viewsCount: 265,
      inquiriesCount: 38,
      isVerifiedFarmer: true
    },
    {
      id: 502,
      userId: 105,
      title: 'Organic Pure Desi Cow Ghee (Bilona Method Churned)',
      category: 'crops_harvest',
      price: 2800,
      currency: 'PKR',
      quantity: '50 Glass Jars (1 kg each)',
      sellerName: 'Tariq Mehmood',
      sellerPhone: '+923129988776',
      locationDistrict: 'Faisalabad, Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Traditional wood-churned A2 grass-fed Sahiwal cow ghee. Golden aroma, lab-tested 100% purity, zero preservatives.',
      postedDate: '2026-08-21',
      status: 'active',
      viewsCount: 198,
      inquiriesCount: 32,
      isVerifiedFarmer: true
    }
  ],
  khataTransactions: [
    { id: 50101, farmId: 105, enterpriseType: 'dairy', categoryName: 'Daily Milk Delivery Revenue', transactionType: 'income', amount: 56000, paymentMode: 'cash', transactionDate: '2026-08-21', partyName: 'Faisalabad City Milk Collection Center' },
    { id: 50102, farmId: 105, enterpriseType: 'crops', categoryName: 'Silage Wrapping Stretch Film Rolls', transactionType: 'expense', amount: 42000, paymentMode: 'bank_transfer', transactionDate: '2026-07-12', partyName: 'Agri Plastics Lahore' }
  ]
};

// All 5 Realistic Farmer Profiles
export const ALL_SEED_FARMER_PROFILES: SeedFarmerProfile[] = [
  SEED_FARMER_1_ASLAM,
  SEED_FARMER_2_RIAZ,
  SEED_FARMER_3_SHER_KHAN,
  SEED_FARMER_4_GHULAM_RASOOL,
  SEED_FARMER_5_TARIQ_MEHMOOD
];

// Aggregated all initial marketplace listings across farmers
export const AGGREGATED_SEED_MARKETPLACE_LISTINGS: MarketplaceListing[] = ALL_SEED_FARMER_PROFILES.flatMap(
  f => f.marketplaceListings
);
