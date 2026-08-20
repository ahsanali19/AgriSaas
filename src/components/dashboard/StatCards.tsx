// src/components/dashboard/StatCards.tsx
import React from 'react';
import { useFarm } from '../../context/FarmContext';
import { useLanguage } from '../../context/LanguageContext';
import { Milk, Bird, Fish, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export const StatCards: React.FC = () => {
  const { farm, metrics } = useFarm();
  const { t } = useLanguage();

  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  const cards = [
    {
      title: t('totalAnimals'),
      value: metrics.totalAnimals,
      subtext: `${metrics.todayMilkYield.toFixed(1)} Liters Today`,
      icon: Milk,
      bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      visible: farm.farmType === 'mixed' || farm.farmType === 'dairy'
    },
    {
      title: t('totalBirds'),
      value: metrics.totalBirds.toLocaleString(),
      subtext: `${metrics.activeFlocks} Active Flocks`,
      icon: Bird,
      bgColor: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-600 text-white',
      visible: farm.farmType === 'mixed' || farm.farmType === 'poultry'
    },
    {
      title: t('activePonds'),
      value: metrics.activePonds,
      subtext: 'Growth Sampling OK',
      icon: Fish,
      bgColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      iconBg: 'bg-cyan-600 text-white',
      visible: farm.farmType === 'mixed' || farm.farmType === 'fish'
    },
    {
      title: t('monthlyRevenue'),
      value: `${symbol} ${metrics.monthlyIncome.toLocaleString()}`,
      subtext: 'Cash & Direct Sales',
      icon: TrendingUp,
      bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      visible: true
    },
    {
      title: t('monthlyExpense'),
      value: `${symbol} ${metrics.monthlyExpense.toLocaleString()}`,
      subtext: 'Feed, Meds & Diesel',
      icon: TrendingDown,
      bgColor: 'bg-rose-50 text-rose-800 border-rose-200',
      iconBg: 'bg-rose-600 text-white',
      visible: true
    },
    {
      title: t('netProfit'),
      value: `${symbol} ${metrics.netProfit.toLocaleString()}`,
      subtext: metrics.netProfit >= 0 ? 'Profitable Run' : 'Operating Deficit',
      icon: DollarSign,
      bgColor: metrics.netProfit >= 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200',
      iconBg: metrics.netProfit >= 0 ? 'bg-emerald-700 text-white' : 'bg-red-600 text-white',
      visible: true
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.filter(c => c.visible).map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 sm:p-4 rounded-2xl border transition hover:shadow-md ${card.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider opacity-80 truncate">
                {card.title}
              </span>
              <div className={`p-1.5 sm:p-2 rounded-xl shadow-sm ${card.iconBg}`}>
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <div className="mt-2 font-black text-lg sm:text-xl tracking-tight">
              {card.value}
            </div>
            <div className="text-[10px] sm:text-[11px] opacity-75 font-medium mt-0.5 truncate">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
