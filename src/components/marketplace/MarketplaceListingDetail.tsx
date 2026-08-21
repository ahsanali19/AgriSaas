// src/components/marketplace/MarketplaceListingDetail.tsx
import React, { useState } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Lock,
  Unlock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Building2,
  Wallet,
  Sparkles,
  AlertCircle,
  Eye,
  Calendar,
  Share2,
  UserCheck
} from 'lucide-react';
import { MarketplaceListing, Buyer } from '../../types';

export interface MarketplaceListingDetailProps {
  listing: MarketplaceListing;
  onClose: () => void;
  viewerMode?: 'buyer' | 'farmer';
  buyerWallet?: number;
  onUnlockLead?: (listingId: number, unlockFee: number) => Promise<{ success: boolean; farmerPhone?: string; message?: string }>;
}

export const MarketplaceListingDetail: React.FC<MarketplaceListingDetailProps> = ({
  listing,
  onClose,
  viewerMode: initialViewerMode = 'buyer',
  buyerWallet: initialBuyerWallet = 2500,
  onUnlockLead
}) => {
  const [viewerMode, setViewerMode] = useState<'buyer' | 'farmer'>(initialViewerMode);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [buyerWallet, setBuyerWallet] = useState<number>(initialBuyerWallet);
  const [revealedPhone, setRevealedPhone] = useState<string>('');
  const [unlockSuccessMsg, setUnlockSuccessMsg] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);

  const UNLOCK_FEE = 100; // Rs. 100

  // Real phone number fallback from listing
  const actualPhone = listing.sellerPhone || '+92 300 8472910';

  // Format masked phone for locked state
  const maskedPhone = actualPhone.length > 7
    ? `${actualPhone.substring(0, 7)} •••••••`
    : '+92 300 •••••••';

  const currentDisplayPhone = isUnlocked ? (revealedPhone || actualPhone) : maskedPhone;

  const handleUnlockClick = async () => {
    setErrorMessage('');
    if (buyerWallet < UNLOCK_FEE) {
      setErrorMessage(`Insufficient wallet balance. You have Rs. ${buyerWallet.toLocaleString()}, but Rs. ${UNLOCK_FEE} is required.`);
      return;
    }

    setIsUnlocking(true);

    try {
      if (onUnlockLead) {
        const result = await onUnlockLead(listing.id, UNLOCK_FEE);
        if (result.success) {
          setIsUnlocked(true);
          setRevealedPhone(result.farmerPhone || actualPhone);
          setBuyerWallet(prev => Math.max(0, prev - UNLOCK_FEE));
          setUnlockSuccessMsg('Direct farmer contact unlocked successfully! Rs. 100 debited from buyer wallet.');
        } else {
          setErrorMessage(result.message || 'Could not unlock lead.');
        }
      } else {
        // Simulated local fallback for offline/preview
        await new Promise(r => setTimeout(r, 600));
        setIsUnlocked(true);
        setRevealedPhone(actualPhone);
        setBuyerWallet(prev => Math.max(0, prev - UNLOCK_FEE));
        setUnlockSuccessMsg('Direct farmer contact unlocked successfully! Rs. 100 debited from buyer wallet.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while unlocking.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleTopUp = (amount: number) => {
    setBuyerWallet(prev => prev + amount);
    setShowTopUpModal(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-auto animate-fadeIn">
        
        {/* Top Perspective Switcher & Close Bar */}
        <div className="bg-slate-900 text-white p-3.5 sm:px-6 flex items-center justify-between border-b border-slate-800">
          
          {/* Mode Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
              Viewing Perspective:
            </span>
            <div className="inline-flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setViewerMode('buyer')}
                className={`px-3 py-1 rounded-lg transition ${
                  viewerMode === 'buyer'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Commercial Buyer Mode
              </button>
              <button
                onClick={() => setViewerMode('farmer')}
                className={`px-3 py-1 rounded-lg transition ${
                  viewerMode === 'farmer'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Farmer View
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Hero Image & Tags */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 shadow-inner">
            <img
              src={listing.imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
              alt={listing.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {listing.category.replace('_', ' ')}
            </div>

            {listing.isVerifiedFarmer && (
              <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Direct Producer</span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-baseline justify-between">
                <div className="font-mono font-black text-2xl sm:text-3xl text-emerald-400 drop-shadow">
                  Rs. {listing.price.toLocaleString()}
                </div>
                <div className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-white">
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
                <span>{listing.locationDistrict || 'Punjab, Pakistan'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Posted on {listing.postedDate || 'Recent'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Seller: {listing.sellerName || 'Direct Farm Estate'}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Lot & Produce Description
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {listing.description || 'Harvested under optimal agricultural practices. Inspected for quality, moisture content, and authentic grade. Available for immediate bulk dispatch or farm pickup.'}
            </p>
          </div>

          {/* ================================================================= */}
          {/* SECTION: PERSPECTIVE LOGIC (BUYER VS FARMER) */}
          {/* ================================================================= */}

          {viewerMode === 'farmer' ? (
            /* FARMER VIEW: Read-Only Info */
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-2 text-slate-800">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Farmer Listing Status: Active on Mandi</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                As a farmer, your listing is completely free and visible to thousands of verified B2B buyers, mills, and traders across South Asia. Commercial buyers pay AgriSaaS to unlock your direct contact details.
              </p>
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                <span>Registered Contact Number:</span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-900">
                  {actualPhone}
                </span>
              </div>
            </div>
          ) : (
            /* BUYER VIEW: Pay-Per-Lead Unlock Flow */
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 space-y-4 border border-slate-800 shadow-lg relative overflow-hidden">
              
              {/* Top Header: Contact Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {isUnlocked ? 'Direct Farmer Contact (Unlocked)' : 'Direct Farmer Contact (Locked)'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isUnlocked
                        ? 'Lead unlocked. You can now negotiate directly with the producer.'
                        : 'Contact details are masked to protect direct producer authenticity.'}
                    </p>
                  </div>
                </div>

                {/* Buyer Wallet Meter */}
                <div className="flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 self-start sm:self-auto">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-slate-300">Wallet:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Rs. {buyerWallet.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setShowTopUpModal(true)}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline ml-1"
                  >
                    +Add
                  </button>
                </div>
              </div>

              {/* Success Message Banner */}
              {unlockSuccessMsg && (
                <div className="bg-emerald-950/80 border border-emerald-500/50 p-3 rounded-2xl flex items-start space-x-2 text-xs text-emerald-200 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{unlockSuccessMsg}</span>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-950/80 border border-red-500/50 p-3 rounded-2xl flex items-start space-x-2 text-xs text-red-200 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Phone Display Box */}
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Producer Mobile / WhatsApp
                  </span>
                  <div className="font-mono text-base sm:text-lg font-bold text-white tracking-wider">
                    {currentDisplayPhone}
                  </div>
                </div>

                {isUnlocked ? (
                  /* Action buttons when lead is unlocked */
                  <div className="flex items-center space-x-2">
                    <a
                      href={`https://wa.me/${currentDisplayPhone.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum, I am a commercial buyer from AgriSaaS interested in: ${encodeURIComponent(listing.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center space-x-1.5 shadow active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Direct</span>
                    </a>
                    <a
                      href={`tel:${currentDisplayPhone}`}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center space-x-1.5 active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Farmer</span>
                    </a>
                  </div>
                ) : (
                  /* Unlock Button when lead is locked */
                  <button
                    onClick={handleUnlockClick}
                    disabled={isUnlocking}
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-950/50 transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{isUnlocking ? 'Unlocking...' : `Unlock Farmer Contact (Rs. ${UNLOCK_FEE})`}</span>
                  </button>
                )}
              </div>

              {!isUnlocked && (
                <p className="text-[11px] text-slate-400 leading-relaxed text-center sm:text-left">
                  💡 <strong>How it works:</strong> Clicking unlock debits <strong>Rs. 100</strong> from your buyer prepaid balance. You immediately receive the verified farmer's unmasked mobile and WhatsApp for direct trading.
                </p>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 sm:px-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AgriSaaS B2B Mandi Protection</span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>

      {/* Quick Buyer Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Recharge Buyer Wallet</span>
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select an instant top-up package to unlock farm leads via JazzCash, EasyPaisa, or Direct Bank Transfer.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleTopUp(amt)}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-center space-y-1 transition"
                >
                  <div className="font-bold text-xs text-emerald-900">Rs. {amt}</div>
                  <div className="text-[10px] text-emerald-600">{amt / 100} Leads</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleTopUp(1000)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              Simulate Instant JazzCash Recharge (Rs. 1,000)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
