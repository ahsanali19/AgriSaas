// src/components/marketplace/MyMarketplaceAds.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { MarketplaceListing, ListingCategory } from '../../types';
import {
  Tag,
  Plus,
  Edit3,
  Trash2,
  Eye,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  X,
  Layers,
  MapPin,
  Coins,
  ArrowRight,
  Filter,
  Milk,
  Sprout,
  Bird,
  Fish,
  Wheat,
  Tractor
} from 'lucide-react';

interface MyMarketplaceAdsProps {
  onNavigateToExploreMarketplace?: () => void;
}

export const MyMarketplaceAds: React.FC<MyMarketplaceAdsProps> = ({ onNavigateToExploreMarketplace }) => {
  const { user } = useAuth();
  const {
    marketplaceListings,
    addMarketplaceListing,
    updateMarketplaceListing,
    deleteMarketplaceListing,
    farm,
    switchFarmerProfile
  } = useFarm();

  // Active status filter
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'sold'>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<MarketplaceListing | null>(null);
  const [deletingAd, setDeletingAd] = useState<MarketplaceListing | null>(null);

  // Notifications
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  // Form State for Create/Edit
  const [formData, setFormData] = useState<{
    title: string;
    category: ListingCategory;
    price: number;
    currency: string;
    quantity: string;
    description: string;
    imageUrl: string;
    locationDistrict: string;
    status: 'active' | 'sold' | 'paused';
  }>({
    title: '',
    category: 'crops_harvest',
    price: 0,
    currency: farm.currency || 'PKR',
    quantity: '',
    description: '',
    imageUrl: '',
    locationDistrict: farm.locationDistrict || 'Sahiwal, Punjab',
    status: 'active'
  });

  // Filter listings belonging to current authenticated user
  const currentUserId = user?.id || 101;
  const userPhone = user?.phoneNumber || '';

  const myAds = marketplaceListings.filter(ad => {
    // Match by explicit userId or seller phone
    if (ad.userId && ad.userId === currentUserId) return true;
    if (userPhone && ad.sellerPhone === userPhone) return true;
    return false;
  });

  const filteredAds = myAds.filter(ad => {
    if (statusFilter === 'all') return true;
    return (ad.status || 'active') === statusFilter;
  });

  // Metrics
  const totalMyAds = myAds.length;
  const activeAdsCount = myAds.filter(a => (a.status || 'active') === 'active').length;
  const totalViews = myAds.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
  const totalInquiries = myAds.reduce((acc, a) => acc + (a.inquiriesCount || 0), 0);

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({
      title: '',
      category: farm.farmType === 'dairy' ? 'dairy_cattle' : farm.farmType === 'poultry' ? 'poultry_birds' : farm.farmType === 'fish' ? 'fish_seed' : 'crops_harvest',
      price: 0,
      currency: farm.currency || 'PKR',
      quantity: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      locationDistrict: farm.locationDistrict || 'Punjab',
      status: 'active'
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (ad: MarketplaceListing) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      category: ad.category,
      price: ad.price,
      currency: ad.currency,
      quantity: ad.quantity,
      description: ad.description || '',
      imageUrl: ad.imageUrl || '',
      locationDistrict: ad.locationDistrict,
      status: ad.status || 'active'
    });
  };

  // Handle Save (Create or Update)
  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorToast('');
    setSuccessToast('');

    if (!formData.title.trim()) {
      setErrorToast('Please enter an ad title.');
      return;
    }
    if (formData.price <= 0) {
      setErrorToast('Price must be greater than 0.');
      return;
    }
    if (!formData.quantity.trim()) {
      setErrorToast('Please specify the available quantity or batch size.');
      return;
    }

    if (editingAd) {
      // Authorization Check performed inside FarmContext
      const result = updateMarketplaceListing(
        editingAd.id,
        {
          title: formData.title.trim(),
          category: formData.category,
          price: Number(formData.price),
          currency: formData.currency,
          quantity: formData.quantity.trim(),
          description: formData.description.trim(),
          imageUrl: formData.imageUrl.trim() || undefined,
          locationDistrict: formData.locationDistrict.trim(),
          status: formData.status
        },
        currentUserId
      );

      if (!result.success) {
        setErrorToast(result.message || 'Authorization failed. You can only edit your own listings.');
        return;
      }

      setSuccessToast(`Ad "${formData.title}" updated successfully!`);
      setEditingAd(null);
    } else {
      // Create new ad
      addMarketplaceListing({
        userId: currentUserId,
        title: formData.title.trim(),
        category: formData.category,
        price: Number(formData.price),
        currency: formData.currency,
        quantity: formData.quantity.trim(),
        sellerName: user?.fullName || farm.name,
        sellerPhone: user?.phoneNumber || '+923001234567',
        locationDistrict: formData.locationDistrict.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: formData.status,
        viewsCount: 1,
        inquiriesCount: 0,
        isVerifiedFarmer: true
      });

      setSuccessToast(`New ad "${formData.title}" is now LIVE on the 100% Free Marketplace!`);
      setIsCreateModalOpen(false);
    }

    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Handle Delete with Confirmation & Auth Check
  const handleConfirmDelete = () => {
    if (!deletingAd) return;
    setErrorToast('');
    setSuccessToast('');

    const result = deleteMarketplaceListing(deletingAd.id, currentUserId);
    if (!result.success) {
      setErrorToast(result.message || 'Security Violation: Cannot delete listings belonging to other farmers.');
      setDeletingAd(null);
      return;
    }

    setSuccessToast(`Ad "${deletingAd.title}" has been permanently removed.`);
    setDeletingAd(null);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Quick Status Toggle (Active <-> Paused <-> Sold)
  const handleQuickStatusChange = (ad: MarketplaceListing, newStatus: 'active' | 'paused' | 'sold') => {
    const result = updateMarketplaceListing(ad.id, { status: newStatus }, currentUserId);
    if (!result.success) {
      setErrorToast(result.message || 'Unauthorized action.');
      return;
    }
    setSuccessToast(`Listing status updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const getCategoryBadge = (category: ListingCategory) => {
    switch (category) {
      case 'dairy_cattle':
        return <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Dairy Livestock</span>;
      case 'crops_harvest':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Crops & Harvest</span>;
      case 'poultry_birds':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Poultry Flock</span>;
      case 'fish_seed':
        return <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Fish & Seed</span>;
      case 'feed_silage':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Feed & Silage</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 border border-slate-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Machinery</span>;
    }
  };

  const getStatusBadge = (status: string = 'active') => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>Live / Active</span>
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
            <Clock className="w-3 h-3" />
            <span>Paused</span>
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-700 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Marked Sold</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-700/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Farmer Ad Management
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-3 py-1 rounded-full font-bold">
                100% Free Marketplace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              My Posted Marketplace Ads
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
              Logged in as <strong className="text-white">{user?.fullName || 'Chaudhry Aslam'}</strong> ({user?.phoneNumber}) • Direct B2B Wholesale Leads
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToExploreMarketplace && (
              <button
                onClick={onNavigateToExploreMarketplace}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl border border-white/20 transition flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore All Ads</span>
              </button>
            )}

            <button
              onClick={openCreateModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-lg transition flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>+ Post New Ad</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Alerts */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorToast && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorToast}</span>
          </div>
          <button onClick={() => setErrorToast('')} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Listings</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalMyAds}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Free Lifetime Active</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live & Visible</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{activeAdsCount}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">Available for B2B buyers</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ad Views</div>
          <div className="text-2xl font-black text-sky-600 mt-1">{totalViews}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">Across Pakistan / India</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiries / Leads</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{totalInquiries}</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">Direct Call & WhatsApp</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-1.5">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          <span className="text-xs font-bold text-slate-600 mr-2">Filter:</span>
          {(['all', 'active', 'paused', 'sold'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold uppercase transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st} {st === 'all' ? `(${myAds.length})` : `(${myAds.filter(a => (a.status || 'active') === st).length})`}
            </button>
          ))}
        </div>

        <button
          onClick={openCreateModal}
          className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Another Item</span>
        </button>
      </div>

      {/* Listings Grid */}
      {filteredAds.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No marketplace ads found in this view</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              You haven't posted any items matching this filter yet. Post your cattle, grain, birds, or farm produce directly to thousands of verified B2B buyers!
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow transition"
          >
            + Create Your First Free Ad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={ad.imageUrl || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={ad.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {getStatusBadge(ad.status)}
                  </div>
                  <div className="absolute top-3 right-3">
                    {getCategoryBadge(ad.category)}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                    <div className="text-xl font-black">
                      Rs. {ad.price.toLocaleString()} <span className="text-xs font-normal opacity-90">{ad.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                    {ad.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-lg">
                      Quantity: <strong>{ad.quantity}</strong>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ad.locationDistrict}</span>
                    </span>
                  </div>

                  {ad.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {ad.description}
                    </p>
                  )}

                  {/* Stats Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ad.viewsCount || 0} Views</span>
                    </span>
                    <span className="flex items-center space-x-1 text-purple-600 font-bold">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{ad.inquiriesCount || 0} Inquiries</span>
                    </span>
                    <span>Posted {ad.postedDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                {/* Quick Status Bar */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[10px] font-bold uppercase text-center">
                  <button
                    onClick={() => handleQuickStatusChange(ad, 'active')}
                    className={`py-1 rounded-lg transition ${
                      ad.status === 'active' || !ad.status
                        ? 'bg-emerald-600 text-white font-black shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleQuickStatusChange(ad, 'paused')}
                    className={`py-1 rounded-lg transition ${
                      ad.status === 'paused'
                        ? 'bg-amber-600 text-white font-black shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => handleQuickStatusChange(ad, 'sold')}
                    className={`py-1 rounded-lg transition ${
                      ad.status === 'sold'
                        ? 'bg-slate-800 text-white font-black shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sold
                  </button>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => openEditModal(ad)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Edit Price / Details</span>
                  </button>

                  <button
                    onClick={() => setDeletingAd(ad)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs p-2 rounded-xl transition border border-rose-200 flex items-center justify-center"
                    title="Delete Ad"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(isCreateModalOpen || editingAd) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingAd ? 'Edit Marketplace Ad' : 'Post New Marketplace Ad'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingAd ? 'Update your price, quantity, or description' : 'Reach thousands of verified B2B buyers across Pakistan / India'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingAd(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ad Title / Product Description *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  placeholder="e.g. Pure Sahiwal Breed Milking Cows (20L Daily Yield)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Marketplace Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ListingCategory })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  >
                    <option value="dairy_cattle">Dairy Cattle & Animals</option>
                    <option value="crops_harvest">Crops, Grain & Harvest</option>
                    <option value="poultry_birds">Poultry Birds & Chicks</option>
                    <option value="fish_seed">Fish & Aquaculture Seed</option>
                    <option value="feed_silage">Silage & Concentrated Feed</option>
                    <option value="machinery">Tractors & Farm Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'sold' | 'paused' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-bold"
                  >
                    <option value="active">Active (Visible to all buyers)</option>
                    <option value="paused">Paused (Temporarily hidden)</option>
                    <option value="sold">Mark as Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selling Price (PKR / Total or Unit) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rs.</span>
                    <input
                      type="number"
                      min="1"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold transition"
                      placeholder="350000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  >
                    <option value="PKR">PKR (₨)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity / Lot Size *
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="e.g. 4 Cows / 28 Metric Tons / 5000 Birds"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location District
                  </label>
                  <input
                    type="text"
                    value={formData.locationDistrict}
                    onChange={(e) => setFormData({ ...formData, locationDistrict: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="e.g. Sahiwal, Punjab"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs transition"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Description & Specifications
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  placeholder="Details regarding vaccination, moisture level, delivery conditions, or pedigree lineage..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingAd(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow transition flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{editingAd ? 'Save Changes' : 'Publish Ad Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingAd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Delete Marketplace Ad?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete <strong className="text-slate-800">"{deletingAd.title}"</strong>? This will remove the listing from the public marketplace and all search results.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Authorization Verified: Only the ad creator (#{deletingAd.userId || 'You'}) can execute this removal.</span>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeletingAd(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow transition"
              >
                Yes, Delete Ad
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyMarketplaceAds;
