"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Store, 
  MapPin, 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Link2
} from 'lucide-react';
import { useSiteStore, useUIStore } from '@/stores';

// Inline SVG social icons due to older lucide-react version compatibility
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function AdminSettings() {
  const { 
    generalSettings, 
    deliverySlots, 
    pincodeCharges, 
    closedDates, 
    fetchSettings, 
    updateSetting, 
    loading 
  } = useSiteStore();
  
  const { addToast } = useUIStore();
  
  const [activeTab, setActiveTab] = useState<'general' | 'pincodes' | 'slots' | 'blackouts'>('general');
  const [saving, setSaving] = useState(false);

  // General Form local state
  const [generalForm, setGeneralForm] = useState({
    storeName: '',
    tagline: '',
    supportEmail: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: 'Vadodara',
    state: 'Gujarat',
    pincode: '',
    instagram: '',
    facebook: '',
    openHour: '',
    closeHour: '',
    themeColor: ''
  });

  // Pincode local state
  const [newPincode, setNewPincode] = useState('');
  const [newCharge, setNewCharge] = useState(0);

  // Slot local state
  const [newSlotLabel, setNewSlotLabel] = useState('');
  const [newSlotCutoff, setNewSlotCutoff] = useState<number | ''>('');
  
  // Slot Editing State
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [editSlotLabel, setEditSlotLabel] = useState('');
  const [editSlotCutoff, setEditSlotCutoff] = useState<number | ''>('');
  
  // Closed Date local state
  const [newClosedDate, setNewClosedDate] = useState('');
  const [newClosedReason, setNewClosedReason] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  // Sync general settings form
  useEffect(() => {
    if (generalSettings) {
      setGeneralForm({
        storeName: generalSettings.storeName || '',
        tagline: generalSettings.tagline || '',
        supportEmail: generalSettings.supportEmail || '',
        phone: generalSettings.phone || '',
        whatsapp: generalSettings.whatsapp || '',
        address: generalSettings.address || '',
        city: generalSettings.city || 'Vadodara',
        state: generalSettings.state || 'Gujarat',
        pincode: generalSettings.pincode || '',
        instagram: generalSettings.socials?.instagram || '',
        facebook: generalSettings.socials?.facebook || '',
        openHour: generalSettings.hours?.open || '08:00',
        closeHour: generalSettings.hours?.close || '22:00',
        themeColor: generalSettings.themeColor || '#D81B60'
      });
    }
  }, [generalSettings]);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const updatedSettings = {
      ...generalSettings,
      storeName: generalForm.storeName,
      tagline: generalForm.tagline,
      supportEmail: generalForm.supportEmail,
      phone: generalForm.phone,
      whatsapp: generalForm.whatsapp,
      address: generalForm.address,
      pincode: generalForm.pincode,
      socials: {
        instagram: generalForm.instagram,
        facebook: generalForm.facebook
      },
      hours: {
        ...generalSettings.hours,
        open: generalForm.openHour,
        close: generalForm.closeHour,
        days: generalSettings.hours?.days || 'Monday - Sunday'
      },
      themeColor: generalForm.themeColor
    };

    const success = await updateSetting('general_settings', updatedSettings);
    setSaving(false);
    if (success) {
      addToast({ type: 'success', message: 'General settings saved successfully.' });
    } else {
      addToast({ type: 'error', message: 'Failed to save general settings.' });
    }
  };

  // Pincode Actions
  const handleAddPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = newPincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      addToast({ type: 'warning', message: 'Pincode must be exactly 6 digits.' });
      return;
    }

    if (pincodeCharges.some(p => p.pincode === cleanPin)) {
      addToast({ type: 'error', message: `Pincode ${cleanPin} is already configured.` });
      return;
    }

    setSaving(true);
    const updatedCharges = [...pincodeCharges, { pincode: cleanPin, charge: Number(newCharge) }];
    const success = await updateSetting('pincode_charges', updatedCharges);
    setSaving(false);

    if (success) {
      addToast({ type: 'success', message: `Pincode ${cleanPin} configured successfully.` });
      setNewPincode('');
      setNewCharge(0);
    } else {
      addToast({ type: 'error', message: 'Failed to configure pincode.' });
    }
  };

  const handleDeletePincode = async (pincode: string) => {
    if (!confirm(`Are you sure you want to remove pincode ${pincode}?`)) return;
    setSaving(true);
    const updatedCharges = pincodeCharges.filter(p => p.pincode !== pincode);
    const success = await updateSetting('pincode_charges', updatedCharges);
    setSaving(false);

    if (success) {
      addToast({ type: 'success', message: `Pincode ${pincode} removed successfully.` });
    } else {
      addToast({ type: 'error', message: 'Failed to remove pincode.' });
    }
  };

  // Delivery Slots Actions
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = newSlotLabel.trim();
    if (!cleanLabel) return;

    if (deliverySlots.some(s => s.label.toLowerCase() === cleanLabel.toLowerCase())) {
      addToast({ type: 'warning', message: 'Slot label already exists.' });
      return;
    }

    setSaving(true);
    const updatedSlots = [...deliverySlots, { 
      label: cleanLabel,
      ...(typeof newSlotCutoff === 'number' && { cutoffHour: newSlotCutoff })
    }];
    const success = await updateSetting('delivery_slots', updatedSlots);
    setSaving(false);

    if (success) {
      addToast({ type: 'success', message: 'Delivery slot added successfully.' });
      setNewSlotLabel('');
      setNewSlotCutoff('');
    } else {
      addToast({ type: 'error', message: 'Failed to add delivery slot.' });
    }
  };

  const handleEditSlotSave = async (index: number) => {
    const cleanLabel = editSlotLabel.trim();
    if (!cleanLabel) return;

    // Check if new label conflicts with other slots
    if (deliverySlots.some((s, i) => i !== index && s.label.toLowerCase() === cleanLabel.toLowerCase())) {
      addToast({ type: 'warning', message: 'Slot label already exists.' });
      return;
    }

    setSaving(true);
    const updatedSlots = [...deliverySlots];
    updatedSlots[index] = {
      label: cleanLabel,
      ...(typeof editSlotCutoff === 'number' ? { cutoffHour: editSlotCutoff } : {})
    };
    
    // Remove cutoffHour if it was cleared
    if (typeof editSlotCutoff !== 'number') {
      delete updatedSlots[index].cutoffHour;
    }

    const success = await updateSetting('delivery_slots', updatedSlots);
    setSaving(false);

    if (success) {
      addToast({ type: 'success', message: 'Delivery slot updated successfully.' });
      setEditingSlotIndex(null);
    } else {
      addToast({ type: 'error', message: 'Failed to update delivery slot.' });
    }
  };

  const handleDeleteSlot = async (label: string) => {
    if (!confirm(`Remove slot "${label}"?`)) return;
    setSaving(true);
    const updatedSlots = deliverySlots.filter(s => s.label !== label);
    const success = await updateSetting('delivery_slots', updatedSlots);
    setSaving(false);

    if (success) {
      addToast({ type: 'success', message: 'Delivery slot removed successfully.' });
    } else {
      addToast({ type: 'error', message: 'Failed to remove delivery slot.' });
    }
  };

  // Closed Dates Actions
  const handleAddClosedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClosedDate) return;

    if (closedDates.some(c => c.date === newClosedDate)) {
      addToast({ type: 'warning', message: 'This date is already blocked.' });
      return;
    }

    setSaving(true);
    const updatedDates = [...closedDates, { date: newClosedDate, reason: newClosedReason.trim() || 'Store holiday' }];
    const success = await updateSetting('closed_dates', updatedDates);
    setSaving(false);

    if (success) {
      addToast({ type: 'success', message: 'Date blocked on blackout calendar.' });
      setNewClosedDate('');
      setNewClosedReason('');
    } else {
      addToast({ type: 'error', message: 'Failed to block date.' });
    }
  };

  const handleDeleteClosedDate = async (date: string) => {
    if (!confirm(`Re-open date ${date}?`)) return;
    setSaving(true);
    const updatedDates = closedDates.filter(c => c.date !== date);
    const success = await updateSetting('closed_dates', updatedDates);
    setSaving(false);

    if (success) {
      addToast({ type: 'success', message: `Date ${date} is now active for delivery.` });
    } else {
      addToast({ type: 'error', message: 'Failed to re-open date.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Store Settings</h2>
          <p className="text-gray-500">Configure delivery areas, scheduling options, and general info.</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm bg-white shadow-sm border border-gray-200 px-4 py-2 rounded-xl">
            <Loader2 className="w-4 h-4 animate-spin text-brand-rose" />
            <span>Loading settings...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2">
          {[
            { id: 'general', label: 'General Info', icon: Store },
            { id: 'pincodes', label: 'Delivery Areas', icon: MapPin },
            { id: 'slots', label: 'Delivery Slots', icon: Clock },
            { id: 'blackouts', label: 'Blackout Calendar', icon: Calendar },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-colors cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-brand-rose/10 text-brand-rose border-brand-rose/25'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Configuration Body */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* General Tab */}
            {activeTab === 'general' && (
              <motion.form
                key="general-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSaveGeneral}
                className="space-y-6"
              >
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-brand-rose" />
                    <span>General Store Configuration</span>
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">Configure user-facing titles, contact support, and social handles.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Store Name</label>
                    <input 
                      type="text" 
                      value={generalForm.storeName}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, storeName: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Tagline / Motto</label>
                    <input 
                      type="text" 
                      value={generalForm.tagline}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Support Email</label>
                    <input 
                      type="email" 
                      value={generalForm.supportEmail}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Calling Number</label>
                    <input 
                      type="text" 
                      value={generalForm.phone}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={generalForm.whatsapp}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Outlet Address</label>
                    <input 
                      type="text" 
                      value={generalForm.address}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Outlet Pincode</label>
                    <input 
                      type="text" 
                      value={generalForm.pincode}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, pincode: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">City (Fixed)</label>
                    <input type="text" value={generalForm.city} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400 opacity-60" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">State (Fixed)</label>
                    <input type="text" value={generalForm.state} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400 opacity-60" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Opening Time</label>
                    <input 
                      type="time" 
                      value={generalForm.openHour}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, openHour: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Closing Time</label>
                    <input 
                      type="time" 
                      value={generalForm.closeHour}
                      onChange={(e) => setGeneralForm(prev => ({ ...prev, closeHour: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                    />
                  </div>
                </div>

                {/* Theme Color Picker Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-rose" />
                    <span>Website Styling &amp; Branding</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Brand Primary Color (Theme)</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={generalForm.themeColor}
                          onChange={(e) => setGeneralForm(prev => ({ ...prev, themeColor: e.target.value }))}
                          className="h-10 w-16 bg-white border border-gray-200 rounded-xl cursor-pointer p-1"
                        />
                        <input 
                          type="text" 
                          value={generalForm.themeColor}
                          onChange={(e) => setGeneralForm(prev => ({ ...prev, themeColor: e.target.value }))}
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm font-mono"
                          placeholder="#D81B60"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Select the primary theme accent color for the entire website storefront and dashboard buttons.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-brand-rose" />
                    <span>Social Media Connections</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5 text-pink-500" />
                        <span>Instagram Url</span>
                      </label>
                      <input 
                        type="url" 
                        value={generalForm.instagram}
                        onChange={(e) => setGeneralForm(prev => ({ ...prev, instagram: e.target.value }))}
                        placeholder="https://instagram.com/..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Facebook className="w-3.5 h-3.5 text-blue-500" />
                        <span>Facebook Url</span>
                      </label>
                      <input 
                        type="url" 
                        value={generalForm.facebook}
                        onChange={(e) => setGeneralForm(prev => ({ ...prev, facebook: e.target.value }))}
                        placeholder="https://facebook.com/..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-all shadow-lg shadow-brand-rose/20 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>Save Store Profile</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* Pincodes Tab */}
            {activeTab === 'pincodes' && (
              <motion.div
                key="pincodes-section"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-rose" />
                    <span>Vadodara Delivery Areas &amp; Pincodes</span>
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">Add, edit, or remove delivery pincodes and associate specific delivery shipping rates.</p>
                </div>

                {/* Add Pincode form */}
                <form onSubmit={handleAddPincode} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">6-Digit Pincode</label>
                    <input 
                      type="text"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      placeholder="E.g., 390011"
                      maxLength={6}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Shipping Charge (₹)</label>
                    <input 
                      type="number"
                      value={newCharge === 0 ? '' : newCharge}
                      onChange={(e) => setNewCharge(Number(e.target.value))}
                      placeholder="0 (Free Delivery)"
                      min={0}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-brand-rose/15 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Area</span>
                  </button>
                </form>

                {/* Pincodes list */}
                <div className="overflow-hidden border border-gray-200 rounded-xl bg-gray-50/60">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Pincode</th>
                        <th className="px-6 py-3 font-medium">Region Status</th>
                        <th className="px-6 py-3 font-medium">Delivery Charges</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {pincodeCharges.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            No areas configured yet. Free delivery active everywhere.
                          </td>
                        </tr>
                      ) : (
                        pincodeCharges.map((item) => (
                          <tr key={item.pincode} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3.5 font-bold font-mono tracking-wider text-gray-900">
                              {item.pincode}
                            </td>
                            <td className="px-6 py-3.5 text-gray-600 text-xs">
                              Vadodara Outskirts / Internal
                            </td>
                            <td className="px-6 py-3.5 text-brand-rose font-bold">
                              {item.charge === 0 ? 'FREE' : `₹${item.charge}`}
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <button 
                                onClick={() => handleDeletePincode(item.pincode)}
                                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Slots Tab */}
            {activeTab === 'slots' && (
              <motion.div
                key="slots-section"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-rose" />
                    <span>Delivery Time Slots Configuration</span>
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">Configure available delivery slots for customers during checkout.</p>
                </div>

                {/* Add slot */}
                <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">New Delivery Slot (Label)</label>
                    <input 
                      type="text"
                      value={newSlotLabel}
                      onChange={(e) => setNewSlotLabel(e.target.value)}
                      placeholder="E.g., Early Morning (07:00 AM - 09:00 AM)"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5" title="Hour (0-23) after which this slot is disabled for same-day delivery">Cutoff Hour (0-23)</label>
                    <input 
                      type="number"
                      min={0}
                      max={23}
                      value={newSlotCutoff}
                      onChange={(e) => setNewSlotCutoff(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 14 for 2:00 PM"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-brand-rose/15 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Slot</span>
                  </button>
                </form>

                {/* Slots list */}
                <div className="space-y-3">
                  {deliverySlots.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No delivery slots configured yet.</p>
                  ) : (
                    deliverySlots.map((slot, index) => (
                      <div 
                        key={slot.label + index} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50/60 border border-gray-200 rounded-xl hover:border-brand-rose/25 transition-all gap-4"
                      >
                        {editingSlotIndex === index ? (
                          <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                            <input 
                              type="text"
                              value={editSlotLabel}
                              onChange={(e) => setEditSlotLabel(e.target.value)}
                              className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm"
                              placeholder="Slot Label"
                            />
                            <input 
                              type="number"
                              min={0}
                              max={23}
                              value={editSlotCutoff}
                              onChange={(e) => setEditSlotCutoff(e.target.value ? Number(e.target.value) : '')}
                              className="w-24 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm"
                              placeholder="Cutoff"
                            />
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEditSlotSave(index)}
                                disabled={saving}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button 
                                onClick={() => setEditingSlotIndex(null)}
                                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-xs font-semibold rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{slot.label}</span>
                                {slot.cutoffHour !== undefined && (
                                  <span className="text-xs text-gray-500 mt-0.5">
                                    Disabled after {slot.cutoffHour.toString().padStart(2, '0')}:00
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setEditingSlotIndex(index);
                                  setEditSlotLabel(slot.label);
                                  setEditSlotCutoff(slot.cutoffHour ?? '');
                                }}
                                className="px-3 py-1.5 border border-gray-200 text-gray-500 hover:text-brand-rose hover:border-brand-rose/50 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteSlot(slot.label)}
                                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Blackout Calendar Tab */}
            {activeTab === 'blackouts' && (
              <motion.div
                key="blackouts-section"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-rose" />
                    <span>Closed Dates Blackout Calendar</span>
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">Select dates when the kitchen is closed (holidays, renovations, festivals) to disable order scheduling.</p>
                </div>

                {/* Add blackout */}
                <form onSubmit={handleAddClosedDate} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Select Closed Date</label>
                    <input 
                      type="date"
                      value={newClosedDate}
                      onChange={(e) => setNewClosedDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Reason for Closure</label>
                    <input 
                      type="text"
                      value={newClosedReason}
                      onChange={(e) => setNewClosedReason(e.target.value)}
                      placeholder="E.g., Diwali Holiday / Kitchen Renovation"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-brand-rose/15 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Block Date</span>
                  </button>
                </form>

                {/* Closed dates list */}
                <div className="overflow-hidden border border-gray-200 rounded-xl bg-gray-50/60">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Blocked Date</th>
                        <th className="px-6 py-3 font-medium">Reason</th>
                        <th className="px-6 py-3 font-medium">Availability</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {closedDates.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            No blackout dates scheduled. Deliveries active every day.
                          </td>
                        </tr>
                      ) : (
                        closedDates.map((item) => (
                          <tr key={item.date} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3.5 font-bold font-mono tracking-wider text-gray-900">
                              {new Date(item.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-3.5 text-gray-600 italic">
                              "{item.reason}"
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-red-500/10 text-red-500 border-red-500/20">
                                Deliveries Blocked
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <button 
                                onClick={() => handleDeleteClosedDate(item.date)}
                                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
