// src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types';
import { Sparkles, Globe, LogOut, ChevronDown, Check, ShieldCheck, ShieldAlert, Tractor } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenUpgrade: () => void;
  onOpenSetup: () => void;
  onSwitchToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenUpgrade, onOpenSetup, onSwitchToAdmin }) => {
  const { user, currentPlan, logout, isAuthenticated, isSuperAdmin, loginAsAdmin } = useAuth();
  const { farm, updateFarmType } = useFarm();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const farmTypeLabels = {
    mixed: '🌾 Mixed Enterprise',
    dairy: '🐄 Dairy Only',
    poultry: '🐔 Poultry Only',
    fish: '🐟 Fish Aquaculture'
  };

  return (
    <header className="sticky top-0 z-30 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand & Farm Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onOpenSetup}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-inner text-white font-black text-xl">
              🌾
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight">{t('appName')}</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-300 border border-emerald-700">
                  {farm.currency}
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block truncate max-w-[200px]">
                {farm.name}
              </p>
            </div>
          </div>

          {/* Farm Type Selector */}
          <div className="relative ml-2 hidden md:block">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="flex items-center space-x-1 text-xs bg-emerald-800/80 hover:bg-emerald-800 px-2.5 py-1.5 rounded-lg border border-emerald-700 transition"
            >
              <span>{farmTypeLabels[farm.farmType]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {showTypeMenu && (
              <div className="absolute left-0 mt-1 w-44 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                {(['mixed', 'dairy', 'poultry', 'fish'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      updateFarmType(type);
                      setShowTypeMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                      farm.farmType === type ? 'font-bold text-emerald-700 bg-emerald-50/60' : ''
                    }`}
                  >
                    <span>{farmTypeLabels[type]}</span>
                    {farm.farmType === type && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Super Admin Switcher Pill */}
          <button
            onClick={() => {
              if (onSwitchToAdmin) {
                loginAsAdmin();
                onSwitchToAdmin();
              }
            }}
            className="hidden sm:flex items-center space-x-1.5 bg-slate-900/90 hover:bg-slate-950 text-indigo-200 hover:text-white border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Super Admin</span>
          </button>

          {/* Subscription Tier Badge */}
          {currentPlan.code === 'FREE' ? (
            <button
              onClick={onOpenUpgrade}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition transform active:scale-95 animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t('freeTier')}</span>
              <span className="bg-amber-800/60 text-[10px] px-1.5 py-0.5 rounded font-normal">
                {t('upgradeToPro')}
              </span>
            </button>
          ) : (
            <div className="flex items-center space-x-1 bg-emerald-800 text-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pro Plan Active</span>
            </div>
          )}

          {/* Language Switcher (EN / UR / HI) */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs px-2.5 py-1.5 rounded-lg transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase font-semibold">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs font-medium">
                <button
                  onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between"
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                <button
                  onClick={() => { setLanguage('ur'); setShowLangMenu(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between"
                >
                  <span className="font-urdu">اردو (Urdu)</span>
                  {language === 'ur' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between"
                >
                  <span>हिंदी (Hindi)</span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>

          {/* User Account / Auth */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2 pl-1">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-medium leading-none">{user?.fullName}</div>
                <div className="text-[10px] text-emerald-300 font-mono mt-0.5">{user?.phoneNumber}</div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-red-600 hover:text-white text-emerald-200 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
