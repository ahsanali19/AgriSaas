// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { useLanguage } from '../../context/LanguageContext';
import { NavTab } from './Sidebar';
import { AdminTab } from '../admin/AdminLayout';
import {
  LayoutDashboard,
  Users,
  History,
  LogOut,
  Sparkles,
  Globe,
  Check,
  ShieldCheck,
  ShieldAlert,
  Coins,
  Sun,
  Droplets,
  Wind,
  Bell,
  AlertTriangle,
  X,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  currentFarmerTab?: NavTab;
  onSelectFarmerTab?: (tab: NavTab) => void;
  currentAdminTab?: AdminTab;
  onSelectAdminTab?: (tab: AdminTab) => void;
  onOpenUpgrade?: () => void;
  onOpenSetup?: () => void;
  onOpenLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentFarmerTab = 'dashboard',
  onSelectFarmerTab,
  currentAdminTab = 'dashboard',
  onSelectAdminTab,
  onOpenUpgrade,
  onOpenSetup,
  onOpenLogin
}) => {
  const { user, role, isAuthenticated, currentPlan, logout } = useAuth();
  const { farm } = useFarm();
  const { language, setLanguage, t } = useLanguage();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAlertPopover, setShowAlertPopover] = useState(false);

  // Weather State for Header Mini-Widget
  const [weather, setWeather] = useState({
    tempC: 38,
    humidityPercent: 68,
    windSpeedKmh: 14,
    condition: 'Sunny & Hot',
    hasAlert: true,
    alertTitle: 'High Temperature Alert (38°C)',
    alertMessage: 'High temperature alert: Ensure cooling in poultry sheds today. Supply oral electrolytes to milking cows.',
    locationName: farm.locationDistrict || 'Punjab Agri Hub'
  });

  // Fetch / Sync location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setWeather(prev => ({
            ...prev,
            locationName: farm.locationDistrict || `${pos.coords.latitude.toFixed(1)}°N, ${pos.coords.longitude.toFixed(1)}°E`
          }));
        },
        () => {
          // Fallback to farm district
        },
        { timeout: 5000 }
      );
    }
  }, [farm.locationDistrict]);

  // =========================================================================
  // 1. SUPERADMIN HEADER (Role === 'admin')
  // =========================================================================
  if (role === 'admin') {
    const adminNavLinks = [
      { id: 'dashboard' as const, label: 'Monetization Hub', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'users' as const, label: 'Manage Farmers & Buyers', icon: <Users className="w-4 h-4" /> },
      { id: 'subscriptions' as const, label: 'B2B Revenue Stream', icon: <Coins className="w-4 h-4" /> },
      { id: 'audit' as const, label: 'Security & Logs', icon: <History className="w-4 h-4" /> }
    ];

    return (
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Superadmin Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-950/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-white">AgriSaaS</span>
                <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/80 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Master Governance Console • Base PKR
              </p>
            </div>
          </div>

          {/* Superadmin Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            {adminNavLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectAdminTab && onSelectAdminTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  currentAdminTab === item.id
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Admin User Profile & Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:block text-right">
              <div className="text-xs font-bold text-white leading-none">
                {user?.fullName || 'Super Administrator'}
              </div>
              <div className="text-[10px] text-indigo-400 font-mono mt-0.5">
                Root RBAC Access
              </div>
            </div>

            <button
              onClick={logout}
              title="Secure Super Admin Logout"
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-800 text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>
    );
  }

  // =========================================================================
  // 2. FARMER HEADER (Role === 'farmer' or 'buyer')
  // =========================================================================
  if (role === 'farmer' || role === 'buyer') {
    return (
      <header className="sticky top-0 z-30 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3">
            <div
              className="flex items-center space-x-2.5 cursor-pointer"
              onClick={onOpenSetup}
              title="Click to view Farm Settings"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-inner text-white font-black text-xl shrink-0">
                🌾
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-lg tracking-tight text-white">{t('appName')}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                    {farm.currency}
                  </span>
                </div>
                <p className="text-xs text-emerald-200 hidden sm:block truncate max-w-[160px]">
                  {farm.name}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Compact Header Weather Widget, Language, Plan & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* =========================================================================
                COMPACT MINI WEATHER WIDGET (With Small Icons & Glowing Alert Bell)
                ========================================================================= */}
            <div className="relative">
              <div
                onClick={() => setShowAlertPopover(!showAlertPopover)}
                className={`cursor-pointer flex items-center space-x-1.5 sm:space-x-2.5 px-2.5 sm:px-3 py-1.5 rounded-2xl border transition shadow-inner select-none ${
                  weather.hasAlert
                    ? 'bg-emerald-950/90 border-amber-500/40 hover:border-amber-400'
                    : 'bg-emerald-950/60 border-emerald-700/60 hover:border-emerald-500'
                }`}
                title="Microclimate Weather & Extreme Alerts (Click to view advisory)"
              >
                {/* Temperature */}
                <div className="flex items-center space-x-1 text-amber-300">
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
                  <span className="font-mono font-bold text-xs text-white">{weather.tempC}°C</span>
                </div>

                {/* Humidity (hidden on ultra-small screens) */}
                <div className="hidden sm:flex items-center space-x-1 text-sky-300 border-l border-emerald-800/80 pl-2 text-xs">
                  <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-mono text-[11px] text-slate-200">{weather.humidityPercent}%</span>
                </div>

                {/* Wind (hidden on mobile and small tablet) */}
                <div className="hidden md:flex items-center space-x-1 text-emerald-300 border-l border-emerald-800/80 pl-2 text-xs">
                  <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px] text-slate-200">{weather.windSpeedKmh}k/h</span>
                </div>

                {/* Notification Bell Icon (Glows red with pulse if extreme alert active) */}
                <div className="relative pl-1 border-l border-emerald-800/80">
                  {weather.hasAlert ? (
                    <div className="relative flex items-center justify-center">
                      <Bell className="w-4 h-4 text-rose-400 animate-bounce" />
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                      </span>
                    </div>
                  ) : (
                    <Bell className="w-4 h-4 text-emerald-400/80" />
                  )}
                </div>
              </div>

              {/* Weather & Alert Popover Dropdown */}
              {showAlertPopover && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 text-white rounded-3xl shadow-2xl border border-emerald-600/40 p-4 z-50 animate-fadeIn space-y-3 font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <strong className="text-xs font-bold text-white">Agrometeorology Status</strong>
                    </div>
                    <button
                      onClick={() => setShowAlertPopover(false)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Microclimate Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Temp</div>
                      <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">{weather.tempC}°C</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Humidity</div>
                      <div className="font-mono font-bold text-sky-400 text-sm mt-0.5">{weather.humidityPercent}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Wind</div>
                      <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{weather.windSpeedKmh} km/h</div>
                    </div>
                  </div>

                  {/* Extreme Weather Alert Banner */}
                  {weather.hasAlert && (
                    <div className="p-3 bg-gradient-to-r from-rose-950/90 to-amber-950/90 rounded-2xl border border-rose-500/40 space-y-1.5 text-left">
                      <div className="flex items-center space-x-1.5 text-rose-300 font-black text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{weather.alertTitle}</span>
                      </div>
                      <p className="text-[11px] text-rose-200/90 leading-relaxed">
                        {weather.alertMessage}
                      </p>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{weather.locationName}</span>
                    </span>
                    <span className="text-emerald-400 font-mono">Live GPS Synced</span>
                  </div>
                </div>
              )}
            </div>

            {/* Free Tier / Pro Badge */}
            {currentPlan.code === 'FREE' ? (
              <button
                onClick={onOpenUpgrade}
                className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl shadow transition transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden md:inline">{t('upgradeToPro')}</span>
                <span className="md:hidden">Pro</span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center space-x-1 bg-emerald-800 text-emerald-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pro</span>
              </div>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs px-2 sm:px-2.5 py-1.5 rounded-xl transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase font-bold text-[11px]">{language}</span>
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

            {/* Farmer Profile & Logout */}
            <div className="flex items-center space-x-1.5 pl-1">
              <button
                onClick={() => onSelectFarmerTab?.('profile')}
                className="hidden xl:block text-right hover:opacity-80 transition cursor-pointer p-1 rounded-lg"
                title="View & Edit Farmer Profile"
              >
                <div className="text-xs font-semibold text-white leading-none">{user?.fullName || 'Farmer'}</div>
                <div className="text-[10px] text-emerald-300 font-mono mt-0.5">{user?.phoneNumber}</div>
              </button>
              <button
                onClick={logout}
                title="Logout from AgriSaaS"
                className="p-2 rounded-xl bg-emerald-800/80 hover:bg-rose-600 hover:text-white text-emerald-200 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>
    );
  }

  // =========================================================================
  // 3. UNAUTHENTICATED GUEST HEADER
  // =========================================================================
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold">
            🌾
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-slate-900">AgriSaaS</span>
            <p className="text-[11px] text-slate-400">Global Livestock & Aqua Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenLogin}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
          >
            Sign In to Dashboard
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
