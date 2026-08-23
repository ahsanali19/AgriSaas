// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SubscriptionPlan } from '../types';

export type AppRole = 'farmer' | 'admin' | 'buyer';

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
  updateUserProfile: (data: Partial<User>) => void;
  loginAsFarmerProfile: (profileUser: User) => void;
  upgradePlan: (planCode: 'PRO_MONTHLY' | 'PRO_YEARLY') => void;
  switchRole: (role: UserRole | AppRole) => void;
  loginAsAdmin: () => void;
  loginAsFarmer: () => void;
  loginAsBuyer: () => void;
}

// 100% Free Lifetime SaaS Plan for All Farmers
const DEFAULT_FREE_PLAN: SubscriptionPlan = {
  code: 'FREE',
  name: '100% Free Lifetime Farmer SaaS',
  price: 0,
  currency: 'PKR',
  billingCycle: 'lifetime',
  maxDairyAnimals: -1, // Unlimited
  maxPoultryFlocks: -1, // Unlimited
  maxFishPonds: -1, // Unlimited
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
  fullName: 'AgriSaaS Monetization Director',
  countryCode: 'PK',
  role: 'admin',
  isSuperAdmin: true
};

const DEMO_BUYER_USER: User = {
  id: 201,
  phoneNumber: '+92 321 9988776',
  fullName: 'Haji Aslam Grain Wholesalers',
  countryCode: 'PK',
  role: 'farmer', // Uses buyer marketplace view
  isSuperAdmin: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe initial state retrieval: ONLY load if actually found in localStorage.
  // CRITICAL FIX: If null (e.g. after logout or first visit), strictly return null.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('agri_user') || localStorage.getItem('agrisaas_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
    return null; // Do NOT auto-login as DEMO_FARMER_USER!
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agri_token') || localStorage.getItem('agrisaas_token') || null;
  });

  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(DEFAULT_FREE_PLAN);

  // Role resolution
  const resolvedRole: AppRole | null = user
    ? (user.role === 'admin' || user.role === 'super_admin' || user.isSuperAdmin ? 'admin' : 'farmer')
    : null;

  const isAdmin = resolvedRole === 'admin';
  const isFarmer = resolvedRole === 'farmer';
  const isSuperAdmin = isAdmin;

  const login = async (phoneNumber: string, pass: string): Promise<boolean> => {
    // Check if logging in with admin credentials
    if (
      phoneNumber.includes('0000000') ||
      phoneNumber.toLowerCase().includes('admin') ||
      pass.toLowerCase().includes('admin')
    ) {
      setUser(SUPER_ADMIN_USER);
      setToken('admin-jwt-token-xyz');
      localStorage.setItem('agri_user', JSON.stringify(SUPER_ADMIN_USER));
      localStorage.setItem('agrisaas_user', JSON.stringify(SUPER_ADMIN_USER));
      localStorage.setItem('agri_token', 'admin-jwt-token-xyz');
      localStorage.setItem('agrisaas_token', 'admin-jwt-token-xyz');
      return true;
    }

    const cleanPhone = phoneNumber.trim();
    const mockUser: User = {
      id: Date.now(),
      phoneNumber: cleanPhone || '+92 300 8472910',
      fullName: cleanPhone.includes('300') ? 'Chaudhry Tariq Mehmood' : 'Verified Farm Owner',
      countryCode: cleanPhone.startsWith('+91') ? 'IN' : 'PK',
      role: 'farmer',
      isSuperAdmin: false
    };

    const sessionToken = 'jwt-session-' + Date.now();
    setUser(mockUser);
    setToken(sessionToken);
    localStorage.setItem('agri_user', JSON.stringify(mockUser));
    localStorage.setItem('agrisaas_user', JSON.stringify(mockUser));
    localStorage.setItem('agri_token', sessionToken);
    localStorage.setItem('agrisaas_token', sessionToken);

    // Clean up any logout URL param
    if (typeof window !== 'undefined' && window.location.search.includes('logout=')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return true;
  };

  const register = async (data: {
    phoneNumber: string;
    fullName: string;
    countryCode: 'PK' | 'IN';
    farmName: string;
  }): Promise<boolean> => {
    const newUser: User = {
      id: Date.now(),
      phoneNumber: data.phoneNumber,
      fullName: data.fullName,
      countryCode: data.countryCode,
      role: 'farmer',
      isSuperAdmin: false
    };

    const sessionToken = 'jwt-session-' + Date.now();
    setUser(newUser);
    setToken(sessionToken);
    localStorage.setItem('agri_user', JSON.stringify(newUser));
    localStorage.setItem('agrisaas_user', JSON.stringify(newUser));
    localStorage.setItem('agri_token', sessionToken);
    localStorage.setItem('agrisaas_token', sessionToken);
    return true;
  };

  // Comprehensive Logout that completely purges tokens, sessions, and headers
  const logout = () => {
    setUser(null);
    setToken(null);

    // Clear all possible stored session keys
    localStorage.removeItem('agri_user');
    localStorage.removeItem('agri_token');
    localStorage.removeItem('agrisaas_user');
    localStorage.removeItem('agrisaas_token');
    localStorage.removeItem('agri_plan');

    // Clear sessionStorage
    try {
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }

    // Clear any Axios default Authorization header if attached globally
    try {
      if (typeof window !== 'undefined' && (window as any).axios) {
        delete (window as any).axios.defaults.headers.common['Authorization'];
      }
    } catch (e) {
      // ignore
    }

    // Append ?logout=success to display a subtle friendly post-logout notice on login screen
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('logout', 'success');
        window.history.pushState({}, '', url.toString());
      }
    } catch (e) {
      // fallback
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('agri_user', JSON.stringify(updated));
      localStorage.setItem('agrisaas_user', JSON.stringify(updated));
      return updated;
    });
  };

  const loginAsFarmerProfile = (profileUser: User) => {
    const sessionToken = 'farmer-jwt-' + profileUser.id;
    setUser(profileUser);
    setToken(sessionToken);
    localStorage.setItem('agri_user', JSON.stringify(profileUser));
    localStorage.setItem('agrisaas_user', JSON.stringify(profileUser));
    localStorage.setItem('agri_token', sessionToken);
    localStorage.setItem('agrisaas_token', sessionToken);
  };

  const upgradePlan = (planCode: 'PRO_MONTHLY' | 'PRO_YEARLY') => {
    // SaaS is now 100% free lifetime
    setCurrentPlan(DEFAULT_FREE_PLAN);
  };

  const switchRole = (newRole: UserRole | AppRole) => {
    if (newRole === 'super_admin' || newRole === 'admin') {
      loginAsAdmin();
    } else {
      loginAsFarmer();
    }
  };

  const loginAsAdmin = () => {
    setUser(SUPER_ADMIN_USER);
    setToken('admin-jwt-token-xyz');
    localStorage.setItem('agri_user', JSON.stringify(SUPER_ADMIN_USER));
    localStorage.setItem('agrisaas_user', JSON.stringify(SUPER_ADMIN_USER));
    localStorage.setItem('agri_token', 'admin-jwt-token-xyz');
    localStorage.setItem('agrisaas_token', 'admin-jwt-token-xyz');
  };

  const loginAsFarmer = () => {
    setUser(DEMO_FARMER_USER);
    setToken('farmer-jwt-session');
    localStorage.setItem('agri_user', JSON.stringify(DEMO_FARMER_USER));
    localStorage.setItem('agrisaas_user', JSON.stringify(DEMO_FARMER_USER));
    localStorage.setItem('agri_token', 'farmer-jwt-session');
    localStorage.setItem('agrisaas_token', 'farmer-jwt-session');
  };

  const loginAsBuyer = () => {
    setUser(DEMO_BUYER_USER);
    setToken('buyer-jwt-session');
    localStorage.setItem('agri_user', JSON.stringify(DEMO_BUYER_USER));
    localStorage.setItem('agrisaas_user', JSON.stringify(DEMO_BUYER_USER));
    localStorage.setItem('agri_token', 'buyer-jwt-session');
    localStorage.setItem('agrisaas_token', 'buyer-jwt-session');
  };

  return (
    <AuthContext.Provider
      value={{
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
        updateUserProfile,
        loginAsFarmerProfile,
        upgradePlan,
        switchRole,
        loginAsAdmin,
        loginAsFarmer,
        loginAsBuyer
      }}
    >
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
