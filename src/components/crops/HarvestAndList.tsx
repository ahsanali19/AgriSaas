// src/components/crops/HarvestAndList.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  Sprout,
  ShoppingBag,
  Warehouse,
  CheckCircle2,
  X,
  ArrowRight,
  TrendingUp,
  Tag,
  MapPin,
  Sparkles,
  Layers
} from 'lucide-react';
import { Crop } from '../../types';

interface HarvestAndListProps {
  onClose: () => void;
  initialCropId?: number;
  onNavigateToMarketplace?: () => void;
}

export const HarvestAndList: React.FC<HarvestAndListProps> = ({
  onClose,
  initialCropId,
  onNavigateToMarketplace
}) => {
  const { farm, crops, logCropHarvest, postCropHarvestToMarketplace, cropInventories } = useFarm();
  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  // Available ready-to-harvest crops
  const unharvestedCrops = crops.filter(c => c.status !== 'harvested');
  const [selectedCropId, setSelectedCropId] = useState<number>(
    initialCropId || unharvestedCrops[0]?.id || crops[0]?.id || 1
  );

  const selectedCrop = crops.find(c => c.id === Number(selectedCropId));

  // Yield Inputs
  const [yieldUnit, setYieldUnit] = useState<'kg' | 'tons' | 'maunds'>('tons');
  const [yieldValue, setYieldValue] = useState<string>('25');
  const [storageLocation, setStorageLocation] = useState<string>('Farm Main Silo & Storage Shed');
  
  // Marketplace Posting Options
  const [postToMarketplaceDirectly, setPostToMarketplaceDirectly] = useState<boolean>(true);
  const [listingTitle, setListingTitle] = useState<string>(
    selectedCrop ? `25 Tons of Fresh ${selectedCrop.cropName} for Sale` : '25 Tons of Grain for Sale'
  );
  const [expectedPricePerUnit, setExpectedPricePerUnit] = useState<string>('3900');
  const [listingDescription, setListingDescription] = useState<string>(
    selectedCrop
      ? `High-quality harvested ${selectedCrop.cropName} (${selectedCrop.variety || 'A-Grade'}). Cleaned, dry grain stored in safe moisture conditions. Available directly for mills and bulk buyers.`
      : 'Freshly harvested yield available directly from our farm.'
  );

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdSummary, setCreatedSummary] = useState<{
    cropName: string;
    totalKg: number;
    listed: boolean;
  } | null>(null);

  // Auto-update title when crop or yield changes
  const handleCropChange = (cropId: number) => {
    setSelectedCropId(cropId);
    const cr = crops.find(c => c.id === cropId);
    if (cr) {
      const unitLabel = yieldUnit === 'tons' ? 'Tons' : yieldUnit === 'maunds' ? 'Maunds (من)' : 'KG';
      setListingTitle(`${yieldValue} ${unitLabel} of ${cr.cropName} for Sale`);
      setListingDescription(
        `High-quality harvested ${cr.cropName} (${cr.variety || 'A-Grade'}). Cleaned, dry grain stored in safe moisture conditions. Available directly for mills and bulk buyers.`
      );
    }
  };

  const handleYieldChange = (val: string, unit: 'kg' | 'tons' | 'maunds') => {
    setYieldValue(val);
    setYieldUnit(unit);
    const cr = selectedCrop;
    if (cr) {
      const unitLabel = unit === 'tons' ? 'Tons' : unit === 'maunds' ? 'Maunds' : 'KG';
      setListingTitle(`${val} ${unitLabel} of ${cr.cropName} for Sale`);
    }
  };

  const calculateTotalKg = (): number => {
    const num = parseFloat(yieldValue) || 0;
    if (yieldUnit === 'tons') return num * 1000;
    if (yieldUnit === 'maunds') return num * 40;
    return num;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropId) return;

    const totalKg = calculateTotalKg();
    if (totalKg <= 0) return;

    // 1. Log Harvest into crop_inventory and set crop status to 'harvested'
    logCropHarvest(Number(selectedCropId), totalKg, storageLocation);

    // 2. If farmer wants to post to B2B Marketplace directly
    if (postToMarketplaceDirectly) {
      const tempInvId = Date.now();
      const unitLabel = yieldUnit === 'tons' ? 'Tons' : yieldUnit === 'maunds' ? 'Maunds' : 'kg';
      postCropHarvestToMarketplace(tempInvId, {
        title: listingTitle.trim() || `${yieldValue} ${unitLabel} of ${selectedCrop?.cropName || 'Crops'} for Sale`,
        description: listingDescription.trim(),
        expectedPrice: Number(expectedPricePerUnit) || 0,
        quantity: `${yieldValue} ${unitLabel} (${totalKg.toLocaleString()} kg)`
      });
    }

    setCreatedSummary({
      cropName: selectedCrop?.cropName || 'Crop',
      totalKg,
      listed: postToMarketplaceDirectly
    });
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Harvest Crop & Post to Marketplace</h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Log your final yield and instantly create a public listing for buyers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess && createdSummary ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Yield Logged & Recorded Successfully!
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  {createdSummary.cropName} harvest ({createdSummary.totalKg.toLocaleString()} kg) is saved in your Farm Inventory.
                </p>
              </div>

              {createdSummary.listed && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-sm">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Live on B2B Marketplace</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Buyers in your district can now view and inquire about your {createdSummary.cropName} listing directly.
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-colors"
                >
                  Close & Back to Crops
                </button>
                {onNavigateToMarketplace && createdSummary.listed && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToMarketplace();
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>View in Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Choose Crop */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Active Crop to Harvest *
                </label>
                {crops.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
                    No active crops found. Please add a crop first.
                  </div>
                ) : (
                  <select
                    value={selectedCropId}
                    onChange={e => handleCropChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                    required
                  >
                    {crops.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.cropName} ({c.landAreaAcres} Acres) - Status: {c.status}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Step 2: Final Harvest Yield */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                    <Warehouse className="w-4 h-4 text-emerald-600" />
                    <span>Harvest Yield Quantity *</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    Total: <strong className="text-emerald-700">{calculateTotalKg().toLocaleString()} KG</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      value={yieldValue}
                      onChange={e => handleYieldChange(e.target.value, yieldUnit)}
                      placeholder="e.g. 25"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={yieldUnit}
                      onChange={e =>
                        handleYieldChange(yieldValue, e.target.value as 'kg' | 'tons' | 'maunds')
                      }
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                    >
                      <option value="tons">Metric Tons</option>
                      <option value="maunds">Maunds (من = 40kg)</option>
                      <option value="kg">Kilograms (KG)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Storage Godown / Location
                  </label>
                  <input
                    type="text"
                    value={storageLocation}
                    onChange={e => setStorageLocation(e.target.value)}
                    placeholder="e.g. Farm Main Silo #1 or Central Godown"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Step 3: Marketplace Listing Toggle & Config */}
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Post to B2B Marketplace
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Make this yield visible to flour mills, feed factories & grain merchants
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postToMarketplaceDirectly}
                      onChange={e => setPostToMarketplaceDirectly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {postToMarketplaceDirectly && (
                  <div className="space-y-3 pt-2 border-t border-emerald-100 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Listing Headline / Title *
                      </label>
                      <input
                        type="text"
                        value={listingTitle}
                        onChange={e => setListingTitle(e.target.value)}
                        placeholder="e.g. 50 Tons of Wheat for Sale"
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required={postToMarketplaceDirectly}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Expected Price ({symbol}) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                            {symbol}
                          </span>
                          <input
                            type="number"
                            value={expectedPricePerUnit}
                            onChange={e => setExpectedPricePerUnit(e.target.value)}
                            placeholder="e.g. 3900"
                            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            required={postToMarketplaceDirectly}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Per Maund (40kg) / Per Ton
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Location / Mandi
                        </label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            readOnly
                            value={farm.locationDistrict || 'Sahiwal, Punjab'}
                            className="w-full pl-8 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Buyer Description & Quality Specs
                      </label>
                      <textarea
                        rows={2}
                        value={listingDescription}
                        onChange={e => setListingDescription(e.target.value)}
                        placeholder="State moisture percentage, variety, bagging details..."
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Sprout className="w-4 h-4" />
                  <span>
                    {postToMarketplaceDirectly
                      ? 'Harvest & Post to Marketplace'
                      : 'Store in Crop Inventory Only'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
