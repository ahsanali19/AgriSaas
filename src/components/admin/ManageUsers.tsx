// src/components/admin/ManageUsers.tsx
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminFarmerUser } from '../../types';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Zap,
  X,
  CheckCircle,
  Phone,
  MapPin,
  Sparkles,
  Globe2,
  DollarSign
} from 'lucide-react';

export const ManageUsers: React.FC = () => {
  const { farmers, updateFarmerSubscription, toggleFarmerStatus } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<'all' | 'FREE' | 'PRO'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');

  // Modal action states
  const [selectedFarmer, setSelectedFarmer] = useState<AdminFarmerUser | null>(null);
  const [actionType, setActionType] = useState<'upgrade_pro' | 'upgrade_yearly' | 'downgrade_free' | 'suspend' | 'activate' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState<string | null>(null);

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch =
      farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.phoneNumber.includes(searchTerm) ||
      farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = filterRegion === 'all' || farmer.countryCode === filterRegion;
    const matchesPlan =
      filterPlan === 'all' ||
      (filterPlan === 'FREE' && farmer.planCode === 'FREE') ||
      (filterPlan === 'PRO' && farmer.planCode !== 'FREE');
    const matchesStatus = filterStatus === 'all' || farmer.planStatus === filterStatus;

    return matchesSearch && matchesRegion && matchesPlan && matchesStatus;
  });

  const handleExecuteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmer || !actionType) return;

    if (actionType === 'upgrade_pro') {
      updateFarmerSubscription(selectedFarmer.id, 'PRO_MONTHLY', actionReason || 'Admin Manual Monthly Upgrade');
      setIsSuccessToast(`Upgraded ${selectedFarmer.fullName} to Pro Monthly!`);
    } else if (actionType === 'upgrade_yearly') {
      updateFarmerSubscription(selectedFarmer.id, 'PRO_YEARLY', actionReason || 'Admin Manual Annual Upgrade');
      setIsSuccessToast(`Upgraded ${selectedFarmer.fullName} to Pro Yearly!`);
    } else if (actionType === 'downgrade_free') {
      updateFarmerSubscription(selectedFarmer.id, 'FREE', actionReason || 'Admin Manual Downgrade');
      setIsSuccessToast(`Downgraded ${selectedFarmer.fullName} to Free Tier.`);
    } else if (actionType === 'suspend') {
      toggleFarmerStatus(selectedFarmer.id, 'suspended', actionReason || 'Policy or terms violation');
      setIsSuccessToast(`Suspended account for ${selectedFarmer.fullName}.`);
    } else if (actionType === 'activate') {
      toggleFarmerStatus(selectedFarmer.id, 'active', actionReason || 'Reactivated by Super Admin');
      setIsSuccessToast(`Reactivated account for ${selectedFarmer.fullName}.`);
    }

    setSelectedFarmer(null);
    setActionType(null);
    setActionReason('');

    setTimeout(() => setIsSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {isSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{isSuccessToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Manage Tenants & Subscription Controls</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search farmers globally, inspect localized currencies and normalized PKR revenue, and execute manual plan overrides.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl">
          Showing <span className="text-white font-bold">{filteredFarmers.length}</span> of {farmers.length} Registered Tenants
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by farmer name, mobile number, or farm..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Filter Region */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterRegion('all')}
            className={`px-3 py-1 rounded-lg transition ${
              filterRegion === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Regions
          </button>
          <button
            onClick={() => setFilterRegion('PK')}
            className={`px-3 py-1 rounded-lg transition ${
              filterRegion === 'PK' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇵🇰 Pakistan (PKR)
          </button>
          <button
            onClick={() => setFilterRegion('IN')}
            className={`px-3 py-1 rounded-lg transition ${
              filterRegion === 'IN' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇮🇳 India (INR)
          </button>
          <button
            onClick={() => setFilterRegion('US')}
            className={`px-3 py-1 rounded-lg transition ${
              filterRegion === 'US' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇺🇸 USA (USD)
          </button>
        </div>

        {/* Filter Plan */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterPlan('all')}
            className={`px-3 py-1 rounded-lg transition ${
              filterPlan === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Tiers
          </button>
          <button
            onClick={() => setFilterPlan('PRO')}
            className={`px-3 py-1 rounded-lg transition ${
              filterPlan === 'PRO' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pro Only
          </button>
          <button
            onClick={() => setFilterPlan('FREE')}
            className={`px-3 py-1 rounded-lg transition ${
              filterPlan === 'FREE' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Free Tier
          </button>
        </div>

      </div>

      {/* Users Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Farmer Details</th>
                <th className="px-5 py-4">Farm & Location</th>
                <th className="px-5 py-4">Local Currency</th>
                <th className="px-5 py-4">Normalized PKR Revenue</th>
                <th className="px-5 py-4">Subscription Plan</th>
                <th className="px-5 py-4">Account Status</th>
                <th className="px-5 py-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredFarmers.map((farmer) => {
                const isPro = farmer.planCode !== 'FREE';
                const isSuspended = farmer.planStatus === 'suspended';

                return (
                  <tr key={farmer.id} className="hover:bg-slate-800/50 transition">
                    
                    {/* Farmer Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                          {farmer.countryCode === 'PK' && '🇵🇰'}
                          {farmer.countryCode === 'IN' && '🇮🇳'}
                          {farmer.countryCode === 'US' && '🇺🇸'}
                          {farmer.countryCode === 'AE' && '🇦🇪'}
                          {!['PK', 'IN', 'US', 'AE'].includes(farmer.countryCode) && '🌍'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{farmer.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{farmer.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Farm & Location */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-200">{farmer.farmName}</div>
                      <div className="text-[11px] text-slate-400 capitalize flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{farmer.locationDistrict || 'District'} • {farmer.farmType}</span>
                      </div>
                    </td>

                    {/* Local Currency */}
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-slate-200">
                        {farmer.preferredCurrency || 'PKR'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {farmer.lastPaymentAmount ? `${farmer.preferredCurrency} ${farmer.lastPaymentAmount}` : 'No charge'}
                      </div>
                    </td>

                    {/* Normalized PKR Revenue (Admin Core Rule) */}
                    <td className="px-5 py-4 font-mono font-bold">
                      {farmer.convertedAmountPkr ? (
                        <span className="text-emerald-400">Rs. {farmer.convertedAmountPkr.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-500">Rs. 0</span>
                      )}
                    </td>

                    {/* Plan Code */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isPro
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {farmer.planCode.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isSuspended
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {farmer.planStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {!isPro ? (
                          <button
                            onClick={() => {
                              setSelectedFarmer(farmer);
                              setActionType('upgrade_pro');
                            }}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition flex items-center space-x-1"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Set Pro</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedFarmer(farmer);
                              setActionType('downgrade_free');
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-slate-700 transition"
                          >
                            Set Free
                          </button>
                        )}

                        {!isSuspended ? (
                          <button
                            onClick={() => {
                              setSelectedFarmer(farmer);
                              setActionType('suspend');
                            }}
                            className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-rose-800/80 transition"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedFarmer(farmer);
                              setActionType('activate');
                            }}
                            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-emerald-800 transition"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {selectedFarmer && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-slate-200">
            
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  {actionType === 'upgrade_pro' && 'Upgrade Tenant to Pro Monthly'}
                  {actionType === 'upgrade_yearly' && 'Upgrade Tenant to Pro Yearly'}
                  {actionType === 'downgrade_free' && 'Downgrade Tenant to Free Tier'}
                  {actionType === 'suspend' && 'Suspend Farmer Tenant'}
                  {actionType === 'activate' && 'Reactivate Farmer Tenant'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedFarmer(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteAction} className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400 font-semibold">Target Farmer Tenant:</div>
                <div className="text-white font-bold text-sm">{selectedFarmer.fullName}</div>
                <div className="text-slate-400">{selectedFarmer.farmName} ({selectedFarmer.phoneNumber})</div>
                <div className="text-emerald-400 text-[11px] font-mono mt-1">
                  Local Currency: {selectedFarmer.preferredCurrency} • Base PKR Valuation: Rs. {selectedFarmer.convertedAmountPkr?.toLocaleString() || 0}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for Action (Recorded in Audit Trail)
                </label>
                <input
                  type="text"
                  required
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Bank transfer verified, promotional grant"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFarmer(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`font-bold py-2.5 px-5 rounded-xl text-xs transition shadow ${
                    actionType === 'suspend'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  Confirm Super Admin Action
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
