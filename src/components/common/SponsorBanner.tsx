// src/components/common/SponsorBanner.tsx
import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Sparkles, Tag, ChevronRight, CheckCircle2, Building2 } from 'lucide-react';
import { PlacementArea, SponsorshipBanner } from '../../types';

export interface SponsorBannerProps {
  placementArea?: PlacementArea;
  customBanner?: SponsorshipBanner;
  className?: string;
  variant?: 'card' | 'compact' | 'sidebar' | 'inline';
}

const DEFAULT_SPONSORS: Record<PlacementArea, SponsorshipBanner[]> = {
  dashboard_top: [
    {
      id: 1,
      sponsorName: 'Engro Fertilizers',
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      placementArea: 'dashboard_top',
      link: 'https://www.engrofertilizers.com',
      tagline: 'Exclusive Farmer Subsidy: Save Rs. 450 per bag on direct Engro DAP & Urea seasonal booking.',
      badgeText: 'Official Fertilizer Partner',
      ctaText: 'Claim Subsidy Voucher'
    },
    {
      id: 2,
      sponsorName: 'National Feeds Ltd',
      imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      placementArea: 'dashboard_top',
      link: 'https://www.nationalfeeds.com',
      tagline: 'High-Yield Cattle Wanda & Broiler Mash with 18% crude protein & free farm doorstep delivery.',
      badgeText: 'Verified Feed Partner',
      ctaText: 'Order Wanda in Bulk'
    }
  ],
  marketplace_sidebar: [
    {
      id: 3,
      sponsorName: 'Bayer CropScience',
      imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      placementArea: 'marketplace_sidebar',
      link: 'https://www.cropscience.bayer.pk',
      tagline: 'Certified Hybrid Seeds & Protection for maximum yield per acre.',
      badgeText: 'Crop Protection Partner',
      ctaText: 'Consult Agronomist'
    },
    {
      id: 4,
      sponsorName: 'Fauji Fresh n Freeze',
      imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      placementArea: 'marketplace_sidebar',
      link: 'https://www.fffl.com.pk',
      tagline: 'Guaranteed B2B Buyback Contracts for Sweetcorn, Peas & Vegetable farmers in Punjab.',
      badgeText: 'B2B Procurement Partner',
      ctaText: 'Register Harvest Lot'
    }
  ],
  crops_footer: [
    {
      id: 5,
      sponsorName: 'Fatima Fertilizer (Sarsabz)',
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      placementArea: 'crops_footer',
      link: 'https://sarsabz.fatima-group.com',
      tagline: 'Sarsabz CANGOP & Nitrophos: Optimized soil nutrition for 25% extra wheat harvest.',
      badgeText: 'Soil Nutrition Partner',
      ctaText: 'View Dosage Guide'
    }
  ],
  ledger_top: [
    {
      id: 6,
      sponsorName: 'Habib Bank Zarai Banking',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      placementArea: 'ledger_top',
      link: 'https://www.hbl.com/agriculture',
      tagline: 'Solar Tube-well & Tractor Financing with subsidized markup rates for verified farmers.',
      badgeText: 'Agri Finance Partner',
      ctaText: 'Apply for Zarai Loan'
    }
  ]
};

export const SponsorBanner: React.FC<SponsorBannerProps> = ({
  placementArea = 'dashboard_top',
  customBanner,
  className = '',
  variant
}) => {
  const sponsorsList = DEFAULT_SPONSORS[placementArea] || DEFAULT_SPONSORS.dashboard_top;
  const [currentIndex, setCurrentIndex] = useState(0);
  const banner = customBanner || sponsorsList[currentIndex % sponsorsList.length];

  const handleBannerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Analytics tracking for sponsor ROI
    try {
      if (banner?.id) {
        fetch(`/api/sponsorships/${banner.id}/click`, { method: 'POST' }).catch(() => {});
      }
    } catch (err) {
      // ignore
    }
  };

  if (!banner) return null;

  // Sidebar variant
  if (variant === 'sidebar' || placementArea === 'marketplace_sidebar') {
    return (
      <div className={`bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-lg text-slate-100 relative ${className}`}>
        {/* Top Tag & Badge */}
        <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{banner.badgeText || 'Verified Agri Partner'}</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            Sponsored
          </span>
        </div>

        {/* Image Preview */}
        <div className="relative h-32 w-full overflow-hidden">
          <img
            src={banner.imageUrl}
            alt={banner.sponsorName}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-2 left-4 font-bold text-base text-white drop-shadow">
            {banner.sponsorName}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {banner.tagline}
          </p>

          <a
            href={banner.link}
            target="_blank"
            rel="noreferrer"
            onClick={handleBannerClick}
            className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-md shadow-emerald-950/40"
          >
            <span>{banner.ctaText || 'View Partner Offer'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Native Dashboard Top Banner (Default & Card Variant)
  return (
    <div className={`relative bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-600/30 rounded-3xl p-4 sm:p-5 text-white shadow-md overflow-hidden ${className}`}>
      
      {/* Subtle Background Ambience */}
      <div className="absolute -right-8 -top-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Sponsor Identity & Copy */}
        <div className="flex items-start sm:items-center space-x-3.5 flex-1 min-w-0">
          
          {/* Sponsor Thumbnail */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-emerald-500/40 shrink-0 shadow-inner bg-slate-800">
            <img
              src={banner.imageUrl}
              alt={banner.sponsorName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{banner.badgeText || 'Direct Agri Partner'}</span>
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                Official B2B Sponsor
              </span>
              <span className="text-xs font-bold text-slate-200 truncate">
                • {banner.sponsorName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2 md:line-clamp-1 leading-snug">
              {banner.tagline}
            </p>
          </div>

        </div>

        {/* Right: Native Action CTA */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          <a
            href={banner.link}
            target="_blank"
            rel="noreferrer"
            onClick={handleBannerClick}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl transition shadow-lg shadow-emerald-950/40 active:scale-95 whitespace-nowrap"
          >
            <span>{banner.ctaText || 'Learn More'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
};
