// src/context/FarmContext.tsx
import React, { createContext, useContext, useState } from 'react';
import {
  Farm,
  FarmType,
  DairyAnimal,
  MilkLog,
  PoultryBatch,
  PoultryDailyLog,
  FishPond,
  FishSamplingLog,
  KhataTransaction,
  KhataParty,
  Crop,
  CropExpense,
  CropInventory,
  WarehouseInventory,
  B2BSale,
  MarketplaceListing
} from '../types';
import { useAuth } from './AuthContext';
import { ALL_SEED_FARMER_PROFILES, AGGREGATED_SEED_MARKETPLACE_LISTINGS } from '../data/seedData';

interface FarmContextType {
  farm: Farm;
  farms: Farm[];
  setFarm: (farm: Farm) => void;
  updateFarmType: (type: FarmType) => void;
  addFarm: (newFarm: Omit<Farm, 'id' | 'userId'>) => { success: boolean; message?: string };
  updateFarm: (id: number, updatedFarm: Partial<Farm>) => void;
  deleteFarm: (id: number) => void;

  // Dairy Livestock CRUD
  dairyAnimals: DairyAnimal[];
  milkLogs: MilkLog[];
  addDairyAnimal: (animal: Omit<DairyAnimal, 'id' | 'farmId'>) => { success: boolean; message?: string };
  updateDairyAnimal: (id: number, animal: Partial<DairyAnimal>) => void;
  deleteDairyAnimal: (id: number) => void;
  addMilkLog: (log: Omit<MilkLog, 'id' | 'farmId'>) => void;

  // Poultry Flocks CRUD
  poultryBatches: PoultryBatch[];
  poultryLogs: PoultryDailyLog[];
  addPoultryBatch: (batch: Omit<PoultryBatch, 'id' | 'farmId' | 'currentBirdCount'>) => { success: boolean; message?: string };
  updatePoultryBatch: (id: number, batch: Partial<PoultryBatch>) => void;
  deletePoultryBatch: (id: number) => void;
  addPoultryLog: (log: Omit<PoultryDailyLog, 'id'>) => void;

  // Fish Aquaculture CRUD
  fishPonds: FishPond[];
  fishLogs: FishSamplingLog[];
  addFishPond: (pond: Omit<FishPond, 'id' | 'farmId'>) => { success: boolean; message?: string };
  updateFishPond: (id: number, pond: Partial<FishPond>) => void;
  deleteFishPond: (id: number) => void;
  addFishLog: (log: Omit<FishSamplingLog, 'id'>) => void;

  // Crop Lifecycle & Inventory CRUD
  crops: Crop[];
  cropExpenses: CropExpense[];
  cropInventories: CropInventory[];
  warehouseInventory: WarehouseInventory[];
  b2bSales: B2BSale[];
  addCrop: (crop: Omit<Crop, 'id' | 'userId' | 'farmId'>) => { success: boolean; message?: string };
  updateCrop: (id: number, crop: Partial<Crop>) => void;
  deleteCrop: (id: number) => void;
  addCropExpense: (expense: Omit<CropExpense, 'id'>) => void;
  logCropHarvest: (cropId: number, totalYieldKg: number, storageLocation?: string) => void;
  postCropHarvestToMarketplace: (inventoryId: number, listingData: { title: string; description: string; expectedPrice: number; quantity: string; imageUrl?: string }) => void;
  addWarehouseStock: (stock: Omit<WarehouseInventory, 'id' | 'userId'>) => void;
  updateWarehouseStock: (id: number, stock: Partial<WarehouseInventory>) => void;
  processB2BSale: (sale: Omit<B2BSale, 'id' | 'userId'>) => void;

  // Marketplace Listings & Ad Management
  marketplaceListings: MarketplaceListing[];
  addMarketplaceListing: (listing: Omit<MarketplaceListing, 'id' | 'postedDate'>) => void;
  updateMarketplaceListing: (id: number, updatedListing: Partial<MarketplaceListing>, requesterUserId?: number) => { success: boolean; message?: string };
  deleteMarketplaceListing: (id: number, requesterUserId?: number) => { success: boolean; message?: string };
  switchFarmerProfile: (farmerId: number) => void;

  // Khata & Ledgers
  khataTransactions: KhataTransaction[];
  parties: KhataParty[];
  addKhataTransaction: (tx: Omit<KhataTransaction, 'id' | 'farmId'>) => void;

  // Quotas & Stats
  quotas: {
    dairy: { current: number; max: number };
    poultry: { current: number; max: number };
    fish: { current: number; max: number };
  };
  metrics: {
    totalAnimals: number;
    todayMilkYield: number;
    activeFlocks: number;
    totalBirds: number;
    activePonds: number;
    totalCropAcres: number;
    totalStoredGrainKg: number;
    totalB2BSalesPkr: number;
    monthlyIncome: number;
    monthlyExpense: number;
    netProfit: number;
  };
}

const DEFAULT_FARMS: Farm[] = [
  {
    id: 1,
    userId: 101,
    name: 'Al-Madina Agro Complex',
    farmType: 'mixed',
    currency: 'PKR',
    locationDistrict: 'Sahiwal, Punjab',
    totalAreaAcres: 50
  },
  {
    id: 2,
    userId: 101,
    name: 'Chenab Valley Dairy Estate',
    farmType: 'dairy',
    currency: 'PKR',
    locationDistrict: 'Jhang, Punjab',
    totalAreaAcres: 40
  },
  {
    id: 3,
    userId: 101,
    name: 'Ravi Aquaculture & Hatchery',
    farmType: 'fish',
    currency: 'PKR',
    locationDistrict: 'Kasur, Punjab',
    totalAreaAcres: 15
  }
];

const INITIAL_ANIMALS: DairyAnimal[] = [
  { id: 1, farmId: 1, tagNumber: 'PK-SAH-01', nameOrAlias: 'Rani', species: 'cow', breed: 'Sahiwal Pure', gender: 'female', lactationStage: 'milking', lastYieldLiters: 18.5, status: 'active' },
  { id: 2, farmId: 1, tagNumber: 'PK-SAH-02', nameOrAlias: 'Moti', species: 'buffalo', breed: 'Nili-Ravi', gender: 'female', lactationStage: 'milking', lastYieldLiters: 14.0, status: 'active' },
  { id: 3, farmId: 1, tagNumber: 'PK-SAH-03', nameOrAlias: 'Sitara', species: 'cow', breed: 'Cholistani Cross', gender: 'female', lactationStage: 'milking', lastYieldLiters: 16.0, status: 'active' },
  { id: 4, farmId: 1, tagNumber: 'PK-SAH-04', nameOrAlias: 'Surriya', species: 'buffalo', breed: 'Kundi', gender: 'female', lactationStage: 'dry', lastYieldLiters: 0, status: 'active' },
  { id: 5, farmId: 1, tagNumber: 'PK-SAH-05', nameOrAlias: 'Gori', species: 'cow', breed: 'Holstein Friesian', gender: 'female', lactationStage: 'milking', lastYieldLiters: 24.5, status: 'active' },
];

const INITIAL_MILK_LOGS: MilkLog[] = [
  { id: 1, farmId: 1, animalTag: 'PK-SAH-01', logDate: '2026-08-18', shift: 'morning', yieldLiters: 10.5, fatPercentage: 4.8 },
  { id: 2, farmId: 1, animalTag: 'PK-SAH-01', logDate: '2026-08-18', shift: 'evening', yieldLiters: 8.0, fatPercentage: 4.9 },
  { id: 3, farmId: 1, animalTag: 'PK-SAH-02', logDate: '2026-08-18', shift: 'morning', yieldLiters: 8.0, fatPercentage: 6.8 },
  { id: 4, farmId: 1, animalTag: 'PK-SAH-02', logDate: '2026-08-18', shift: 'evening', yieldLiters: 6.0, fatPercentage: 7.0 },
  { id: 5, farmId: 1, animalTag: 'PK-SAH-05', logDate: '2026-08-18', shift: 'morning', yieldLiters: 14.0, fatPercentage: 3.9 },
];

const INITIAL_POULTRY_BATCHES: PoultryBatch[] = [
  { id: 1, farmId: 1, batchCode: 'FLOCK-2026-B1', birdType: 'broiler', breedName: 'Cobb 500', initialBirdCount: 3000, currentBirdCount: 2940, placementDate: '2026-07-28', status: 'active' },
  { id: 2, farmId: 1, batchCode: 'LAYER-2026-L2', birdType: 'layer', breedName: 'Lohmann Brown', initialBirdCount: 2000, currentBirdCount: 1980, placementDate: '2026-06-15', status: 'active' },
];

const INITIAL_POULTRY_LOGS: PoultryDailyLog[] = [
  { id: 1, batchId: 1, logDate: '2026-08-18', mortalityCount: 4, feedConsumedKg: 280, waterIntakeLiters: 650, avgBodyWeightGrams: 1420 },
  { id: 2, batchId: 1, logDate: '2026-08-17', mortalityCount: 3, feedConsumedKg: 275, waterIntakeLiters: 640, avgBodyWeightGrams: 1350 },
];

const INITIAL_FISH_PONDS: FishPond[] = [
  { id: 1, farmId: 1, pondNameOrNumber: 'Pond 1 (North Lake)', areaSqftOrAcres: 3.5, areaUnit: 'acres', averageDepthFeet: 6.0, waterSource: 'Canal + Solar Tube-well', status: 'active' },
  { id: 2, farmId: 1, pondNameOrNumber: 'Pond 2 (Nursery Lake)', areaSqftOrAcres: 1.5, areaUnit: 'acres', averageDepthFeet: 4.5, waterSource: 'Canal Water', status: 'active' },
];

const INITIAL_FISH_LOGS: FishSamplingLog[] = [
  { id: 1, pondId: 1, sampleDate: '2026-08-15', speciesName: 'Rohu & Catla', avgWeightGrams: 850, dailyFeedAmountKg: 45, waterPh: 7.6, dissolvedOxygenPpm: 5.8, mortalityObserved: 0 },
];

// Initial Crops
const INITIAL_CROPS: Crop[] = [
  {
    id: 1,
    userId: 101,
    farmId: 1,
    cropName: 'Sugarcane (کماد)',
    variety: 'CPF-249 Early High Sugar',
    landAreaAcres: 16.0,
    sowingDate: '2026-02-15',
    expectedHarvestDate: '2026-11-20',
    status: 'vegetative',
    notes: 'Contract delivery allocated to Shakarganj Sugar Mills.'
  },
  {
    id: 2,
    userId: 101,
    farmId: 1,
    cropName: 'Basmati Rice (دھان/چاول)',
    variety: 'Super Basmati Kainat 1121',
    landAreaAcres: 12.5,
    sowingDate: '2026-06-10',
    expectedHarvestDate: '2026-10-25',
    status: 'flowering',
    notes: 'First irrigation scheduled; bio-fertilizer application completed.'
  },
  {
    id: 3,
    userId: 101,
    farmId: 1,
    cropName: 'Wheat (گندم)',
    variety: 'Akbar-2019 Certified Seed',
    landAreaAcres: 15.0,
    sowingDate: '2025-11-10',
    expectedHarvestDate: '2026-04-20',
    status: 'harvested',
    notes: 'Bumper yield harvested and stored in Main Silo #1.'
  }
];

const INITIAL_CROP_EXPENSES: CropExpense[] = [
  { id: 1, cropId: 1, cropName: 'Sugarcane (کماد)', category: 'Seed', amount: 48000, date: '2026-02-16', description: 'Certified Sugarcane Sets 120 maunds' },
  { id: 2, cropId: 1, cropName: 'Sugarcane (کماد)', category: 'Fertilizer', amount: 65000, date: '2026-03-20', description: '10 Bags DAP + 8 Bags Urea (Engro)' },
  { id: 3, cropId: 1, cropName: 'Sugarcane (کماد)', category: 'Tractor', amount: 28000, date: '2026-04-10', description: 'Deep ploughing & ridging labor' },
  { id: 4, cropId: 2, cropName: 'Basmati Rice (دھان/چاول)', category: 'Seed', amount: 22500, date: '2026-06-11', description: 'Kainat 1121 Nursery Seedlings' },
  { id: 5, cropId: 2, cropName: 'Basmati Rice (دھان/چاول)', category: 'Labor', amount: 35000, date: '2026-06-25', description: 'Manual paddy transplanting team' },
  { id: 6, cropId: 3, cropName: 'Wheat (گندم)', category: 'Tractor', amount: 42000, date: '2026-04-22', description: 'Combine Harvester cutting & threshing' },
];

const INITIAL_WAREHOUSE_INVENTORY: WarehouseInventory[] = [
  {
    id: 1,
    userId: 101,
    cropId: 3,
    cropName: 'Wheat Grain (گندم کا اناج)',
    totalYieldKg: 24000,
    storedQuantity: 18500,
    storageLocation: 'Central Grain Silo A-1 (Grain Warehouse)',
    packagingUnit: 'kg',
    lastUpdated: '2026-08-15'
  },
  {
    id: 2,
    userId: 101,
    cropId: 1,
    cropName: 'Sugarcane Stalks (کماد رت)',
    totalYieldKg: 650000,
    storedQuantity: 320000,
    storageLocation: 'Field Yard & Transit Loading Bay',
    packagingUnit: 'kg',
    lastUpdated: '2026-08-18'
  }
];

const INITIAL_B2B_SALES: B2BSale[] = [
  {
    id: 1,
    userId: 101,
    cropId: 1,
    cropName: 'Sugarcane (کماد)',
    buyerName: 'Shakarganj Sugar Mills Ltd.',
    buyerType: 'sugar_mill',
    vehicleNumber: 'TRK-4820 (10-Wheeler)',
    vehicleWeightSlip: 'MILL-KANDA-94021',
    grossWeightKg: 38500,
    tareWeightKg: 12500,
    totalWeight: 26000,
    weightUnit: 'kg',
    ratePerUnit: 425, // Rs. 425 per 40kg (Maund)
    grossAmount: 276250,
    commissionDeduction: 5500, // Arhat / loading deduction
    taxDeduction: 2762,
    netPayable: 267988,
    paymentStatus: 'paid',
    saleDate: '2026-08-14'
  },
  {
    id: 2,
    userId: 101,
    cropId: 3,
    cropName: 'Wheat Grain (گندم)',
    buyerName: 'Ch. Aslam Grain Commission Agent (Ghalla Mandi)',
    buyerType: 'commission_agent',
    vehicleNumber: 'LES-9104 (Mazda)',
    vehicleWeightSlip: 'MANDI-KS-10842',
    grossWeightKg: 14200,
    tareWeightKg: 4200,
    totalWeight: 10000,
    weightUnit: 'kg',
    ratePerUnit: 3900, // Rs. 3900 per 40kg (Maund)
    grossAmount: 975000,
    commissionDeduction: 19500, // 2% Arhat
    taxDeduction: 0,
    netPayable: 955500,
    paymentStatus: 'paid',
    saleDate: '2026-08-08'
  }
];

const INITIAL_CROP_INVENTORY: CropInventory[] = [
  {
    id: 1,
    userId: 101,
    cropId: 3,
    cropName: 'Wheat (گندم - Akbar 2019)',
    totalYieldKg: 18000,
    availableQuantity: 14000,
    storageLocation: 'Central Farm Silo Room #1',
    harvestDate: '2026-05-10',
    isListedOnMarketplace: false
  },
  {
    id: 2,
    userId: 101,
    cropId: 1,
    cropName: 'Sugarcane (کماد - CPF-249)',
    totalYieldKg: 650000,
    availableQuantity: 320000,
    storageLocation: 'Field Yard & Transit Loading Bay',
    harvestDate: '2026-08-12',
    isListedOnMarketplace: true
  }
];

const INITIAL_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 1,
    title: 'Pure Sahiwal Breed Milking Cows (18L Daily Yield)',
    category: 'dairy_cattle',
    price: 320000,
    currency: 'PKR',
    quantity: '3 Cows (2nd Lactation)',
    sellerName: 'Chaudhry Farooq Cattle Farm',
    sellerPhone: '+923008472910',
    locationDistrict: 'Sahiwal, Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Vaccinated against FMD & LSD. High butterfat percentage (4.8%). High genetic potential, docile temperament.',
    postedDate: '2026-08-16',
    isVerifiedFarmer: true
  },
  {
    id: 2,
    title: 'Day-Old Broiler Chicks (Cobb 500 Fast Growth)',
    category: 'poultry_birds',
    price: 95,
    currency: 'PKR',
    quantity: '2,500 Chicks (Vaccinated)',
    sellerName: 'Al-Haq Hatcheries',
    sellerPhone: '+923017654321',
    locationDistrict: 'Faisalabad, Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Marek vaccinated day-old chicks. High livability (98%+), target FCR of 1.45 at 35 days.',
    postedDate: '2026-08-18',
    isVerifiedFarmer: true
  },
  {
    id: 3,
    title: '14 Metric Tons Premium Milling Wheat (Akbar 2019)',
    category: 'crops_harvest',
    price: 3950,
    currency: 'PKR',
    quantity: '14 Tons (350 Bags)',
    sellerName: 'Al-Madina Agro Complex',
    sellerPhone: '+923001234567',
    locationDistrict: 'Sahiwal, Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Dry, cleaned 2026 season wheat with 12% moisture. Stored in climate-safe silos. Ready for flour mills or feed.',
    postedDate: '2026-08-17',
    isVerifiedFarmer: true
  }
];

const INITIAL_KHATA: KhataTransaction[] = [
  { id: 1, farmId: 1, enterpriseType: 'dairy', categoryName: 'Morning Milk Delivery (Nestlé/Gawala)', transactionType: 'income', amount: 48500, paymentMode: 'bank_transfer', transactionDate: '2026-08-18', partyName: 'Sahiwal Milk Center', description: 'Bulk raw milk 310 Litres' },
  { id: 2, farmId: 1, enterpriseType: 'dairy', categoryName: 'Silage & Wanda Concentrate Feed', transactionType: 'expense', amount: 22000, paymentMode: 'cash', transactionDate: '2026-08-17', partyName: 'Supreme Agri Feeds', description: '15 Bags of 18% CP Cattle Feed' },
  { id: 3, farmId: 1, enterpriseType: 'crops', categoryName: 'Sugarcane Sale to Shakarganj Mill (Gatepass #MILL-KANDA-94021)', transactionType: 'income', amount: 267988, paymentMode: 'bank_transfer', transactionDate: '2026-08-14', partyName: 'Shakarganj Sugar Mills Ltd.', description: 'Net B2B Mill Dispatch (26,000 kg Sugar Cane)' },
  { id: 4, farmId: 1, enterpriseType: 'crops', categoryName: 'Wheat Fertilizer & DAP (Engro)', transactionType: 'expense', amount: 65000, paymentMode: 'cash', transactionDate: '2026-03-20', partyName: 'Agro Chemicals Store', description: '10 Bags DAP + 8 Bags Urea' },
  { id: 5, farmId: 1, enterpriseType: 'poultry', categoryName: 'Broiler Starter Feed #1', transactionType: 'expense', amount: 38000, paymentMode: 'bank_transfer', transactionDate: '2026-08-16', partyName: 'National Poultry Feeds' },
  { id: 6, farmId: 1, enterpriseType: 'fish', categoryName: 'Commercial Floating Fish Pellets', transactionType: 'expense', amount: 18500, paymentMode: 'jazzcash', transactionDate: '2026-08-15', partyName: 'Agro Aqua Store' },
  { id: 7, farmId: 1, enterpriseType: 'general', categoryName: 'Solar Tube-well Electricity Bill', transactionType: 'expense', amount: 9500, paymentMode: 'easypaisa', transactionDate: '2026-08-14' },
];

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPlan, user, loginAsFarmerProfile } = useAuth();
  
  // Seed All 5 Farms
  const allSeedFarms: Farm[] = ALL_SEED_FARMER_PROFILES.map(p => p.farm);
  const [farms, setFarms] = useState<Farm[]>(allSeedFarms);
  const [farm, setFarm] = useState<Farm>(allSeedFarms[0]);
  
  // Dairy Livestock (Seeded with Farmer 1: Chaudhry Aslam's 50 Cows)
  const [dairyAnimals, setDairyAnimals] = useState<DairyAnimal[]>(ALL_SEED_FARMER_PROFILES[0].dairyAnimals);
  const [milkLogs, setMilkLogs] = useState<MilkLog[]>(ALL_SEED_FARMER_PROFILES[0].milkLogs);
  
  // Poultry (Seeded with Farmer 3: Sher Khan's 5000 Broiler Flock)
  const [poultryBatches, setPoultryBatches] = useState<PoultryBatch[]>(ALL_SEED_FARMER_PROFILES[2].poultryBatches);
  const [poultryLogs, setPoultryLogs] = useState<PoultryDailyLog[]>(ALL_SEED_FARMER_PROFILES[2].poultryLogs);
  
  // Fish (Seeded with Farmer 4: Ghulam Rasool's Tilapia & Rohu Ponds)
  const [fishPonds, setFishPonds] = useState<FishPond[]>(ALL_SEED_FARMER_PROFILES[3].fishPonds);
  const [fishLogs, setFishLogs] = useState<FishSamplingLog[]>(ALL_SEED_FARMER_PROFILES[3].fishLogs);
  
  // Crops & B2B Sales (Seeded with Farmer 2: Malik Riaz's 30 Acres Wheat & Sugarcane)
  const [crops, setCrops] = useState<Crop[]>(ALL_SEED_FARMER_PROFILES[1].crops);
  const [cropExpenses, setCropExpenses] = useState<CropExpense[]>(ALL_SEED_FARMER_PROFILES[1].cropExpenses);
  const [cropInventories, setCropInventories] = useState<CropInventory[]>(ALL_SEED_FARMER_PROFILES[1].cropInventories);
  const [warehouseInventory, setWarehouseInventory] = useState<WarehouseInventory[]>(ALL_SEED_FARMER_PROFILES[1].warehouseInventory);
  const [b2bSales, setB2bSales] = useState<B2BSale[]>(ALL_SEED_FARMER_PROFILES[1].b2bSales);

  // Marketplace: Seeded with realistic listings from all 5 farmers
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(AGGREGATED_SEED_MARKETPLACE_LISTINGS);

  // Khata Ledger
  const [khataTransactions, setKhataTransactions] = useState<KhataTransaction[]>(ALL_SEED_FARMER_PROFILES[0].khataTransactions);
  const [parties] = useState<KhataParty[]>([
    { id: 1, farmId: 101, partyName: 'Shakarganj Sugar Mills Ltd.', partyType: 'buyer_customer', currentBalance: 267988 },
    { id: 2, farmId: 101, partyName: 'Ch. Aslam Grain Commission Agent', partyType: 'buyer_customer', currentBalance: 955500 },
    { id: 3, farmId: 101, partyName: 'Supreme Agri Feeds', partyType: 'supplier_vendor', currentBalance: -15000 },
  ]);

  // =========================================================================
  // Farm CRUD
  // =========================================================================
  const updateFarmType = (type: FarmType) => {
    setFarm(prev => ({ ...prev, farmType: type }));
    setFarms(prev => prev.map(f => f.id === farm.id ? { ...f, farmType: type } : f));
  };

  const addFarm = (newFarmData: Omit<Farm, 'id' | 'userId'>) => {
    const createdFarm: Farm = {
      ...newFarmData,
      id: Date.now(),
      userId: farm.userId || 101
    };
    setFarms(prev => [createdFarm, ...prev]);
    return { success: true };
  };

  const updateFarm = (id: number, updatedData: Partial<Farm>) => {
    setFarms(prev => prev.map(f => (f.id === id ? { ...f, ...updatedData } : f)));
    if (farm.id === id) {
      setFarm(prev => ({ ...prev, ...updatedData }));
    }
  };

  const deleteFarm = (id: number) => {
    setFarms(prev => prev.filter(f => f.id !== id));
    if (farm.id === id) {
      const remaining = farms.filter(f => f.id !== id);
      if (remaining.length > 0) {
        setFarm(remaining[0]);
      }
    }
  };

  // =========================================================================
  // Dairy Livestock CRUD
  // =========================================================================
  const addDairyAnimal = (animal: Omit<DairyAnimal, 'id' | 'farmId'>) => {
    const activeCount = dairyAnimals.filter(a => a.status === 'active').length;
    if (currentPlan.maxDairyAnimals !== -1 && activeCount >= currentPlan.maxDairyAnimals) {
      return {
        success: false,
        message: `Free plan is limited to ${currentPlan.maxDairyAnimals} animals. Please upgrade to Pro for unlimited livestock records.`
      };
    }
    const newAnimal: DairyAnimal = {
      ...animal,
      id: Date.now(),
      farmId: farm.id,
      status: animal.status || 'active'
    };
    setDairyAnimals(prev => [newAnimal, ...prev]);
    return { success: true };
  };

  const updateDairyAnimal = (id: number, updatedAnimal: Partial<DairyAnimal>) => {
    setDairyAnimals(prev => prev.map(a => (a.id === id ? { ...a, ...updatedAnimal } : a)));
  };

  const deleteDairyAnimal = (id: number) => {
    setDairyAnimals(prev => prev.filter(a => a.id !== id));
  };

  const addMilkLog = (log: Omit<MilkLog, 'id' | 'farmId'>) => {
    const newLog: MilkLog = {
      ...log,
      id: Date.now(),
      farmId: farm.id
    };
    setMilkLogs(prev => [newLog, ...prev]);
  };

  // =========================================================================
  // Poultry Flocks CRUD
  // =========================================================================
  const addPoultryBatch = (batch: Omit<PoultryBatch, 'id' | 'farmId' | 'currentBirdCount'>) => {
    const activeFlocks = poultryBatches.filter(b => b.status === 'active').length;
    if (currentPlan.maxPoultryFlocks !== -1 && activeFlocks >= currentPlan.maxPoultryFlocks) {
      return {
        success: false,
        message: `Free plan is limited to ${currentPlan.maxPoultryFlocks} active flocks. Upgrade to Pro for unlimited batches.`
      };
    }
    const newBatch: PoultryBatch = {
      ...batch,
      id: Date.now(),
      farmId: farm.id,
      currentBirdCount: batch.initialBirdCount,
      status: 'active'
    };
    setPoultryBatches(prev => [newBatch, ...prev]);
    return { success: true };
  };

  const updatePoultryBatch = (id: number, updatedBatch: Partial<PoultryBatch>) => {
    setPoultryBatches(prev => prev.map(b => (b.id === id ? { ...b, ...updatedBatch } : b)));
  };

  const deletePoultryBatch = (id: number) => {
    setPoultryBatches(prev => prev.filter(b => b.id !== id));
  };

  const addPoultryLog = (log: Omit<PoultryDailyLog, 'id'>) => {
    const newLog: PoultryDailyLog = {
      ...log,
      id: Date.now()
    };
    setPoultryLogs(prev => [newLog, ...prev]);
    
    if (log.mortalityCount > 0) {
      setPoultryBatches(prev => prev.map(b => {
        if (b.id === log.batchId) {
          return { ...b, currentBirdCount: Math.max(0, b.currentBirdCount - log.mortalityCount) };
        }
        return b;
      }));
    }
  };

  // =========================================================================
  // Fish Aquaculture CRUD
  // =========================================================================
  const addFishPond = (pond: Omit<FishPond, 'id' | 'farmId'>) => {
    const activePonds = fishPonds.filter(p => p.status === 'active').length;
    if (currentPlan.maxFishPonds !== -1 && activePonds >= currentPlan.maxFishPonds) {
      return {
        success: false,
        message: `Free plan is limited to ${currentPlan.maxFishPonds} active ponds. Upgrade to Pro for unlimited ponds.`
      };
    }
    const newPond: FishPond = {
      ...pond,
      id: Date.now(),
      farmId: farm.id,
      status: 'active'
    };
    setFishPonds(prev => [newPond, ...prev]);
    return { success: true };
  };

  const updateFishPond = (id: number, updatedPond: Partial<FishPond>) => {
    setFishPonds(prev => prev.map(p => (p.id === id ? { ...p, ...updatedPond } : p)));
  };

  const deleteFishPond = (id: number) => {
    setFishPonds(prev => prev.filter(p => p.id !== id));
  };

  const addFishLog = (log: Omit<FishSamplingLog, 'id'>) => {
    const newLog: FishSamplingLog = {
      ...log,
      id: Date.now()
    };
    setFishLogs(prev => [newLog, ...prev]);
  };

  // =========================================================================
  // Crop Lifecycle & B2B Sales CRUD (With Auto-Sync to Master Ledger)
  // =========================================================================
  const addCrop = (crop: Omit<Crop, 'id' | 'userId' | 'farmId'>) => {
    const newCrop: Crop = {
      ...crop,
      id: Date.now(),
      userId: farm.userId || 101,
      farmId: farm.id
    };
    setCrops(prev => [newCrop, ...prev]);
    return { success: true };
  };

  const updateCrop = (id: number, updatedCrop: Partial<Crop>) => {
    setCrops(prev => prev.map(c => (c.id === id ? { ...c, ...updatedCrop } : c)));
  };

  const deleteCrop = (id: number) => {
    setCrops(prev => prev.filter(c => c.id !== id));
  };

  // Automatically sync Crop Expense with Master Ledger!
  const addCropExpense = (expense: Omit<CropExpense, 'id'>) => {
    const newExpense: CropExpense = {
      ...expense,
      id: Date.now()
    };
    setCropExpenses(prev => [newExpense, ...prev]);

    // Auto-record to Master Khata Ledger as an expense
    const khataTx: KhataTransaction = {
      id: Date.now() + 1,
      farmId: farm.id,
      enterpriseType: 'crops',
      categoryName: `${expense.cropName || 'Crop'} - ${expense.category} Input`,
      transactionType: 'expense',
      amount: expense.amount,
      paymentMode: 'cash',
      transactionDate: expense.date || new Date().toISOString().split('T')[0],
      description: expense.description || `Stage input cost for ${expense.category}`
    };
    setKhataTransactions(prev => [khataTx, ...prev]);
  };

  // Farmer Crops: Log harvest into crop_inventory
  const logCropHarvest = (cropId: number, totalYieldKg: number, storageLocation?: string) => {
    const targetCrop = crops.find(c => c.id === cropId);
    const cropName = targetCrop ? targetCrop.cropName : 'Harvested Crop';

    // 1. Mark crop status as harvested
    setCrops(prev => prev.map(c => (c.id === cropId ? { ...c, status: 'harvested' as const } : c)));

    // 2. Add or update crop_inventory record
    const newInventory: CropInventory = {
      id: Date.now(),
      userId: farm.userId || 101,
      cropId: cropId,
      cropName: cropName,
      totalYieldKg: Number(totalYieldKg),
      availableQuantity: Number(totalYieldKg),
      storageLocation: storageLocation?.trim() || 'Central Farm Storage #1',
      harvestDate: new Date().toISOString().split('T')[0],
      isListedOnMarketplace: false
    };
    setCropInventories(prev => [newInventory, ...prev]);

    // Also update warehouse stock for backwards compatibility
    const newWarehouse: WarehouseInventory = {
      id: Date.now() + 10,
      userId: farm.userId || 101,
      cropId: cropId,
      cropName: cropName,
      totalYieldKg: Number(totalYieldKg),
      storedQuantity: Number(totalYieldKg),
      storageLocation: storageLocation?.trim() || 'Central Storage Silo',
      packagingUnit: 'kg',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setWarehouseInventory(prev => [newWarehouse, ...prev]);
  };

  // Marketplace Integration: Post available crop inventory to marketplace_listings
  const postCropHarvestToMarketplace = (
    inventoryId: number,
    listingData: {
      title: string;
      description: string;
      expectedPrice: number;
      quantity: string;
      imageUrl?: string;
    }
  ) => {
    // 1. Update inventory record status
    setCropInventories(prev =>
      prev.map(inv => (inv.id === inventoryId ? { ...inv, isListedOnMarketplace: true } : inv))
    );

    // 2. Add listing to marketplace
    const newListing: MarketplaceListing = {
      id: Date.now(),
      title: listingData.title,
      category: 'crops_harvest',
      price: listingData.expectedPrice,
      currency: farm.currency || 'PKR',
      quantity: listingData.quantity,
      sellerName: farm.name || 'Verified Kisan',
      sellerPhone: '+923001234567',
      locationDistrict: farm.locationDistrict || 'Sahiwal, Punjab',
      imageUrl:
        listingData.imageUrl ||
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      description: listingData.description || 'Freshly harvested yield available directly from farm.',
      postedDate: new Date().toISOString().split('T')[0],
      isVerifiedFarmer: true
    };
    setMarketplaceListings(prev => [newListing, ...prev]);
  };

  const addMarketplaceListing = (listing: Omit<MarketplaceListing, 'id' | 'postedDate'>) => {
    const newListing: MarketplaceListing = {
      ...listing,
      id: Date.now(),
      userId: listing.userId || user?.id || farm.userId || 101,
      status: listing.status || 'active',
      viewsCount: listing.viewsCount || 1,
      inquiriesCount: listing.inquiriesCount || 0,
      postedDate: new Date().toISOString().split('T')[0]
    };
    setMarketplaceListings(prev => [newListing, ...prev]);
  };

  const updateMarketplaceListing = (
    id: number,
    updatedListing: Partial<MarketplaceListing>,
    requesterUserId?: number
  ): { success: boolean; message?: string } => {
    const existing = marketplaceListings.find(l => l.id === id);
    if (!existing) {
      return { success: false, message: 'Marketplace listing not found.' };
    }

    // Authorization check: User can only edit their own listings
    const authUserId = requesterUserId || user?.id;
    if (existing.userId && authUserId && existing.userId !== authUserId) {
      return {
        success: false,
        message: 'Security Alert: You are not authorized to edit listings owned by another farmer.'
      };
    }

    setMarketplaceListings(prev =>
      prev.map(l => (l.id === id ? { ...l, ...updatedListing } : l))
    );
    return { success: true };
  };

  const deleteMarketplaceListing = (
    id: number,
    requesterUserId?: number
  ): { success: boolean; message?: string } => {
    const existing = marketplaceListings.find(l => l.id === id);
    if (!existing) {
      return { success: false, message: 'Marketplace listing not found.' };
    }

    // Authorization check: User can only delete their own listings
    const authUserId = requesterUserId || user?.id;
    if (existing.userId && authUserId && existing.userId !== authUserId) {
      return {
        success: false,
        message: 'Security Alert: You are not authorized to delete listings owned by another farmer.'
      };
    }

    setMarketplaceListings(prev => prev.filter(l => l.id !== id));
    return { success: true };
  };

  const switchFarmerProfile = (farmerId: number) => {
    const profile = ALL_SEED_FARMER_PROFILES.find(p => p.user.id === farmerId);
    if (!profile) return;

    loginAsFarmerProfile(profile.user);
    setFarm(profile.farm);
    setDairyAnimals(profile.dairyAnimals);
    setMilkLogs(profile.milkLogs);
    setPoultryBatches(profile.poultryBatches);
    setPoultryLogs(profile.poultryLogs);
    setFishPonds(profile.fishPonds);
    setFishLogs(profile.fishLogs);
    setCrops(profile.crops);
    setCropExpenses(profile.cropExpenses);
    setCropInventories(profile.cropInventories);
    setWarehouseInventory(profile.warehouseInventory);
    setB2bSales(profile.b2bSales);
    setKhataTransactions(profile.khataTransactions);
  };

  const addWarehouseStock = (stock: Omit<WarehouseInventory, 'id' | 'userId'>) => {
    const newStock: WarehouseInventory = {
      ...stock,
      id: Date.now(),
      userId: farm.userId || 101,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setWarehouseInventory(prev => [newStock, ...prev]);
  };

  const updateWarehouseStock = (id: number, updatedStock: Partial<WarehouseInventory>) => {
    setWarehouseInventory(prev => prev.map(w => (w.id === id ? { ...w, ...updatedStock, lastUpdated: new Date().toISOString().split('T')[0] } : w)));
  };

  // Automatically process B2B Sale, adjust inventory & sync net payable with Master Ledger!
  const processB2BSale = (sale: Omit<B2BSale, 'id' | 'userId'>) => {
    const newSale: B2BSale = {
      ...sale,
      id: Date.now(),
      userId: farm.userId || 101
    };
    setB2bSales(prev => [newSale, ...prev]);

    // Deduct stock from warehouse if exists
    setWarehouseInventory(prev => prev.map(item => {
      if (item.cropId === sale.cropId) {
        return {
          ...item,
          storedQuantity: Math.max(0, item.storedQuantity - sale.totalWeight),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    // Auto-record to Master Khata Ledger as an Income Transaction with full breakdown
    const khataTx: KhataTransaction = {
      id: Date.now() + 2,
      farmId: farm.id,
      enterpriseType: 'crops',
      categoryName: `B2B Sale: ${sale.cropName} -> ${sale.buyerName}`,
      transactionType: 'income',
      amount: sale.netPayable,
      paymentMode: 'bank_transfer',
      transactionDate: sale.saleDate || new Date().toISOString().split('T')[0],
      partyName: sale.buyerName,
      description: `Gatepass: ${sale.vehicleWeightSlip} | Vehicle: ${sale.vehicleNumber || 'N/A'} | Weight: ${sale.totalWeight}kg | Gross: Rs. ${sale.grossAmount.toLocaleString()} - Comm/Deduction: Rs. ${sale.commissionDeduction.toLocaleString()}`
    };
    setKhataTransactions(prev => [khataTx, ...prev]);
  };

  // =========================================================================
  // Master Khata Transactions
  // =========================================================================
  const addKhataTransaction = (tx: Omit<KhataTransaction, 'id' | 'farmId'>) => {
    const newTx: KhataTransaction = {
      ...tx,
      id: Date.now(),
      farmId: farm.id
    };
    setKhataTransactions(prev => [newTx, ...prev]);
  };

  // Aggregated computations
  const totalAnimals = dairyAnimals.filter(a => a.status === 'active').length;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayMilkYield = milkLogs
    .filter(l => l.logDate === todayDateStr || l.logDate === '2026-08-18')
    .reduce((sum, l) => sum + Number(l.yieldLiters), 0);

  const activeFlocks = poultryBatches.filter(b => b.status === 'active').length;
  const totalBirds = poultryBatches
    .filter(b => b.status === 'active')
    .reduce((sum, b) => sum + Number(b.currentBirdCount), 0);

  const activePonds = fishPonds.filter(p => p.status === 'active').length;

  const totalCropAcres = crops
    .filter(c => c.status !== 'harvested')
    .reduce((sum, c) => sum + Number(c.landAreaAcres), 0);

  const totalStoredGrainKg = warehouseInventory
    .reduce((sum, w) => sum + Number(w.storedQuantity), 0);

  const totalB2BSalesPkr = b2bSales
    .reduce((sum, s) => sum + Number(s.netPayable), 0);

  const monthlyIncome = khataTransactions
    .filter(t => t.transactionType === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpense = khataTransactions
    .filter(t => t.transactionType === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netProfit = monthlyIncome - monthlyExpense;

  const value: FarmContextType = {
    farm,
    farms,
    setFarm,
    updateFarmType,
    addFarm,
    updateFarm,
    deleteFarm,
    dairyAnimals,
    milkLogs,
    addDairyAnimal,
    updateDairyAnimal,
    deleteDairyAnimal,
    addMilkLog,
    poultryBatches,
    poultryLogs,
    addPoultryBatch,
    updatePoultryBatch,
    deletePoultryBatch,
    addPoultryLog,
    fishPonds,
    fishLogs,
    addFishPond,
    updateFishPond,
    deleteFishPond,
    addFishLog,
    crops,
    cropExpenses,
    cropInventories,
    warehouseInventory,
    b2bSales,
    addCrop,
    updateCrop,
    deleteCrop,
    addCropExpense,
    logCropHarvest,
    postCropHarvestToMarketplace,
    marketplaceListings,
    addMarketplaceListing,
    updateMarketplaceListing,
    deleteMarketplaceListing,
    switchFarmerProfile,
    addWarehouseStock,
    updateWarehouseStock,
    processB2BSale,
    khataTransactions,
    parties,
    addKhataTransaction,
    quotas: {
      dairy: { current: totalAnimals, max: currentPlan.maxDairyAnimals },
      poultry: { current: activeFlocks, max: currentPlan.maxPoultryFlocks },
      fish: { current: activePonds, max: currentPlan.maxFishPonds }
    },
    metrics: {
      totalAnimals,
      todayMilkYield,
      activeFlocks,
      totalBirds,
      activePonds,
      totalCropAcres,
      totalStoredGrainKg,
      totalB2BSalesPkr,
      monthlyIncome,
      monthlyExpense,
      netProfit
    }
  };

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
