// src/components/marketplace/CreateAdModal.tsx
import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Tag,
  Phone,
  MapPin,
  RefreshCw,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { ListingCategory, MarketplaceListing } from '../../types';
import { compressImage, CompressedImageResult } from '../../utils/imageCompressor';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ListingCategory;
  onSuccess?: (newListing: Partial<MarketplaceListing>) => void;
}

const PRESET_IMAGES: { label: string; category: ListingCategory; url: string }[] = [
  { label: 'Sahiwal Cow', category: 'dairy_cattle', url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: 'Wheat Grain', category: 'crops_harvest', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: 'Broiler Chicks', category: 'poultry_birds', url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: 'Freshwater Fish', category: 'fish_seed', url: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: 'Corn Silage', category: 'feed_silage', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: 'Millat Tractor', category: 'machinery', url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'crops_harvest',
  onSuccess
}) => {
  const { farm, addMarketplaceListing } = useFarm();
  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListingCategory>(initialCategory);
  const [price, setPrice] = useState<number | ''>(50000);
  const [quantity, setQuantity] = useState('');
  const [sellerName, setSellerName] = useState(farm.name || 'Local Farmer');
  const [sellerPhone, setSellerPhone] = useState('+92 300 1234567');
  const [locationDistrict, setLocationDistrict] = useState(farm.locationDistrict || 'Punjab');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Compression & Upload State
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressedImageResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Hidden File Inputs Refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process File Selection & Compression
  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setErrorMsg('');
    setIsCompressing(true);

    try {
      // Execute client-side compression (resizing to max 1080px & compressing under 500KB)
      const result = await compressImage(file, {
        maxWidth: 1080,
        maxHeight: 1080,
        quality: 0.7,
        maxSizeKB: 450
      });

      setCompressionResult(result);
      // Set the compressed base64 data string as the image URL
      setImageUrl(result.dataUrl);
    } catch (err: any) {
      console.error('Image compression failed:', err);
      setErrorMsg('Failed to compress image. Please try another photo.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileProcess(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSelectPreset = (presetUrl: string, presetCat: ListingCategory) => {
    setImageUrl(presetUrl);
    setCategory(presetCat);
    setCompressionResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter an ad title.');
      return;
    }
    if (!sellerPhone.trim()) {
      setErrorMsg('Please enter your direct WhatsApp or phone number so buyers can reach you.');
      return;
    }
    if (!quantity.trim()) {
      setErrorMsg('Please specify the quantity or batch available.');
      return;
    }

    const finalImageUrl = imageUrl || PRESET_IMAGES.find(p => p.category === category)?.url || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    const listingPayload = {
      title: title.trim(),
      category,
      price: Number(price) || 0,
      currency: farm.currency || 'PKR',
      quantity: quantity.trim(),
      sellerName: sellerName.trim() || farm.name || 'Direct Producer',
      sellerPhone: sellerPhone.trim(),
      locationDistrict: locationDistrict.trim() || 'Punjab',
      imageUrl: finalImageUrl,
      description: description.trim() || 'Direct verified farm listing on 100% Free AgriSaaS Mandi.',
      isVerifiedFarmer: true,
      status: 'active' as const
    };

    addMarketplaceListing(listingPayload);

    if (onSuccess) {
      onSuccess(listingPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto border border-slate-200 my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 flex items-center justify-center font-bold text-lg">
              🚜
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base sm:text-lg font-black text-slate-900">Post Free Mandi Listing</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  100% Free
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Direct buyer contact • No unlock fees • Zero commission
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Guarantee Callout */}
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3 flex items-start space-x-2.5 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Open Direct Marketplace: </span>
            <span>Your phone number and WhatsApp are immediately visible to all buyers. No one pays to unlock contact.</span>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* =========================================================================
              PHOTO UPLOAD & CLIENT-SIDE COMPRESSION SECTION
              ========================================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Upload Real Item Photo *</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                ⚡ Auto-compressed in browser under 500KB
              </span>
            </div>

            {/* Hidden Inputs for Camera and Gallery */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
              id="camera-capture-input"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-gallery-input"
            />

            {/* Image Preview & Compression Stats OR Upload Dropzone */}
            {imageUrl ? (
              <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-slate-900 overflow-hidden group shadow-sm">
                <div className="relative h-48 w-full bg-slate-950 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt="Uploaded produce"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                {/* Compression Metrics Tag */}
                {compressionResult && (
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl flex items-center space-x-1.5 shadow">
                    <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>
                      {compressionResult.originalSizeFormatted} ➔ {compressionResult.compressedSizeFormatted} ({compressionResult.savedPercentage}% saved)
                    </span>
                  </div>
                )}

                {/* Retake / Change Buttons */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow transition flex items-center space-x-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Retake Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl border border-slate-700 shadow transition flex items-center space-x-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-300 hover:border-emerald-500/80 bg-slate-50'
                }`}
              >
                {isCompressing ? (
                  <div className="py-4 space-y-2 flex flex-col items-center">
                    <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                    <div className="text-xs font-bold text-slate-800">
                      Compressing image in browser...
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Optimizing resolution and quality to save internet data
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-center items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center space-x-2 active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo (Camera)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center space-x-2 active:scale-95"
                      >
                        <Upload className="w-4 h-4 text-slate-600" />
                        <span>Upload Gallery</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Or drag and drop your photo here (JPG, PNG, WebP up to 15MB)
                    </p>

                    {/* Quick Presets */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Or pick a sample category photo:
                      </div>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleSelectPreset(preset.url, preset.category)}
                            className="text-[11px] px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-slate-700 font-medium transition"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Listing Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sahiwal Breed Milking Cow, 10 Tons Basmati Rice 1121"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Category & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ListingCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="crops_harvest">🌾 Harvested Crops & Grains</option>
                <option value="dairy_cattle">🐄 Dairy Cattle & Buffs</option>
                <option value="poultry_birds">🐔 Poultry Birds & Chicks</option>
                <option value="fish_seed">🐟 Fish Seed & Fingerlings</option>
                <option value="feed_silage">🌽 Silage & Animal Feed</option>
                <option value="machinery">🚜 Farm Machinery & Tools</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity Available *</label>
              <input
                type="text"
                required
                placeholder="e.g. 25 Tons, 3 Animals, 5000 Chicks"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Price & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Price ({symbol}) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="50000"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District / Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sahiwal, Okara, Faisalabad"
                value={locationDistrict}
                onChange={(e) => setLocationDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Seller Name & Direct Phone/WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Seller / Farm Name</label>
              <input
                type="text"
                placeholder="Chaudhry Farm Estate"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Direct Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="+92 300 1234567"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Quality Specs</label>
            <textarea
              rows={2}
              placeholder="Describe breed quality, vaccination history, moisture content, delivery or pickup terms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCompressing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Publish 100% Free Listing</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
