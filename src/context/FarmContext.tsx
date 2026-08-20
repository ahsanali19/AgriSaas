// src/context/FarmContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Farm, FarmType, DairyAnimal, MilkLog, PoultryBatch, PoultryDailyLog, FishPond, FishSamplingLog, KhataTransaction, KhataParty } from '../types';
import { useAuth } from './AuthContext';

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
    totalAreaAcres: 25
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

const INITIAL_KHATA: KhataTransaction[] = [
  { id: 1, farmId: 1, enterpriseType: 'dairy', categoryName: 'Morning Milk Delivery (Nestlé/Gawala)', transactionType: 'income', amount: 48500, paymentMode: 'bank_transfer', transactionDate: '2026-08-18', partyName: 'Sahiwal Milk Center', description: 'Bulk raw milk 310 Litres' },
  { id: 2, farmId: 1, enterpriseType: 'dairy', categoryName: 'Silage & Wanda Concentrate Feed', transactionType: 'expense', amount: 22000, paymentMode: 'cash', transactionDate: '2026-08-17', partyName: 'Supreme Agri Feeds', description: '15 Bags of 18% CP Cattle Feed' },
  { id: 3, farmId: 1, enterpriseType: 'poultry', categoryName: 'Broiler Starter Feed #1', transactionType: 'expense', amount: 38000, paymentMode: 'bank_transfer', transactionDate: '2026-08-16', partyName: 'National Poultry Feeds' },
  { id: 4, farmId: 1, enterpriseType: 'fish', categoryName: 'Commercial Floating Fish Pellets', transactionType: 'expense', amount: 18500, paymentMode: 'jazzcash', transactionDate: '2026-08-15', partyName: 'Agro Aqua Store' },
  { id: 5, farmId: 1, enterpriseType: 'general', categoryName: 'Solar Tube-well Electricity Bill', transactionType: 'expense', amount: 9500, paymentMode: 'easypaisa', transactionDate: '2026-08-14' },
];

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPlan } = useAuth();
  const [farms, setFarms] = useState<Farm[]>(DEFAULT_FARMS);
  const [farm, setFarm] = useState<Farm>(DEFAULT_FARMS[0]);
  const [dairyAnimals, setDairyAnimals] = useState<DairyAnimal[]>(INITIAL_ANIMALS);
  const [milkLogs, setMilkLogs] = useState<MilkLog[]>(INITIAL_MILK_LOGS);
  const [poultryBatches, setPoultryBatches] = useState<PoultryBatch[]>(INITIAL_POULTRY_BATCHES);
  const [poultryLogs, setPoultryLogs] = useState<PoultryDailyLog[]>(INITIAL_POULTRY_LOGS);
  const [fishPonds, setFishPonds] = useState<FishPond[]>(INITIAL_FISH_PONDS);
  const [fishLogs, setFishLogs] = useState<FishSamplingLog[]>(INITIAL_FISH_LOGS);
  const [khataTransactions, setKhataTransactions] = useState<KhataTransaction[]>(INITIAL_KHATA);
  const [parties] = useState<KhataParty[]>([
    { id: 1, farmId: 1, partyName: 'Sahiwal Milk Center', partyType: 'buyer_customer', currentBalance: 42000 },
    { id: 2, farmId: 1, partyName: 'Supreme Agri Feeds', partyType: 'supplier_vendor', currentBalance: -15000 },
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
    
    // Deduct dead & culled birds
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
  // Khata Transactions
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
