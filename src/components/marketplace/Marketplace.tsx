// src/components/marketplace/Marketplace.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { MarketplaceListing, ListingCategory } from '../../types';
import { MarketplaceListingDetail } from './MarketplaceListingDetail';
import { CreateAdModal } from './CreateAdModal';
import { SponsorBanner } from '../common/SponsorBanner';
import {
  ShoppingBag,
  Plus,
  Search,
  MapPin,
  Phone,
  MessageCircle,
  Tag,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Sparkles,
  Zap,
  ShieldCheck,
  Eye,
  Camera
} from 'lucide-react';

interface MarketplaceProps {
  onNavigateToMyAds?: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onNavigateToMyAds }) => {
  const { farm, marketplaceListings } = useFarm();
  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDetailListing, setSelectedDetailListing] = useState<MarketplaceListing | null>(null);

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
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight truncate">
                AgriSaaS B2B Mandi
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                100% Free For Everyone
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              Direct Phone & WhatsApp • Zero Buyer Fees • Unlimited Free Listings
            </p>
          </div>
        </div>

        {/* Action Buttons */}
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
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-sm active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Post Ad (Free)</span>
          </button>
        </div>
      </div>

      {/* 100% Free Open Marketplace Guarantee Banner */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3 sm:p-3.5 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <div>
            <span className="font-bold text-emerald-900">Zero Middleman Commission: </span>
            <span className="text-emerald-800">
              Farmers post unlimited ads with camera photos; commercial buyers view phone & WhatsApp instantly for free.
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition shrink-0 flex items-center space-x-1"
        >
          <Plus className="w-3 h-3" />
          <span>Upload Item</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, wheat, livestock, chicks, fish seed, tractors..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
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
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Listings 3-Column Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredListings.map((item) => {
            const actualPhone = item.sellerPhone || '+92 300 8472910';
            const cleanPhone = actualPhone.replace(/[^0-9]/g, '');

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/50 transition duration-200 flex flex-col justify-between group"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedDetailListing(item)}
                >
                  
                  {/* Image & Badges */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category Pill */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {item.category.replace('_', ' ')}
                    </div>

                    {/* Verified Farmer Badge */}
                    {item.isVerifiedFarmer && (
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 shadow">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 space-y-2">
                    
                    {/* Price & Quantity */}
                    <div className="flex items-baseline justify-between">
                      <div className="font-mono font-black text-lg text-emerald-800">
                        {symbol} {item.price.toLocaleString()}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
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

                    {/* Location & Seller Info */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center space-x-1 truncate max-w-[140px]">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.locationDistrict}</span>
                      </div>
                      <span className="font-medium truncate max-w-[110px] text-slate-700">
                        {item.sellerName || 'Direct Farm'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Direct 100% Free Actions (WhatsApp & Call) */}
                <div className="p-3 pt-0 grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=Assalam-o-Alaikum, I am interested in your AgriSaaS listing: ${encodeURIComponent(item.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${actualPhone}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 active:scale-95 text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Right: Direct Agri-Sponsor Sidebar Banners */}
        <div className="lg:col-span-1 space-y-4">
          <SponsorBanner placementArea="marketplace_sidebar" variant="sidebar" />
          
          {/* 100% Free Mandi Policy Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-2.5">
            <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Free Mandi</span>
            </div>
            <h4 className="font-bold text-sm text-slate-100">
              Direct Farmer & Buyer Exchange
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No unlock fees. No commissions. Connect directly with producers for fair grain prices, livestock trades, and certified aquaculture seed.
            </p>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MODAL: VIEW LISTING DETAIL
          ========================================================================= */}
      {selectedDetailListing && (
        <MarketplaceListingDetail
          listing={selectedDetailListing}
          onClose={() => setSelectedDetailListing(null)}
          onNavigateToMyAds={onNavigateToMyAds}
        />
      )}

      {/* =========================================================================
          MODAL: CREATE AD WITH REAL CAMERA PHOTO & CLIENT-SIDE COMPRESSION
          ========================================================================= */}
      <CreateAdModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialCategory={selectedCategory === 'all' ? 'crops_harvest' : (selectedCategory as ListingCategory)}
      />

    </div>
  );
};
