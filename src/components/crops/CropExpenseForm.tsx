// src/components/crops/CropExpenseForm.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { X, Receipt, DollarSign, Sprout, Calendar, FileText } from 'lucide-react';
import { CropExpenseCategory } from '../../types';
import { VoiceInput } from '../common/VoiceInput';

interface CropExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCropId?: number;
}

export const CropExpenseForm: React.FC<CropExpenseFormProps> = ({
  isOpen,
  onClose,
  defaultCropId
}) => {
  const { crops, addCropExpense, farm } = useFarm();

  const [cropId, setCropId] = useState<number>(defaultCropId || crops[0]?.id || 1);
  const [category, setCategory] = useState<CropExpenseCategory>('Fertilizer');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const selectedCrop = crops.find(c => c.id === Number(cropId));

    addCropExpense({
      cropId: Number(cropId),
      cropName: selectedCrop ? selectedCrop.cropName : 'Crop',
      category,
      amount: Number(amount),
      date,
      description: description.trim() || `${category} input application`
    });

    onClose();
    setAmount('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Record Crop Stage Expense</h3>
              <p className="text-[11px] text-emerald-200">Auto-syncs with Farm Master Ledger & Khata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Select Active Crop / فصل *</span>
            </label>
            <select
              value={cropId}
              onChange={(e) => setCropId(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
            >
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.cropName} ({crop.landAreaAcres} Acres - {crop.status})
                </option>
              ))}
            </select>
          </div>

          {/* Expense Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expense Stage / Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CropExpenseCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              >
                <option value="Seed">🌱 Seed (بیج)</option>
                <option value="Fertilizer">🧪 Fertilizer / DAP / Urea (کھاد)</option>
                <option value="Pesticide">🐛 Pesticide / Spray (سپرے)</option>
                <option value="Tractor">🚜 Tractor / Tillage (ٹریکٹر/گوڈی)</option>
                <option value="Labor">👨‍🌾 Labor & Weeding (مزدوری)</option>
                <option value="Irrigation">💧 Tube-well / Canal (پانی/ڈیزل)</option>
                <option value="Other">📦 Other Inputs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Expense Date *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Amount Spent ({farm.currency || 'PKR'}) *</span>
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 35000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-3 pr-16 py-2.5 text-base font-bold font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 font-mono">
                {farm.currency || 'PKR'}
              </span>
            </div>
          </div>

          {/* Description with Voice Input */}
          <VoiceInput
            id="crop-expense-description"
            label="Item / Brand / Vendor Notes (Speak or Type)"
            labelIcon={<FileText className="w-3.5 h-3.5" />}
            placeholder="e.g. 5 Bags Engro DAP, Ch. Sons Agri Store or speak in Urdu/English"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            hint="💡 Click the microphone icon to speak expense notes directly in Urdu, English or Hindi."
          />

          {/* Sync notification pill */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center space-x-2">
            <span className="text-base">⚡</span>
            <span>Submitting will automatically log a debit entry in the Khata Master Ledger.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md shadow-emerald-700/20"
            >
              Record Expense (POST)
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CropExpenseForm;
