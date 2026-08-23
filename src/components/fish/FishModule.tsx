// src/components/fish/FishModule.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Fish,
  AlertTriangle,
  ShieldAlert,
  X,
  Pencil,
  Trash2,
  Activity,
  Waves
} from 'lucide-react';
import { FishPond } from '../../types';

interface FishModuleProps {
  onOpenUpgrade: () => void;
}

export const FishModule: React.FC<FishModuleProps> = ({ onOpenUpgrade }) => {
  const {
    fishPonds,
    fishLogs,
    addFishPond,
    updateFishPond,
    deleteFishPond,
    addFishLog,
    quotas
  } = useFarm();
  const { currentPlan } = useAuth();

  const [showAddPondModal, setShowAddPondModal] = useState(false);
  const [showEditPondModal, setShowEditPondModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSamplingModal, setShowSamplingModal] = useState(false);
  const [tierLimitError, setTierLimitError] = useState<string | null>(null);

  // Selected pond for edit / delete
  const [selectedPond, setSelectedPond] = useState<FishPond | null>(null);

  // Form states
  const [pondName, setPondName] = useState('');
  const [area, setArea] = useState('2.5');
  const [areaUnit, setAreaUnit] = useState<'acres' | 'sqft' | 'marla'>('acres');
  const [waterSource, setWaterSource] = useState('Solar Tube-well');
  const [averageDepthFeet, setAverageDepthFeet] = useState('5.5');
  const [status, setStatus] = useState<'active' | 'fallow_drying' | 'maintenance'>('active');

  // Sampling form states
  const [selectedPondId, setSelectedPondId] = useState<number>(fishPonds[0]?.id || 1);
  const [avgWeightGrams, setAvgWeightGrams] = useState('750');
  const [waterPh, setWaterPh] = useState('7.5');
  const [dissolvedOxygenPpm, setDissolvedOxygenPpm] = useState('5.4');

  // Open Edit Modal
  const handleOpenEdit = (pond: FishPond) => {
    setSelectedPond(pond);
    setPondName(pond.pondNameOrNumber);
    setArea(String(pond.areaSqftOrAcres));
    setAreaUnit(pond.areaUnit as any);
    setWaterSource(pond.waterSource || 'Canal Source');
    setAverageDepthFeet(String(pond.averageDepthFeet || 5.0));
    setStatus(pond.status);
    setShowEditPondModal(true);
  };

  // Open Delete Dialog
  const handleOpenDelete = (pond: FishPond) => {
    setSelectedPond(pond);
    setShowDeleteDialog(true);
  };

  // Add Pond (POST)
  const handleAddPond = (e: React.FormEvent) => {
    e.preventDefault();
    setTierLimitError(null);

    const result = addFishPond({
      pondNameOrNumber: pondName.trim(),
      areaSqftOrAcres: Number(area),
      areaUnit,
      waterSource,
      averageDepthFeet: Number(averageDepthFeet),
      status: 'active'
    });

    if (!result.success) {
      setTierLimitError(result.message || 'Limit exceeded');
    } else {
      setShowAddPondModal(false);
      setPondName('');
    }
  };

  // Update Pond (PUT / PATCH)
  const handleUpdatePond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPond) return;

    try {
      // In full-stack: await fetch(`/api/fish/ponds/${selectedPond.id}`, { method: 'PUT', body: JSON.stringify({...}) });
      updateFishPond(selectedPond.id, {
        pondNameOrNumber: pondName.trim(),
        areaSqftOrAcres: Number(area),
        areaUnit,
        waterSource,
        averageDepthFeet: Number(averageDepthFeet),
        status
      });
      setShowEditPondModal(false);
      setSelectedPond(null);
    } catch (err) {
      console.error('Error updating fish pond:', err);
    }
  };

  // Delete Pond (DELETE)
  const handleConfirmDelete = async () => {
    if (!selectedPond) return;

    try {
      // In full-stack: await fetch(`/api/fish/ponds/${selectedPond.id}`, { method: 'DELETE' });
      deleteFishPond(selectedPond.id);
      setShowDeleteDialog(false);
      setSelectedPond(null);
    } catch (err) {
      console.error('Error deleting fish pond:', err);
    }
  };

  const handleSampling = (e: React.FormEvent) => {
    e.preventDefault();
    addFishLog({
      pondId: Number(selectedPondId),
      sampleDate: new Date().toISOString().split('T')[0],
      speciesName: 'Rohu / Catla',
      avgWeightGrams: Number(avgWeightGrams),
      dailyFeedAmountKg: 40,
      waterPh: Number(waterPh),
      dissolvedOxygenPpm: Number(dissolvedOxygenPpm),
      mortalityObserved: 0
    });
    setShowSamplingModal(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Module Header (Compact Modern Bar) */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center text-lg shrink-0 border border-cyan-100">
            🐟
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">Fish Aquaculture & Ponds</h2>
            <p className="text-xs text-slate-500 truncate">
              Seed stocking densities, water pH/DO sampling, and feed tracking
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setShowSamplingModal(true)}
            className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs px-3 py-2 rounded-xl border border-cyan-200 transition flex items-center space-x-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Sample Pond</span>
          </button>

          <button
            onClick={() => {
              setTierLimitError(null);
              setPondName(`Pond ${fishPonds.length + 1} (East Lake)`);
              setShowAddPondModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Pond</span>
          </button>
        </div>
      </div>

      {/* Quota warning */}
      {currentPlan.maxFishPonds !== -1 && quotas.fish.current >= quotas.fish.max && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Free Tier allows up to 2 active fish ponds. Upgrade to Pro for unlimited aquaculture lakes.</span>
          </div>
          <button
            onClick={onOpenUpgrade}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex-shrink-0 transition shadow-sm"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Ponds Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            Active Aquaculture Ponds ({fishPonds.length} Ponds)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Pond Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Pond Identity</th>
                <th className="px-5 py-3.5">Surface Area</th>
                <th className="px-5 py-3.5">Avg Depth</th>
                <th className="px-5 py-3.5">Water Source</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {fishPonds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No ponds registered. Click "New Pond" to start aquaculture tracking.
                  </td>
                </tr>
              ) : (
                fishPonds.map((pond) => (
                  <tr key={pond.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-bold text-slate-900 flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-sm">
                        🌊
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{pond.pondNameOrNumber}</div>
                        <div className="text-[11px] text-slate-400">Rohu, Catla & Tilapia</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-slate-800">
                      {pond.areaSqftOrAcres} {pond.areaUnit}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-600">
                      {pond.averageDepthFeet || 5.0} ft
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {pond.waterSource || 'Canal Source'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        pond.status === 'active'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pond.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(pond)}
                          title="Edit Pond Details"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDelete(pond)}
                          title="Delete Pond Record"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Pond Modal (PUT) */}
      {showEditPondModal && selectedPond && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-cyan-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pencil className="w-5 h-5 text-cyan-300" />
                <h3 className="font-bold text-base">Edit Pond: {selectedPond.pondNameOrNumber}</h3>
              </div>
              <button
                onClick={() => setShowEditPondModal(false)}
                className="text-cyan-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePond} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pond Name / Number *</label>
                <input
                  type="text"
                  required
                  value={pondName}
                  onChange={(e) => setPondName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area</label>
                  <input
                    type="number"
                    step="0.1"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="acres">Acres (ایکڑ)</option>
                    <option value="marla">Marla (مرلہ)</option>
                    <option value="sqft">Sq. Ft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Average Depth (Feet)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={averageDepthFeet}
                    onChange={(e) => setAverageDepthFeet(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="active">Active (فعال)</option>
                    <option value="fallow_drying">Fallow / Drying (خشک)</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Water Source</label>
                <input
                  type="text"
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditPondModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2.5 px-5 rounded-xl transition shadow"
                >
                  Update Pond (PUT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedPond && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-rose-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            
            <div>
              <h4 className="font-bold text-lg text-slate-900">Delete Pond Record?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete this record (Pond: <strong>{selectedPond.pondNameOrNumber}</strong>)? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedPond(null);
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

      {/* Add Pond Modal */}
      {showAddPondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🌊</span>
                <h3 className="font-bold text-base">New Aquaculture Pond</h3>
              </div>
              <button
                onClick={() => setShowAddPondModal(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPond} className="p-6 space-y-4">
              
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
                      setShowAddPondModal(false);
                      onOpenUpgrade();
                    }}
                    className="mt-2.5 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl transition"
                  >
                    Upgrade to GDS Pro
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pond Name / Number *</label>
                <input
                  type="text"
                  required
                  value={pondName}
                  onChange={(e) => setPondName(e.target.value)}
                  placeholder="e.g. Pond 3 (South Lake)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="acres">Acres (ایکڑ)</option>
                    <option value="marla">Marla (مرلہ)</option>
                    <option value="sqft">Sq. Ft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Water Source</label>
                <input
                  type="text"
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  placeholder="e.g. Solar Tube-well / Canal"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddPondModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition"
                >
                  Save Pond (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sampling Modal */}
      {showSamplingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-cyan-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <h3 className="font-bold text-base">Record Water & Weight Sample</h3>
              </div>
              <button
                onClick={() => setShowSamplingModal(false)}
                className="text-cyan-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSampling} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Pond</label>
                <select
                  value={selectedPondId}
                  onChange={(e) => setSelectedPondId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold"
                >
                  {fishPonds.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.pondNameOrNumber} ({p.areaSqftOrAcres} {p.areaUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Avg Weight (g)</label>
                  <input
                    type="number"
                    value={avgWeightGrams}
                    onChange={(e) => setAvgWeightGrams(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={waterPh}
                    onChange={(e) => setWaterPh(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DO (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dissolvedOxygenPpm}
                    onChange={(e) => setDissolvedOxygenPpm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSamplingModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-5 rounded-xl transition"
                >
                  Save Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FishModule;
