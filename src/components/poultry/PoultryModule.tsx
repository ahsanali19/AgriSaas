// src/components/poultry/PoultryModule.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Bird,
  AlertTriangle,
  ShieldAlert,
  X,
  Pencil,
  Trash2,
  FileText
} from 'lucide-react';
import { PoultryBatch } from '../../types';

interface PoultryModuleProps {
  onOpenUpgrade: () => void;
}

export const PoultryModule: React.FC<PoultryModuleProps> = ({ onOpenUpgrade }) => {
  const {
    poultryBatches,
    poultryLogs,
    addPoultryBatch,
    updatePoultryBatch,
    deletePoultryBatch,
    addPoultryLog,
    quotas
  } = useFarm();
  const { currentPlan } = useAuth();

  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [showEditBatchModal, setShowEditBatchModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogDailyModal, setShowLogDailyModal] = useState(false);
  const [tierLimitError, setTierLimitError] = useState<string | null>(null);

  // Selected batch for edit/delete
  const [selectedBatch, setSelectedBatch] = useState<PoultryBatch | null>(null);

  // Form states for Add / Edit
  const [batchCode, setBatchCode] = useState('');
  const [birdType, setBirdType] = useState<'broiler' | 'layer' | 'desi_country'>('broiler');
  const [breedName, setBreedName] = useState('Cobb 500');
  const [initialBirdCount, setInitialBirdCount] = useState('2500');
  const [currentBirdCount, setCurrentBirdCount] = useState('2500');
  const [placementDate, setPlacementDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'active' | 'harvested' | 'culled'>('active');

  // Daily log states
  const [selectedBatchId, setSelectedBatchId] = useState<number>(poultryBatches[0]?.id || 1);
  const [mortalityCount, setMortalityCount] = useState('2');
  const [feedConsumedKg, setFeedConsumedKg] = useState('240');
  const [avgBodyWeightGrams, setAvgBodyWeightGrams] = useState('1450');

  // Open Edit modal
  const handleOpenEdit = (batch: PoultryBatch) => {
    setSelectedBatch(batch);
    setBatchCode(batch.batchCode);
    setBirdType(batch.birdType);
    setBreedName(batch.breedName || 'Cobb 500');
    setInitialBirdCount(String(batch.initialBirdCount));
    setCurrentBirdCount(String(batch.currentBirdCount));
    setPlacementDate(batch.placementDate);
    setStatus(batch.status);
    setShowEditBatchModal(true);
  };

  // Open Delete confirmation
  const handleOpenDelete = (batch: PoultryBatch) => {
    setSelectedBatch(batch);
    setShowDeleteDialog(true);
  };

  // Add Batch (POST)
  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setTierLimitError(null);

    const result = addPoultryBatch({
      batchCode: batchCode.trim().toUpperCase(),
      birdType,
      breedName,
      initialBirdCount: Number(initialBirdCount),
      placementDate,
      status: 'active'
    });

    if (!result.success) {
      setTierLimitError(result.message || 'Limit exceeded');
    } else {
      setShowAddBatchModal(false);
      setBatchCode('');
    }
  };

  // Update Batch (PUT / PATCH)
  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;

    try {
      // In full-stack: await fetch(`/api/poultry/batches/${selectedBatch.id}`, { method: 'PUT', body: JSON.stringify({...}) });
      updatePoultryBatch(selectedBatch.id, {
        batchCode: batchCode.trim().toUpperCase(),
        birdType,
        breedName,
        initialBirdCount: Number(initialBirdCount),
        currentBirdCount: Number(currentBirdCount),
        placementDate,
        status
      });
      setShowEditBatchModal(false);
      setSelectedBatch(null);
    } catch (err) {
      console.error('Error updating poultry batch:', err);
    }
  };

  // Confirm Delete Batch (DELETE)
  const handleConfirmDelete = async () => {
    if (!selectedBatch) return;

    try {
      // In full-stack: await fetch(`/api/poultry/batches/${selectedBatch.id}`, { method: 'DELETE' });
      deletePoultryBatch(selectedBatch.id);
      setShowDeleteDialog(false);
      setSelectedBatch(null);
    } catch (err) {
      console.error('Error deleting poultry batch:', err);
    }
  };

  const handleLogDaily = (e: React.FormEvent) => {
    e.preventDefault();
    addPoultryLog({
      batchId: Number(selectedBatchId),
      logDate: new Date().toISOString().split('T')[0],
      mortalityCount: Number(mortalityCount) || 0,
      feedConsumedKg: Number(feedConsumedKg) || 0,
      avgBodyWeightGrams: Number(avgBodyWeightGrams) || 0
    });
    setShowLogDailyModal(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Module Header (Compact Modern Bar) */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center text-lg shrink-0 border border-amber-100">
            🐔
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">Poultry Flock & FCR Tracker</h2>
            <p className="text-xs text-slate-500 truncate">
              Broiler & Layer flocks, daily feed weight math, and mortality logs
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setShowLogDailyModal(true)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs px-3 py-2 rounded-xl border border-amber-200 transition flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Log Daily</span>
          </button>

          <button
            onClick={() => {
              setTierLimitError(null);
              setBatchCode(`FLOCK-${new Date().getFullYear()}-B${poultryBatches.length + 1}`);
              setShowAddBatchModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Batch</span>
          </button>
        </div>
      </div>

      {/* Tier Quota Notification */}
      {currentPlan.maxPoultryFlocks !== -1 && quotas.poultry.current >= quotas.poultry.max && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Free Tier is capped at 2 concurrent poultry batches. Upgrade to Pro for unlimited shed management.</span>
          </div>
          <button
            onClick={onOpenUpgrade}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex-shrink-0 transition shadow-sm"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Poultry Batches Table / Data View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            Active Poultry Flocks & Sheds ({poultryBatches.length} Flocks)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Flock Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Flock Code</th>
                <th className="px-5 py-3.5">Bird Type & Breed</th>
                <th className="px-5 py-3.5">Initial / Live Birds</th>
                <th className="px-5 py-3.5">Mortality Rate</th>
                <th className="px-5 py-3.5">Placement Date</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {poultryBatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No flocks registered. Click "New Batch" to start tracking.
                  </td>
                </tr>
              ) : (
                poultryBatches.map((batch) => {
                  const mortalityTotal = batch.initialBirdCount - batch.currentBirdCount;
                  const mortalityRate = ((mortalityTotal / batch.initialBirdCount) * 100).toFixed(1);

                  return (
                    <tr key={batch.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900 flex items-center space-x-2">
                        <span>🐤</span>
                        <span>{batch.batchCode}</span>
                      </td>
                      <td className="px-5 py-4 capitalize">
                        <span className="font-semibold text-slate-800">{batch.birdType}</span>
                        <div className="text-[11px] text-slate-400">{batch.breedName || 'Commercial'}</div>
                      </td>
                      <td className="px-5 py-4 font-mono">
                        <span className="font-bold text-emerald-800">{batch.currentBirdCount.toLocaleString()}</span>
                        <span className="text-slate-400 text-[11px]"> / {batch.initialBirdCount.toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-rose-600">
                        {mortalityRate}% <span className="text-slate-400 font-normal">({mortalityTotal})</span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {batch.placementDate}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          batch.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(batch)}
                            title="Edit Flock Details"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => handleOpenDelete(batch)}
                            title="Delete Flock Record"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Poultry Batch Modal (PUT) */}
      {showEditBatchModal && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-amber-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pencil className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Edit Flock: {selectedBatch.batchCode}</h3>
              </div>
              <button
                onClick={() => setShowEditBatchModal(false)}
                className="text-amber-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBatch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Batch / Flock Code *</label>
                <input
                  type="text"
                  required
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm uppercase font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bird Type</label>
                  <select
                    value={birdType}
                    onChange={(e) => setBirdType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="broiler">Broiler (گوشت والی مرغی)</option>
                    <option value="layer">Layer (انڈے والی مرغی)</option>
                    <option value="desi_country">Desi / Aseel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Breed Name</label>
                  <input
                    type="text"
                    value={breedName}
                    onChange={(e) => setBreedName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Chicks</label>
                  <input
                    type="number"
                    value={initialBirdCount}
                    onChange={(e) => setInitialBirdCount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Live Birds</label>
                  <input
                    type="number"
                    value={currentBirdCount}
                    onChange={(e) => setCurrentBirdCount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Placement Date</label>
                  <input
                    type="date"
                    value={placementDate}
                    onChange={(e) => setPlacementDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="active">Active (فعال)</option>
                    <option value="harvested">Harvested (فروخت شدہ)</option>
                    <option value="culled">Culled / Closed</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditBatchModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-2.5 px-5 rounded-xl transition shadow"
                >
                  Update Flock (PUT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-rose-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            
            <div>
              <h4 className="font-bold text-lg text-slate-900">Delete Flock Record?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete this record (Flock: <strong>{selectedBatch.batchCode}</strong>)? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedBatch(null);
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-rose-200"
              >
                Confirm Delete (DELETE)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {showAddBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🐣</span>
                <h3 className="font-bold text-base">New Poultry Batch</h3>
              </div>
              <button
                onClick={() => setShowAddBatchModal(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBatch} className="p-6 space-y-4">
              
              {tierLimitError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs">
                  <div className="flex items-center space-x-2 font-bold mb-1">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Free Tier Limit Exceeded</span>
                  </div>
                  <p>{tierLimitError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddBatchModal(false);
                      onOpenUpgrade();
                    }}
                    className="mt-2.5 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl transition"
                  >
                    Upgrade to AgriSaaS Pro
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Batch / Flock Code *</label>
                <input
                  type="text"
                  required
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="e.g. FLOCK-2026-B3"
                  className="w-full px-3 py-2 text-sm uppercase font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bird Type</label>
                  <select
                    value={birdType}
                    onChange={(e) => setBirdType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="broiler">Broiler (گوشت والی مرغی)</option>
                    <option value="layer">Layer (انڈے والی مرغی)</option>
                    <option value="desi_country">Desi / Aseel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Breed Name</label>
                  <input
                    type="text"
                    value={breedName}
                    onChange={(e) => setBreedName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Chicks *</label>
                  <input
                    type="number"
                    required
                    value={initialBirdCount}
                    onChange={(e) => setInitialBirdCount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Placement Date</label>
                  <input
                    type="date"
                    value={placementDate}
                    onChange={(e) => setPlacementDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition"
                >
                  Save Batch (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily Log Modal */}
      {showLogDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-amber-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-base">Record Daily Mortality & Feed</h3>
              </div>
              <button
                onClick={() => setShowLogDailyModal(false)}
                className="text-amber-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogDaily} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold"
                >
                  {poultryBatches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.batchCode} ({b.currentBirdCount} live birds)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dead / Culled (اموات)</label>
                  <input
                    type="number"
                    value={mortalityCount}
                    onChange={(e) => setMortalityCount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-rose-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Feed Consumed (Kg)</label>
                  <input
                    type="number"
                    value={feedConsumedKg}
                    onChange={(e) => setFeedConsumedKg(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sample Avg Weight (Grams)</label>
                <input
                  type="number"
                  value={avgBodyWeightGrams}
                  onChange={(e) => setAvgBodyWeightGrams(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLogDailyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-5 rounded-xl transition"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PoultryModule;
