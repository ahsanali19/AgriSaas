// src/components/farms/FarmList.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import {
  Tractor,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Maximize2,
  Coins,
  AlertTriangle,
  X,
  Check,
  Building2
} from 'lucide-react';
import { Farm, FarmType } from '../../types';

export const FarmList: React.FC = () => {
  const { farms, farm, setFarm, addFarm, updateFarm, deleteFarm } = useFarm();
  const { currentPlan } = useAuth();

  // Modals & Dialogs
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    farmType: 'mixed' as FarmType,
    currency: 'PKR',
    locationDistrict: 'Sahiwal, Punjab',
    totalAreaAcres: 25
  });

  const openEditModal = (farmItem: Farm) => {
    setSelectedFarm(farmItem);
    setFormData({
      name: farmItem.name,
      farmType: farmItem.farmType,
      currency: farmItem.currency,
      locationDistrict: farmItem.locationDistrict || '',
      totalAreaAcres: farmItem.totalAreaAcres || 10
    });
    setShowEditModal(true);
  };

  const openDeleteDialog = (farmItem: Farm) => {
    setSelectedFarm(farmItem);
    setShowDeleteDialog(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Simulated API call: POST /api/farms
    try {
      // await fetch('/api/farms', { method: 'POST', body: JSON.stringify(formData) });
      addFarm({
        name: formData.name.trim(),
        farmType: formData.farmType,
        currency: formData.currency,
        locationDistrict: formData.locationDistrict,
        totalAreaAcres: Number(formData.totalAreaAcres)
      });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error creating farm:', err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarm || !formData.name.trim()) return;

    // Simulated API call: PUT /api/farms/:id
    try {
      // await fetch(`/api/farms/${selectedFarm.id}`, { method: 'PUT', body: JSON.stringify(formData) });
      updateFarm(selectedFarm.id, {
        name: formData.name.trim(),
        farmType: formData.farmType,
        currency: formData.currency,
        locationDistrict: formData.locationDistrict,
        totalAreaAcres: Number(formData.totalAreaAcres)
      });
      setShowEditModal(false);
      setSelectedFarm(null);
    } catch (err) {
      console.error('Error updating farm:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedFarm) return;

    // Simulated API call: DELETE /api/farms/:id
    try {
      // await fetch(`/api/farms/${selectedFarm.id}`, { method: 'DELETE' });
      deleteFarm(selectedFarm.id);
      setShowDeleteDialog(false);
      setSelectedFarm(null);
    } catch (err) {
      console.error('Error deleting farm:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
              🌾
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Farm Estates & Land Holdings</h2>
              <p className="text-xs text-slate-500">
                Manage multiple agricultural estates, district locations, land sizes, and default currencies.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              farmType: 'mixed',
              currency: 'PKR',
              locationDistrict: 'Sahiwal, Punjab',
              totalAreaAcres: 20
            });
            setShowAddModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition flex items-center space-x-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farm</span>
        </button>
      </div>

      {/* Farms Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Active Farm Locations ({farms.length})</h3>
          <span className="text-xs text-slate-500">Current Active: <strong className="text-emerald-700">{farm.name}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Farm Identity</th>
                <th className="px-5 py-3.5">Enterprise Type</th>
                <th className="px-5 py-3.5">District Location</th>
                <th className="px-5 py-3.5">Total Land</th>
                <th className="px-5 py-3.5">Base Currency</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {farms.map((item) => {
                const isSelected = item.id === farm.id;
                return (
                  <tr key={item.id} className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                    <td className="px-5 py-4 font-bold text-slate-900 flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm">
                        🌾
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">ID: #{item.id}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 capitalize">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border">
                        {item.farmType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.locationDistrict || 'Punjab, PK'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold">
                      {item.totalAreaAcres || 25} Acres
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-emerald-800">
                      {item.currency}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {isSelected ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                          Active Farm
                        </span>
                      ) : (
                        <button
                          onClick={() => setFarm(item)}
                          className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition"
                        >
                          Switch
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit Farm Details"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => openDeleteDialog(item)}
                          disabled={farms.length <= 1}
                          title={farms.length <= 1 ? 'Cannot delete only remaining farm' : 'Delete Farm'}
                          className={`p-1.5 rounded-xl transition ${
                            farms.length <= 1
                              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                              : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Farm Modal */}
      {showEditModal && selectedFarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-indigo-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pencil className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-base">Edit Farm: {selectedFarm.name}</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-indigo-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enterprise Type</label>
                  <select
                    value={formData.farmType}
                    onChange={(e) => setFormData({ ...formData, farmType: e.target.value as FarmType })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="mixed">🌾 Mixed Farm</option>
                    <option value="dairy">🐄 Dairy Farm</option>
                    <option value="poultry">🐔 Poultry Farm</option>
                    <option value="fish">🐟 Aquaculture Farm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                  >
                    <option value="PKR">PKR (₨)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="AED">AED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District Location</label>
                  <input
                    type="text"
                    value={formData.locationDistrict}
                    onChange={(e) => setFormData({ ...formData, locationDistrict: e.target.value })}
                    placeholder="e.g. Sahiwal, Punjab"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Acres</label>
                  <input
                    type="number"
                    value={formData.totalAreaAcres}
                    onChange={(e) => setFormData({ ...formData, totalAreaAcres: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl transition shadow"
                >
                  Save Changes (PUT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">Register New Farm Complex</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indus Agro Ranch"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enterprise Type</label>
                  <select
                    value={formData.farmType}
                    onChange={(e) => setFormData({ ...formData, farmType: e.target.value as FarmType })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="mixed">🌾 Mixed Farm</option>
                    <option value="dairy">🐄 Dairy Farm</option>
                    <option value="poultry">🐔 Poultry Farm</option>
                    <option value="fish">🐟 Aquaculture Farm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  >
                    <option value="PKR">PKR (₨)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition shadow"
                >
                  Register Farm (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedFarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-rose-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div>
              <h4 className="font-bold text-lg text-slate-900">Delete Farm Location?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <strong>"{selectedFarm.name}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedFarm(null);
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-rose-200"
              >
                Confirm Delete (DELETE)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmList;
