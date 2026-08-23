// src/components/admin/AdminDashboard.tsx
import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { SponsorshipBanner, PlacementArea } from '../../types';
import {
  Coins,
  TrendingUp,
  Building2,
  Users,
  Eye,
  MousePointerClick,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  MapPin,
  Globe,
  Sun,
  Moon,
  Zap,
  ShieldCheck,
  BarChart3,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Tractor,
  Wheat,
  Milk,
  Radio,
  Sliders,
  DollarSign
} from 'lucide-react';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  onNavigate?: (tab: AdminTab) => void;
}

interface SponsorCampaign extends SponsorshipBanner {
  monthlyBudgetPkr: number;
  startDate: string;
  endDate: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { stats, farmers } = useAdmin();

  // Theme state for Light/Dark 3D Neuomorphism & Glassmorphism
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>('dark');

  // Ad Manager State
  const [placementFilter, setPlacementFilter] = useState<string>('all');
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [selectedBannerPreview, setSelectedBannerPreview] = useState<SponsorCampaign | null>(null);

  // Regional Agri-Intelligence Filter
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'punjab' | 'sindh' | 'kpk' | 'balochistan'>('all');
  const [intelligenceMetric, setIntelligenceMetric] = useState<'volume' | 'farmers' | 'revenue'>('volume');

  // Initial Real B2B Sponsor Campaigns
  const [campaigns, setCampaigns] = useState<SponsorCampaign[]>([
    {
      id: 1,
      sponsorName: 'Engro Fertilizers',
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      placementArea: 'dashboard_top',
      link: 'https://www.engrofertilizers.com',
      status: 'active',
      tagline: 'Zarkhez Plus & Urea - Maximize your Per-Acre Wheat & Cotton Yield with Precision Soil Health',
      badgeText: 'Verified Agri Partner',
      ctaText: 'Explore Fertilizer Rebate',
      impressionsCount: 148200,
      clicksCount: 6240,
      monthlyBudgetPkr: 250000,
      startDate: '2026-08-01',
      endDate: '2026-10-31'
    },
    {
      id: 2,
      sponsorName: 'Bayer CropScience',
      imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      placementArea: 'marketplace_sidebar',
      link: 'https://www.cropscience.bayer.com',
      status: 'active',
      tagline: 'Decis Prime & Belt Expert - Complete Insect & Bollworm Protection for Cash Crops',
      badgeText: 'Official Crop Protection',
      ctaText: 'View Spray Schedule',
      impressionsCount: 112400,
      clicksCount: 4320,
      monthlyBudgetPkr: 180000,
      startDate: '2026-07-15',
      endDate: '2026-09-30'
    },
    {
      id: 3,
      sponsorName: 'Fauji Fresh Milk & Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      placementArea: 'dashboard_top',
      link: 'https://www.ffbl.com',
      status: 'active',
      tagline: 'Guaranteed Daily Farm-Gate Procurement for Bulk Sahiwal & Nili-Ravi Dairy Producers',
      badgeText: 'Corporate Buyer',
      ctaText: 'Register Milk Supply',
      impressionsCount: 89600,
      clicksCount: 4890,
      monthlyBudgetPkr: 200000,
      startDate: '2026-08-10',
      endDate: '2026-11-10'
    },
    {
      id: 4,
      sponsorName: 'National Feeds & Wafaq Silage',
      imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      placementArea: 'marketplace_sidebar',
      link: 'https://www.nationalfeeds.com',
      status: 'active',
      tagline: 'High-Protein Broiler Crumbles & 22% CP High-Yield Milking Cattle Wanda',
      badgeText: 'Feed Mill Sponsor',
      ctaText: 'Order Bulk Feed',
      impressionsCount: 74500,
      clicksCount: 2980,
      monthlyBudgetPkr: 120000,
      startDate: '2026-08-05',
      endDate: '2026-09-05'
    },
    {
      id: 5,
      sponsorName: 'Fatima Fertilizer (Sarsabz)',
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      placementArea: 'crops_footer',
      link: 'https://fatima-group.com',
      status: 'active',
      tagline: 'CAN & NP Sarsabz - Green Revolution with High Nitrogen Absorption for Maize & Sugarcane',
      badgeText: 'Diamond Sponsor',
      ctaText: 'Check Dealer Locator',
      impressionsCount: 52100,
      clicksCount: 2150,
      monthlyBudgetPkr: 150000,
      startDate: '2026-07-20',
      endDate: '2026-10-20'
    }
  ]);

  // New Banner Form State
  const [newBanner, setNewBanner] = useState({
    sponsorName: '',
    placementArea: 'dashboard_top' as PlacementArea,
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com',
    tagline: '',
    badgeText: 'Verified Partner',
    ctaText: 'Learn More',
    monthlyBudgetPkr: 150000
  });

  const handleToggleCampaignStatus = (id: number) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c))
    );
  };

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.sponsorName || !newBanner.tagline) return;

    const created: SponsorCampaign = {
      id: Date.now(),
      sponsorName: newBanner.sponsorName,
      imageUrl: newBanner.imageUrl,
      placementArea: newBanner.placementArea,
      link: newBanner.link,
      status: 'active',
      tagline: newBanner.tagline,
      badgeText: newBanner.badgeText,
      ctaText: newBanner.ctaText,
      impressionsCount: 0,
      clicksCount: 0,
      monthlyBudgetPkr: Number(newBanner.monthlyBudgetPkr),
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31'
    };

    setCampaigns(prev => [created, ...prev]);
    setShowAddBannerModal(false);
    setNewBanner({
      sponsorName: '',
      placementArea: 'dashboard_top',
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      link: 'https://example.com',
      tagline: '',
      badgeText: 'Verified Partner',
      ctaText: 'Learn More',
      monthlyBudgetPkr: 150000
    });
  };

  // Aggregate Monetization Calculations
  const totalMonthlyAdRevenuePkr = campaigns
    .filter(c => c.status === 'active')
    .reduce((acc, curr) => acc + curr.monthlyBudgetPkr, 0);

  const todayLeadUnlocksCount = 482;
  const todayLeadUnlockRevenuePkr = todayLeadUnlocksCount * 100; // Rs 100 per lead
  const monthlyLeadUnlocksRevenuePkr = 1248000; // Rs. 1.248M / mo

  const totalCommercialBuyers = 1420;
  const buyerPrepaidWalletPoolPkr = 2850000; // Rs. 2.85M in buyer escrow/wallets

  const totalPlatformImpressions = campaigns.reduce((acc, c) => acc + (c.impressionsCount || 0), 0);
  const totalPlatformClicks = campaigns.reduce((acc, c) => acc + (c.clicksCount || 0), 0);
  const averageCtr = ((totalPlatformClicks / (totalPlatformImpressions || 1)) * 100).toFixed(2);

  // Regional Intelligence Dataset for 3D Heatmap Matrix
  const regionalData = [
    {
      id: 'punjab',
      name: 'Punjab Central & South',
      zone: 'Sahiwal, Okara, Multan, Rahim Yar Khan',
      farmers: 18450,
      cropVolumeTons: 68500,
      dairyCattleHead: 14200,
      leadRevenueToday: 28400,
      growthRate: '+24.5%',
      majorCrops: ['Wheat', 'Cotton', 'Sugarcane', 'Maize'],
      densityColor: 'emerald'
    },
    {
      id: 'sindh',
      name: 'Sindh Riverine Belt',
      zone: 'Sukkur, Larkana, Hyderabad, Badin',
      farmers: 6200,
      cropVolumeTons: 34100,
      dairyCattleHead: 6800,
      leadRevenueToday: 11200,
      growthRate: '+18.2%',
      majorCrops: ['Rice (IRRI/Basmati)', 'Sugarcane', 'Chili', 'Cotton'],
      densityColor: 'teal'
    },
    {
      id: 'kpk',
      name: 'KPK Valleys & Swat',
      zone: 'Mardan, Charsadda, Peshawar, Swat',
      farmers: 2800,
      cropVolumeTons: 16400,
      dairyCattleHead: 3100,
      leadRevenueToday: 5400,
      growthRate: '+14.9%',
      majorCrops: ['Tobacco', 'Maize', 'Apples', 'Peach'],
      densityColor: 'cyan'
    },
    {
      id: 'balochistan',
      name: 'Balochistan Orchards & Coast',
      zone: 'Quetta, Pishin, Khuzdar, Lasbela',
      farmers: 1250,
      cropVolumeTons: 9800,
      dairyCattleHead: 1900,
      leadRevenueToday: 3200,
      growthRate: '+11.8%',
      majorCrops: ['Dates', 'Grapes', 'Pomegranate', 'Coastal Aquaculture'],
      densityColor: 'amber'
    }
  ];

  const filteredRegions = selectedRegion === 'all'
    ? regionalData
    : regionalData.filter(r => r.id === selectedRegion);

  const filteredCampaigns = placementFilter === 'all'
    ? campaigns
    : campaigns.filter(c => c.placementArea === placementFilter);

  return (
    <div className={`space-y-8 font-sans transition-colors duration-500 ${
      adminTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
    }`}>

      {/* =========================================================================
          1. 3D GLASSMORPHISM HEADER: MONETIZATION & ANALYTICS COMMAND CENTER
          ========================================================================= */}
      <div className={`rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border transition-all duration-300 shadow-2xl relative overflow-hidden ${
        adminTheme === 'dark'
          ? 'bg-gradient-to-r from-slate-900/90 via-indigo-950/80 to-slate-900/90 border-indigo-500/20 shadow-indigo-950/40'
          : 'bg-gradient-to-r from-white/95 via-indigo-50/80 to-white/95 border-indigo-200/80 shadow-slate-200/80'
      }`}>
        
        {/* Ambient 3D Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Monetization & Analytics Hub</span>
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Free Lifetime Farmer Model Active</span>
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl font-black tracking-tight ${
              adminTheme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              AgriSaaS Monetization Command Center
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${
              adminTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Real-time platform revenue engine fueled exclusively by <strong>B2B Marketplace Lead Unlocks (Rs. 100/lead)</strong>, <strong>Direct Agri-Sponsorship Banners</strong>, and commercial buyer prepaid escrow.
            </p>
          </div>

          {/* Right Controls: Theme Switcher & Add Banner CTA */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            
            {/* 3D Theme Switcher */}
            <button
              onClick={() => setAdminTheme(adminTheme === 'dark' ? 'light' : 'dark')}
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center space-x-2 text-xs font-bold shadow-lg hover:scale-105 active:scale-95 ${
                adminTheme === 'dark'
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              {adminTheme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark 3D Mode</span>
                </>
              )}
            </button>

            {/* Post Sponsor Campaign Button */}
            <button
              onClick={() => setShowAddBannerModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition flex items-center space-x-2 shadow-xl shadow-emerald-950/40 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ New B2B Sponsor Banner</span>
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. MONETIZATION HUB: 3D ELEVATED REVENUE CARDS (NEUOMORPHIC DEPTH)
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">Monetization Engine Telemetry</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Live PKR Feed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Today's Lead Unlocks & Revenue */}
          <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 shadow-xl hover:-translate-y-1 group relative overflow-hidden ${
            adminTheme === 'dark'
              ? 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-400/60 shadow-emerald-950/30'
              : 'bg-white/90 border-emerald-200 hover:border-emerald-400 shadow-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Today's Lead Unlocks</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline space-x-2 font-mono">
              <span className="text-xs font-bold text-emerald-500">Rs.</span>
              <span className="text-3xl font-black text-emerald-400 tracking-tight">
                {todayLeadUnlockRevenuePkr.toLocaleString()}
              </span>
            </div>

            <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-300">{todayLeadUnlocksCount} verified contacts unlocked</span>
              <span className="text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+24.8%</span>
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/40 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Fixed Pricing:</span>
              <span className="font-mono text-emerald-400 font-bold">Rs. 100 / lead</span>
            </div>
          </div>

          {/* Card 2: Active Sponsorship Revenue */}
          <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 shadow-xl hover:-translate-y-1 group relative overflow-hidden ${
            adminTheme === 'dark'
              ? 'bg-slate-900/80 border-indigo-500/30 hover:border-indigo-400/60 shadow-indigo-950/30'
              : 'bg-white/90 border-indigo-200 hover:border-indigo-400 shadow-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Sponsorship Retainers</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline space-x-2 font-mono">
              <span className="text-xs font-bold text-indigo-400">Rs.</span>
              <span className="text-3xl font-black text-indigo-400 tracking-tight">
                {totalMonthlyAdRevenuePkr.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 font-sans">/mo</span>
            </div>

            <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-300">{campaigns.filter(c => c.status === 'active').length} Active Corporate Sponsors</span>
              <span className="text-indigo-400 font-bold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Engro, Bayer, Fauji</span>
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/40 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Platform Impressions:</span>
              <span className="font-mono text-indigo-300 font-bold">{(totalPlatformImpressions / 1000).toFixed(1)}k</span>
            </div>
          </div>

          {/* Card 3: Commercial Buyer Prepaid Wallets */}
          <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 shadow-xl hover:-translate-y-1 group relative overflow-hidden ${
            adminTheme === 'dark'
              ? 'bg-slate-900/80 border-cyan-500/30 hover:border-cyan-400/60 shadow-cyan-950/30'
              : 'bg-white/90 border-cyan-200 hover:border-cyan-400 shadow-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>B2B Buyer Capital</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline space-x-2 font-mono">
              <span className="text-xs font-bold text-cyan-400">Rs.</span>
              <span className="text-3xl font-black text-cyan-400 tracking-tight">
                {buyerPrepaidWalletPoolPkr.toLocaleString()}
              </span>
            </div>

            <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-300">{totalCommercialBuyers.toLocaleString()} Wholesalers & Mills</span>
              <span className="text-cyan-400 font-bold">Escrow Ready</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/40 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Avg Wallet Recharge:</span>
              <span className="font-mono text-cyan-300 font-bold">Rs. 5,000</span>
            </div>
          </div>

          {/* Card 4: Verified Free Farmer Network */}
          <div className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 shadow-xl hover:-translate-y-1 group relative overflow-hidden ${
            adminTheme === 'dark'
              ? 'bg-slate-900/80 border-amber-500/30 hover:border-amber-400/60 shadow-amber-950/30'
              : 'bg-white/90 border-amber-200 hover:border-amber-400 shadow-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Free Farmer Supply</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline space-x-2 font-mono">
              <span className="text-3xl font-black text-amber-400 tracking-tight">
                28,700+
              </span>
              <span className="text-xs font-bold text-amber-500">Farmers</span>
            </div>

            <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
              <span className="font-semibold text-slate-300">128,800 Tons Supply Listed</span>
              <span className="text-amber-400 font-bold">0% Churn</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/40 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Subscription Cost:</span>
              <span className="text-emerald-400 font-black uppercase">100% Free Forever</span>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          3. AD MANAGER: B2B SPONSORSHIP CAMPAIGN COMMAND
          ========================================================================= */}
      <div className={`rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border transition-all duration-300 shadow-xl space-y-6 ${
        adminTheme === 'dark'
          ? 'bg-slate-900/85 border-slate-800 shadow-slate-950/50'
          : 'bg-white/90 border-slate-200 shadow-slate-200'
      }`}>
        
        {/* Ad Manager Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/40">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-black tracking-tight">B2B Agri-Sponsor Ad Manager</h3>
            </div>
            <p className={`text-xs mt-0.5 ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Manage direct corporate sponsor banners displayed across the Farmer Dashboard, Marketplace Mandi, and Crop Footers.
            </p>
          </div>

          {/* Placement Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto text-xs">
            <button
              onClick={() => setPlacementFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                placementFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              All Placements ({campaigns.length})
            </button>
            <button
              onClick={() => setPlacementFilter('dashboard_top')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                placementFilter === 'dashboard_top'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              Dashboard Top
            </button>
            <button
              onClick={() => setPlacementFilter('marketplace_sidebar')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                placementFilter === 'marketplace_sidebar'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              Mandi Sidebar
            </button>
            <button
              onClick={() => setPlacementFilter('crops_footer')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                placementFilter === 'crops_footer'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              Crops Footer
            </button>
          </div>
        </div>

        {/* Sponsor Campaigns 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((camp) => {
            const ctr = (((camp.clicksCount || 0) / (camp.impressionsCount || 1)) * 100).toFixed(2);

            return (
              <div
                key={camp.id}
                className={`rounded-3xl border overflow-hidden backdrop-blur-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between group ${
                  adminTheme === 'dark'
                    ? 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/50'
                    : 'bg-white border-slate-200 hover:border-indigo-400'
                }`}
              >
                <div>
                  {/* Banner Image Preview */}
                  <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={camp.imageUrl}
                      alt={camp.sponsorName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Badge & Placement Tag */}
                    <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {camp.placementArea.replace('_', ' ')}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        camp.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-slate-700/80 text-slate-300'
                      }`}>
                        {camp.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs font-black truncate">{camp.sponsorName}</div>
                      <div className="text-[10px] text-emerald-300 font-semibold truncate">{camp.badgeText}</div>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-4 space-y-3">
                    <p className={`text-xs line-clamp-2 leading-relaxed ${
                      adminTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {camp.tagline}
                    </p>

                    {/* Performance Metrics */}
                    <div className={`p-3 rounded-2xl grid grid-cols-3 gap-2 text-center text-xs font-mono ${
                      adminTheme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-200'
                    }`}>
                      <div>
                        <div className="text-[10px] text-slate-400 font-sans">Impressions</div>
                        <div className="font-bold text-slate-200">{(camp.impressionsCount! / 1000).toFixed(1)}k</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-sans">Clicks</div>
                        <div className="font-bold text-slate-200">{camp.clicksCount?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-sans">CTR</div>
                        <div className="font-bold text-emerald-400">{ctr}%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">Monthly Retainer:</span>
                      <span className="font-mono font-bold text-indigo-400">
                        Rs. {camp.monthlyBudgetPkr.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className={`p-4 pt-0 flex items-center justify-between gap-2 border-t ${
                  adminTheme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                } mt-3`}>
                  
                  <button
                    onClick={() => handleToggleCampaignStatus(camp.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                      camp.status === 'active'
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    <span>{camp.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}</span>
                  </button>

                  <a
                    href={camp.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-xl border transition ${
                      adminTheme === 'dark'
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                    title="Visit Target Destination"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          4. AGRI-INTELLIGENCE MAP: 3D REGIONAL CROP VOLUME & DENSITY MATRIX
          ========================================================================= */}
      <div className={`rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border transition-all duration-300 shadow-xl space-y-6 ${
        adminTheme === 'dark'
          ? 'bg-slate-900/85 border-slate-800 shadow-slate-950/50'
          : 'bg-white/90 border-slate-200 shadow-slate-200'
      }`}>
        
        {/* Section Header & Metric Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/40">
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-black tracking-tight">Agri-Intelligence 3D Regional Heatmap</h3>
            </div>
            <p className={`text-xs mt-0.5 ${adminTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Telemetry matrix tracking regional crop harvest volumes, dairy herd density, and B2B lead monetization across South Asia.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80 text-xs">
              <button
                onClick={() => setIntelligenceMetric('volume')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                  intelligenceMetric === 'volume'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wheat className="w-3.5 h-3.5" />
                <span>Crop Harvest (Tons)</span>
              </button>
              <button
                onClick={() => setIntelligenceMetric('farmers')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                  intelligenceMetric === 'farmers'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Farmer Density</span>
              </button>
              <button
                onClick={() => setIntelligenceMetric('revenue')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                  intelligenceMetric === 'revenue'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Lead Revenue</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3D Regional Matrix Heatmap Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {regionalData.map((reg) => {
            const isSelected = selectedRegion === reg.id || selectedRegion === 'all';
            const volumePercentage = Math.min(100, Math.round((reg.cropVolumeTons / 70000) * 100));

            return (
              <div
                key={reg.id}
                onClick={() => setSelectedRegion(selectedRegion === reg.id ? 'all' : (reg.id as any))}
                className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group ${
                  selectedRegion === reg.id
                    ? 'bg-gradient-to-br from-emerald-950/90 to-slate-900 border-emerald-400 ring-2 ring-emerald-500/50'
                    : adminTheme === 'dark'
                    ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                {/* 3D Visual Depth Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm text-slate-100">{reg.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {reg.growthRate}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mt-1 truncate">{reg.zone}</div>

                {/* Main Metric Value */}
                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  {intelligenceMetric === 'volume' && (
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Verified Crop Yield</div>
                      <div className="font-mono font-black text-2xl text-emerald-400 mt-0.5">
                        {reg.cropVolumeTons.toLocaleString()} <span className="text-xs text-slate-400 font-sans">Tons</span>
                      </div>
                    </div>
                  )}

                  {intelligenceMetric === 'farmers' && (
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Farmer Enterprises</div>
                      <div className="font-mono font-black text-2xl text-teal-400 mt-0.5">
                        {reg.farmers.toLocaleString()} <span className="text-xs text-slate-400 font-sans">Holders</span>
                      </div>
                    </div>
                  )}

                  {intelligenceMetric === 'revenue' && (
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Daily B2B Lead Unlocks</div>
                      <div className="font-mono font-black text-2xl text-cyan-400 mt-0.5">
                        Rs. {reg.leadRevenueToday.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3D Animated Volume Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>Regional Capacity</span>
                    <span>{volumePercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                      style={{ width: `${volumePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Major Crop Tags */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {reg.majorCrops.map((crop, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {crop}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          MODAL: ADD NEW B2B SPONSOR BANNER
          ========================================================================= */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-white">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Upload B2B Sponsor Banner</h3>
                  <p className="text-[11px] text-indigo-300 font-semibold">Engage 28,000+ Verified South Asian Farmers</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddBannerModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCampaign} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Corporate Sponsor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bayer CropScience, Engro, Fauji Foods"
                  value={newBanner.sponsorName}
                  onChange={(e) => setNewBanner({ ...newBanner, sponsorName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Placement Area *</label>
                  <select
                    value={newBanner.placementArea}
                    onChange={(e) => setNewBanner({ ...newBanner, placementArea: e.target.value as PlacementArea })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="dashboard_top">Dashboard Top (High Visibility)</option>
                    <option value="marketplace_sidebar">Mandi Sidebar (B2B Lead Target)</option>
                    <option value="crops_footer">Crops Footer (Agronomy Target)</option>
                    <option value="ledger_top">Khata Ledger Top</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Monthly Budget (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="10000"
                    placeholder="150000"
                    value={newBanner.monthlyBudgetPkr}
                    onChange={(e) => setNewBanner({ ...newBanner, monthlyBudgetPkr: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Promotional Tagline / Offer *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Guaranteed 15% Yield Boost with Certified Hybrid Seeds..."
                  value={newBanner.tagline}
                  onChange={(e) => setNewBanner({ ...newBanner, tagline: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Badge Text</label>
                  <input
                    type="text"
                    placeholder="Verified Partner"
                    value={newBanner.badgeText}
                    onChange={(e) => setNewBanner({ ...newBanner, badgeText: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="Explore Offer"
                    value={newBanner.ctaText}
                    onChange={(e) => setNewBanner({ ...newBanner, ctaText: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Target Web Link / WhatsApp</label>
                <input
                  type="url"
                  placeholder="https://sponsorbrand.com/kisan-offer"
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBannerModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg transition"
                >
                  Publish Live Campaign
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
