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
    <div className="space-y-4">
      
      {/* 1. Direct B2B Agri-Sponsorship Banner (Compact) */}
      <SponsorBanner placementArea="dashboard_top" />

      {/* 2. Welcome & Farm Header (Compact Modern Bar) */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg shrink-0">
            🌾
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">{farm.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                Lifetime Free
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <span>📍 {farm.locationDistrict || 'Punjab'}</span>
              <span>•</span>
              <span>{farm.totalAreaAcres || 25} Acres</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => onNavigate('marketplace')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-sm transition flex items-center space-x-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>B2B Mandi</span>
          </button>
        </div>
      </div>

      {/* 3. Summary KPI Cards */}
      <StatCards />

      {/* 4. Enterprise Quick Status Strip (Compact) */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
          <span className="flex items-center space-x-1.5 font-medium text-slate-700">
            <span>🐄</span>
            <span>Dairy Herd:</span>
          </span>
          <span className="font-mono font-bold text-emerald-700">
            {quotas.dairy.current} Animals (∞)
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
          <span className="flex items-center space-x-1.5 font-medium text-slate-700">
            <span>🐔</span>
            <span>Poultry Flocks:</span>
          </span>
          <span className="font-mono font-bold text-teal-700">
            {quotas.poultry.current} Flocks (∞)
          </span>
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
          <span className="flex items-center space-x-1.5 font-medium text-slate-700">
            <span>🐟</span>
            <span>Fish Ponds:</span>
          </span>
          <span className="font-mono font-bold text-cyan-700">
            {quotas.fish.current} Ponds (∞)
          </span>
        </div>
      </div>

      {/* Main Grid: Enterprise Quick Access & Recent Financial Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Enterprise Operations & Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Utility Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            
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
