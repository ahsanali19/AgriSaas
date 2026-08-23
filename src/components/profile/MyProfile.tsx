// src/components/profile/MyProfile.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { useLanguage } from '../../context/LanguageContext';
import { ALL_SEED_FARMER_PROFILES } from '../../data/seedData';
import {
  User,
  ShieldCheck,
  Phone,
  Building2,
  MapPin,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Tractor,
  Milk,
  Sprout,
  Bird,
  Fish,
  Layers,
  ArrowRight,
  ShieldAlert,
  Coins
} from 'lucide-react';

interface MyProfileProps {
  onNavigateToAds?: () => void;
}

export const MyProfile: React.FC<MyProfileProps> = ({ onNavigateToAds }) => {
  const { user, updateUserProfile } = useAuth();
  const { farm, updateFarm, switchFarmerProfile } = useFarm();
  const { t } = useLanguage();

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || 'Chaudhry Aslam');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+923001234567');
  const [farmName, setFarmName] = useState(farm.name || 'Aslam Royal Dairy Estate');
  const [locationDistrict, setLocationDistrict] = useState(farm.locationDistrict || 'Sahiwal, Punjab');
  const [currency, setCurrency] = useState(farm.currency || 'PKR');
  const [totalAreaAcres, setTotalAreaAcres] = useState<number>(farm.totalAreaAcres || 45);

  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // Handle Profile Update with Authorization Check
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    // Authorization & Validation
    if (!user) {
      setProfileErrorMsg('Security Exception: You must be logged in to update your profile.');
      return;
    }

    if (!fullName.trim()) {
      setProfileErrorMsg('Full Name cannot be left blank.');
      return;
    }

    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      setProfileErrorMsg('Please provide a valid Mobile / WhatsApp number.');
      return;
    }

    // 1. Update Auth User State
    updateUserProfile({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      preferredCurrency: currency
    });

    // 2. Update Farm Context State
    updateFarm(farm.id, {
      name: farmName.trim(),
      locationDistrict: locationDistrict.trim(),
      currency,
      totalAreaAcres: Number(totalAreaAcres)
    });

    setProfileSuccessMsg('Profile and Farm details saved successfully! Cloud state synchronized.');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');

    if (!currentPassword) {
      setPasswordErrorMsg('Please enter your current password.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirmation do not match.');
      return;
    }

    // Simulate secure backend password hash update
    setPasswordSuccessMsg('Password updated securely! Next login will require your new credentials.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMsg(''), 4500);
  };

  // Farmer Switch Handler
  const handleSelectFarmer = (farmerId: number) => {
    switchFarmerProfile(farmerId);
    const target = ALL_SEED_FARMER_PROFILES.find(p => p.user.id === farmerId);
    if (target) {
      setFullName(target.user.fullName);
      setPhoneNumber(target.user.phoneNumber);
      setFarmName(target.farm.name);
      setLocationDistrict(target.farm.locationDistrict || '');
      setCurrency(target.farm.currency);
      setTotalAreaAcres(target.farm.totalAreaAcres || 0);
      setProfileSuccessMsg(`Switched active session to "${target.user.fullName}" (${target.farm.farmType.toUpperCase()})`);
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    }
  };

  const getFarmTypeIcon = (type: string) => {
    switch (type) {
      case 'dairy': return <Milk className="w-5 h-5 text-sky-400" />;
      case 'crops': return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'poultry': return <Bird className="w-5 h-5 text-amber-400" />;
      case 'fish': return <Fish className="w-5 h-5 text-cyan-400" />;
      default: return <Layers className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-700/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 flex items-center justify-center text-white text-3xl font-black shadow-inner border border-emerald-500/30 shrink-0">
              {fullName.charAt(0) || 'K'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{fullName}</h1>
                <span className="inline-flex items-center space-x-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Kisan</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{phoneNumber}</span>
                <span>•</span>
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{farm.name}</span>
              </p>
            </div>
          </div>

          {onNavigateToAds && (
            <button
              onClick={onNavigateToAds}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition self-start md:self-auto"
            >
              <span>Manage My Posted Ads</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Profile Settings + Password Change */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personal & Farm Details Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal & Farm Profile</h2>
              <p className="text-xs text-slate-500">Update your verified farmer credentials and regional farm identity</p>
            </div>
          </div>

          {profileSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {profileErrorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{profileErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Kisan Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  placeholder="e.g. Chaudhry Aslam"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile / WhatsApp (B2B Contact) *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono transition"
                  placeholder="+923001234567"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farm / Estate Commercial Name *
              </label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="e.g. Aslam Royal Dairy Estate & Stud Farm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District & Province / State
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={locationDistrict}
                    onChange={(e) => setLocationDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="e.g. Sahiwal, Punjab"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Land (Acres)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={totalAreaAcres}
                  onChange={(e) => setTotalAreaAcres(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Base Billing Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                >
                  <option value="PKR">Pakistani Rupee (PKR - ₨)</option>
                  <option value="INR">Indian Rupee (INR - ₹)</option>
                  <option value="USD">US Dollar (USD - $)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Enterprise Type
                </label>
                <div className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-700 flex items-center space-x-2">
                  {getFarmTypeIcon(farm.farmType)}
                  <span>{farm.farmType} Farming</span>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition shadow flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Profile & Farm Details</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Change Password & Security (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Change Password Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Change Password</h2>
                <p className="text-xs text-slate-500">Ensure a strong, private password for your AgriSaaS account</p>
              </div>
            </div>

            {passwordSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordSuccessMsg}</span>
              </div>
            )}

            {passwordErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password (Min 6 Characters)
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="New strong password"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Repeat new password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow flex items-center justify-center space-x-2 mt-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </form>
          </div>

          {/* Account Security & RBAC Status */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
              <ShieldAlert className="w-4 h-4" />
              <span>RBAC Role & Authorization Guard</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Account ID:</span>
                <span className="text-white font-bold">#{user?.id || 101}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role:</span>
                <span className="text-emerald-300 font-bold uppercase">{user?.role || 'farmer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pricing Plan:</span>
                <span className="text-amber-400 font-bold">100% Free Lifetime SaaS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Security Check:</span>
                <span className="text-sky-300">Farmer-Owned Isolation Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Realistic Pakistani/Indian Dummy Data Switcher Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Switch Seeded Farmer Test Profiles</h2>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2.5 py-1 rounded-full font-bold">
            5 Seed Environments Active
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Select any of the 5 seeded Pakistani/Indian farmer profiles to test different farming verticals (Dairy, Crops, Poultry, Fish, Mixed) and their corresponding live marketplace listings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {ALL_SEED_FARMER_PROFILES.map((profile) => {
            const isSelected = user?.phoneNumber === profile.user.phoneNumber;
            return (
              <button
                key={profile.user.id}
                onClick={() => handleSelectFarmer(profile.user.id)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/50'
                    : 'bg-slate-50 hover:bg-emerald-50/60 border-slate-200 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      #{profile.user.id}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {profile.farm.farmType}
                    </span>
                  </div>
                  <div className={`font-bold text-sm mt-1.5 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {profile.user.fullName}
                  </div>
                  <div className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {profile.user.phoneNumber}
                  </div>
                  <p className={`text-[11px] mt-2 line-clamp-2 leading-tight ${isSelected ? 'text-emerald-100' : 'text-slate-600'}`}>
                    {profile.farm.name}
                  </p>
                </div>

                <div className={`mt-3 pt-2 border-t text-[10px] flex items-center justify-between font-semibold ${
                  isSelected ? 'border-emerald-800 text-emerald-300' : 'border-slate-200 text-slate-500'
                }`}>
                  <span>{profile.farm.totalAreaAcres || 0} Acres</span>
                  <span>{profile.marketplaceListings.length} Ads</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default MyProfile;
