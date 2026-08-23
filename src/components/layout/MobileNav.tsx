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
    { id: 'health', label: 'Veterinary & AI Health', icon: Stethoscope },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'khata', label: t('khata') || 'Khata', icon: BookOpenCheck },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-10px_25px_rgba(0,0,0,0.4)] px-2 py-2"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}
    >
      <div className="grid grid-cols-7 items-center max-w-md mx-auto w-full gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              aria-label={tab.label}
              title={tab.label}
              className={`relative flex items-center justify-center h-11 w-full rounded-2xl transition-all duration-200 active:scale-90 select-none ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`}
              />

              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_#34d399]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};


