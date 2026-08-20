// src/components/auth/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Tractor,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Globe
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
  const { login, loginAsAdmin } = useAuth();

  // Form states
  const [identifier, setIdentifier] = useState('+92 300 8472910');
  const [password, setPassword] = useState('kisan123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Post-logout banner state (checks URL search param `?logout=success`)
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('logout') === 'success') {
      setShowLogoutAlert(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if credentials are for SaaS Admin
      if (identifier.toLowerCase().includes('admin') || identifier === '+92 300 0000000') {
        loginAsAdmin();
        if (onNavigateAdmin) {
          onNavigateAdmin();
        } else if (onSuccess) {
          onSuccess();
        }
        return;
      }

      const success = await login(identifier, password);
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please verify your phone or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2 font-sans bg-white text-slate-900 overflow-hidden">
      
      {/* =========================================================================
          LEFT SIDE: THE FORM AREA (Clean, Centered, Minimalist Footer)
          ========================================================================= */}
      <div className="flex flex-col justify-between h-full px-6 sm:px-12 lg:px-16 py-8 sm:py-10 bg-white overflow-y-auto">
        
        {/* Top: Logo & System Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/20 text-xl font-bold">
              🌾
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">AgriSaaS</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                  Global
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Multi-Enterprise Farm Engine</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">PK • IN • Global</span>
          </div>
        </div>

        {/* Center: Main Welcome & Login Form */}
        <div className="max-w-md w-full mx-auto my-auto py-6">
          
          {/* Post-Logout Message Banner */}
          {showLogoutAlert && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs flex items-start space-x-3 shadow-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-emerald-950">You have been securely logged out.</strong>
                <p className="text-emerald-800/90 mt-0.5">
                  We are calculating your farm's growth while you are away. See you soon!
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back to your farm's control center
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Sign in to manage your livestock, track daily milk yields, broiler batches, fish ponds, and khata records.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Mobile / Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="+92 300 8472910 or farmer@agrisaas.io"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset SMS link will be sent to your registered phone.')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 transition"
                />
                <span className="text-xs font-medium text-slate-600">Remember this device for 30 days</span>
              </label>
            </div>

            {/* Prominent Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 transition transform active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              <span className="text-sm">{loading ? 'Authenticating...' : 'Sign In to Farm Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                onClick={onNavigateRegister || (() => alert('Opening Farm Registration Wizard...'))}
                className="font-bold text-emerald-600 hover:text-emerald-700 transition underline underline-offset-4"
              >
                Start your free trial.
              </button>
            </p>
          </div>

        </div>

        {/* =========================================================================
            THE FOOTER: MINIMALIST + DISCRETE ADMIN LINK
            ========================================================================= */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => alert('AgriSaaS adheres to ISO 27001 and local data protection regulations.')}
              className="hover:text-slate-600 transition"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => alert('AgriSaaS Terms of Service: Free 10-animal quota included.')}
              className="hover:text-slate-600 transition"
            >
              Terms
            </button>
            <span>•</span>
            {/* Discrete Admin Link (Next to Terms, Low Opacity) */}
            <button
              onClick={onNavigateAdmin || (() => {
                loginAsAdmin();
                if (onSuccess) onSuccess();
              })}
              className="opacity-40 hover:opacity-100 hover:text-indigo-600 font-mono transition"
              title="Restricted platform governance portal"
            >
              SaaS Administration
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} AgriSaaS Inc.
          </div>
        </div>

      </div>

      {/* =========================================================================
          RIGHT SIDE: THE VISUAL HOOK (Desktop Only - High-Quality Agri Backdrop)
          ========================================================================= */}
      <div className="hidden md:flex relative h-full w-full bg-slate-900 items-center justify-center p-8 lg:p-12 overflow-hidden">
        
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Modern Agricultural Landscape"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transform hover:scale-100 transition duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Dark Overlay for Optical Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60" />

        {/* Floating Glassmorphism Hook Card */}
        <div className="relative z-10 max-w-lg w-full backdrop-blur-xl bg-white/10 border border-white/20 p-8 lg:p-10 rounded-3xl text-white shadow-2xl space-y-6">
          
          {/* Live Platform Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Over 1,200+ Active Livestock & Aqua Farms</span>
          </div>

          {/* Hook Headline */}
          <div className="space-y-2">
            <h2 className="text-2xl lg:text-3xl font-extrabold leading-snug tracking-tight text-white">
              Join thousands of farmers tracking daily yields and maximizing profits.
            </h2>
            <p className="text-xs lg:text-sm text-slate-200/90 leading-relaxed">
              Real-time feed conversion ratios (FCR), individual cattle lactation curves, automated pond water quality alerts, and multi-currency khata ledgers in one seamless app.
            </p>
          </div>

          {/* Dummy Rising Chart & KPI Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                <span>Avg Milk Yield Gain</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="font-mono font-bold text-lg text-emerald-400">
                +18.4%
              </div>
              <div className="text-[10px] text-slate-400">Per lactation cycle</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                <span>Broiler FCR Target</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="font-mono font-bold text-lg text-amber-400">
                1.42 FCR
              </div>
              <div className="text-[10px] text-slate-400">Feed efficiency index</div>
            </div>

          </div>

          {/* Farmer Testimonial Quote */}
          <div className="pt-2 border-t border-white/15 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center font-bold text-xs text-white">
              CT
            </div>
            <div className="text-xs text-slate-200">
              <div className="font-semibold text-white">Chaudhry Tariq Mehmood</div>
              <div className="text-[11px] text-slate-300">Al-Madina Agro Complex (Sahiwal)</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
