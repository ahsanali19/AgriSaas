// src/components/dairy/DairyModule.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Milk,
  AlertTriangle,
  Pencil,
  Trash2,
  X,
  ShieldAlert
} from 'lucide-react';
import { DairyAnimal } from '../../types';

interface DairyModuleProps {
  onOpenUpgrade: () => void;
}

export const DairyModule: React.FC<DairyModuleProps> = ({ onOpenUpgrade }) => {
  const {
    dairyAnimals,
    milkLogs,
    addDairyAnimal,
    updateDairyAnimal,
    deleteDairyAnimal,
    addMilkLog,
    quotas
  } = useFarm();
  const { currentPlan } = useAuth();

  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [showEditAnimalModal, setShowEditAnimalModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogMilkModal, setShowLogMilkModal] = useState(false);
  const [tierLimitError, setTierLimitError] = useState<string | null>(null);

  // Selected animal for Edit / Delete
  const [selectedAnimal, setSelectedAnimal] = useState<DairyAnimal | null>(null);

  // Form states for Add / Edit
  const [tagNumber, setTagNumber] = useState('');
  const [nameOrAlias, setNameOrAlias] = useState('');
  const [species, setSpecies] = useState<'cow' | 'buffalo' | 'goat'>('cow');
  const [breed, setBreed] = useState('Sahiwal Pure');
  const [lactationStage, setLactationStage] = useState<'milking' | 'dry' | 'pregnant_milking' | 'heifer' | 'calf'>('milking');
  const [yieldLiters, setYieldLiters] = useState('12.5');

  // Milk log form states
  const [selectedTag, setSelectedTag] = useState(dairyAnimals[0]?.tagNumber || '');
  const [shift, setShift] = useState<'morning' | 'evening'>('morning');
  const [milkYieldLiters, setMilkYieldLiters] = useState('12.5');
  const [fatPercentage, setFatPercentage] = useState('4.5');

  // Open Edit Modal with prefilled row data
  const handleOpenEdit = (animal: DairyAnimal) => {
    setSelectedAnimal(animal);
    setTagNumber(animal.tagNumber);
    setNameOrAlias(animal.nameOrAlias || '');
    setSpecies(animal.species as 'cow' | 'buffalo' | 'goat');
    setBreed(animal.breed || 'Sahiwal Pure');
    setLactationStage(animal.lactationStage);
    setYieldLiters(animal.lastYieldLiters ? String(animal.lastYieldLiters) : '0');
    setShowEditAnimalModal(true);
  };

  // Open Delete confirmation dialog
  const handleOpenDelete = (animal: DairyAnimal) => {
    setSelectedAnimal(animal);
    setShowDeleteDialog(true);
  };

  // Create Animal (POST)
  const handleAddAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    setTierLimitError(null);

    const result = addDairyAnimal({
      tagNumber: tagNumber.trim().toUpperCase(),
      nameOrAlias: nameOrAlias.trim() || undefined,
      species,
      breed,
      gender: 'female',
      lactationStage,
      lastYieldLiters: Number(yieldLiters) || 0,
      status: 'active'
    });

    if (!result.success) {
      setTierLimitError(result.message || 'Limit exceeded');
    } else {
      setShowAddAnimalModal(false);
      setTagNumber('');
      setNameOrAlias('');
    }
  };

  // Update Animal (PUT / PATCH)
  const handleUpdateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal) return;

    try {
      // In full-stack: await fetch(`/api/dairy/animals/${selectedAnimal.id}`, { method: 'PUT', body: JSON.stringify({...}) });
      updateDairyAnimal(selectedAnimal.id, {
        tagNumber: tagNumber.trim().toUpperCase(),
        nameOrAlias: nameOrAlias.trim() || undefined,
        species,
        breed,
        lactationStage,
        lastYieldLiters: Number(yieldLiters) || 0
      });
      setShowEditAnimalModal(false);
      setSelectedAnimal(null);
    } catch (err) {
      console.error('Error updating dairy animal:', err);
    }
  };

  // Confirm Delete Animal (DELETE)
  const handleConfirmDelete = async () => {
    if (!selectedAnimal) return;

    try {
      // In full-stack: await fetch(`/api/dairy/animals/${selectedAnimal.id}`, { method: 'DELETE' });
      deleteDairyAnimal(selectedAnimal.id);
      setShowDeleteDialog(false);
      setSelectedAnimal(null);
    } catch (err) {
      console.error('Error deleting dairy animal:', err);
    }
  };

  const handleLogMilk = (e: React.FormEvent) => {
    e.preventDefault();
    addMilkLog({
      animalTag: selectedTag,
      logDate: new Date().toISOString().split('T')[0],
      shift,
      yieldLiters: Number(milkYieldLiters),
      fatPercentage: Number(fatPercentage)
    });
    setShowLogMilkModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐄</span>
            <h2 className="text-xl font-bold text-slate-900">Dairy & Livestock Herd</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your Cow & Buffalo herd, individual ear-tags, daily shift yields, and breeding cycles.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowLogMilkModal(true)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-blue-200 transition flex items-center space-x-1.5"
          >
            <Milk className="w-4 h-4" />
            <span>Log Milk Shift</span>
          </button>

          <button
            onClick={() => {
              setTierLimitError(null);
              setTagNumber('');
              setNameOrAlias('');
              setYieldLiters('12.5');
              setShowAddAnimalModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Animal ({quotas.dairy.current}/{quotas.dairy.max === -1 ? '∞' : quotas.dairy.max})</span>
          </button>
        </div>
      </div>

      {/* Tier Quota Notification if Free Tier is nearing limit */}
      {currentPlan.maxDairyAnimals !== -1 && quotas.dairy.current >= quotas.dairy.max && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>You have reached the 10-animal cap on the Free Kisan Tier. Upgrade to Pro for unlimited livestock records.</span>
          </div>
          <button
            onClick={onOpenUpgrade}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex-shrink-0 transition shadow-sm"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Animals Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            Registered Cattle Herd ({dairyAnimals.length} Records)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Ear-Tag Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Ear-Tag #</th>
                <th className="px-5 py-3.5">Name / Alias</th>
                <th className="px-5 py-3.5">Species & Breed</th>
                <th className="px-5 py-3.5">Lactation Stage</th>
                <th className="px-5 py-3.5">Last Yield</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {dairyAnimals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No animals registered yet. Click "Add Animal" above.
                  </td>
                </tr>
              ) : (
                dairyAnimals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">
                      {animal.tagNumber}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {animal.nameOrAlias || '—'}
                    </td>
                    <td className="px-5 py-4 capitalize">
                      <span className="mr-1">{animal.species === 'cow' ? '🐄' : animal.species === 'buffalo' ? '🐃' : '🐐'}</span>
                      <span className="font-medium">{animal.species}</span> ({animal.breed || 'Local'})
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        animal.lactationStage === 'milking'
                          ? 'bg-emerald-100 text-emerald-800'
                          : animal.lactationStage === 'pregnant_milking'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {animal.lactationStage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">
                      {animal.lastYieldLiters ? `${animal.lastYieldLiters} L/day` : '0 L (Dry)'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {animal.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(animal)}
                          title="Edit Animal Record"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDelete(animal)}
                          title="Delete Animal Record"
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

      {/* Edit Animal Modal (PUT) */}
      {showEditAnimalModal && selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pencil className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">Edit Livestock: {selectedAnimal.tagNumber}</h3>
              </div>
              <button
                onClick={() => setShowEditAnimalModal(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAnimal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ear-Tag # / شناختی ٹیگ نمبر *</label>
                <input
                  type="text"
                  required
                  value={tagNumber}
                  onChange={(e) => setTagNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm uppercase font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Animal Alias / نام</label>
                <input
                  type="text"
                  value={nameOrAlias}
                  onChange={(e) => setNameOrAlias(e.target.value)}
                  placeholder="e.g. Rani / Moti"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="cow">Cow (گائے)</option>
                    <option value="buffalo">Buffalo (بھینس)</option>
                    <option value="goat">Goat (بکری)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Breed</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lactation Stage</label>
                  <select
                    value={lactationStage}
                    onChange={(e) => setLactationStage(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="milking">Milking (دودھ دینے والی)</option>
                    <option value="pregnant_milking">Pregnant & Milking</option>
                    <option value="dry">Dry (خشک)</option>
                    <option value="heifer">Heifer (وچھی)</option>
                    <option value="calf">Calf (بچھڑا/بچھڑی)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Yield (Liters)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={yieldLiters}
                    onChange={(e) => setYieldLiters(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditAnimalModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-xl transition shadow"
                >
                  Update Animal (PUT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-rose-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>
            
            <div>
              <h4 className="font-bold text-lg text-slate-900">Delete Animal Record?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete this record (Tag: <strong>{selectedAnimal.tagNumber}</strong>)? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedAnimal(null);
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

      {/* Add Animal Modal */}
      {showAddAnimalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🐄</span>
                <h3 className="font-bold text-base">Register New Dairy Animal</h3>
              </div>
              <button
                onClick={() => setShowAddAnimalModal(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAnimal} className="p-6 space-y-4">
              
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
                      setShowAddAnimalModal(false);
                      onOpenUpgrade();
                    }}
                    className="mt-2.5 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl transition"
                  >
                    Upgrade to AgriSaaS Pro
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ear-Tag # / شناختی ٹیگ نمبر *</label>
                <input
                  type="text"
                  required
                  value={tagNumber}
                  onChange={(e) => setTagNumber(e.target.value)}
                  placeholder="e.g. PK-SAH-06"
                  className="w-full px-3 py-2 text-sm uppercase font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Animal Alias / نام</label>
                <input
                  type="text"
                  value={nameOrAlias}
                  onChange={(e) => setNameOrAlias(e.target.value)}
                  placeholder="e.g. Rani / Moti"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="cow">Cow (گائے)</option>
                    <option value="buffalo">Buffalo (بھینس)</option>
                    <option value="goat">Goat (بکری)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Breed</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="e.g. Sahiwal / Nili-Ravi"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lactation Stage</label>
                <select
                  value={lactationStage}
                  onChange={(e) => setLactationStage(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="milking">Milking (دودھ دینے والی)</option>
                  <option value="pregnant_milking">Pregnant & Milking</option>
                  <option value="dry">Dry (خشک)</option>
                  <option value="heifer">Heifer (وچھی)</option>
                  <option value="calf">Calf (بچھڑا/بچھڑی)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddAnimalModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition"
                >
                  Save Animal (POST)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Milk Modal */}
      {showLogMilkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-blue-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Milk className="w-5 h-5" />
                <h3 className="font-bold text-base">Record Shift Milk Yield</h3>
              </div>
              <button
                onClick={() => setShowLogMilkModal(false)}
                className="text-blue-200 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogMilk} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Animal Ear-Tag</label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold"
                >
                  {dairyAnimals.map(a => (
                    <option key={a.id} value={a.tagNumber}>
                      {a.tagNumber} ({a.nameOrAlias || a.species}) - {a.lactationStage}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Milking Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="morning">Morning (صبح)</option>
                    <option value="evening">Evening (شام)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Yield (Litres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={milkYieldLiters}
                    onChange={(e) => setMilkYieldLiters(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fat Percentage (%) - Optional</label>
                <input
                  type="number"
                  step="0.1"
                  value={fatPercentage}
                  onChange={(e) => setFatPercentage(e.target.value)}
                  placeholder="e.g. 4.5% or 6.8%"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLogMilkModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition"
                >
                  Log Milk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DairyModule;
