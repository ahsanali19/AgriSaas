// src/components/khata/KhataModule.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useLanguage } from '../../context/LanguageContext';
import { EnterpriseType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ProfitLossReport } from './ProfitLossReport';
import { CustomerVendorLedger } from './CustomerVendorLedger';
import {
  Plus,
  BookOpenCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  DollarSign,
  BarChart3,
  Users,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const KhataModule: React.FC = () => {
  const { farm, khataTransactions, addKhataTransaction, metrics } = useFarm();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'cashbook' | 'pnl' | 'parties'>('cashbook');
  const [filterEnterprise, setFilterEnterprise] = useState<EnterpriseType | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [enterpriseType, setEnterpriseType] = useState<EnterpriseType>('dairy');
  const [categoryName, setCategoryName] = useState('Raw Milk Sales');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('15000');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'bank_transfer' | 'jazzcash' | 'easypaisa' | 'credit_udhaar'>('cash');
  const [partyName, setPartyName] = useState('');
  const [description, setDescription] = useState('');

  const quickIncomeCategories = [
    { label: 'Raw Milk Sales', ent: 'dairy' as EnterpriseType },
    { label: 'Live Broiler Birds', ent: 'poultry' as EnterpriseType },
    { label: 'Fresh Fish Harvest', ent: 'fish' as EnterpriseType },
    { label: 'Manure / Compost', ent: 'general' as EnterpriseType },
  ];

  const quickExpenseCategories = [
    { label: 'Cattle Feed / Wanda', ent: 'dairy' as EnterpriseType },
    { label: 'Poultry Feed Bags', ent: 'poultry' as EnterpriseType },
    { label: 'Fish Floating Pellets', ent: 'fish' as EnterpriseType },
    { label: 'Medicine & Vaccines', ent: 'general' as EnterpriseType },
    { label: 'Labour / Worker Wages', ent: 'general' as EnterpriseType },
    { label: 'Diesel / Solar Tube-well', ent: 'general' as EnterpriseType },
  ];

  const filteredTransactions = khataTransactions.filter((tx) => {
    const matchesEnterprise = filterEnterprise === 'all' || tx.enterpriseType === filterEnterprise;
    const matchesType = filterType === 'all' || tx.transactionType === filterType;
    return matchesEnterprise && matchesType;
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    addKhataTransaction({
      enterpriseType,
      categoryName,
      transactionType,
      amount: Number(amount),
      paymentMode,
      transactionDate: new Date().toISOString().split('T')[0],
      partyName: partyName.trim() || undefined,
      description: description.trim() || undefined
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Khata Navigation Tabs */}
      <div className="bg-white rounded-3xl p-2 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('cashbook')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'cashbook' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>Master Cashbook (روزنامچہ)</span>
          </button>

          <button
            onClick={() => setActiveTab('pnl')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'pnl' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Profit & Loss Reports (نفع و نقصان)</span>
          </button>

          <button
            onClick={() => setActiveTab('parties')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'parties' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Party Udhaar Book (ادھار کھاتہ)</span>
          </button>
        </div>

        {activeTab === 'cashbook' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center space-x-1.5 self-center m-1"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
        )}
      </div>

      {/* Tab 1: Cashbook */}
      {activeTab === 'cashbook' && (
        <div className="space-y-6">
          
          {/* P&L Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-emerald-900">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-700">
                <span>Total Farm Income</span>
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-mono font-black text-2xl mt-2 text-emerald-800">
                {formatCurrency(metrics.monthlyIncome, farm.currency)}
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 text-rose-900">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-700">
                <span>Total Farm Expenses</span>
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
              </div>
              <div className="font-mono font-black text-2xl mt-2 text-rose-800">
                {formatCurrency(metrics.monthlyExpense, farm.currency)}
              </div>
            </div>

            <div className={`border rounded-3xl p-5 ${
              metrics.netProfit >= 0
                ? 'bg-emerald-900 text-white border-emerald-950 shadow-md'
                : 'bg-red-900 text-white border-red-950 shadow-md'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-80">
                <span>Net Farm Profit</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="font-mono font-black text-2xl mt-2">
                {formatCurrency(metrics.netProfit, farm.currency)}
              </div>
            </div>
          </div>

          {/* Transactions Filter & Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Filters */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">Enterprise:</span>
                {(['all', 'dairy', 'poultry', 'fish', 'general'] as const).map((ent) => (
                  <button
                    key={ent}
                    onClick={() => setFilterEnterprise(ent)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                      filterEnterprise === ent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ent}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">Type:</span>
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filterType === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filterType === 'income' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filterType === 'expense' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Enterprise</th>
                    <th className="px-5 py-3.5">Category / Description</th>
                    <th className="px-5 py-3.5">Party / Customer</th>
                    <th className="px-5 py-3.5">Payment Mode</th>
                    <th className="px-5 py-3.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(tx.transactionDate)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {tx.enterpriseType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        <div>{tx.categoryName}</div>
                        {tx.description && <div className="text-[10px] text-slate-400 font-normal">{tx.description}</div>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {tx.partyName || '—'}
                      </td>
                      <td className="px-5 py-3.5 font-mono capitalize">
                        <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                          {tx.paymentMode.replace('_', ' ')}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 font-mono font-bold text-right text-sm ${
                        tx.transactionType === 'income' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {tx.transactionType === 'income' ? '+' : '-'}{formatCurrency(tx.amount, farm.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Profit & Loss Statement */}
      {activeTab === 'pnl' && (
        <ProfitLossReport />
      )}

      {/* Tab 3: Udhaar Party Ledger */}
      {activeTab === 'parties' && (
        <CustomerVendorLedger />
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2">
                <BookOpenCheck className="w-5 h-5" />
                <h3 className="font-bold text-base">New Khata Transaction</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-4 overflow-y-auto">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setTransactionType('income');
                    setCategoryName('Raw Milk Sales');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    transactionType === 'income' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600'
                  }`}
                >
                  + Cash In / Income (آمدن)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransactionType('expense');
                    setCategoryName('Cattle Feed / Wanda');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition ${
                    transactionType === 'expense' ? 'bg-rose-600 text-white shadow' : 'text-slate-600'
                  }`}
                >
                  - Cash Out / Expense (خرچ)
                </button>
              </div>

              {/* Quick Category Chips */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Quick Suggested Categories:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(transactionType === 'income' ? quickIncomeCategories : quickExpenseCategories).map((qc) => (
                    <button
                      key={qc.label}
                      type="button"
                      onClick={() => {
                        setCategoryName(qc.label);
                        setEnterpriseType(qc.ent);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                        categoryName === qc.label
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {qc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enterprise Tag</label>
                  <select
                    value={enterpriseType}
                    onChange={(e) => setEnterpriseType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="dairy">Dairy & Cattle</option>
                    <option value="poultry">Poultry Farm</option>
                    <option value="fish">Fish Aquaculture</option>
                    <option value="general">General Overhead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount ({farm.currency}) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Particulars / Item Title *</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Milk sales, Cattle feed bags, Vaccine"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="cash">Cash (نقد)</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="credit_udhaar">Credit / Udhaar (ادھار)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Party / Person</label>
                  <input
                    type="text"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder="e.g. Gawala / Feed Dealer"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Remarks</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details or quantity notes"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition"
                >
                  Save Entry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
