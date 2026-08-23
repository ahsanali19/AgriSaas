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
      ctaText: 'Claim Subsidy Voucher',
      status: 'active'
    },
    {
      id: 2,
      sponsorName: 'National Feeds Ltd',
      imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      placementArea: 'dashboard_top',
      link: 'https://www.nationalfeeds.com',
      tagline: 'High-Yield Cattle Wanda & Broiler Mash with 18% crude protein & free farm doorstep delivery.',
      badgeText: 'Verified Feed Partner',
      ctaText: 'Order Wanda in Bulk',
      status: 'active'
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
      ctaText: 'Consult Agronomist',
      status: 'active'
    },
    {
      id: 4,
      sponsorName: 'Fauji Fresh n Freeze',
      imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      placementArea: 'marketplace_sidebar',
      link: 'https://www.fffl.com.pk',
      tagline: 'Guaranteed B2B Buyback Contracts for Sweetcorn, Peas & Vegetable farmers in Punjab.',
      badgeText: 'B2B Procurement Partner',
      ctaText: 'Register Harvest Lot',
      status: 'active'
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
      ctaText: 'View Dosage Guide',
      status: 'active'
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
      ctaText: 'Apply for Zarai Loan',
      status: 'active'
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
      <div className={`bg-slate-900 border border-emerald-500/20 rounded-2xl overflow-hidden shadow-sm text-slate-100 relative ${className}`}>
        {/* Top Tag & Badge */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{banner.badgeText || 'Verified Partner'}</span>
          </div>
          <span className="text-[9px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
            Ad
          </span>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <div className="flex items-center space-x-2.5">
            <img
              src={banner.imageUrl}
              alt={banner.sponsorName}
              className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="font-bold text-xs text-white truncate">{banner.sponsorName}</div>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight mt-0.5">
                {banner.tagline}
              </p>
            </div>
          </div>

          <a
            href={banner.link}
            target="_blank"
            rel="noreferrer"
            onClick={handleBannerClick}
            className="w-full inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition"
          >
            <span>{banner.ctaText || 'View Offer'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Native Dashboard Top Banner (Default & Card Variant - Compact Modern Strip)
  return (
    <div className={`relative bg-slate-900 border border-emerald-500/20 rounded-2xl p-2.5 sm:p-3 text-white shadow-sm overflow-hidden ${className}`}>
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        
        {/* Left: Sponsor Identity & Copy */}
        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/30 shrink-0 bg-slate-800">
            <img
              src={banner.imageUrl}
              alt={banner.sponsorName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{banner.badgeText || 'Direct Agri Partner'}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-200 truncate">
                {banner.sponsorName}
              </span>
            </div>

            <p className="text-xs text-slate-300 line-clamp-1 leading-tight">
              {banner.tagline}
            </p>
          </div>
        </div>

        {/* Right: Native Action CTA */}
        <div className="flex items-center shrink-0 self-end sm:self-auto">
          <a
            href={banner.link}
            target="_blank"
            rel="noreferrer"
            onClick={handleBannerClick}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition active:scale-95 whitespace-nowrap"
          >
            <span>{banner.ctaText || 'Learn More'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
