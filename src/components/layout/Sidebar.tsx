// src/components/layout/Sidebar.tsx
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Milk, Bird, Fish, BookOpenCheck, CreditCard, Sparkles, ChevronRight, Users, ShoppingBag, Stethoscope, Tractor, Sprout } from 'lucide-react';

export type NavTab = 'dashboard' | 'farms' | 'crops' | 'dairy' | 'poultry' | 'fish' | 'khata' | 'staff' | 'marketplace' | 'health' | 'subscriptions';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenUpgrade: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenUpgrade }) => {
  const { t } = useLanguage();
  const { farm, quotas, metrics } = useFarm();
  const { currentPlan } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavTab, label: t('dashboard'), icon: LayoutDashboard, visible: true },
    { id: 'farms' as NavTab, label: 'Farm Estates', icon: Tractor, visible: true },
    { 
      id: 'crops' as NavTab, 
      label: 'Crops & B2B Sales', 
      icon: Sprout, 
      visible: true,
      quota: `${metrics.totalCropAcres} ac`
    },
    { 
      id: 'dairy' as NavTab, 
      label: t('dairy'), 
      icon: Milk, 
      visible: farm.farmType === 'mixed' || farm.farmType === 'dairy',
      quota: currentPlan.maxDairyAnimals !== -1 ? `${quotas.dairy.current}/${quotas.dairy.max}` : `${quotas.dairy.current}`
    },
    { 
      id: 'poultry' as NavTab, 
      label: t('poultry'), 
      icon: Bird, 
      visible: farm.farmType === 'mixed' || farm.farmType === 'poultry',
      quota: currentPlan.maxPoultryFlocks !== -1 ? `${quotas.poultry.current}/${quotas.poultry.max}` : `${quotas.poultry.current}`
    },
    { 
      id: 'fish' as NavTab, 
      label: t('fish'), 
      icon: Fish, 
      visible: farm.farmType === 'mixed' || farm.farmType === 'fish',
      quota: currentPlan.maxFishPonds !== -1 ? `${quotas.fish.current}/${quotas.fish.max}` : `${quotas.fish.current}`
    },
    { id: 'khata' as NavTab, label: t('khata'), icon: BookOpenCheck, visible: true },
    { id: 'health' as NavTab, label: 'Vet & AI Health', icon: Stethoscope, visible: true },
    { id: 'staff' as NavTab, label: 'Staff & Labor', icon: Users, visible: true },
    { id: 'marketplace' as NavTab, label: 'B2B Marketplace', icon: ShoppingBag, visible: true },
    { id: 'subscriptions' as NavTab, label: t('subscriptions'), icon: CreditCard, visible: true },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 border-r border-slate-800">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Farm Enterprises
        </div>

        {navItems.filter(item => item.visible).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.quota && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.quota}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 100% Free Lifetime Farmer SaaS Highlight */}
      <div className="bg-gradient-to-br from-slate-800 to-emerald-950/60 border border-emerald-500/30 p-3.5 rounded-2xl shadow-sm text-left">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>100% Free for Farmers</span>
        </div>
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
          Zero subscription fees. Unlimited livestock, flocks, ponds, crops & master khata unlocked.
        </p>
        <button
          onClick={() => onSelectTab('marketplace')}
          className="mt-2.5 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-1 transition shadow-sm"
        >
          <span>B2B Mandi Leads</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
