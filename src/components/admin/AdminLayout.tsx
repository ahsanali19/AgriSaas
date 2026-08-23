// src/components/admin/AdminLayout.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Users,
  LayoutDashboard,
  CreditCard,
  History,
  LogOut,
  ArrowLeftRight,
  Sparkles,
  Server,
  Database,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'users' | 'subscriptions' | 'audit';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onSwitchToFarmerPortal: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onSwitchToFarmerPortal,
  children
}) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Executive Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'users',
      label: 'Registered Farmers & Hubs',
      icon: <Users className="w-4 h-4" />,
      badge: 'Live'
    },
    {
      id: 'subscriptions',
      label: 'SaaS Plans & Revenue',
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      id: 'audit',
      label: 'Security & Audit Logs',
      icon: <History className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Admin Enterprise Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand & Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-950">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm sm:text-[15px] tracking-tight text-white">Green</span>
              <span className="font-medium text-xs sm:text-[13px] tracking-tight text-indigo-300">Digital System</span>
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/60 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Platform Governance & Multitenant Console</p>
          </div>
        </div>

        {/* System Health & Farmer Portal Switcher */}
        <div className="flex items-center space-x-3">
          
          {/* Live Node / DB indicator */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>MySQL 8.0: Connected</span>
            <span className="text-slate-600">|</span>
            <span>API Latency: 24ms</span>
          </div>

          {/* Switch to Farmer View Button */}
          <button
            onClick={onSwitchToFarmerPortal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Farmer App Portal</span>
          </button>

          {/* Super Admin User Chip */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
              SA
            </div>
            <span className="font-medium text-slate-200">{user?.fullName || 'Super Admin'}</span>
          </div>

          <button
            onClick={logout}
            className="text-slate-400 hover:text-rose-400 p-2 rounded-xl border border-slate-800 hover:bg-slate-800 transition"
            title="Sign Out Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Admin Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Admin Sidebar */}
        <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 hidden md:flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System Management
            </div>

            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick System Diagnostics Widget */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-indigo-400 font-bold text-[11px]">
              <Database className="w-3.5 h-3.5" />
              <span>Multi-Tenant Cluster</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Active Tenants:</span>
                <span className="text-slate-200 font-bold">1,248</span>
              </div>
              <div className="flex justify-between">
                <span>Tier Guard:</span>
                <span className="text-emerald-400 font-bold">Enforced</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </main>

      </div>

    </div>
  );
};
