// src/components/crops/CropDashboard.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  Sprout,
  Plus,
  Receipt,
  ShoppingBag,
  Warehouse,
  Calendar,
  AlertCircle,
  Clock,
  TrendingUp,
  Pencil,
  Trash2,
  X,
  Droplets,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  Tag,
  DollarSign,
  Info
} from 'lucide-react';
import { Crop, CropExpense, CropInventory } from '../../types';
import { CropExpenseForm } from './CropExpenseForm';
import { HarvestAndList } from './HarvestAndList';

interface CropDashboardProps {
  onNavigateToMarketplace?: () => void;
}

export const CropDashboard: React.FC<CropDashboardProps> = ({ onNavigateToMarketplace }) => {
  const {
    farm,
    crops,
    cropExpenses,
    cropInventories,
    addCrop,
    updateCrop,
    deleteCrop,
    postCropHarvestToMarketplace
  } = useFarm();

  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  // Sub-tabs
  const [activeTab, setActiveTab] = useState<'crops' | 'inventory' | 'expenses'>('crops');

  // Modals
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showEditCropModal, setShowEditCropModal] = useState(false);
  const [showDeleteCropDialog, setShowDeleteCropDialog] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [harvestTargetCropId, setHarvestTargetCropId] = useState<number | undefined>(undefined);

  // Selected crop for Edit/Delete
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  // Form fields for Add/Edit Crop
  const [cropName, setCropName] = useState('Sugarcane (کماد)');
  const [variety, setVariety] = useState('CPF-249 Early High Sugar');
  const [landAreaAcres, setLandAreaAcres] = useState('10');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(
    new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [cropStatus, setCropStatus] = useState<Crop['status']>('vegetative');
  const [cropNotes, setCropNotes] = useState('');

  // Quick Post modal state for an existing inventory item
  const [showQuickPostModal, setShowQuickPostModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<CropInventory | null>(null);
  const [quickPostTitle, setQuickPostTitle] = useState('');
  const [quickPostPrice, setQuickPostPrice] = useState('');
  const [quickPostDesc, setQuickPostDesc] = useState('');

  // Calculations
  const totalLandAcres = crops
    .filter(c => c.status !== 'harvested')
    .reduce((sum, c) => sum + Number(c.landAreaAcres), 0);

  const totalExpenseAmount = cropExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const totalInventoryKg = cropInventories.reduce((sum, inv) => sum + Number(inv.availableQuantity), 0);

  const listedInventoryCount = cropInventories.filter(inv => inv.isListedOnMarketplace).length;

  // Open Edit Crop Form
  const handleOpenEdit = (crop: Crop) => {
    setSelectedCrop(crop);
    setCropName(crop.cropName);
    setVariety(crop.variety || '');
    setLandAreaAcres(String(crop.landAreaAcres));
    setSowingDate(crop.sowingDate);
    setExpectedHarvestDate(crop.expectedHarvestDate);
    setCropStatus(crop.status);
    setCropNotes(crop.notes || '');
    setShowEditCropModal(true);
  };

  // Open Delete Crop Dialog
  const handleOpenDelete = (crop: Crop) => {
    setSelectedCrop(crop);
    setShowDeleteCropDialog(true);
  };

  // Submit Add Crop
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !landAreaAcres) return;

    addCrop({
      cropName: cropName.trim(),
      variety: variety.trim(),
      landAreaAcres: Number(landAreaAcres),
      sowingDate,
      expectedHarvestDate,
      status: cropStatus,
      notes: cropNotes.trim()
    });

    setShowAddCropModal(false);
    setCropName('Wheat (گندم)');
    setVariety('Akbar 2019');
    setLandAreaAcres('5');
  };

  // Submit Edit Crop
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop) return;

    updateCrop(selectedCrop.id, {
      cropName: cropName.trim(),
      variety: variety.trim(),
      landAreaAcres: Number(landAreaAcres),
      sowingDate,
      expectedHarvestDate,
      status: cropStatus,
      notes: cropNotes.trim()
    });

    setShowEditCropModal(false);
    setSelectedCrop(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!selectedCrop) return;
    deleteCrop(selectedCrop.id);
    setShowDeleteCropDialog(false);
    setSelectedCrop(null);
  };

  // Trigger Harvest Modal for a specific crop
  const handleTriggerHarvest = (cropId: number) => {
    setHarvestTargetCropId(cropId);
    setShowHarvestModal(true);
  };

  // Open Quick Post modal for an inventory item
  const handleOpenQuickPost = (item: CropInventory) => {
    setSelectedInventoryItem(item);
    const tons = (item.availableQuantity / 1000).toFixed(1);
    setQuickPostTitle(`${tons} Tons of ${item.cropName} for Sale`);
    setQuickPostPrice('3950');
    setQuickPostDesc(
      `Clean, dry harvested ${item.cropName} available directly from our farm. Located at ${item.storageLocation || 'Farm Silo'}. Available for bulk pickup.`
    );
    setShowQuickPostModal(true);
  };

  const handleQuickPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventoryItem) return;

    postCropHarvestToMarketplace(selectedInventoryItem.id, {
      title: quickPostTitle.trim(),
      description: quickPostDesc.trim(),
      expectedPrice: Number(quickPostPrice) || 0,
      quantity: `${(selectedInventoryItem.availableQuantity / 1000).toFixed(1)} Tons (${selectedInventoryItem.availableQuantity.toLocaleString()} kg)`
    });

    setShowQuickPostModal(false);
    setSelectedInventoryItem(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Sprout className="w-3 h-3" />
                <span>Farmer Crops & Harvest</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">{farm.name || 'AgriSaaS Farm'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Farmer Crops & Harvest Lifecycle
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track sowing to harvest, log stage-wise input expenses, and directly list your harvested yields on the B2B Marketplace with a single click.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddCropModal(true)}
              className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-2xl text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Add New Crop</span>
            </button>

            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/40 text-white font-bold rounded-2xl text-xs transition-all flex items-center space-x-1.5"
            >
              <Receipt className="w-4 h-4 text-emerald-200" />
              <span>Log Expense</span>
            </button>

            <button
              onClick={() => {
                setHarvestTargetCropId(undefined);
                setShowHarvestModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-amber-100" />
              <span>Harvest & List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Land Utilized
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {totalLandAcres}{' '}
              <span className="text-xs font-semibold text-slate-500">Acres</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {crops.filter(c => c.status !== 'harvested').length} Active Fields
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Input Expenses
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              {symbol} {totalExpenseAmount.toLocaleString()}
            </h3>
            <p className="text-[11px] text-teal-600 font-medium mt-0.5">
              {cropExpenses.length} Stage Entries
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Grain in Inventory
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {(totalInventoryKg / 1000).toFixed(1)}{' '}
              <span className="text-xs font-semibold text-slate-500">Tons</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {totalInventoryKg.toLocaleString()} KG Total Yield
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Marketplace
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {listedInventoryCount}{' '}
              <span className="text-xs font-semibold text-slate-500">Listings</span>
            </h3>
            <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
              Live for B2B Buyers
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('crops')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'crops'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Active Crops & Fields ({crops.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'inventory'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Harvested Yield & Inventory ({cropInventories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'expenses'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Stage Expenses ({cropExpenses.length})</span>
          </button>
        </div>

        {activeTab === 'inventory' && onNavigateToMarketplace && (
          <button
            onClick={onNavigateToMarketplace}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>Open Marketplace Mandi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE CROPS TABLE (CRUD) */}
      {/* ========================================================================= */}
      {activeTab === 'crops' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span>Crop Lifecycle & Farm Plots (farmer_crops)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your active cultivation, sowing timelines, and harvest readiness.
              </p>
            </div>
            <button
              onClick={() => setShowAddCropModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Crop</span>
            </button>
          </div>

          {crops.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sprout className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Crops Registered Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Get started by adding your current wheat, sugarcane, cotton, or rice fields.
              </p>
              <button
                onClick={() => setShowAddCropModal(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs"
              >
                + Add Your First Crop
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Crop Name & Variety</th>
                    <th className="py-3 px-4">Land Area</th>
                    <th className="py-3 px-4">Sowing Date</th>
                    <th className="py-3 px-4">Expected Harvest</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-center">Harvest Action</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {crops.map((crop) => {
                    const isHarvested = crop.status === 'harvested';
                    return (
                      <tr key={crop.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-sm text-slate-900">{crop.cropName}</div>
                          {crop.variety && (
                            <div className="text-[11px] text-slate-500 font-medium">
                              Variety: {crop.variety}
                            </div>
                          )}
                          {crop.notes && (
                            <div className="text-[10px] text-slate-400 italic truncate max-w-xs">
                              {crop.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {crop.landAreaAcres} Acres
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {crop.sowingDate}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {crop.expectedHarvestDate}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              crop.status === 'harvested'
                                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                : crop.status === 'harvest_ready'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                                : crop.status === 'flowering'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : crop.status === 'vegetative'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {crop.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isHarvested ? (
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Harvested</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleTriggerHarvest(crop.id)}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold text-[11px] transition-colors inline-flex items-center space-x-1"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                              <span>Harvest & Post</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenEdit(crop)}
                              title="Edit Crop"
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(crop)}
                              title="Delete Crop"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HARVESTED YIELD & INVENTORY (crop_inventory) */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Warehouse className="w-5 h-5 text-emerald-600" />
                <span>Crop Inventory & Storage (crop_inventory)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Yields stored in your farm silos and available to list directly on the B2B Marketplace.
              </p>
            </div>
            <button
              onClick={() => {
                setHarvestTargetCropId(undefined);
                setShowHarvestModal(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Harvest Yield</span>
            </button>
          </div>

          {cropInventories.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Warehouse className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Harvested Inventory Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Once you harvest your active crops, the yields will appear here ready to be listed for buyers.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Harvested Crop</th>
                    <th className="py-3 px-4">Total Yield</th>
                    <th className="py-3 px-4">Available Quantity</th>
                    <th className="py-3 px-4">Storage Location</th>
                    <th className="py-3 px-4">Harvest Date</th>
                    <th className="py-3 px-4">Marketplace Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {cropInventories.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                        {item.cropName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {item.totalYieldKg.toLocaleString()} KG
                        <span className="text-[10px] text-slate-400 block">
                          ({(item.totalYieldKg / 1000).toFixed(1)} Tons)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        {item.availableQuantity.toLocaleString()} KG
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.storageLocation || 'Farm Silo Room'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.harvestDate || '2026-08-15'}
                      </td>
                      <td className="py-3.5 px-4">
                        {item.isListedOnMarketplace ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Listed on Marketplace</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <span>Unlisted (In Silo)</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!item.isListedOnMarketplace ? (
                          <button
                            onClick={() => handleOpenQuickPost(item)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] shadow-sm transition-all inline-flex items-center space-x-1"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Post to Marketplace</span>
                          </button>
                        ) : (
                          <button
                            onClick={onNavigateToMarketplace}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-[11px] transition-colors inline-flex items-center space-x-1"
                          >
                            <span>View Live Ad</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STAGE EXPENSES (crop_expenses) */}
      {/* ========================================================================= */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>Crop Input Costs & Expenses (crop_expenses)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Categorized expenses (Seeds, Fertilizer, Pesticide, Tractor, Labor) auto-synced to Master Ledger.
              </p>
            </div>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Expense</span>
            </button>
          </div>

          {cropExpenses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Stage Expenses Recorded</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Log costs like fertilizer bags, tractor fuel, or labor to accurately calculate your crop profit margin.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Crop Name</th>
                    <th className="py-3 px-4">Expense Category</th>
                    <th className="py-3 px-4">Description / Notes</th>
                    <th className="py-3 px-4 text-right">Amount ({symbol})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {cropExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {expense.date}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {expense.cropName || 'Farm Crop'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            expense.category === 'Fertilizer'
                              ? 'bg-emerald-100 text-emerald-800'
                              : expense.category === 'Seed'
                              ? 'bg-amber-100 text-amber-800'
                              : expense.category === 'Tractor'
                              ? 'bg-blue-100 text-blue-800'
                              : expense.category === 'Labor'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {expense.description || 'Input cost application'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono text-slate-900">
                        {symbol} {expense.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD CROP */}
      {/* ========================================================================= */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Register New Crop Field</h3>
                  <p className="text-[11px] text-emerald-200">Create entry in farmer_crops table</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCropModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Crop Name / فصل کا نام *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wheat (گندم), Sugarcane (کماد), Cotton (کپاس)"
                    value={cropName}
                    onChange={e => setCropName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seed Variety / ورائٹی
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Akbar 2019, CPF-249"
                    value={variety}
                    onChange={e => setVariety(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Land Area (Acres) / رقبہ *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="e.g. 5"
                    value={landAreaAcres}
                    onChange={e => setLandAreaAcres(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sowing Date / بوائی کی تاریخ *
                  </label>
                  <input
                    type="date"
                    required
                    value={sowingDate}
                    onChange={e => setSowingDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expected Harvest Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedHarvestDate}
                    onChange={e => setExpectedHarvestDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Growth Stage / Status
                  </label>
                  <select
                    value={cropStatus}
                    onChange={e => setCropStatus(e.target.value as Crop['status'])}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    <option value="sowing">Sowing (تازہ بوائی)</option>
                    <option value="vegetative">Vegetative Growth (نشوونما)</option>
                    <option value="flowering">Flowering / Grain Formation (پھول/سٹا)</option>
                    <option value="harvest_ready">Ready for Harvest (کٹائی کے لیے تیار)</option>
                    <option value="harvested">Harvested (کٹائی مکمل)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notes / Field Location (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. North Tube-well Acre #4"
                    value={cropNotes}
                    onChange={e => setCropNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddCropModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl text-xs shadow-md transition"
                >
                  Add Crop Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT CROP */}
      {/* ========================================================================= */}
      {showEditCropModal && selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Edit Crop Details</h3>
                  <p className="text-[11px] text-emerald-200">Update crop record in database</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditCropModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Crop Name / فصل کا نام *
                  </label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={e => setCropName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seed Variety / ورائٹی
                  </label>
                  <input
                    type="text"
                    value={variety}
                    onChange={e => setVariety(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Land Area (Acres) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={landAreaAcres}
                    onChange={e => setLandAreaAcres(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sowing Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={sowingDate}
                    onChange={e => setSowingDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expected Harvest Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedHarvestDate}
                    onChange={e => setExpectedHarvestDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Growth Stage / Status
                  </label>
                  <select
                    value={cropStatus}
                    onChange={e => setCropStatus(e.target.value as Crop['status'])}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    <option value="sowing">Sowing (تازہ بوائی)</option>
                    <option value="vegetative">Vegetative Growth (نشوونما)</option>
                    <option value="flowering">Flowering / Grain Formation (پھول/سٹا)</option>
                    <option value="harvest_ready">Ready for Harvest (کٹائی کے لیے تیار)</option>
                    <option value="harvested">Harvested (کٹائی مکمل)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={cropNotes}
                    onChange={e => setCropNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditCropModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl text-xs shadow-md transition"
                >
                  Save Changes (PUT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {showDeleteCropDialog && selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Crop Record?</h3>
            <p className="text-xs text-slate-600 mt-1">
              Are you sure you want to delete <strong>{selectedCrop.cropName}</strong> ({selectedCrop.landAreaAcres} Acres)? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-center space-x-3">
              <button
                onClick={() => setShowDeleteCropDialog(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Yes, Delete (DELETE)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: QUICK POST INVENTORY TO MARKETPLACE */}
      {/* ========================================================================= */}
      {showQuickPostModal && selectedInventoryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Post Yield to B2B Marketplace</h3>
                  <p className="text-[11px] text-emerald-200">
                    Direct listing to marketplace_listings table
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickPostModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickPostSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={quickPostTitle}
                  onChange={e => setQuickPostTitle(e.target.value)}
                  placeholder="e.g. 50 Tons of Wheat for Sale"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expected Price ({symbol}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    required
                    value={quickPostPrice}
                    onChange={e => setQuickPostPrice(e.target.value)}
                    placeholder="e.g. 3900"
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Per Maund (40kg) or Per Ton
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity Available
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${selectedInventoryItem.availableQuantity.toLocaleString()} KG (${(
                    selectedInventoryItem.availableQuantity / 1000
                  ).toFixed(1)} Tons)`}
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Buyer Description & Quality Specs
                </label>
                <textarea
                  rows={3}
                  value={quickPostDesc}
                  onChange={e => setQuickPostDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowQuickPostModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl text-xs shadow-md transition flex items-center space-x-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Publish to Marketplace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EXPENSE MODAL */}
      {/* ========================================================================= */}
      <CropExpenseForm
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
      />

      {/* ========================================================================= */}
      {/* MODAL 6: HARVEST & LIST MODAL */}
      {/* ========================================================================= */}
      {showHarvestModal && (
        <HarvestAndList
          onClose={() => setShowHarvestModal(false)}
          initialCropId={harvestTargetCropId}
          onNavigateToMarketplace={onNavigateToMarketplace}
        />
      )}
    </div>
  );
};

export default CropDashboard;
