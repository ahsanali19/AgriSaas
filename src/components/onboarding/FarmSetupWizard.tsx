// src/components/onboarding/FarmSetupWizard.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { FarmType } from '../../types';
import { X, Check, ArrowRight, Milk, Bird, Fish, Sparkles, MapPin } from 'lucide-react';

interface FarmSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmSetupWizard: React.FC<FarmSetupWizardProps> = ({ isOpen, onClose }) => {
  const { farm, setFarm } = useFarm();
  const [farmName, setFarmName] = useState(farm.name);
  const [selectedType, setSelectedType] = useState<FarmType>(farm.farmType);
  const [district, setDistrict] = useState(farm.locationDistrict || 'Sahiwal, Punjab');
  const [areaAcres, setAreaAcres] = useState(farm.totalAreaAcres || 25);
  const [currency, setCurrency] = useState<'PKR' | 'INR'>(farm.currency);

  if (!isOpen) return null;

  const farmTypes: { type: FarmType; title: string; subtitle: string; icon: string; benefits: string[] }[] = [
    {
      type: 'mixed',
      title: 'Mixed Enterprise Farm',
      subtitle: 'Combined Dairy, Poultry, and Aquaculture in one integrated farm setup.',
      icon: '🌾',
      benefits: ['Consolidated Master Khata', 'Multi-enterprise yield analytics', 'Cross-enterprise fodder/manure flow']
    },
    {
      type: 'dairy',
      title: 'Dairy & Livestock Herd',
      subtitle: 'Focused purely on Cow, Buffalo, and Goat milk yield and breeding.',
      icon: '🐄',
      benefits: ['Ear-tag ID registry', 'Shift-based milk log & fat %', 'Calving & vaccination reminders']
    },
    {
      type: 'poultry',
      title: 'Poultry Farm (Broiler & Layer)',
      subtitle: 'Flock batch management, daily mortality, FCR feed, and egg production.',
      icon: '🐔',
      benefits: ['Batch performance tracking', 'Daily mortality & FCR math', 'Egg grading and bird sales']
    },
    {
      type: 'fish',
      title: 'Aquaculture Fish Ponds',
      subtitle: 'Commercial pond stocking, water quality sampling, and feed management.',
      icon: '🐟',
      benefits: ['Pond-wise seed stocking', 'Weight sampling growth curves', 'DO & pH water monitoring']
    }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFarm({
      ...farm,
      name: farmName,
      farmType: selectedType,
      locationDistrict: district,
      totalAreaAcres: Number(areaAcres),
      currency
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-full hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🚜</span>
            <h2 className="text-xl font-bold">Farm Enterprise Setup Wizard</h2>
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            Configure your enterprise operations and regional agricultural preferences.
          </p>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto">
          
          {/* Farm Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name</label>
              <input
                type="text"
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="e.g. Al-Rehman Cattle & Poultry"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location / District</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Faisalabad / Karnal / Gujranwala"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Farm Area (Acres / ایکڑ)</label>
              <input
                type="number"
                value={areaAcres}
                onChange={(e) => setAreaAcres(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Accounting Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'PKR' | 'INR')}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="PKR">PKR (Pakistani Rupee - ₨)</option>
                <option value="INR">INR (Indian Rupee - ₹)</option>
              </select>
            </div>
          </div>

          {/* Select Farm Enterprise Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Primary Enterprise Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {farmTypes.map((ft) => {
                const isSelected = selectedType === ft.type;
                return (
                  <div
                    key={ft.type}
                    onClick={() => setSelectedType(ft.type)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{ft.icon}</span>
                      <h4 className="font-bold text-sm text-slate-800">{ft.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ft.subtitle}</p>
                    <ul className="mt-2 space-y-1">
                      {ft.benefits.map((b, i) => (
                        <li key={i} className="text-[11px] text-emerald-800 flex items-center space-x-1">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <span>Save & Apply Settings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
