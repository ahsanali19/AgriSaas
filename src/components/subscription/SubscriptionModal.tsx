// src/components/subscription/SubscriptionModal.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { X, Check, Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { currentPlan, upgradePlan } = useAuth();
  const { farm } = useFarm();
  const [selectedPlan, setSelectedPlan] = useState<'PRO_MONTHLY' | 'PRO_YEARLY'>('PRO_MONTHLY');
  const [paymentGateway, setPaymentGateway] = useState<'jazzcash' | 'easypaisa' | 'upi' | 'bank'>('jazzcash');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  const handleUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradePlan(selectedPlan);
      setIsProcessing(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-200 hover:text-white p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-amber-200" />
            <h2 className="text-xl font-bold">GDS Pro Subscription</h2>
          </div>
          <p className="text-xs text-amber-100 mt-1">
            Remove all animal and flock limits, unlock PDF financial reports, and multi-user worker access.
          </p>
        </div>

        {/* Plans Compare */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Free Tier */}
            <div className={`p-5 rounded-2xl border-2 transition ${
              currentPlan.code === 'FREE' ? 'border-slate-300 bg-slate-50' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-800">Free Kisan Plan</h3>
                {currentPlan.code === 'FREE' && (
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">Current</span>
                )}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {symbol} 0 <span className="text-xs font-normal text-slate-500">/ forever</span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Up to 10 Dairy Animals</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Up to 2 Poultry Flocks</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Up to 2 Fish Ponds</span>
                </li>
                <li className="flex items-center space-x-1.5 text-slate-400">
                  <X className="w-4 h-4 text-slate-300" />
                  <span>Standard Cashbook only</span>
                </li>
              </ul>
            </div>

            {/* Pro Tier */}
            <div className={`p-5 rounded-2xl border-2 transition relative ${
              selectedPlan === 'PRO_MONTHLY' ? 'border-amber-500 bg-amber-50/50 shadow-md' : 'border-slate-200'
            }`}>
              <div className="absolute -top-2.5 right-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                Recommended
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">GDS Pro</h3>
              </div>
              <div className="text-2xl font-black text-amber-900 mt-2">
                {symbol} {farm.currency === 'INR' ? '499' : '1,499'} <span className="text-xs font-normal text-slate-500">/ month</span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">Unlimited Dairy Animals</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">Unlimited Poultry Flocks</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">Unlimited Fish Ponds</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>PDF Export & Khata Auditing</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Regional Payment Option
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentGateway('jazzcash')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition ${
                  paymentGateway === 'jazzcash' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-700'
                }`}
              >
                <span>🔴 JazzCash</span>
                <span className="text-[10px] font-normal text-slate-500 mt-0.5">Mobile Account</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentGateway('easypaisa')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition ${
                  paymentGateway === 'easypaisa' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-700'
                }`}
              >
                <span>🟢 EasyPaisa</span>
                <span className="text-[10px] font-normal text-slate-500 mt-0.5">Instant Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentGateway('upi')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition ${
                  paymentGateway === 'upi' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-700'
                }`}
              >
                <span>🇮🇳 UPI / GPay</span>
                <span className="text-[10px] font-normal text-slate-500 mt-0.5">Direct Bank VPA</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentGateway('bank')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition ${
                  paymentGateway === 'bank' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-700'
                }`}
              >
                <span>🏦 Bank Transfer</span>
                <span className="text-[10px] font-normal text-slate-500 mt-0.5">IBAN / RTGS</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Close
            </button>
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <span>{isProcessing ? 'Activating Pro...' : `Upgrade to Pro (${symbol} ${farm.currency === 'INR' ? '499' : '1,499'})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
