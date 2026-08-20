// src/components/admin/AdminDashboard.tsx
import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  Layers,
  ShieldCheck,
  Globe2,
  Sparkles,
  ArrowUpRight,
  Calculator,
  Coins
} from 'lucide-react';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  onNavigate: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { stats, auditLogs, farmers } = useAdmin();

  const conversionRate = ((stats.activeProSubscriptions / stats.totalFarmers) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Currency Rule Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold text-white">SaaS Platform Governance & Revenue</h2>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/80 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              STRICT PKR BASE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global multi-currency tenant payments (USD, EUR, INR, AED) are automatically normalized and aggregated strictly in <strong>PKR (Pakistani Rupee)</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('users')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-indigo-950"
          >
            <Users className="w-4 h-4" />
            <span>Manage All Tenants</span>
          </button>
        </div>
      </div>

      {/* Primary Revenue & SaaS Metrics (Strictly formatted in PKR / Rs.) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Platform Lifetime Revenue (PKR) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-5 relative overflow-hidden shadow-lg shadow-emerald-950/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Platform Revenue</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono font-black text-3xl text-emerald-400 mt-3 flex items-baseline space-x-1">
            <span className="text-lg font-bold text-emerald-500">Rs.</span>
            <span>{stats.totalPlatformRevenuePkr.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
            <span className="text-emerald-400 font-semibold">PKR Normalized</span>
            <span>• Across all global tenants</span>
          </div>
        </div>

        {/* Monthly Recurring Revenue (MRR in PKR) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Monthly Recurring (MRR)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-mono font-black text-3xl text-cyan-400 mt-3 flex items-baseline space-x-1">
            <span className="text-lg font-bold text-cyan-500">Rs.</span>
            <span>{stats.monthlyRecurringRevenuePkr.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{stats.monthlyGrowthRate}% growth this month</span>
          </div>
        </div>

        {/* Active Pro Subscriptions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Active Pro Tenants</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono font-black text-3xl text-amber-400 mt-3">
            {stats.activeProSubscriptions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            <span className="font-bold text-slate-200">{conversionRate}%</span> conversion rate from Free tier
          </div>
        </div>

        {/* Total Registered Farmers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Registered Farmers</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="font-mono font-black text-3xl text-white mt-3">
            {stats.totalFarmers.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Free Kisan Tier: <strong className="text-slate-200">{stats.freeTierUsers}</strong>
          </div>
        </div>

      </div>

      {/* Aggregate Multitenant Livestock & Aquaculture Assets */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Global Farm Asset Census</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl">
              🐄
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Tagged Dairy Livestock</div>
              <div className="font-mono font-bold text-xl text-white mt-0.5">
                {stats.totalLivestockCount.toLocaleString()} Head
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl">
              🐔
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Tracked Poultry Birds</div>
              <div className="font-mono font-bold text-xl text-white mt-0.5">
                {stats.totalPoultryBirds.toLocaleString()} Birds
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl">
              🐟
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Managed Aquaculture Ponds</div>
              <div className="font-mono font-bold text-xl text-white mt-0.5">
                {stats.totalFishPonds.toLocaleString()} Ponds
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Multi-Currency Conversion Transparency & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Multi-Currency Conversion Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <span>International Currency Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Aggregated into PKR</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-base">🇵🇰</span>
                <span className="font-semibold text-slate-200">Pakistan (PKR)</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">Rs. 1,499 / mo (100% base)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-base">🇮🇳</span>
                <span className="font-semibold text-slate-200">India (INR)</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">₹ 499 / mo ≈ Rs. 1,680 PKR</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-base">🇺🇸</span>
                <span className="font-semibold text-slate-200">United States / Global (USD)</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">$ 14.99 / mo ≈ Rs. 4,180 PKR</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-base">🇦🇪</span>
                <span className="font-semibold text-slate-200">Middle East (AED / SAR)</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">55 AED / mo ≈ Rs. 4,175 PKR</span>
            </div>
          </div>
        </div>

        {/* Admin Security & Action Audit Trail */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Recent Super Admin Overrides</span>
          </h3>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{log.action.replace(/_/g, ' ')}</div>
                  <div className="text-[11px] text-slate-400">{log.user} • {log.details}</div>
                </div>
                <div className="font-mono text-[10px] text-slate-400 text-right">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
