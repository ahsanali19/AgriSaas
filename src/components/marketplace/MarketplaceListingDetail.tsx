// src/components/marketplace/MarketplaceListingDetail.tsx
import React, { useState } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  ShieldCheck,
  Calendar,
  Share2,
  UserCheck,
  Copy,
  ExternalLink,
  Sparkles,
  Tag
} from 'lucide-react';
import { MarketplaceListing } from '../../types';

export interface MarketplaceListingDetailProps {
  listing: MarketplaceListing;
  onClose: () => void;
  onNavigateToMyAds?: () => void;
}

export const MarketplaceListingDetail: React.FC<MarketplaceListingDetailProps> = ({
  listing,
  onClose,
  onNavigateToMyAds
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Direct phone number
  const sellerPhone = listing.sellerPhone || '+92 300 8472910';
  const cleanPhoneForWhatsApp = sellerPhone.replace(/[^0-9]/g, '');

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(sellerPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out ${listing.title} on GDS 100% Free B2B Mandi: ${sellerPhone}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${listing.title} - Contact: ${sellerPhone} - GDS Free Mandi`);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-auto">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white p-3.5 sm:px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">
              100% Free B2B Mandi • Open Direct Contact
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition flex items-center space-x-1 text-xs"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          
          {/* Hero Image & Badges */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 shadow-inner">
            <img
              src={listing.imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
              alt={listing.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
              {listing.category.replace('_', ' ')}
            </div>

            {/* Verified Farmer Badge */}
            {listing.isVerifiedFarmer && (
              <div className="absolute top-3 right-3 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Direct Producer</span>
              </div>
            )}

            {/* Price & Quantity Overlay */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div className="font-mono font-black text-2xl sm:text-3xl text-emerald-400 drop-shadow">
                  {listing.currency === 'INR' ? '₹' : '₨'} {listing.price.toLocaleString()}
                </div>
                <div className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-white border border-white/20">
                  Available: {listing.quantity}
                </div>
              </div>
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {listing.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center space-x-1 font-semibold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{listing.locationDistrict || 'Punjab'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Posted on {listing.postedDate || 'Recent'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Seller: {listing.sellerName || 'Direct Farm Producer'}</span>
              </span>
            </div>
          </div>

          {/* =========================================================================
              DIRECT 100% FREE CONTACT BOX (WHATSAPP & CALL)
              ========================================================================= */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 text-white space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Direct Producer Contact (100% Free)
                  </div>
                  <div className="text-xs text-slate-300">
                    Connect directly without intermediaries or unlock fees
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Direct Deal
              </span>
            </div>

            {/* Phone display with copy */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="font-mono text-base sm:text-lg font-bold text-white tracking-wider">
                {sellerPhone}
              </div>
              <button
                onClick={handleCopyPhone}
                className="text-xs font-bold text-slate-400 hover:text-emerald-400 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedPhone ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Direct Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href={`https://wa.me/${cleanPhoneForWhatsApp}?text=Assalam-o-Alaikum, I am contacting you regarding your GDS listing: ${encodeURIComponent(listing.title)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-md active:scale-95 text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${sellerPhone}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 active:scale-95 text-center"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Directly</span>
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Lot & Produce Description
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {listing.description || 'Grown and managed under optimal agricultural practices. Available for immediate bulk dispatch, mill delivery, or farm pickup.'}
            </p>
          </div>

          {/* Safety & Quality Tips */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Trading Safety Tip: </span>
              <span>Inspect produce weight slips, moisture certificates, or livestock health tags during physical handover or pickup.</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 sm:px-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>GDS 100% Free B2B Mandi</span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
