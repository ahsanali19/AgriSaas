// src/components/marketplace/Marketplace.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { MarketplaceListing } from '../../types';
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
  Share2
} from 'lucide-react';

const INITIAL_LISTINGS: MarketplaceListing[] = [
  {
    id: 1,
    title: 'Pure Sahiwal Breed Milking Cows (18L Daily Yield)',
    category: 'dairy_cattle',
    price: 320000,
    currency: 'PKR',
    quantity: '3 Cows (2nd Lactation)',
    sellerName: 'Chaudhry Farooq Cattle Farm',
    sellerPhone: '+923008472910',
    locationDistrict: 'Sahiwal, Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Vaccinated against FMD & LSD. High butterfat percentage (4.8%). High genetic potential, docile temperament.',
    postedDate: '2026-08-16',
    isVerifiedFarmer: true
  },
  {
    id: 2,
    title: 'Day-Old Broiler Chicks (Cobb 500 Fast Growth)',
    category: 'poultry_birds',
    price: 95,
    currency: 'PKR',
    quantity: '2,500 Chicks (Vaccinated)',
    sellerName: 'Al-Haq Hatcheries',
    sellerPhone: '+923017654321',
    locationDistrict: 'Faisalabad, Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Marek vaccinated day-old chicks. High livability (98%+), target FCR of 1.45 at 35 days.',
    postedDate: '2026-08-18',
    isVerifiedFarmer: true
  },
  {
    id: 3,
    title: 'Certified Rohu & Grass Carp Fish Fingerlings (3-4 Inches)',
    category: 'fish_seed',
    price: 18,
    currency: 'PKR',
    quantity: '15,000 Fingerlings',
    sellerName: 'Indus Valley Aqua Hatchery',
    sellerPhone: '+923049988776',
    locationDistrict: 'Muzaffargarh, Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'High disease resistance nursery fingerlings. Oxygen-packed delivery available anywhere in Punjab & Sindh.',
    postedDate: '2026-08-15',
    isVerifiedFarmer: true
  },
  {
    id: 4,
    title: 'High-Energy Corn Silage (Vacuum Bales 500kg)',
    category: 'feed_silage',
    price: 14,
    currency: 'PKR',
    quantity: '40 Tons (80 Bales)',
    sellerName: 'Kisan Green Feeds',
    sellerPhone: '+923061234567',
    locationDistrict: 'Okara, Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Grown with Pioneer seed, harvested at ideal milk-line stage. 8.5% crude protein, excellent aroma.',
    postedDate: '2026-08-17',
    isVerifiedFarmer: true
  }
];

export const Marketplace: React.FC = () => {
  const { farm } = useFarm();
  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  const [listings, setListings] = useState<MarketplaceListing[]>(INITIAL_LISTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    title: '',
    category: 'dairy_cattle' as MarketplaceListing['category'],
    price: 50000,
    quantity: '1 Unit',
    sellerName: farm.name || 'Local Farmer',
    sellerPhone: '+923001234567',
    locationDistrict: farm.locationDistrict || 'Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: ''
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.title || !newListing.sellerPhone) return;

    const created: MarketplaceListing = {
      id: Date.now(),
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
      postedDate: new Date().toISOString().split('T')[0],
      isVerifiedFarmer: true
    };

    setListings([created, ...listings]);
    setShowPostModal(false);
    setNewListing({
      title: '',
      category: 'dairy_cattle',
      price: 50000,
      quantity: '1 Unit',
      sellerName: farm.name || 'Local Farmer',
      sellerPhone: '+923001234567',
      locationDistrict: farm.locationDistrict || 'Punjab',
      imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      description: ''
    });
  };

  const categories = [
    { id: 'all', label: 'All Items', icon: '🌾' },
    { id: 'dairy_cattle', label: 'Dairy Cattle & Buffs', icon: '🐄' },
    { id: 'poultry_birds', label: 'Poultry Chicks & Flocks', icon: '🐔' },
    { id: 'fish_seed', label: 'Fish Seed & Fingerlings', icon: '🐟' },
    { id: 'feed_silage', label: 'Silage & Cattle Feed', icon: '🌽' },
    { id: 'machinery', label: 'Tractors & Equipment', icon: '🚜' },
  ];

  const filteredListings = listings.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.locationDistrict.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>B2B Agri Mandi</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">Farmer-to-Farmer Trade</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AgriSaaS B2B Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Buy and sell high-genetic milking cows, day-old chicks, quality fingerlings, corn silage, and farm machinery directly with verified producers without commission middlemen.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowPostModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-3 rounded-2xl transition flex items-center space-x-2 shadow-lg shadow-emerald-950 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post Free Listing</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 text-9xl select-none pointer-events-none transform translate-x-8 translate-y-8">
          🚜
        </div>
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
              placeholder="Search milking cows, chicks, silage, seeds..."
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

      {/* Classifieds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredListings.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between group"
          >
            <div>
              
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

            {/* B2B Action Buttons (WhatsApp & Call) */}
            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
              
              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${item.sellerPhone.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum, I am interested in your AgriSaaS listing: ${encodeURIComponent(item.title)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 text-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {/* Direct Call CTA */}
              <a
                href={`tel:${item.sellerPhone}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 active:scale-95 text-center"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Call Seller</span>
              </a>

            </div>

          </div>
        ))}
      </div>

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
                <h3 className="text-lg font-bold text-slate-900">Post Item on B2B Mandi</h3>
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
                    placeholder="e.g. 2 Cows, 50 Bales, 5000 Seed"
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
                    min="1"
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District / Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahiwal, Punjab"
                    value={newListing.locationDistrict}
                    onChange={(e) => setNewListing({ ...newListing, locationDistrict: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seller / Farm Name</label>
                  <input
                    type="text"
                    required
                    value={newListing.sellerName}
                    onChange={(e) => setNewListing({ ...newListing, sellerName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 1234567"
                    value={newListing.sellerPhone}
                    onChange={(e) => setNewListing({ ...newListing, sellerPhone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newListing.imageUrl}
                  onChange={(e) => setNewListing({ ...newListing, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Health/Genetic Details</label>
                <textarea
                  rows={3}
                  placeholder="Provide vaccination status, daily milk yield records, feed history, delivery availability..."
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95"
                >
                  Publish Active Listing
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Marketplace;
