// src/components/dashboard/MasterDashboard.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatCards } from './StatCards';
import { Milk, Bird, Fish, BookOpenCheck, Sparkles, Plus, AlertCircle, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface MasterDashboardProps {
  onNavigate: (tab: NavTab) => void;
  onOpenUpgrade: () => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({ onNavigate, onOpenUpgrade }) => {
  const { farm, quotas, milkLogs, poultryBatches, fishPonds, khataTransactions } = useFarm();
  const { currentPlan } = useAuth();
  const { t } = useLanguage();

  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  return (
    <div className="space-y-6">
      
      {/* Welcome & Farm Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 mb-3 border border-emerald-600">
            <span>📍 {farm.locationDistrict || 'Punjab, South Asia'}</span>
            <span>•</span>
            <span>{farm.totalAreaAcres || 25} Acres</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{farm.name}</h1>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 text-9xl select-none pointer-events-none transform translate-x-8 translate-y-8">
          🌾
        </div>
      </div>

      {/* Summary KPI Cards */}
      <StatCards />

      {/* Subscription Quota Progress Bar (SaaS Limit Meter) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">SaaS Plan Quota Usage</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentPlan.code === 'FREE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {currentPlan.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentPlan.code === 'FREE'
                ? 'Free Tier restricts herd size and batches. Upgrade to Pro for unlimited multi-enterprise capacity.'
                : 'Unlimited Pro Access is active on this account.'}
            </p>
          </div>

          {currentPlan.code === 'FREE' && (
            <button
              onClick={onOpenUpgrade}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Unlock Unlimited (Rs 1,499/mo)</span>
            </button>
          )}
        </div>

        {/* Quota Bars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Dairy Quota */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span>🐄</span>
                <span>Dairy Animals</span>
              </span>
              <span className="font-mono">
                {quotas.dairy.current} / {quotas.dairy.max === -1 ? '∞' : quotas.dairy.max}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  quotas.dairy.max !== -1 && quotas.dairy.current >= quotas.dairy.max
                    ? 'bg-red-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: quotas.dairy.max === -1 ? '30%' : `${Math.min(100, (quotas.dairy.current / quotas.dairy.max) * 100)}%` }}
              />
            </div>
          </div>

          {/* Poultry Quota */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span>🐔</span>
                <span>Poultry Flocks</span>
              </span>
              <span className="font-mono">
                {quotas.poultry.current} / {quotas.poultry.max === -1 ? '∞' : quotas.poultry.max}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  quotas.poultry.max !== -1 && quotas.poultry.current >= quotas.poultry.max
                    ? 'bg-red-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: quotas.poultry.max === -1 ? '30%' : `${Math.min(100, (quotas.poultry.current / quotas.poultry.max) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fish Quota */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span>🐟</span>
                <span>Fish Ponds</span>
              </span>
              <span className="font-mono">
                {quotas.fish.current} / {quotas.fish.max === -1 ? '∞' : quotas.fish.max}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  quotas.fish.max !== -1 && quotas.fish.current >= quotas.fish.max
                    ? 'bg-red-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: quotas.fish.max === -1 ? '30%' : `${Math.min(100, (quotas.fish.current / quotas.fish.max) * 100)}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Enterprise Quick Access & Recent Financial Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enterprise Modules Quick Access */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Enterprise Module Shortcuts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Dairy Card */}
            <div
              onClick={() => onNavigate('dairy')}
              className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition transform">
                🐄
              </div>
              <h4 className="font-bold text-base text-slate-800">Dairy & Livestock</h4>
              <p className="text-xs text-slate-500 mt-1">
                Individual Ear-Tag records, shift yields, and breeding/calving alerts.
              </p>
              <div className="mt-4 flex items-center text-xs font-bold text-emerald-700">
                <span>Manage Herd</span>
                <span className="ml-1 group-hover:translate-x-1 transition transform">→</span>
              </div>
            </div>

            {/* Poultry Card */}
            <div
              onClick={() => onNavigate('poultry')}
              className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition transform">
                🐔
              </div>
              <h4 className="font-bold text-base text-slate-800">Poultry Farms</h4>
              <p className="text-xs text-slate-500 mt-1">
                Broiler & Layer flocks, daily feed weight math, and mortality logs.
              </p>
              <div className="mt-4 flex items-center text-xs font-bold text-emerald-700">
                <span>Manage Flocks</span>
                <span className="ml-1 group-hover:translate-x-1 transition transform">→</span>
              </div>
            </div>

            {/* Fish Card */}
            <div
              onClick={() => onNavigate('fish')}
              className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition transform">
                🐟
              </div>
              <h4 className="font-bold text-base text-slate-800">Aquaculture Ponds</h4>
              <p className="text-xs text-slate-500 mt-1">
                Seed stocking densities, water pH/DO sampling, and feed management.
              </p>
              <div className="mt-4 flex items-center text-xs font-bold text-emerald-700">
                <span>Manage Ponds</span>
                <span className="ml-1 group-hover:translate-x-1 transition transform">→</span>
              </div>
            </div>

          </div>

          {/* Secondary Farm Management Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            
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
