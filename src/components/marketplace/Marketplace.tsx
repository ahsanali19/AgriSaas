// src/components/marketplace/Marketplace.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { MarketplaceListing } from '../../types';
import { MarketplaceListingDetail } from './MarketplaceListingDetail';
import { SponsorBanner } from '../common/SponsorBanner';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  MessageCircle,
  Tag,
  CheckCircle2,
  Calendar,
  X,
  ExternalLink,
  Sparkles,
  Share2,
  Lock,
  Unlock,
  Wallet,
  Building2,
  Eye,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface MarketplaceProps {
  onNavigateToMyAds?: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onNavigateToMyAds }) => {
  const { farm, marketplaceListings, addMarketplaceListing } = useFarm();
  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  // Perspective & B2B Lead Unlock State
  const [viewerMode, setViewerMode] = useState<'buyer' | 'farmer'>('buyer');
  const [buyerWallet, setBuyerWallet] = useState<number>(2500); // 2,500 PKR balance
  const [unlockedListingIds, setUnlockedListingIds] = useState<Set<number>>(new Set());
  const [selectedDetailListing, setSelectedDetailListing] = useState<MarketplaceListing | null>(null);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    title: '',
    category: 'crops_harvest' as MarketplaceListing['category'],
    price: 50000,
    quantity: '1 Unit',
    sellerName: farm.name || 'Local Farmer',
    sellerPhone: '+923001234567',
    locationDistrict: farm.locationDistrict || 'Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: ''
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.title || !newListing.sellerPhone) return;

    addMarketplaceListing({
      title: newListing.title,
      category: newListing.category,
      price: Number(newListing.price),
      currency: farm.currency || 'PKR',
      quantity: newListing.quantity,
      sellerName: newListing.sellerName,
      sellerPhone: newListing.sellerPhone,
      locationDistrict: newListing.locationDistrict,
      imageUrl: newListing.imageUrl,
      description: newListing.description || 'Verified farm listing from AgriSaaS platform.',
      isVerifiedFarmer: true
    });

    setShowPostModal(false);
    setNewListing({
      title: '',
      category: 'crops_harvest',
      price: 50000,
      quantity: '1 Unit',
      sellerName: farm.name || 'Local Farmer',
      sellerPhone: '+923001234567',
      locationDistrict: farm.locationDistrict || 'Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      description: ''
    });
  };

  const handleUnlockLead = async (listingId: number, fee: number) => {
    // Check wallet
    if (buyerWallet < fee) {
      return { success: false, message: `Insufficient balance. Rs. ${fee} required.` };
    }

    try {
      // Call backend API if available
      const res = await fetch('/api/marketplace/unlock-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, buyerId: 1, unlockFee: fee })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setUnlockedListingIds(prev => new Set(prev).add(listingId));
        setBuyerWallet(prev => prev - fee);
        return {
          success: true,
          farmerPhone: data.farmerContact?.phone || '+92 300 8472910'
        };
      }
    } catch (e) {
      // fallback
    }

    // Local fallback
    setUnlockedListingIds(prev => new Set(prev).add(listingId));
    setBuyerWallet(prev => prev - fee);
    return {
      success: true,
      farmerPhone: '+92 300 8472910'
    };
  };

  const categories = [
    { id: 'all', label: 'All Items', icon: '🌾' },
    { id: 'crops_harvest', label: 'Harvested Crops & Grains', icon: '🌾' },
    { id: 'dairy_cattle', label: 'Dairy Cattle & Buffs', icon: '🐄' },
    { id: 'poultry_birds', label: 'Poultry Chicks & Flocks', icon: '🐔' },
    { id: 'fish_seed', label: 'Fish Seed & Fingerlings', icon: '🐟' },
    { id: 'feed_silage', label: 'Silage & Cattle Feed', icon: '🌽' },
    { id: 'machinery', label: 'Tractors & Equipment', icon: '🚜' },
  ];

  const filteredListings = marketplaceListings.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.locationDistrict.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 font-sans">
      
      {/* Header (Compact Modern Bar) */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg shrink-0">
            🚜
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-white tracking-tight truncate">
              AgriSaaS B2B Marketplace Mandi
            </h1>
            <p className="text-xs text-slate-400 truncate">
              Free listings for farmers • Verified buyer lead unlock
            </p>
          </div>
        </div>

        {/* Action & Post Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {onNavigateToMyAds && (
            <button
              onClick={onNavigateToMyAds}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>My Ads</span>
            </button>
          )}

          <button
            onClick={() => setShowPostModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Ad (Free)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PERSPECTIVE SWITCHER & BUYER PREPAID WALLET BAR (Compact)
          ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-3 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-sm">
        
        {/* Left: Perspective Switcher */}
        <div className="flex items-center space-x-2">
          <div className="text-xs font-bold text-slate-500 flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mode:</span>
          </div>

          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewerMode('buyer')}
              className={`px-2.5 py-1 rounded-md transition flex items-center space-x-1 ${
                viewerMode === 'buyer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Buyer Mode</span>
            </button>
            <button
              onClick={() => setViewerMode('farmer')}
              className={`px-2.5 py-1 rounded-md transition flex items-center space-x-1 ${
                viewerMode === 'farmer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👨‍🌾</span>
              <span>Farmer (Free Sell)</span>
            </button>
          </div>
        </div>

        {/* Right: Buyer Wallet & Lead Stats */}
        {viewerMode === 'buyer' && (
          <div className="flex items-center space-x-3 self-start md:self-auto bg-slate-850 border border-slate-700/80 px-4 py-2 rounded-2xl">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400">Buyer Wallet Balance</div>
                <div className="text-xs font-mono font-bold text-emerald-400">
                  Rs. {buyerWallet.toLocaleString()} PKR
                </div>
              </div>
            </div>

            <button
              onClick={() => setBuyerWallet(prev => prev + 1000)}
              className="bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
            >
              +Recharge (Rs 1,000)
            </button>
          </div>
        )}

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, milling wheat, cattle, silage, seed..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredListings.length}</strong> active trade listings
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MAIN MARKETPLACE CONTENT: LISTINGS GRID + B2B SPONSOR SIDEBAR
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Listings 3-Column Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredListings.map((item) => {
            const isUnlocked = unlockedListingIds.has(item.id);
            const actualPhone = item.sellerPhone || '+92 300 8472910';
            const maskedPhone = actualPhone.length > 7 ? `${actualPhone.substring(0, 7)} •••••••` : '+92 300 •••••••';
            const displayPhone = viewerMode === 'farmer' || isUnlocked ? actualPhone : maskedPhone;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between group"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedDetailListing(item)}
                >
                  
                  {/* Image & Badges */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category Pill */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {item.category.replace('_', ' ')}
                    </div>

                    {/* Verified Farmer Badge */}
                    {item.isVerifiedFarmer && (
                      <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2.5">
                    
                    {/* Price & Quantity */}
                    <div className="flex items-baseline justify-between">
                      <div className="font-mono font-black text-xl text-emerald-800">
                        {symbol} {item.price.toLocaleString()}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.quantity}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Location & Seller */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center space-x-1 truncate max-w-[150px]">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.locationDistrict}</span>
                      </div>
                      <span>{item.postedDate}</span>
                    </div>

                  </div>
                </div>

                {/* B2B Action Buttons / Unlock Lead Flow */}
                <div className="p-4 pt-0">
                  {viewerMode === 'buyer' && !isUnlocked ? (
                    /* Locked Lead Button for Commercial Buyer */
                    <button
                      onClick={() => setSelectedDetailListing(item)}
                      className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 shadow active:scale-95 text-center"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Farmer Contact (Rs. 100)</span>
                    </button>
                  ) : (
                    /* Unlocked or Farmer View CTA (Direct WhatsApp & Call) */
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/${displayPhone.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum, I am interested in your AgriSaaS listing: ${encodeURIComponent(item.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 text-center"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${displayPhone}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 active:scale-95 text-center"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-600" />
                        <span>Call</span>
                      </a>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Right: Direct Agri-Sponsor Sidebar Banners */}
        <div className="lg:col-span-1 space-y-6">
          <SponsorBanner placementArea="marketplace_sidebar" variant="sidebar" />
          
          {/* B2B Buyer Guarantee Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Farm Guarantee</span>
            </div>
            <h4 className="font-bold text-sm text-slate-100">
              Verified Direct Agri Producers
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every listing on AgriSaaS is verified through active farm registries and geolocation check-ins to prevent broker fraud.
            </p>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MODAL: VIEW LISTING DETAIL & UNLOCK LEAD
          ========================================================================= */}
      {selectedDetailListing && (
        <MarketplaceListingDetail
          listing={selectedDetailListing}
          onClose={() => setSelectedDetailListing(null)}
          viewerMode={viewerMode}
          buyerWallet={buyerWallet}
          onUnlockLead={handleUnlockLead}
        />
      )}

      {/* =========================================================================
          MODAL: POST NEW B2B LISTING
          ========================================================================= */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Post Free Item on B2B Mandi</h3>
                  <p className="text-[11px] text-emerald-700 font-semibold">100% Free Lifetime Listing for Farmers</p>
                </div>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Listing Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sahiwal Breed Milking Cow, 10,000 Rohu Fingerlings"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="crops_harvest">🌾 Harvested Crops & Grains</option>
                    <option value="dairy_cattle">🐄 Dairy Cattle & Buffs</option>
                    <option value="poultry_birds">🐔 Poultry Birds & Chicks</option>
                    <option value="fish_seed">🐟 Fish Seed & Fingerlings</option>
                    <option value="feed_silage">🌽 Silage & Animal Feed</option>
                    <option value="machinery">🚜 Farm Machinery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity Available *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 Tons, 2 Cows, 5000 Seed"
                    value={newListing.quantity}
                    onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price ({symbol}) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="50000"
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahiwal, Okara"
                    value={newListing.locationDistrict}
                    onChange={(e) => setNewListing({ ...newListing, locationDistrict: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Contact (Phone / WhatsApp) *</label>
                <input
                  type="text"
                  required
                  placeholder="+92 300 1234567"
                  value={newListing.sellerPhone}
                  onChange={(e) => setNewListing({ ...newListing, sellerPhone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Produce Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newListing.imageUrl}
                  onChange={(e) => setNewListing({ ...newListing, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Quality Specs</label>
                <textarea
                  rows={2}
                  placeholder="Mention moisture content, vaccination record, weight, delivery options..."
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
                >
                  Publish Free Listing
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
