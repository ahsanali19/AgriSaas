// src/components/routing/ProtectedRoute.tsx
import React from 'react';
import { useAuth, AppRole } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Lock, LogOut } from 'lucide-react';
import { Login } from '../auth/Login';

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
  onRedirectToDashboard?: () => void;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = ['farmer', 'admin'],
  onRedirectToDashboard,
  children
}) => {
  const { isAuthenticated, role, logout, loginAsFarmer, loginAsAdmin } = useAuth();

  // 1. Unauthenticated Guard: Redirect / Render Login
  if (!isAuthenticated) {
    return (
      <Login
        onSuccess={() => {}}
      />
    );
  }

  // 2. Role-Based Access Control (RBAC) Guard
  if (role && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
          
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              403 - ACCESS RESTRICTED
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight pt-2">
              Unauthorized Route Access
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account has the role <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">{role}</code>, which does not have permission to view this restricted module.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            {role === 'farmer' ? (
              <button
                onClick={onRedirectToDashboard || (() => window.location.href = '/')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Farmer Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onRedirectToDashboard || (() => window.location.href = '/admin')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-950"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Super Admin Dashboard</span>
              </button>
            )}

            <button
              onClick={logout}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign In with Different Account</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 3. Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
