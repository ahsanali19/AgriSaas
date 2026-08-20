// src/components/khata/CustomerVendorLedger.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { formatCurrency } from '../../utils/formatters';
import { Users, Plus, Phone, MessageSquare, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { KhataParty } from '../../types';

export const CustomerVendorLedger: React.FC = () => {
  const { farm, parties, addKhataTransaction } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPartyType, setFilterPartyType] = useState<'all' | 'buyer_customer' | 'supplier_vendor'>('all');

  const filteredParties = parties.filter(p => {
    const matchesSearch = p.partyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterPartyType === 'all' || p.partyType === filterPartyType;
    return matchesSearch && matchesType;
  });

  const sendWhatsAppReminder = (party: KhataParty) => {
    const amountStr = formatCurrency(Math.abs(party.currentBalance), farm.currency);
    const message = encodeURIComponent(
      `Assalam-o-Alaikum ${party.partyName},\nThis is a gentle Khata balance reminder from ${farm.name}.\nYour outstanding balance is: ${amountStr}.\nPlease confirm upon receipt.`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Customer & Supplier Udhaar Book (ادھار کھاتہ)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track receivables from Dudh-Walas/Wholesalers and payables to Feed Mills & Hatcheries.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by party name..."
              className="pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Party Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredParties.map((party) => {
          const isReceivable = party.currentBalance >= 0;

          return (
            <div key={party.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{party.partyName}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {party.partyType === 'buyer_customer' ? 'Buyer / Milk Dealer' : 'Feed / Medicine Supplier'}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  isReceivable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {isReceivable ? 'You Will Receive' : 'You Owe'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Net Balance</div>
                <div className={`font-mono font-black text-xl mt-0.5 ${
                  isReceivable ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {formatCurrency(Math.abs(party.currentBalance), farm.currency)}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => sendWhatsAppReminder(party)}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2 rounded-xl border border-emerald-200 transition flex items-center justify-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Slip</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
