// src/types.ts

export type FarmType = 'dairy' | 'poultry' | 'fish' | 'crops' | 'mixed';

export type EnterpriseType = 'general' | 'dairy' | 'poultry' | 'fish' | 'crops';

export type LanguageCode = 'en' | 'ur' | 'hi';

export type UserRole = 'admin' | 'farmer' | 'super_admin' | 'owner' | 'manager' | 'worker';

export type IsoCurrency = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'AED' | 'SAR' | 'CAD' | 'AUD' | 'BDT';

export interface User {
  id: number;
  phoneNumber: string;
  fullName: string;
  countryCode: string;
  preferredCurrency?: string;
  role: UserRole;
  isSuperAdmin?: boolean;
}

export interface SubscriptionPlan {
  code: 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY';
  name: string;
  price: number;
  currency: string;
  billingCycle: 'lifetime' | 'monthly' | 'yearly';
  maxDairyAnimals: number; // -1 for unlimited
  maxPoultryFlocks: number; // -1 for unlimited
  maxFishPonds: number; // -1 for unlimited
  hasAdvancedKhata: boolean;
  hasPdfExport: boolean;
}

export interface Farm {
  id: number;
  userId: number;
  name: string;
  farmType: FarmType;
  currency: string;
  locationDistrict?: string;
  locationState?: string;
  totalAreaAcres?: number;
}

export interface DairyAnimal {
  id: number;
  farmId: number;
  tagNumber: string;
  nameOrAlias?: string;
  species: 'cow' | 'buffalo' | 'goat' | 'sheep';
  breed?: string;
  gender: 'female' | 'male';
  dob?: string;
  lactationStage: 'milking' | 'dry' | 'pregnant_milking' | 'heifer' | 'calf';
  lastYieldLiters?: number;
  status: 'active' | 'sold' | 'deceased';
}

export interface MilkLog {
  id: number;
  farmId: number;
  animalId?: number;
  animalTag?: string;
  logDate: string;
  shift: 'morning' | 'afternoon' | 'evening';
  yieldLiters: number;
  fatPercentage?: number;
  notes?: string;
}

export interface PoultryBatch {
  id: number;
  farmId: number;
  batchCode: string;
  birdType: 'broiler' | 'layer' | 'desi_country';
  breedName?: string;
  initialBirdCount: number;
  currentBirdCount: number;
  placementDate: string;
  targetHarvestDate?: string;
  status: 'active' | 'harvested' | 'culled';
}

export interface PoultryDailyLog {
  id: number;
  batchId: number;
  logDate: string;
  mortalityCount: number;
  feedConsumedKg: number;
  waterIntakeLiters?: number;
  avgBodyWeightGrams?: number;
  eggsCollected?: number;
  notes?: string;
}

export interface FishPond {
  id: number;
  farmId: number;
  pondNameOrNumber: string;
  areaSqftOrAcres: number;
  areaUnit: 'acres' | 'sqft' | 'marla' | 'bigha';
  averageDepthFeet?: number;
  waterSource?: string;
  status: 'active' | 'fallow_drying' | 'maintenance';
}

export interface FishStocking {
  id: number;
  pondId: number;
  speciesName: string;
  seedCount: number;
  avgInitialWeightGrams: number;
  stockingDate: string;
  status: 'stocked' | 'harvested';
}

export interface FishSamplingLog {
  id: number;
  pondId: number;
  sampleDate: string;
  speciesName?: string;
  avgWeightGrams: number;
  dailyFeedAmountKg: number;
  waterPh?: number;
  dissolvedOxygenPpm?: number;
  mortalityObserved: number;
  notes?: string;
}

export interface KhataTransaction {
  id: number;
  farmId: number;
  enterpriseType: EnterpriseType;
  categoryName: string;
  transactionType: 'income' | 'expense';
  amount: number;
  paymentMode: 'cash' | 'bank_transfer' | 'stripe' | 'jazzcash' | 'easypaisa' | 'upi' | 'credit_udhaar';
  transactionDate: string;
  partyName?: string;
  description?: string;
}

export interface KhataParty {
  id: number;
  farmId: number;
  partyName: string;
  partyPhone?: string;
  partyType: 'buyer_customer' | 'supplier_vendor';
  currentBalance: number;
}

// Super Admin types
export interface AdminPlatformStats {
  totalFarmers: number;
  totalFarms: number;
  activeProSubscriptions: number;
  freeTierUsers: number;
  totalPlatformRevenuePkr: number; // Strictly aggregated in PKR (Rs.)
  monthlyRecurringRevenuePkr: number; // MRR in PKR
  annualRecurringRevenuePkr: number; // ARR in PKR
  totalLivestockCount: number;
  totalPoultryBirds: number;
  totalFishPonds: number;
  monthlyGrowthRate: number;
}

export interface AdminFarmerUser {
  id: number;
  phoneNumber: string;
  fullName: string;
  countryCode: string;
  preferredCurrency: string;
  role: UserRole;
  farmName: string;
  farmType: FarmType;
  locationDistrict?: string;
  planCode: 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY';
  planStatus: 'active' | 'suspended' | 'cancelled' | 'trial';
  createdAt: string;
  animalsCount: number;
  flocksCount: number;
  pondsCount: number;
  lastActive: string;
  lastPaymentAmount?: number;
  lastPaymentCurrency?: string;
  convertedAmountPkr?: number;
}

export interface StaffMember {
  id: number;
  fullName: string;
  phone: string;
  cnicOrNationalId?: string;
  role: 'Milker' | 'Flock Manager' | 'Pond Worker' | 'General Labor' | 'Supervisor';
  enterpriseAssigned: EnterpriseType;
  monthlySalary: number;
  totalAdvancePaid: number;
  joiningDate: string;
  status: 'active' | 'on_leave' | 'resigned';
}

export interface SalaryAdvance {
  id: number;
  staffId: number;
  staffName: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface MarketplaceListing {
  id: number;
  title: string;
  category: 'crops_harvest' | 'dairy_cattle' | 'poultry_birds' | 'fish_seed' | 'feed_silage' | 'machinery';
  price: number;
  currency: string;
  quantity: string;
  sellerName: string;
  sellerPhone: string;
  locationDistrict: string;
  imageUrl?: string;
  description: string;
  postedDate: string;
  isVerifiedFarmer?: boolean;
}

export interface HealthRecord {
  id: number;
  animalId?: string;
  animalTag?: string;
  species: 'Cow' | 'Buffalo' | 'Goat' | 'Broiler' | 'Layer' | 'Fish';
  symptoms: string;
  severity: 'low' | 'moderate' | 'critical';
  reportedDate: string;
  status: 'Under Observation' | 'Veterinarian Consulted' | 'Treatment Ongoing' | 'Resolved';
  aiPreliminaryDiagnosis?: string;
  aiSuggestedTreatment?: string;
}

// Crop Lifecycle & Inventory Interfaces
export type CropExpenseCategory = 'Seed' | 'Fertilizer' | 'Pesticide' | 'Tractor' | 'Labor' | 'Irrigation' | 'Other';

export interface Crop {
  id: number;
  userId: number;
  farmId: number;
  cropName: string;
  variety?: string;
  landAreaAcres: number;
  sowingDate: string;
  expectedHarvestDate: string;
  status: 'sowing' | 'vegetative' | 'flowering' | 'harvest_ready' | 'harvested';
  notes?: string;
}

export interface CropExpense {
  id: number;
  cropId: number;
  cropName?: string;
  category: CropExpenseCategory;
  amount: number;
  date: string;
  description?: string;
}

export interface CropInventory {
  id: number;
  userId: number;
  cropId: number;
  cropName: string;
  totalYieldKg: number;
  availableQuantity: number;
  storageLocation?: string;
  harvestDate?: string;
  isListedOnMarketplace?: boolean;
}

export interface WarehouseInventory {
  id: number;
  userId: number;
  cropId: number;
  cropName: string;
  totalYieldKg: number;
  storedQuantity: number;
  storageLocation: string;
  packagingUnit?: 'kg' | 'maunds' | 'metric_ton' | 'bags';
  lastUpdated?: string;
}

export interface B2BSale {
  id: number;
  userId: number;
  cropId: number;
  cropName: string;
  buyerName: string;
  buyerType?: 'sugar_mill' | 'commission_agent' | 'wholesaler' | 'exporter' | 'feed_mill' | 'other';
  vehicleNumber?: string;
  vehicleWeightSlip: string;
  grossWeightKg?: number;
  tareWeightKg?: number;
  totalWeight: number;
  weightUnit?: 'kg' | 'maunds' | 'metric_ton';
  ratePerUnit: number;
  grossAmount: number;
  commissionDeduction: number;
  taxDeduction?: number;
  netPayable: number;
  paymentStatus: 'paid' | 'pending' | 'partially_paid';
  saleDate: string;
}

// =============================================================================
// B2B Monetization Engine: Buyers, Marketplace Leads & Agri-Sponsorships
// =============================================================================

export type BuyerSubscriptionStatus = 'active' | 'expired' | 'pay_as_you_go' | 'enterprise_tier';

export interface Buyer {
  id: number;
  mobile: string;
  name: string;
  company: string;
  buyerSubscriptionStatus: BuyerSubscriptionStatus;
  walletBalance: number; // in PKR / Rs.
  totalLeadsUnlocked?: number;
  createdAt?: string;
}

export type LeadStatus = 'locked' | 'unlocked';

export interface MarketplaceLead {
  id: number;
  listingId: number;
  buyerId: number;
  farmerId: number;
  status: LeadStatus;
  unlockFee: number; // e.g. 100 PKR
  createdAt: string;
  unlockedAt?: string;
  farmerPhoneRevealed?: string;
}

export type PlacementArea = 'dashboard_top' | 'marketplace_sidebar' | 'crops_footer' | 'ledger_top';

export interface SponsorshipBanner {
  id: number;
  sponsorName: string;
  imageUrl: string;
  placementArea: PlacementArea;
  link: string;
  status: 'active' | 'inactive';
  tagline?: string;
  badgeText?: string;
  ctaText?: string;
  impressionsCount?: number;
  clicksCount?: number;
  createdAt?: string;
}


