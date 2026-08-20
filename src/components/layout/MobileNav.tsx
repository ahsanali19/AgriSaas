// src/components/layout/MobileNav.tsx
import React from 'react';
import { NavTab } from './Sidebar';
import { useLanguage } from '../../context/LanguageContext';
import { useFarm } from '../../context/FarmContext';
import { LayoutDashboard, Milk, Bird, Fish, BookOpenCheck } from 'lucide-react';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useLanguage();
  const { farm } = useFarm();

  const tabs = [
    { id: 'dashboard' as NavTab, label: t('dashboard'), icon: LayoutDashboard },
    ...(farm.farmType === 'mixed' || farm.farmType === 'dairy'
      ? [{ id: 'dairy' as NavTab, label: 'Dairy', icon: Milk }]
      : []),
    ...(farm.farmType === 'mixed' || farm.farmType === 'poultry'
      ? [{ id: 'poultry' as NavTab, label: 'Poultry', icon: Bird }]
      : []),
    ...(farm.farmType === 'mixed' || farm.farmType === 'fish'
      ? [{ id: 'fish' as NavTab, label: 'Fish', icon: Fish }]
      : []),
    { id: 'khata' as NavTab, label: 'Khata', icon: BookOpenCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
