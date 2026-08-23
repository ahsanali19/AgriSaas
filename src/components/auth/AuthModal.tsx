// src/components/auth/AuthModal.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Phone, Lock, User, Building, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [countryCode, setCountryCode] = useState<'PK' | 'IN'>('PK');
  const [phone, setPhone] = useState('3008472910');
  const [password, setPassword] = useState('kisan123');
  const [fullName, setFullName] = useState('Chaudhry Tariq Mehmood');
  const [farmName, setFarmName] = useState('Al-Madina Agro Farm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fullPhone = `${countryCode === 'PK' ? '+92' : '+91'} ${phone.trim()}`;

    try {
      if (isRegister) {
        await register({
          phoneNumber: fullPhone,
          fullName,
          countryCode,
          farmName
        });
      } else {
        await login(fullPhone, password);
      }
      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-full hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <h2 className="text-xl font-bold">{isRegister ? 'Create AgriSaaS Account' : 'Farmer Sign In'}</h2>
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            {isRegister
              ? 'Join modern livestock & aquaculture farmers across South Asia'
              : 'Access your Dairy, Poultry, Fish & Khata records'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold transition ${
              !isRegister ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mobile Login
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold transition ${
              isRegister ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Farm Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          {/* Country Code Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Country / خطہ</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCountryCode('PK')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition ${
                  countryCode === 'PK' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'
                }`}
              >
                <span>🇵🇰 Pakistan (+92)</span>
              </button>
              <button
                type="button"
                onClick={() => setCountryCode('IN')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition ${
                  countryCode === 'IN' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'
                }`}
              >
                <span>🇮🇳 India (+91)</span>
              </button>
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farmer Full Name / کسان کا نام</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chaudhry Tariq / Ramesh Patel"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name / فارم کا نام</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Madina Cattle & Fish Complex"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number / موبائل نمبر</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="3001234567"
                className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">We verify via SMS OTP during production.</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password / پاس ورڈ</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying...' : isRegister ? 'Register Farm & Start Free' : 'Secure Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Includes free 10-animal, 2-flock, and 2-pond quota.</span>
        </div>

      </div>
    </div>
  );
};
