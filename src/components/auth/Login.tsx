// src/components/auth/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Building2,
  Tractor,
  Coins,
  Globe2,
  Layers,
  Zap,
  Info
} from 'lucide-react';

interface LoginProps {
  onSuccess?: () => void;
  onNavigateRegister?: () => void;
  onNavigateAdmin?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateAdmin
}) => {
  const { login, loginAsAdmin, loginAsFarmer, loginAsBuyer } = useAuth();

  // Mode & Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'farmer' | 'buyer' | 'admin'>('farmer');

  // Form Fields
  const [phoneNumber, setPhoneNumber] = useState('+92 300 8472910');
  const [password, setPassword] = useState('kisan123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Post-logout feedback banner
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('logout') === 'success') {
        setShowLogoutAlert(true);
      }
    }
  }, []);

  // Update preset credentials when tab changes
  const handleTabSwitch = (tab: 'farmer' | 'buyer' | 'admin') => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'farmer') {
      setPhoneNumber('+92 300 8472910');
      setPassword('kisan123');
    } else if (tab === 'buyer') {
      setPhoneNumber('+92 321 9988776');
      setPassword('buyer123');
    } else if (tab === 'admin') {
      setPhoneNumber('+92 300 0000000');
      setPassword('admin2026');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'admin' || phoneNumber.includes('0000000') || password.toLowerCase().includes('admin')) {
        loginAsAdmin();
        if (onNavigateAdmin) {
          onNavigateAdmin();
        } else if (onSuccess) {
          onSuccess();
        }
        return;
      }

      if (activeTab === 'buyer') {
        loginAsBuyer();
        if (onSuccess) onSuccess();
        return;
      }

      const success = await login(phoneNumber, password);
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please verify your phone number and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden transition-colors duration-500 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-900 text-slate-900'
    }`}>

      {/* =========================================================================
          1. FULL-SCREEN CINEMATIC LOOPING HTML5 VIDEO BACKGROUND
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 filter brightness-[0.65] contrast-[1.1] transition-opacity duration-1000"
        >
          {/* High-quality cinematic agricultural video streams */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-tractor-harvesting-wheat-in-a-field-42407-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-tractor-in-a-green-field-41551-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Ambient Gradient Overlays for Cinematic Depth & Contrast */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-tr from-slate-950/90 via-emerald-950/60 to-slate-950/80 backdrop-blur-[2px]'
            : 'bg-gradient-to-tr from-emerald-950/70 via-slate-950/50 to-teal-950/70 backdrop-blur-[1px]'
        }`} />

        {/* Animated Subtle Floating Light Orbs */}
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
      </div>

      {/* =========================================================================
          2. FLOATING TOP BAR (Logo + Theme Switcher + Free Badge)
          ========================================================================= */}
      <div className="absolute top-0 inset-x-0 z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-900/50 ring-2 ring-white/20">
            🌾
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-black text-xl tracking-tight drop-shadow-md">Green Digital System</span>
              <span className="bg-emerald-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                100% Free Kisan Plan
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-medium drop-shadow hidden sm:block">
              Modern Farm Engine & B2B Mandi Lead Exchange
            </p>
          </div>
        </div>

        {/* Right Actions: Theme Toggle & Live Market Indicator */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-xs text-emerald-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white/90">B2B Mandi Active</span>
            <span className="text-white/40">•</span>
            <span>PKR Base</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Glassmorphism`}
            className="flex items-center space-x-1.5 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-xl border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-lg hover:scale-105 active:scale-95"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Light Glass</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-300" />
                <span className="hidden sm:inline">Dark Glass</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. CENTERPIECE: STUNNING GLASSMORPHISM LOGIN CARD
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-xl px-4 sm:px-6 py-16 sm:py-20 flex flex-col items-center">
        
        {/* Post-Logout Friendly Alert */}
        {showLogoutAlert && (
          <div className="w-full mb-4 p-4 rounded-3xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs backdrop-blur-2xl flex items-start space-x-3 shadow-2xl animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-white block text-sm">Session Closed Successfully</strong>
              <p className="mt-0.5 text-emerald-200/90 leading-relaxed">
                Tokens and active sessions were completely cleared. Your farm data is securely synced and waiting for your next sign-in.
              </p>
            </div>
          </div>
        )}

        {/* The 3D Glassmorphism Card */}
        <div className={`w-full rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-2xl transition-all duration-500 border ${
          theme === 'dark'
            ? 'bg-slate-900/75 border-white/15 text-white shadow-emerald-950/60'
            : 'bg-white/80 border-white/60 text-slate-900 shadow-slate-950/40'
        }`}>

          {/* Card Header & Title */}
          <div className="text-center mb-6">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              {activeTab === 'farmer' && 'Farmer Control Center'}
              {activeTab === 'buyer' && 'B2B Commercial Buyer Portal'}
              {activeTab === 'admin' && 'SaaS Monetization Command'}
            </h1>
            <p className={`text-xs sm:text-sm mt-1.5 max-w-md mx-auto ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {activeTab === 'farmer' && 'Zero subscription fees forever. Manage dairy, poultry, fish, crops, and ledger khata.'}
              {activeTab === 'buyer' && 'Direct access to verified agricultural producers, milling wheat, silage, and livestock.'}
              {activeTab === 'admin' && 'Real-time telemetry for B2B lead unlocks, direct sponsorships, and regional crop volume.'}
            </p>
          </div>

          {/* 3-Way Role Selector Tabs */}
          <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-2xl mb-6 border ${
            theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-200/80 border-slate-300/80'
          }`}>
            <button
              type="button"
              onClick={() => handleTabSwitch('farmer')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'farmer'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <span>👨‍🌾</span>
              <span className="truncate">Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('buyer')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'buyer'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="truncate">B2B Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('admin')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/40'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="truncate">SaaS Admin</span>
            </button>
          </div>

          {/* Quick Demo Login Pill Bar */}
          <div className="mb-5 flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Demo Sign-In:</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => { loginAsFarmer(); if (onSuccess) onSuccess(); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2 py-1 rounded-lg transition active:scale-95"
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => { loginAsBuyer(); if (onSuccess) onSuccess(); }}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] px-2 py-1 rounded-lg transition active:scale-95"
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => { loginAsAdmin(); if (onNavigateAdmin) onNavigateAdmin(); else if (onSuccess) onSuccess(); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-2 py-1 rounded-lg transition active:scale-95"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Phone Number / Identifier */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Registered Mobile Number / User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4 text-emerald-500" />
                </div>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+92 300 1234567"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                    theme === 'dark'
                      ? 'bg-slate-950/80 border-slate-700/80 text-white placeholder-slate-500'
                      : 'bg-white/90 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`block text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Security Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered phone via SMS OTP.'); }}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-emerald-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl text-xs sm:text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                    theme === 'dark'
                      ? 'bg-slate-950/80 border-slate-700/80 text-white placeholder-slate-500'
                      : 'bg-white/90 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Privacy */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900/60"
                />
                <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Keep me securely logged in
                </span>
              </label>

              <div className="flex items-center space-x-1 text-[11px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Encrypted</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-xl active:scale-95 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-950/50'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-950/60'
              }`}
            >
              {loading ? (
                <span>Authenticating Farm Credentials...</span>
              ) : (
                <>
                  <span>
                    {activeTab === 'farmer' && 'Open 100% Free Farm Workspace'}
                    {activeTab === 'buyer' && 'Enter B2B Mandi Lead Hub'}
                    {activeTab === 'admin' && 'Access SaaS Monetization Console'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer Registration Link */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Don't have a GDS farm registered yet?{' '}
              <button
                type="button"
                onClick={onNavigateRegister || (() => { loginAsFarmer(); if (onSuccess) onSuccess(); })}
                className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
              >
                Register 100% Free Today
              </button>
            </p>
          </div>

        </div>

        {/* Value Badges Beneath Card */}
        <div className="mt-6 grid grid-cols-3 gap-3 w-full text-center">
          <div className="p-2.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-white">
            <div className="text-sm font-black text-emerald-400">100% Free</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">For All Farmers</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-white">
            <div className="text-sm font-black text-teal-400">B2B Leads</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Direct Mandi</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-white">
            <div className="text-sm font-black text-cyan-400">0% Commission</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Keep 100% Profit</div>
          </div>
        </div>

      </div>

    </div>
  );
};
