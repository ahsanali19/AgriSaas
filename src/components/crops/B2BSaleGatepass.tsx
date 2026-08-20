// src/components/crops/B2BSaleGatepass.tsx
import React, { useState, useMemo } from 'react';
import { useFarm } from '../../context/FarmContext';
import { X, Truck, Scale, Building, Calculator, CheckCircle2, FileText } from 'lucide-react';

interface B2BSaleGatepassProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCropId?: number;
}

export const B2BSaleGatepass: React.FC<B2BSaleGatepassProps> = ({
  isOpen,
  onClose,
  defaultCropId
}) => {
  const { crops, processB2BSale, farm } = useFarm();

  const [cropId, setCropId] = useState<number>(defaultCropId || crops[0]?.id || 1);
  const [buyerName, setBuyerName] = useState('Shakarganj Sugar Mills Ltd.');
  const [buyerType, setBuyerType] = useState<'sugar_mill' | 'commission_agent' | 'wholesaler' | 'exporter' | 'feed_mill'>('sugar_mill');
  const [vehicleNumber, setVehicleNumber] = useState('TRK-8924 (10-Wheeler)');
  const [vehicleWeightSlip, setVehicleWeightSlip] = useState(`MILL-KP-${Math.floor(10000 + Math.random() * 90000)}`);
  
  // Weight & Measurement
  const [weightPricingMode, setWeightPricingMode] = useState<'per_maund' | 'per_kg'>('per_maund'); // Maund = 40kg
  const [grossWeightKg, setGrossWeightKg] = useState('32000');
  const [tareWeightKg, setTareWeightKg] = useState('10000');
  const [netWeightKg, setNetWeightKg] = useState('22000');
  const [ratePerUnit, setRatePerUnit] = useState('450'); // Rs. 450 per 40kg (Maund) or Rs. 80/kg
  
  // Deductions
  const [commissionDeduction, setCommissionDeduction] = useState('4500'); // Arhat, Market cess, Labor
  const [taxDeduction, setTaxDeduction] = useState('2200');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'partially_paid'>('paid');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle Gross - Tare calculation
  const handleGrossChange = (val: string) => {
    setGrossWeightKg(val);
    const g = Number(val) || 0;
    const t = Number(tareWeightKg) || 0;
    if (g > t) {
      setNetWeightKg(String(g - t));
    }
  };

  const handleTareChange = (val: string) => {
    setTareWeightKg(val);
    const g = Number(grossWeightKg) || 0;
    const t = Number(val) || 0;
    if (g > t) {
      setNetWeightKg(String(g - t));
    }
  };

  // Compute Financials
  const { grossAmount, netPayable, totalMaunds } = useMemo(() => {
    const weight = Number(netWeightKg) || 0;
    const rate = Number(ratePerUnit) || 0;
    const comm = Number(commissionDeduction) || 0;
    const tax = Number(taxDeduction) || 0;

    let gross = 0;
    const maunds = weight / 40;

    if (weightPricingMode === 'per_maund') {
      gross = maunds * rate;
    } else {
      gross = weight * rate;
    }

    const net = Math.max(0, gross - comm - tax);

    return {
      grossAmount: Math.round(gross),
      netPayable: Math.round(net),
      totalMaunds: maunds.toFixed(1)
    };
  }, [netWeightKg, ratePerUnit, weightPricingMode, commissionDeduction, taxDeduction]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!netWeightKg || Number(netWeightKg) <= 0 || !buyerName.trim()) return;

    const selectedCrop = crops.find(c => c.id === Number(cropId));

    processB2BSale({
      cropId: Number(cropId),
      cropName: selectedCrop ? selectedCrop.cropName : 'Crop',
      buyerName: buyerName.trim(),
      buyerType,
      vehicleNumber: vehicleNumber.trim(),
      vehicleWeightSlip: vehicleWeightSlip.trim(),
      grossWeightKg: Number(grossWeightKg) || undefined,
      tareWeightKg: Number(tareWeightKg) || undefined,
      totalWeight: Number(netWeightKg),
      weightUnit: 'kg',
      ratePerUnit: Number(ratePerUnit),
      grossAmount,
      commissionDeduction: Number(commissionDeduction) || 0,
      taxDeduction: Number(taxDeduction) || 0,
      netPayable,
      paymentStatus,
      saleDate
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-indigo-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">B2B Crop Sale & Gatepass Slip</h3>
              <p className="text-[11px] text-indigo-200">Sugar Mill Delivery • Mandi Commission Agent • Grain Terminal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Crop & Buyer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Crop Lot *</label>
              <select
                value={cropId}
                onChange={(e) => setCropId(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
              >
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.cropName} ({crop.landAreaAcres} Acres)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Buyer Enterprise Type</label>
              <select
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="sugar_mill">🏭 Sugar Mill (شوگر مل)</option>
                <option value="commission_agent">🤝 Commission Agent / Arthi (آڑھتی)</option>
                <option value="wholesaler">🏪 Wholesaler / Trader (غلہ منڈی)</option>
                <option value="feed_mill">🌾 Poultry/Animal Feed Mill</option>
                <option value="exporter">🚢 Exporter / Processor</option>
              </select>
            </div>
          </div>

          {/* Buyer Name & Gatepass Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                <span>Buyer / Mill / Mandi Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shakarganj Sugar Mills / Ch. Aslam Arthi"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Kanda Weight Slip # / پرچی نمبر *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MILL-KANDA-9402"
                value={vehicleWeightSlip}
                onChange={(e) => setVehicleWeightSlip(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold uppercase border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-indigo-900"
              />
            </div>
          </div>

          {/* Vehicle & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Vehicle / Trolley Number</span>
              </label>
              <input
                type="text"
                placeholder="e.g. LES-4920 / Trolley #4"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sale & Dispatch Date</label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Electronic Scale (Kanda) Weights */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Electronic Weighbridge (کانٹا) Measurements</span>
              </div>
              <div className="flex items-center space-x-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setWeightPricingMode('per_maund')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition ${
                    weightPricingMode === 'per_maund'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Per Maund (40 Kg)
                </button>
                <button
                  type="button"
                  onClick={() => setWeightPricingMode('per_kg')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition ${
                    weightPricingMode === 'per_kg'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Per Kg
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Gross (گاڑی + مال)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={grossWeightKg}
                    onChange={(e) => handleGrossChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-slate-400">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tare (خالی گاڑی)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={tareWeightKg}
                    onChange={(e) => handleTareChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-slate-400">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-800 mb-1">Net Weight (صافی)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={netWeightKg}
                    onChange={(e) => setNetWeightKg(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-black border-2 border-emerald-500 bg-emerald-50/50 rounded-lg text-emerald-900 focus:outline-none"
                  />
                  <span className="absolute right-2 top-1.5 text-[10px] font-bold text-emerald-700">kg</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>Total Maunds (من): <strong>{totalMaunds} Maunds</strong></span>
              <span>Metric Tons: <strong>{(Number(netWeightKg) / 1000).toFixed(2)} MT</strong></span>
            </div>
          </div>

          {/* Pricing & Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rate ({weightPricingMode === 'per_maund' ? 'Rs. / 40kg' : 'Rs. / kg'}) *
              </label>
              <input
                type="number"
                required
                value={ratePerUnit}
                onChange={(e) => setRatePerUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Commission / Arhat (₨)
              </label>
              <input
                type="number"
                value={commissionDeduction}
                onChange={(e) => setCommissionDeduction(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-rose-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tax / Cess / Deductions (₨)
              </label>
              <input
                type="number"
                value={taxDeduction}
                onChange={(e) => setTaxDeduction(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-rose-600"
              />
            </div>
          </div>

          {/* Live Net Computation Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-inner flex items-center justify-between">
            <div>
              <div className="text-[11px] text-emerald-200 font-medium">Gross: Rs. {grossAmount.toLocaleString()}</div>
              <div className="text-xl font-extrabold font-mono tracking-tight text-white">
                Net Payable: Rs. {netPayable.toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <label className="block text-[10px] text-emerald-200 mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="bg-emerald-800 text-white text-xs font-bold px-2 py-1 rounded-lg border border-emerald-600 focus:outline-none"
              >
                <option value="paid">✅ Paid (وصول شدہ)</option>
                <option value="pending">⏳ Pending (بقایا)</option>
                <option value="partially_paid">🌗 Partial</option>
              </select>
            </div>
          </div>

          {/* Sync Notice */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>This transaction will auto-credit <strong>Rs. {netPayable.toLocaleString()}</strong> to the Master Khata Ledger and adjust warehouse inventory.</span>
          </div>

          {/* Submit Actions */}
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Issue Gatepass & Post to Khata</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default B2BSaleGatepass;
