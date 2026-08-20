// src/components/dashboard/StatCards.tsx
import React from 'react';
import { useFarm } from '../../context/FarmContext';
import { useLanguage } from '../../context/LanguageContext';
import { Milk, Bird, Fish, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

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
      bgColor: 'bg-blue-50/90 text-blue-900 border-blue-200/80',
      iconBg: 'bg-blue-600 text-white',
      visible: farm.farmType === 'mixed' || farm.farmType === 'dairy'
    },
    {
      title: t('totalBirds'),
      value: metrics.totalBirds.toLocaleString(),
      subtext: `${metrics.activeFlocks} Active Flocks`,
      icon: Bird,
      bgColor: 'bg-amber-50/90 text-amber-900 border-amber-200/80',
      iconBg: 'bg-amber-600 text-white',
      visible: farm.farmType === 'mixed' || farm.farmType === 'poultry'
    },
    {
      title: t('activePonds'),
      value: metrics.activePonds,
      subtext: 'Growth Sampling OK',
      icon: Fish,
      bgColor: 'bg-cyan-50/90 text-cyan-900 border-cyan-200/80',
      iconBg: 'bg-cyan-600 text-white',
      visible: farm.farmType === 'mixed' || farm.farmType === 'fish'
    },
    {
      title: t('monthlyRevenue'),
      value: `${symbol} ${metrics.monthlyIncome.toLocaleString()}`,
      subtext: 'Cash & Direct Sales',
      icon: TrendingUp,
      bgColor: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/80',
      iconBg: 'bg-emerald-600 text-white',
      visible: true
    },
    {
      title: t('monthlyExpense'),
      value: `${symbol} ${metrics.monthlyExpense.toLocaleString()}`,
      subtext: 'Feed, Meds & Diesel',
      icon: TrendingDown,
      bgColor: 'bg-rose-50/90 text-rose-900 border-rose-200/80',
      iconBg: 'bg-rose-600 text-white',
      visible: true
    },
    {
      title: t('netProfit'),
      value: `${symbol} ${metrics.netProfit.toLocaleString()}`,
      subtext: metrics.netProfit >= 0 ? 'Profitable Run' : 'Operating Deficit',
      icon: DollarSign,
      bgColor: metrics.netProfit >= 0 ? 'bg-teal-50/90 text-teal-900 border-teal-200/80' : 'bg-red-50/90 text-red-900 border-red-200/80',
      iconBg: metrics.netProfit >= 0 ? 'bg-teal-700 text-white' : 'bg-red-600 text-white',
      visible: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-3.5 sm:gap-4">
      {cards.filter(c => c.visible).map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between min-w-0 ${card.bgColor}`}
          >
            <div className="flex items-start justify-between gap-2.5">
              <span className="text-xs sm:text-xs font-bold uppercase tracking-wider opacity-85 leading-snug break-words flex-1 min-w-0">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl shadow-sm shrink-0 ${card.iconBg}`}>
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            
            <div className="mt-3">
              <div className="font-black text-xl sm:text-2xl tracking-tight font-mono text-slate-900 break-words leading-tight">
                {card.value}
              </div>
              <div className="text-[11px] sm:text-xs opacity-75 font-medium mt-1 leading-snug break-words">
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
