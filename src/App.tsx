// src/App.tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FarmProvider } from './context/FarmContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdminProvider } from './context/AdminContext';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MasterDashboard } from './components/dashboard/MasterDashboard';
import { FarmList } from './components/farms/FarmList';
import { CropDashboard } from './components/crops/CropDashboard';
import { DairyModule } from './components/dairy/DairyModule';
import { PoultryModule } from './components/poultry/PoultryModule';
import { FishModule } from './components/fish/FishModule';
import { KhataModule } from './components/khata/KhataModule';
import { StaffManagement } from './components/staff/StaffManagement';
import { Marketplace } from './components/marketplace/Marketplace';
import { MyMarketplaceAds } from './components/marketplace/MyMarketplaceAds';
import { MyProfile } from './components/profile/MyProfile';
import { HealthAssistant } from './components/health/HealthAssistant';
import { Login } from './components/auth/Login';
import { AuthModal } from './components/auth/AuthModal';
import { FarmSetupWizard } from './components/onboarding/FarmSetupWizard';
import { SubscriptionModal } from './components/subscription/SubscriptionModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManageUsers } from './components/admin/ManageUsers';
import { AdminTab } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { UpdateNotification } from './components/common/UpdateNotification';

function AppContent() {
  const { user, role, isAuthenticated, loginAsFarmer, loginAsAdmin } = useAuth();

  // Active Navigation States
  const [currentFarmerTab, setCurrentFarmerTab] = useState<NavTab>('dashboard');
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('dashboard');

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // 1. Unauthenticated State -> Render Front-Door Split-Screen Login
  if (!isAuthenticated) {
    return (
      <Login
        onSuccess={() => {}}
        onNavigateRegister={() => setShowSetupModal(true)}
        onNavigateAdmin={() => loginAsAdmin()}
      />
    );
  }

  // 2. Super Admin Portal (RBAC Protected: role === 'admin')
  if (role === 'admin') {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
          
          {/* Strict Super Admin Header (ONLY Admin Links) */}
          <Header
            currentAdminTab={currentAdminTab}
            onSelectAdminTab={setCurrentAdminTab}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
            {currentAdminTab === 'dashboard' && (
              <AdminDashboard onNavigate={setCurrentAdminTab} />
            )}

            {currentAdminTab === 'users' && (
              <ManageUsers />
            )}

            {currentAdminTab === 'subscriptions' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <h2 className="text-xl font-bold text-white">SaaS Plans & Subscription Revenue</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Normalized platform revenue metrics formulated strictly in Pakistani Rupee (PKR).
                  </p>
                </div>
                <AdminDashboard onNavigate={setCurrentAdminTab} />
              </div>
            )}

            {currentAdminTab === 'audit' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h2 className="text-xl font-bold text-white">Security & Audit Trails</h2>
                <p className="text-xs text-slate-400">
                  Immutable record of all administrative subscription overrides and account suspensions.
                </p>
                <ManageUsers />
              </div>
            )}
          </main>

        </div>
      </ProtectedRoute>
    );
  }

  // 3. Farmer Portal (RBAC Protected: role === 'farmer')
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-16 md:pb-0">
        
        {/* Strict Farmer Header (ONLY Farmer Links & No Admin Controls) */}
        <Header
          currentFarmerTab={currentFarmerTab}
          onSelectFarmerTab={setCurrentFarmerTab}
          onOpenUpgrade={() => setShowUpgradeModal(true)}
          onOpenSetup={() => setShowSetupModal(true)}
          onOpenLogin={() => setShowAuthModal(true)}
        />

        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar
              currentTab={currentFarmerTab}
              onSelectTab={setCurrentFarmerTab}
              onOpenUpgrade={() => setShowUpgradeModal(true)}
            />
          </div>

          {/* Farmer Module Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden pb-20 md:pb-8">
            {currentFarmerTab === 'dashboard' && (
              <MasterDashboard
                onNavigate={setCurrentFarmerTab}
                onOpenUpgrade={() => setShowUpgradeModal(true)}
              />
            )}

            {currentFarmerTab === 'farms' && (
              <FarmList />
            )}

            {currentFarmerTab === 'crops' && (
              <CropDashboard onNavigateToMarketplace={() => setCurrentFarmerTab('marketplace')} />
            )}

            {currentFarmerTab === 'dairy' && (
              <DairyModule onOpenUpgrade={() => setShowUpgradeModal(true)} />
            )}

            {currentFarmerTab === 'poultry' && (
              <PoultryModule onOpenUpgrade={() => setShowUpgradeModal(true)} />
            )}

            {currentFarmerTab === 'fish' && (
              <FishModule onOpenUpgrade={() => setShowUpgradeModal(true)} />
            )}

            {currentFarmerTab === 'khata' && (
              <KhataModule />
            )}

            {currentFarmerTab === 'health' && (
              <HealthAssistant />
            )}

            {currentFarmerTab === 'staff' && (
              <StaffManagement />
            )}

            {currentFarmerTab === 'marketplace' && (
              <Marketplace onNavigateToMyAds={() => setCurrentFarmerTab('my_ads')} />
            )}

            {currentFarmerTab === 'my_ads' && (
              <MyMarketplaceAds
                onNavigateToExploreMarketplace={() => setCurrentFarmerTab('marketplace')}
              />
            )}

            {currentFarmerTab === 'profile' && (
              <MyProfile
                onNavigateToAds={() => setCurrentFarmerTab('my_ads')}
              />
            )}

            {currentFarmerTab === 'subscriptions' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Subscription & Enterprise Quotas</h2>
                <p className="text-xs text-slate-500">
                  Manage your subscription, regional payment methods, and farm enterprise limits.
                </p>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-3 px-6 rounded-xl transition shadow"
                >
                  View Plans & Upgrade
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileNav
          currentTab={currentFarmerTab}
          onSelectTab={setCurrentFarmerTab}
        />

        {/* Farmer Modals */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />

        <FarmSetupWizard
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
        />

        <SubscriptionModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />

      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AdminProvider>
          <FarmProvider>
            <AppContent />
            <UpdateNotification />
          </FarmProvider>
        </AdminProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
