// src/context/AdminContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { AdminPlatformStats, AdminFarmerUser } from '../types';

interface AdminContextType {
  stats: AdminPlatformStats;
  farmers: AdminFarmerUser[];
  updateFarmerSubscription: (userId: number, planCode: 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY', reason?: string) => void;
  toggleFarmerStatus: (userId: number, status: 'active' | 'suspended', reason?: string) => void;
  auditLogs: { id: number; timestamp: string; action: string; user: string; details: string }[];
}

// Strict Platform Revenue Aggregation in Pakistani Rupee (PKR / Rs.)
const INITIAL_PLATFORM_STATS: AdminPlatformStats = {
  totalFarmers: 1248,
  totalFarms: 1390,
  activeProSubscriptions: 412,
  freeTierUsers: 836,
  totalPlatformRevenuePkr: 1845600, // Rs. 1,845,600 Total Lifetime Revenue
  monthlyRecurringRevenuePkr: 617588, // Rs. 617,588 MRR
  annualRecurringRevenuePkr: 1228012, // Rs. 1,228,012 ARR
  totalLivestockCount: 8940,
  totalPoultryBirds: 485000,
  totalFishPonds: 312,
  monthlyGrowthRate: 18.4
};

const INITIAL_FARMERS: AdminFarmerUser[] = [
  {
    id: 101,
    phoneNumber: '+92 300 8472910',
    fullName: 'Chaudhry Tariq Mehmood',
    countryCode: 'PK',
    preferredCurrency: 'PKR',
    role: 'owner',
    farmName: 'Al-Madina Agro Complex',
    farmType: 'mixed',
    locationDistrict: 'Sahiwal, Punjab',
    planCode: 'PRO_MONTHLY',
    planStatus: 'active',
    createdAt: '2026-06-12',
    animalsCount: 24,
    flocksCount: 3,
    pondsCount: 2,
    lastActive: '10 mins ago',
    lastPaymentAmount: 1499,
    lastPaymentCurrency: 'PKR',
    convertedAmountPkr: 1499
  },
  {
    id: 102,
    phoneNumber: '+91 98765 43210',
    fullName: 'Gurpreet Singh Dhillon',
    countryCode: 'IN',
    preferredCurrency: 'INR',
    role: 'owner',
    farmName: 'Dhillon Broiler Feeds & Hatchery',
    farmType: 'poultry',
    locationDistrict: 'Ludhiana, Punjab',
    planCode: 'PRO_YEARLY',
    planStatus: 'active',
    createdAt: '2026-05-18',
    animalsCount: 0,
    flocksCount: 8,
    pondsCount: 0,
    lastActive: '1 hour ago',
    lastPaymentAmount: 4999,
    lastPaymentCurrency: 'INR',
    convertedAmountPkr: 16800 // Converted INR to PKR
  },
  {
    id: 103,
    phoneNumber: '+1 415 555 2671',
    fullName: 'John Miller',
    countryCode: 'US',
    preferredCurrency: 'USD',
    role: 'owner',
    farmName: 'Oak Valley Cattle & Dairy',
    farmType: 'dairy',
    locationDistrict: 'California, US',
    planCode: 'PRO_MONTHLY',
    planStatus: 'active',
    createdAt: '2026-07-02',
    animalsCount: 42,
    flocksCount: 0,
    pondsCount: 0,
    lastActive: 'Just now',
    lastPaymentAmount: 14.99,
    lastPaymentCurrency: 'USD',
    convertedAmountPkr: 4180 // Converted USD to PKR
  },
  {
    id: 104,
    phoneNumber: '+971 50 123 4567',
    fullName: 'Hamdan Al-Maktoum',
    countryCode: 'AE',
    preferredCurrency: 'AED',
    role: 'owner',
    farmName: 'Desert Oasis Aqua Lake',
    farmType: 'fish',
    locationDistrict: 'Al Ain, UAE',
    planCode: 'PRO_YEARLY',
    planStatus: 'active',
    createdAt: '2026-04-20',
    animalsCount: 0,
    flocksCount: 0,
    pondsCount: 6,
    lastActive: '3 hours ago',
    lastPaymentAmount: 550,
    lastPaymentCurrency: 'AED',
    convertedAmountPkr: 41750 // Converted AED to PKR
  },
  {
    id: 105,
    phoneNumber: '+92 312 9844123',
    fullName: 'Malik Zafar Iqbal',
    countryCode: 'PK',
    preferredCurrency: 'PKR',
    role: 'owner',
    farmName: 'Chenab Dairy Farm',
    farmType: 'dairy',
    locationDistrict: 'Jhang, Punjab',
    planCode: 'FREE',
    planStatus: 'active',
    createdAt: '2026-07-01',
    animalsCount: 9,
    flocksCount: 0,
    pondsCount: 0,
    lastActive: '2 hours ago',
    lastPaymentAmount: 0,
    lastPaymentCurrency: 'PKR',
    convertedAmountPkr: 0
  },
  {
    id: 106,
    phoneNumber: '+92 345 1122334',
    fullName: 'Sardar Muhammad Khan',
    countryCode: 'PK',
    preferredCurrency: 'PKR',
    role: 'owner',
    farmName: 'Potohar Poultry Sheds',
    farmType: 'poultry',
    locationDistrict: 'Rawalpindi, Punjab',
    planCode: 'FREE',
    planStatus: 'suspended',
    createdAt: '2026-03-15',
    animalsCount: 0,
    flocksCount: 2,
    pondsCount: 0,
    lastActive: '5 days ago',
    lastPaymentAmount: 0,
    lastPaymentCurrency: 'PKR',
    convertedAmountPkr: 0
  }
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<AdminPlatformStats>(INITIAL_PLATFORM_STATS);
  const [farmers, setFarmers] = useState<AdminFarmerUser[]>(INITIAL_FARMERS);
  const [auditLogs, setAuditLogs] = useState<{ id: number; timestamp: string; action: string; user: string; details: string }[]>([
    { id: 1, timestamp: '2026-08-18 20:30', action: 'MANUAL_UPGRADE', user: 'Chaudhry Tariq Mehmood', details: 'Upgraded to PRO_MONTHLY (+PKR 1,499)' },
    { id: 2, timestamp: '2026-08-17 14:15', action: 'GLOBAL_PAYMENT', user: 'John Miller', details: 'Stripe $14.99 converted to PKR 4,180' },
    { id: 3, timestamp: '2026-08-16 11:00', action: 'ACCOUNT_SUSPENDED', user: 'Sardar Muhammad Khan', details: 'Suspended by Super Admin' }
  ]);

  const updateFarmerSubscription = (userId: number, planCode: 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY', reason: string = 'Manual Super Admin Action') => {
    const additionalPkr = planCode === 'PRO_MONTHLY' ? 1499 : planCode === 'PRO_YEARLY' ? 14999 : 0;

    setFarmers(prev => prev.map(f => {
      if (f.id === userId) {
        return {
          ...f,
          planCode,
          planStatus: 'active' as const,
          convertedAmountPkr: additionalPkr
        };
      }
      return f;
    }));

    setStats(s => ({
      ...s,
      activeProSubscriptions: planCode !== 'FREE' ? s.activeProSubscriptions + 1 : Math.max(0, s.activeProSubscriptions - 1),
      freeTierUsers: planCode === 'FREE' ? s.freeTierUsers + 1 : Math.max(0, s.freeTierUsers - 1),
      totalPlatformRevenuePkr: s.totalPlatformRevenuePkr + additionalPkr,
      monthlyRecurringRevenuePkr: s.monthlyRecurringRevenuePkr + (planCode === 'PRO_MONTHLY' ? 1499 : 0)
    }));

    const targetFarmer = farmers.find(f => f.id === userId);
    setAuditLogs(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        action: `PLAN_OVERRIDE_${planCode}`,
        user: targetFarmer?.fullName || `User #${userId}`,
        details: `${reason} • Normalized PKR Revenue: Rs. ${additionalPkr.toLocaleString()}`
      },
      ...prev
    ]);
  };

  const toggleFarmerStatus = (userId: number, newStatus: 'active' | 'suspended', reason: string = 'Super Admin policy') => {
    setFarmers(prev => prev.map(f => {
      if (f.id === userId) {
        return { ...f, planStatus: newStatus };
      }
      return f;
    }));

    const targetFarmer = farmers.find(f => f.id === userId);
    setAuditLogs(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        action: `USER_${newStatus.toUpperCase()}`,
        user: targetFarmer?.fullName || `User #${userId}`,
        details: reason
      },
      ...prev
    ]);
  };

  return (
    <AdminContext.Provider value={{
      stats,
      farmers,
      updateFarmerSubscription,
      toggleFarmerStatus,
      auditLogs
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
