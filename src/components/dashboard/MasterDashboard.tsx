// src/components/dashboard/MasterDashboard.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatCards } from './StatCards';
import { SponsorBanner } from '../common/SponsorBanner';
import { Milk, Bird, Fish, BookOpenCheck, Sparkles, Plus, AlertCircle, TrendingUp, Calendar, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface MasterDashboardProps {
  onNavigate: (tab: NavTab) => void;
  onOpenUpgrade?: () => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({ onNavigate, onOpenUpgrade }) => {
  const { farm, quotas, milkLogs, poultryBatches, fishPonds, khataTransactions } = useFarm();
  const { currentPlan } = useAuth();
  const { t } = useLanguage();

  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  return (
    <div className="space-y-6">
      
      {/* 1. Direct B2B Agri-Sponsorship Banner (Dashboard Top Placement) */}
      <SponsorBanner placementArea="dashboard_top" />

      {/* 2. Welcome & Farm Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 mb-3 border border-emerald-600">
            <span>📍 {farm.locationDistrict || 'Punjab, South Asia'}</span>
            <span>•</span>
            <span>{farm.totalAreaAcres || 25} Acres</span>
            <span>•</span>
            <span className="text-emerald-200">100% Free Lifetime SaaS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{farm.name}</h1>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 text-9xl select-none pointer-events-none transform translate-x-8 translate-y-8">
          🌾
        </div>
      </div>

      {/* 3. Summary KPI Cards */}
      <StatCards />

      {/* 4. 100% Free Lifetime Farmer SaaS Status Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AgriSaaS Farmer Plan</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Free Forever for Farmers</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero subscription fees. All Dairy, Poultry, Fish, Crops, and Ledger tools are fully unlocked with unlimited enterprise capacity.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => onNavigate('marketplace')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Explore B2B Marketplace Mandi</span>
            </button>
          </div>
        </div>

        {/* Enterprise Capacity Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Dairy Capacity */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span>🐄</span>
                <span>Dairy Animals</span>
              </span>
              <span className="font-mono text-emerald-800 font-bold">
                {quotas.dairy.current} (Unlimited ∞)
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 h-2 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-600 transition-all rounded-full" style={{ width: '45%' }} />
            </div>
          </div>

          {/* Poultry Capacity */}
          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span>🐔</span>
                <span>Poultry Flocks</span>
              </span>
              <span className="font-mono text-teal-800 font-bold">
                {quotas.poultry.current} (Unlimited ∞)
              </span>
            </div>
            <div className="w-full bg-teal-200/60 h-2 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-teal-600 transition-all rounded-full" style={{ width: '35%' }} />
            </div>
          </div>

          {/* Fish Capacity */}
          <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span>🐟</span>
                <span>Fish Ponds</span>
              </span>
              <span className="font-mono text-cyan-800 font-bold">
                {quotas.fish.current} (Unlimited ∞)
              </span>
            </div>
            <div className="w-full bg-cyan-200/60 h-2 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-cyan-600 transition-all rounded-full" style={{ width: '40%' }} />
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Enterprise Quick Access & Recent Financial Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enterprise Operations & Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Utility Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div
              onClick={() => onNavigate('health')}
              className="cursor-pointer bg-slate-50 hover:bg-emerald-50/60 p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 transition flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-lg shrink-0">
                🩺
              </div>
              <div className="truncate">
                <h5 className="font-bold text-xs text-slate-800">Vet & AI Health</h5>
                <p className="text-[10px] text-slate-500 truncate">Symptom triage & vet logs</p>
              </div>
            </div>

            <div
              onClick={() => onNavigate('staff')}
              className="cursor-pointer bg-slate-50 hover:bg-emerald-50/60 p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 transition flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-lg shrink-0">
                👥
              </div>
              <div className="truncate">
                <h5 className="font-bold text-xs text-slate-800">Staff & Labor</h5>
                <p className="text-[10px] text-slate-500 truncate">Wages & advance (peshgi)</p>
              </div>
            </div>

            <div
              onClick={() => onNavigate('marketplace')}
              className="cursor-pointer bg-slate-50 hover:bg-emerald-50/60 p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 transition flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg shrink-0">
                🚜
              </div>
              <div className="truncate">
                <h5 className="font-bold text-xs text-slate-800">B2B Mandi</h5>
                <p className="text-[10px] text-slate-500 truncate">Buy/sell cattle, chicks & feed</p>
              </div>
            </div>

          </div>

          {/* Today's Milk Collection Feed */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <span>🥛</span>
                <span>Recent Milk Yield Logs</span>
              </h4>
              <button
                onClick={() => onNavigate('dairy')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                View All Records
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {milkLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                      {log.shift === 'morning' ? 'AM' : 'PM'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Tag: {log.animalTag || 'Bulk Farm'}</div>
                      <div className="text-[10px] text-slate-400">{log.logDate} • {log.shift} shift</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-slate-900">{log.yieldLiters} L</div>
                    {log.fatPercentage && <div className="text-[10px] text-emerald-600">{log.fatPercentage}% Fat</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Khata Cashbook Feed */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <span>📖</span>
                <span>Recent Khata Entries</span>
              </h4>
              <button
                onClick={() => onNavigate('khata')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Cashbook →
              </button>
            </div>

            <div className="space-y-2.5">
              {khataTransactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-800 truncate max-w-[160px]">{tx.categoryName}</div>
                    <div className="text-[10px] text-slate-500 capitalize flex items-center space-x-1 mt-0.5">
                      <span className="font-semibold text-emerald-700">{tx.enterpriseType}</span>
                      <span>•</span>
                      <span>{tx.paymentMode}</span>
                    </div>
                  </div>
                  <div className={`font-bold font-mono text-right ${
                    tx.transactionType === 'income' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {tx.transactionType === 'income' ? '+' : '-'}{symbol} {tx.amount.toLocaleString()}
                    <div className="text-[9px] text-slate-400 font-normal">{tx.transactionDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('khata')}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center space-x-1"
          >
            <BookOpenCheck className="w-4 h-4 text-emerald-600" />
            <span>Open Complete Ledger & P&L</span>
          </button>
        </div>

      </div>

    </div>
  );
};
