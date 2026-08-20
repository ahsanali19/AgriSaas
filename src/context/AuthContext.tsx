// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SubscriptionPlan } from '../types';

export type AppRole = 'farmer' | 'admin';

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  token: string | null;
  currentPlan: SubscriptionPlan;
  isAuthenticated: boolean;
  isFarmer: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (phoneNumber: string, pass: string) => Promise<boolean>;
  register: (data: { phoneNumber: string; fullName: string; countryCode: 'PK' | 'IN'; farmName: string }) => Promise<boolean>;
  logout: () => void;
  upgradePlan: (planCode: 'PRO_MONTHLY' | 'PRO_YEARLY') => void;
  switchRole: (role: UserRole | AppRole) => void;
  loginAsAdmin: () => void;
  loginAsFarmer: () => void;
}

const DEFAULT_FREE_PLAN: SubscriptionPlan = {
  code: 'FREE',
  name: 'Free Kisan Tier',
  price: 0,
  currency: 'PKR',
  billingCycle: 'lifetime',
  maxDairyAnimals: 10,
  maxPoultryFlocks: 2,
  maxFishPonds: 2,
  hasAdvancedKhata: false,
  hasPdfExport: false,
};

const PRO_PLAN: SubscriptionPlan = {
  code: 'PRO_MONTHLY',
  name: 'AgriSaaS Pro',
  price: 1499,
  currency: 'PKR',
  billingCycle: 'monthly',
  maxDairyAnimals: -1,
  maxPoultryFlocks: -1,
  maxFishPonds: -1,
  hasAdvancedKhata: true,
  hasPdfExport: true,
};

const DEMO_FARMER_USER: User = {
  id: 101,
  phoneNumber: '+92 300 8472910',
  fullName: 'Chaudhry Tariq Mehmood',
  countryCode: 'PK',
  role: 'farmer',
  isSuperAdmin: false
};

const SUPER_ADMIN_USER: User = {
  id: 1,
  phoneNumber: '+92 300 0000000',
  fullName: 'AgriSaaS Super Administrator',
  countryCode: 'PK',
  role: 'admin',
  isSuperAdmin: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agri_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return DEMO_FARMER_USER;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('agri_token') || 'demo-jwt-token');
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(() => {
    const savedPlan = localStorage.getItem('agri_plan');
    return savedPlan === 'PRO' ? PRO_PLAN : DEFAULT_FREE_PLAN;
  });

  // Role resolution
  const resolvedRole: AppRole | null = user
    ? (user.role === 'admin' || user.role === 'super_admin' || user.isSuperAdmin ? 'admin' : 'farmer')
    : null;

  const isAdmin = resolvedRole === 'admin';
  const isFarmer = resolvedRole === 'farmer';
  const isSuperAdmin = isAdmin;

  const login = async (phoneNumber: string, pass: string): Promise<boolean> => {
    // Check if logging in with admin credentials
    if (phoneNumber.includes('0000000') || pass.toLowerCase().includes('admin')) {
      setUser(SUPER_ADMIN_USER);
      setToken('admin-jwt-token-xyz');
      localStorage.setItem('agri_user', JSON.stringify(SUPER_ADMIN_USER));
      localStorage.setItem('agri_token', 'admin-jwt-token-xyz');
      return true;
    }

    const mockUser: User = {
      id: Date.now(),
      phoneNumber,
      fullName: 'Farm Owner',
      countryCode: phoneNumber.startsWith('+91') ? 'IN' : 'PK',
      role: 'farmer',
      isSuperAdmin: false
    };
    setUser(mockUser);
    setToken('jwt-session-' + Date.now());
    localStorage.setItem('agri_user', JSON.stringify(mockUser));
    localStorage.setItem('agri_token', 'jwt-session-' + Date.now());

    // Clean up any logout URL param
    if (window.location.search.includes('logout=')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return true;
  };

  const register = async (data: { phoneNumber: string; fullName: string; countryCode: 'PK' | 'IN'; farmName: string }): Promise<boolean> => {
    const newUser: User = {
      id: Date.now(),
      phoneNumber: data.phoneNumber,
      fullName: data.fullName,
      countryCode: data.countryCode,
      role: 'farmer',
      isSuperAdmin: false
    };
    setUser(newUser);
    setToken('jwt-session-' + Date.now());
    localStorage.setItem('agri_user', JSON.stringify(newUser));
    localStorage.setItem('agri_token', 'jwt-session-' + Date.now());
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agri_user');
    localStorage.removeItem('agri_token');
    
    // Append ?logout=success to trigger the friendly post-logout notice
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('logout', 'success');
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      // fallback
    }
  };

  const upgradePlan = (planCode: 'PRO_MONTHLY' | 'PRO_YEARLY') => {
    setCurrentPlan(PRO_PLAN);
    localStorage.setItem('agri_plan', 'PRO');
  };

  const switchRole = (newRole: UserRole | AppRole) => {
    if (newRole === 'super_admin' || newRole === 'admin') {
      setUser(SUPER_ADMIN_USER);
      localStorage.setItem('agri_user', JSON.stringify(SUPER_ADMIN_USER));
    } else {
      setUser(DEMO_FARMER_USER);
      localStorage.setItem('agri_user', JSON.stringify(DEMO_FARMER_USER));
    }
  };

  const loginAsAdmin = () => switchRole('admin');
  const loginAsFarmer = () => switchRole('farmer');

  return (
    <AuthContext.Provider value={{
      user,
      role: resolvedRole,
      token,
      currentPlan,
      isAuthenticated: !!user,
      isFarmer,
      isAdmin,
      isSuperAdmin,
      login,
      register,
      logout,
      upgradePlan,
      switchRole,
      loginAsAdmin,
      loginAsFarmer
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
