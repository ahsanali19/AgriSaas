// src/components/khata/ProfitLossReport.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Calendar, Download, Printer, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Filter } from 'lucide-react';
import { EnterpriseType } from '../../types';

export const ProfitLossReport: React.FC = () => {
  const { farm, khataTransactions } = useFarm();
  const { t } = useLanguage();

  const [dateFilter, setDateFilter] = useState<'month' | 'week' | 'year' | 'all'>('month');
  const [selectedEnterprise, setSelectedEnterprise] = useState<EnterpriseType | 'all'>('all');

  // Filter transactions
  const now = new Date();
  const filtered = khataTransactions.filter(tx => {
    if (selectedEnterprise !== 'all' && tx.enterpriseType !== selectedEnterprise) {
      return false;
    }

    const txDate = new Date(tx.transactionDate);
    if (dateFilter === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return txDate >= sevenDaysAgo;
    } else if (dateFilter === 'month') {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    } else if (dateFilter === 'year') {
      return txDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalIncome = filtered
    .filter(t => t.transactionType === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filtered
    .filter(t => t.transactionType === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netProfit = totalIncome - totalExpense;
  const marginPercent = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0.0';

  // Enterprise breakdown
  const enterprises: { type: EnterpriseType; label: string; icon: string }[] = [
    { type: 'dairy', label: 'Dairy & Livestock', icon: '🐄' },
    { type: 'poultry', label: 'Poultry Farm', icon: '🐔' },
    { type: 'fish', label: 'Fish Aquaculture', icon: '🐟' },
    { type: 'general', label: 'General Farm Overhead', icon: '🌾' },
  ];

  const enterpriseBreakdown = enterprises.map(ent => {
    const entTxs = filtered.filter(t => t.enterpriseType === ent.type);
    const inc = entTxs.filter(t => t.transactionType === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const exp = entTxs.filter(t => t.transactionType === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return {
      ...ent,
      income: inc,
      expense: exp,
      net: inc - exp
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Report Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Farm Profit & Loss Statement</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audited financial breakdown across all livestock, poultry, and aquaculture enterprises.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-semibold">
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dateFilter === 'week' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dateFilter === 'month' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateFilter('year')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dateFilter === 'year' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Year
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dateFilter === 'all' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Time
            </button>
          </div>

          {/* Export / Print */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-emerald-950">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center justify-between">
            <span>Total Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono font-black text-2xl mt-2 text-emerald-900">
            {formatCurrency(totalIncome, farm.currency)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">Direct Farm Income</div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 text-rose-950">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center justify-between">
            <span>Total Operating Cost</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="font-mono font-black text-2xl mt-2 text-rose-900">
            {formatCurrency(totalExpense, farm.currency)}
          </div>
          <div className="text-[11px] text-rose-700 mt-1">Feed, Wages, Diesel & Meds</div>
        </div>

        <div className={`border rounded-3xl p-5 ${
          netProfit >= 0
            ? 'bg-emerald-900 text-white border-emerald-950 shadow-md'
            : 'bg-red-900 text-white border-red-950 shadow-md'
        }`}>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80 flex items-center justify-between">
            <span>Net Operating Margin</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="font-mono font-black text-2xl mt-2">
            {netProfit < 0 ? '-' : ''}{formatCurrency(Math.abs(netProfit), farm.currency)}
          </div>
          <div className="text-[11px] opacity-80 mt-1">
            {netProfit >= 0 ? 'Surplus Cashflow' : 'Operating Deficit'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Profitability Ratio</span>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-mono font-black text-2xl mt-2 text-slate-900">
            {marginPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Net Margin on Sales</div>
        </div>
      </div>

      {/* Enterprise-wise Breakdown Bars & Visual Graph */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
          Enterprise Unit Economics & P&L
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enterpriseBreakdown.map((ent) => {
            const hasActivity = ent.income > 0 || ent.expense > 0;
            const maxVal = Math.max(ent.income, ent.expense, 1);
            const incWidth = `${(ent.income / maxVal) * 100}%`;
            const expWidth = `${(ent.expense / maxVal) * 100}%`;

            return (
              <div key={ent.type} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{ent.icon}</span>
                    <h4 className="font-bold text-sm text-slate-900">{ent.label}</h4>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                    ent.net >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {ent.net >= 0 ? '+' : ''}{formatCurrency(ent.net, farm.currency)}
                  </span>
                </div>

                {hasActivity ? (
                  <div className="space-y-2 pt-1 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span>Revenue (آمدن):</span>
                        <span className="font-mono font-bold text-emerald-700">{formatCurrency(ent.income, farm.currency)}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: incWidth }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span>Expenses (خرچ):</span>
                        <span className="font-mono font-bold text-rose-700">{formatCurrency(ent.expense, farm.currency)}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: expWidth }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-2">No transactions recorded in selected date range.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Itemized Audit Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            Statement Ledger Entries ({filtered.length} Items)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Period: {dateFilter.toUpperCase()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Enterprise</th>
                <th className="px-5 py-3.5">Particulars</th>
                <th className="px-5 py-3.5">Payment Channel</th>
                <th className="px-5 py-3.5 text-right">Debit (Expense)</th>
                <th className="px-5 py-3.5 text-right">Credit (Income)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                    {formatDate(tx.transactionDate)}
                  </td>
                  <td className="px-5 py-3.5 capitalize font-semibold text-slate-800">
                    {tx.enterpriseType}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{tx.categoryName}</div>
                    {tx.partyName && <div className="text-[10px] text-slate-400">Party: {tx.partyName}</div>}
                  </td>
                  <td className="px-5 py-3.5 capitalize">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-mono">
                      {tx.paymentMode.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-rose-700">
                    {tx.transactionType === 'expense' ? formatCurrency(tx.amount, farm.currency) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-700">
                    {tx.transactionType === 'income' ? formatCurrency(tx.amount, farm.currency) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
