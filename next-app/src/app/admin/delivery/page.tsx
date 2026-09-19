"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  X,
  Truck,
  MapPin,
  Clock,
  Calendar,
  Zap,
  Timer,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useSiteStore, useUIStore } from '@/stores';
import { formatTimeSlotDisplay } from '@/utils';

// ─── Types ──────────────────────────────────────────────

interface DeliverySpeed {
  label: string;
  value: string;
  surcharge: number;
  icon: string;
  description: string;
}

interface DeliveryArea {
  areaName: string;
  pincode: string;
  isServiceable: boolean;
}

// ─── Constants ──────────────────────────────────────────

const ICON_OPTIONS = ['Zap', 'Clock', 'Timer', 'Truck', 'Calendar', 'Bike', 'Package', 'Rocket'];

const DEFAULT_AREAS: DeliveryArea[] = [
  'Manjalpur', 'Akota', 'Alkapuri', 'Fatehgunj', 'Sayajigunj',
  'Gotri', 'Vasna', 'Waghodia Road', 'Harni', 'Tarsali',
  'Subhanpura', 'Sama', 'Karelibaug', 'Makarpura', 'Tandalja',
  'Dabhoi Road', 'Atladra', 'Padra Road', 'Sevasi', 'Bhayli',
].map((name, i) => ({
  areaName: name,
  pincode: `39${String(1001 + i).slice(0, 4)}`,
  isServiceable: true,
}));

// ─── Styling constants ──────────────────────────────────

const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm";
const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5";

// ─── Modal Component ────────────────────────────────────

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white shadow-sm border border-gray-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────

export default function AdminDelivery() {
  const {
    deliverySpeeds,
    deliverySlots,
    closedDates,
    fetchSettings,
    updateSetting,
    loading,
  } = useSiteStore();

  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'speeds' | 'areas' | 'slots' | 'blackouts'>('speeds');
  const [saving, setSaving] = useState(false);

  // ── Delivery Speeds state ──
  const [speeds, setSpeeds] = useState<DeliverySpeed[]>([]);
  const [speedModal, setSpeedModal] = useState(false);
  const [editingSpeedIdx, setEditingSpeedIdx] = useState<number | null>(null);
  const [speedForm, setSpeedForm] = useState<DeliverySpeed>({ label: '', value: '', surcharge: 0, icon: 'Truck', description: '' });

  // ── Delivery Areas state ──
  const [areas, setAreas] = useState<DeliveryArea[]>(DEFAULT_AREAS);
  const [areaModal, setAreaModal] = useState(false);
  const [editingAreaIdx, setEditingAreaIdx] = useState<number | null>(null);
  const [areaForm, setAreaForm] = useState<DeliveryArea>({ areaName: '', pincode: '', isServiceable: true });

  // ── Time Slots state ──
  const [newSlotLabel, setNewSlotLabel] = useState('');

  // ── Blackout Calendar state ──
  const [newClosedDate, setNewClosedDate] = useState('');
  const [newClosedReason, setNewClosedReason] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  // Sync delivery speeds from store
  useEffect(() => {
    if (deliverySpeeds && deliverySpeeds.length > 0) {
      setSpeeds(deliverySpeeds);
    }
  }, [deliverySpeeds]);

  // ── Delivery Speeds Handlers ──

  const openSpeedModal = (idx?: number) => {
    if (idx !== undefined) {
      setEditingSpeedIdx(idx);
      setSpeedForm({ ...speeds[idx] });
    } else {
      setEditingSpeedIdx(null);
      setSpeedForm({ label: '', value: '', surcharge: 0, icon: 'Truck', description: '' });
    }
    setSpeedModal(true);
  };

  const handleSaveSpeed = async () => {
    if (!speedForm.label.trim() || !speedForm.value.trim()) {
      addToast({ type: 'warning', message: 'Label and value are required.' });
      return;
    }
    let updated: DeliverySpeed[];
    if (editingSpeedIdx !== null) {
      updated = [...speeds];
      updated[editingSpeedIdx] = { ...speedForm };
    } else {
      updated = [...speeds, { ...speedForm }];
    }
    setSaving(true);
    const success = await updateSetting('delivery_speeds', updated);
    setSaving(false);
    if (success) {
      setSpeeds(updated);
      setSpeedModal(false);
      addToast({ type: 'success', message: editingSpeedIdx !== null ? 'Delivery speed updated.' : 'Delivery speed added.' });
    } else {
      addToast({ type: 'error', message: 'Failed to save delivery speeds.' });
    }
  };

  const handleDeleteSpeed = async (idx: number) => {
    if (!confirm(`Remove "${speeds[idx].label}"?`)) return;
    const updated = speeds.filter((_, i) => i !== idx);
    setSaving(true);
    const success = await updateSetting('delivery_speeds', updated);
    setSaving(false);
    if (success) {
      setSpeeds(updated);
      addToast({ type: 'success', message: 'Delivery speed removed.' });
    } else {
      addToast({ type: 'error', message: 'Failed to remove delivery speed.' });
    }
  };

  // ── Delivery Areas Handlers ──

  const openAreaModal = (idx?: number) => {
    if (idx !== undefined) {
      setEditingAreaIdx(idx);
      setAreaForm({ ...areas[idx] });
    } else {
      setEditingAreaIdx(null);
      setAreaForm({ areaName: '', pincode: '', isServiceable: true });
    }
    setAreaModal(true);
  };

  const handleSaveArea = async () => {
    if (!areaForm.areaName.trim()) {
      addToast({ type: 'warning', message: 'Area name is required.' });
      return;
    }
    let updated: DeliveryArea[];
    if (editingAreaIdx !== null) {
      updated = [...areas];
      updated[editingAreaIdx] = { ...areaForm };
    } else {
      updated = [...areas, { ...areaForm }];
    }
    setSaving(true);
    const success = await updateSetting('delivery_areas', updated);
    setSaving(false);
    if (success) {
      setAreas(updated);
      setAreaModal(false);
      addToast({ type: 'success', message: editingAreaIdx !== null ? 'Delivery area updated.' : 'Delivery area added.' });
    } else {
      addToast({ type: 'error', message: 'Failed to save delivery areas.' });
    }
  };

  const handleDeleteArea = async (idx: number) => {
    if (!confirm(`Remove area "${areas[idx].areaName}"?`)) return;
    const updated = areas.filter((_, i) => i !== idx);
    setSaving(true);
    const success = await updateSetting('delivery_areas', updated);
    setSaving(false);
    if (success) {
      setAreas(updated);
      addToast({ type: 'success', message: 'Delivery area removed.' });
    } else {
      addToast({ type: 'error', message: 'Failed to remove delivery area.' });
    }
  };

  const handleToggleServiceable = async (idx: number) => {
    const updated = [...areas];
    updated[idx] = { ...updated[idx], isServiceable: !updated[idx].isServiceable };
    setAreas(updated);
    const success = await updateSetting('delivery_areas', updated);
    if (!success) {
      // Revert
      updated[idx] = { ...updated[idx], isServiceable: !updated[idx].isServiceable };
      setAreas(updated);
      addToast({ type: 'error', message: 'Failed to toggle area status.' });
    }
  };

  // ── Time Slots Handlers ──

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = formatTimeSlotDisplay(newSlotLabel.trim());
    if (!cleanLabel) return;
    if (deliverySlots.some(s => s.label.toLowerCase() === cleanLabel.toLowerCase())) {
      addToast({ type: 'warning', message: 'Slot label already exists.' });
      return;
    }
    setSaving(true);
    const updatedSlots = [...deliverySlots, { label: cleanLabel }];
    const success = await updateSetting('delivery_slots', updatedSlots);
    setSaving(false);
    if (success) {
      addToast({ type: 'success', message: 'Delivery slot added successfully.' });
      setNewSlotLabel('');
    } else {
      addToast({ type: 'error', message: 'Failed to add delivery slot.' });
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

  // ── Blackout Calendar Handlers ──

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

  // ── Tab definitions ──
  const tabs = [
    { id: 'speeds' as const, label: 'Delivery Speeds', icon: Zap },
    { id: 'areas' as const, label: 'Delivery Areas', icon: MapPin },
    { id: 'slots' as const, label: 'Time Slots', icon: Clock },
    { id: 'blackouts' as const, label: 'Blackout Calendar', icon: Calendar },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Delivery Management</h2>
          <p className="text-gray-500">Configure delivery speeds, serviceable areas, time slots, and blackout dates.</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm bg-white shadow-sm border border-gray-200 px-4 py-2 rounded-xl">
            <Loader2 className="w-4 h-4 animate-spin text-brand-rose" />
            <span>Loading...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

            {/* ── Tab 1: Delivery Speeds ── */}
            {activeTab === 'speeds' && (
              <motion.div
                key="speeds-section"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-rose" />
                      <span>Delivery Speed Options</span>
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">Configure delivery speed tiers with surcharges for customer checkout.</p>
                  </div>
                  <button
                    onClick={() => openSpeedModal()}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-brand-rose/15"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Speed</span>
                  </button>
                </div>

                <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-5 py-3.5 font-semibold">Label</th>
                        <th className="px-5 py-3.5 font-semibold">Value</th>
                        <th className="px-5 py-3.5 font-semibold">Surcharge</th>
                        <th className="px-5 py-3.5 font-semibold">Description</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {speeds.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                            No delivery speeds configured.
                          </td>
                        </tr>
                      ) : (
                        speeds.map((speed, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-5 py-3.5 font-semibold text-gray-900">{speed.label}</td>
                            <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{speed.value}</td>
                            <td className="px-5 py-3.5 text-brand-rose font-bold">
                              {speed.surcharge === 0 ? 'FREE' : `₹${speed.surcharge}`}
                            </td>
                            <td className="px-5 py-3.5 text-gray-500 text-xs">{speed.description}</td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => openSpeedModal(idx)}
                                  className="p-1.5 text-gray-500 hover:text-brand-rose hover:bg-brand-rose/10 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSpeed(idx)}
                                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Tab 2: Delivery Areas ── */}
            {activeTab === 'areas' && (
              <motion.div
                key="areas-section"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brand-rose" />
                      <span>Vadodara Delivery Areas</span>
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">Manage serviceable areas and pincodes for delivery coverage.</p>
                  </div>
                  <button
                    onClick={() => openAreaModal()}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-brand-rose/15"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Area</span>
                  </button>
                </div>

                <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-5 py-3.5 font-semibold">Area Name</th>
                        <th className="px-5 py-3.5 font-semibold">Pincode</th>
                        <th className="px-5 py-3.5 font-semibold">Serviceable</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {areas.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                            No delivery areas configured.
                          </td>
                        </tr>
                      ) : (
                        areas.map((area, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-5 py-3.5 font-semibold text-gray-900">{area.areaName}</td>
                            <td className="px-5 py-3.5 text-gray-600 font-mono tracking-wider">{area.pincode}</td>
                            <td className="px-5 py-3.5">
                              <button
                                onClick={() => handleToggleServiceable(idx)}
                                className="cursor-pointer"
                              >
                                {area.isServiceable ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-green-500/10 text-green-500 border-green-500/20">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-red-500/10 text-red-500 border-red-500/20">
                                    <XCircle className="w-3 h-3" />
                                    Disabled
                                  </span>
                                )}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => openAreaModal(idx)}
                                  className="p-1.5 text-gray-500 hover:text-brand-rose hover:bg-brand-rose/10 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteArea(idx)}
                                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-500">
                  Showing {areas.length} delivery areas • {areas.filter(a => a.isServiceable).length} active
                </p>
              </motion.div>
            )}

            {/* ── Tab 3: Time Slots ── */}
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

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const cleanLabel = formatTimeSlotDisplay(newSlotLabel.trim());
                  if (!cleanLabel) return;
                  if (deliverySlots.some(s => s.label.toLowerCase() === cleanLabel.toLowerCase())) {
                    addToast({ type: 'warning', message: 'Slot label already exists.' });
                    return;
                  }
                  setSaving(true);
                  const newCutoffVal = (e.target as any).elements.cutoffHour.value ? Number((e.target as any).elements.cutoffHour.value) : undefined;
                  const updatedSlots = [...deliverySlots, { label: cleanLabel, cutoffHour: newCutoffVal }];
                  const success = await updateSetting('delivery_slots', updatedSlots);
                  setSaving(false);
                  if (success) {
                    addToast({ type: 'success', message: 'Delivery slot added successfully.' });
                    setNewSlotLabel('');
                  } else {
                    addToast({ type: 'error', message: 'Failed to add delivery slot.' });
                  }
                }} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className={labelCls}>New Delivery Slot (Label)</label>
                    <input
                      type="text"
                      value={newSlotLabel}
                      onChange={(e) => setNewSlotLabel(e.target.value)}
                      placeholder="E.g., 10:00 AM - 01:00 PM (No Fix Time)"
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Cutoff Hour (24h format, e.g. 11 for 11 AM)</label>
                    <input
                      type="number"
                      name="cutoffHour"
                      min="0"
                      max="23"
                      placeholder="e.g., 11"
                      className={inputCls}
                      defaultValue="11"
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

                <div className="space-y-3">
                  {deliverySlots.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No delivery slots configured yet.</p>
                  ) : (
                    deliverySlots.map((slot, sIdx) => (
                      <div
                        key={slot.label}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-brand-rose/30 transition-all"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-medium text-gray-900">{slot.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Cutoff Hour (24h):</span>
                            <input
                              type="number"
                              min="0"
                              max="23"
                              defaultValue={slot.cutoffHour ?? 11}
                              onBlur={async (e) => {
                                const val = Number(e.target.value);
                                if (val >= 0 && val <= 23 && val !== slot.cutoffHour) {
                                  const updated = [...deliverySlots];
                                  updated[sIdx] = { ...slot, cutoffHour: val };
                                  const success = await updateSetting('delivery_slots', updated);
                                  if (success) {
                                    addToast({ type: 'success', message: `Cutoff hour for ${slot.label} updated to ${val}:00.` });
                                  } else {
                                    addToast({ type: 'error', message: 'Failed to update cutoff hour.' });
                                  }
                                }
                              }}
                              className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-900 shadow-sm text-xs font-semibold text-center focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/30"
                            />
                            <span className="text-[10px] text-gray-500">(Leaves after {slot.cutoffHour ?? 11}:00)</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSlot(slot.label)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer ml-4"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Tab 4: Blackout Calendar ── */}
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

                <form onSubmit={handleAddClosedDate} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className={labelCls}>Select Closed Date</label>
                    <input
                      type="date"
                      value={newClosedDate}
                      onChange={(e) => setNewClosedDate(e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Reason for Closure</label>
                    <input
                      type="text"
                      value={newClosedReason}
                      onChange={(e) => setNewClosedReason(e.target.value)}
                      placeholder="E.g., Diwali Holiday / Kitchen Renovation"
                      className={inputCls}
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

                <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-5 py-3.5 font-semibold">Blocked Date</th>
                        <th className="px-5 py-3.5 font-semibold">Reason</th>
                        <th className="px-5 py-3.5 font-semibold">Availability</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {closedDates.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                            No blackout dates scheduled. Deliveries active every day.
                          </td>
                        </tr>
                      ) : (
                        closedDates.map((item) => (
                          <tr key={item.date} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-5 py-3.5 font-bold font-mono tracking-wider text-gray-900">
                              {new Date(item.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="px-5 py-3.5 text-gray-600 italic">
                              &quot;{item.reason}&quot;
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-red-500/10 text-red-500 border-red-500/20">
                                Deliveries Blocked
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
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

      {/* ── Speed Modal ── */}
      <Modal
        open={speedModal}
        onClose={() => setSpeedModal(false)}
        title={editingSpeedIdx !== null ? 'Edit Delivery Speed' : 'Add Delivery Speed'}
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Label</label>
            <input className={inputCls} placeholder="e.g., 2 Hours Express" value={speedForm.label} onChange={(e) => setSpeedForm({ ...speedForm, label: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Value (Slug)</label>
              <input className={inputCls} placeholder="e.g., 2hr" value={speedForm.value} onChange={(e) => setSpeedForm({ ...speedForm, value: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Surcharge (₹)</label>
              <input type="number" min={0} className={inputCls} value={speedForm.surcharge} onChange={(e) => setSpeedForm({ ...speedForm, surcharge: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Icon</label>
            <select
              className={inputCls}
              value={speedForm.icon}
              onChange={(e) => setSpeedForm({ ...speedForm, icon: e.target.value })}
            >
              {ICON_OPTIONS.map((ic) => (
                <option key={ic} value={ic}>{ic}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <input className={inputCls} placeholder="e.g., Lightning-fast delivery" value={speedForm.description} onChange={(e) => setSpeedForm({ ...speedForm, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => setSpeedModal(false)}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSpeed}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-brand-rose/15 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{editingSpeedIdx !== null ? 'Update' : 'Add'}</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Area Modal ── */}
      <Modal
        open={areaModal}
        onClose={() => setAreaModal(false)}
        title={editingAreaIdx !== null ? 'Edit Delivery Area' : 'Add Delivery Area'}
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Area Name</label>
            <input className={inputCls} placeholder="e.g., Manjalpur" value={areaForm.areaName} onChange={(e) => setAreaForm({ ...areaForm, areaName: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Pincode</label>
            <input className={inputCls} placeholder="e.g., 390011" maxLength={6} value={areaForm.pincode} onChange={(e) => setAreaForm({ ...areaForm, pincode: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Serviceable</label>
            <button
              type="button"
              onClick={() => setAreaForm({ ...areaForm, isServiceable: !areaForm.isServiceable })}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-colors cursor-pointer ${
                areaForm.isServiceable
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              <span className="text-sm font-medium">{areaForm.isServiceable ? 'Active — Accepting deliveries' : 'Disabled — No deliveries'}</span>
              {areaForm.isServiceable ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => setAreaModal(false)}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveArea}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-brand-rose/15 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{editingAreaIdx !== null ? 'Update' : 'Add'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
