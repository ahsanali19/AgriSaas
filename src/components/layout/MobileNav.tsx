// src/components/layout/MobileNav.tsx
import React from 'react';
import { NavTab } from './Sidebar';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Milk,
  Bird,
  Fish,
  Stethoscope,
  ShoppingBag,
  BookOpenCheck
} from 'lucide-react';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useLanguage();

  const tabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t('dashboard') || 'Dashboard', icon: LayoutDashboard },
    { id: 'dairy', label: t('dairy') || 'Dairy', icon: Milk },
    { id: 'poultry', label: t('poultry') || 'Poultry', icon: Bird },
    { id: 'fish', label: t('fish') || 'Fish', icon: Fish },
    { id: 'health', label: 'Vet', icon: Stethoscope },
    { id: 'marketplace', label: 'Market', icon: ShoppingBag },
    { id: 'khata', label: t('khata') || 'Khata', icon: BookOpenCheck },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 shadow-[0_-8px_20px_rgba(0,0,0,0.35)] px-1 py-1.5"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.375rem)' }}
    >
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 min-w-[46px] sm:min-w-[54px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 select-none ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5 transition-transform ${
                    isActive ? 'text-emerald-400 scale-110' : 'text-slate-400'
                  }`}
                />
                {isActive && (
                  <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
                )}
              </div>
              <span className="text-[10px] leading-tight tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

