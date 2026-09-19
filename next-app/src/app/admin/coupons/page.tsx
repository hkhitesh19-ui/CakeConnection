"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Ticket, 
  X, 
  Calendar, 
  DollarSign, 
  Tag, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useSiteStore, useUIStore } from '@/stores';

interface CouponForm {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minPurchase: number;
  expiry: string;
  status: 'active' | 'inactive';
  usageLimit: string;
}

export default function AdminCoupons() {
  const { coupons, fetchSettings, updateSetting, loading } = useSiteStore();
  const { addToast } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CouponForm>({
    code: '',
    type: 'percent',
    value: 10,
    minPurchase: 0,
    expiry: '',
    status: 'active',
    usageLimit: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setForm({
      code: '',
      type: 'percent',
      value: 10,
      minPurchase: 0,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days default
      status: 'active',
      usageLimit: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: any) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase || 0,
      expiry: coupon.expiry,
      status: coupon.status,
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    
    const updatedCoupons = coupons.filter(c => c.code !== code);
    const success = await updateSetting('coupons', updatedCoupons);
    if (success) {
      addToast({ type: 'success', message: `Coupon "${code}" deleted successfully.` });
    } else {
      addToast({ type: 'error', message: 'Failed to delete coupon.' });
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = form.code.toUpperCase().trim();
    if (!cleanCode) {
      addToast({ type: 'warning', message: 'Coupon code is required.' });
      return;
    }

    if (form.value <= 0) {
      addToast({ type: 'warning', message: 'Discount value must be greater than zero.' });
      return;
    }

    setSaving(true);

    const couponData = {
      code: cleanCode,
      type: form.type,
      value: Number(form.value),
      minPurchase: Number(form.minPurchase || 0),
      expiry: form.expiry,
      status: form.status,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      usageCount: editingCoupon ? (editingCoupon.usageCount || 0) : 0
    };

    let updatedCoupons = [...coupons];
    if (editingCoupon) {
      // Edit mode: replace
      updatedCoupons = updatedCoupons.map(c => c.code === editingCoupon.code ? couponData : c);
    } else {
      // Create mode: verify uniqueness
      const exists = coupons.some(c => c.code === cleanCode);
      if (exists) {
        addToast({ type: 'error', message: `Coupon code "${cleanCode}" already exists.` });
        setSaving(false);
        return;
      }
      updatedCoupons.push(couponData);
    }

    const success = await updateSetting('coupons', updatedCoupons);
    setSaving(false);
    if (success) {
      addToast({ type: 'success', message: `Coupon "${cleanCode}" saved successfully.` });
      setIsModalOpen(false);
    } else {
      addToast({ type: 'error', message: 'Failed to save coupon.' });
    }
  };

  const getStatusColor = (status: string, expiry: string) => {
    const isExpired = new Date(expiry) < new Date();
    if (isExpired) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (status === 'inactive') return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    return 'bg-green-500/10 text-green-500 border-green-500/20';
  };

  const getStatusLabel = (status: string, expiry: string) => {
    const isExpired = new Date(expiry) < new Date();
    if (isExpired) return 'Expired';
    return status === 'active' ? 'Active' : 'Inactive';
  };

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Coupons</h2>
          <p className="text-gray-500">Manage promotional codes and discounts dynamically.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-rose/20 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coupons by code..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:border-brand-rose transition-colors"
          />
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-brand-rose" />
            <span>Loading database settings...</span>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Coupon Code</th>
                <th className="px-6 py-4 font-semibold">Discount Value</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Min Purchase</th>
                <th className="px-6 py-4 font-semibold">Usage Status</th>
                <th className="px-6 py-4 font-semibold">Expiry Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Fetching coupons...' : 'No coupons created yet.'}
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.code} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-rose/10 flex items-center justify-center">
                          <Ticket className="w-4 h-4 text-brand-rose" />
                        </div>
                        <span className="font-bold text-gray-900 tracking-wider font-mono">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-rose font-bold">
                      {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{coupon.type} Discount</td>
                    <td className="px-6 py-4 text-gray-600">₹{coupon.minPurchase || 0}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {coupon.usageCount || 0} / {coupon.usageLimit ? coupon.usageLimit : '∞'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(coupon.expiry).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(coupon.status, coupon.expiry)}`}>
                        {getStatusLabel(coupon.status, coupon.expiry)}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(coupon)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCoupon(coupon.code)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white shadow-sm border border-gray-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-rose" />
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCoupon} className="p-6 space-y-4">
                {/* Code */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Coupon Code</label>
                  <input 
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="E.g., WELCOME50"
                    disabled={!!editingCoupon}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-rose transition-colors font-mono font-bold tracking-wider disabled:opacity-50"
                    required
                  />
                </div>

                {/* Type & Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Discount Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as 'percent' | 'flat' }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors cursor-pointer"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      {form.type === 'percent' ? 'Percentage Value' : 'Flat Value'}
                    </label>
                    <input 
                      type="number"
                      value={form.value}
                      onChange={(e) => setForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                      placeholder={form.type === 'percent' ? '15' : '100'}
                      min={1}
                      max={form.type === 'percent' ? 100 : 9999}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Min Purchase & Usage Limit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Min Purchase (₹)</label>
                    <input 
                      type="number"
                      value={form.minPurchase}
                      onChange={(e) => setForm(prev => ({ ...prev, minPurchase: Number(e.target.value) }))}
                      placeholder="0"
                      min={0}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Usage Limit (orders)</label>
                    <input 
                      type="number"
                      value={form.usageLimit}
                      onChange={(e) => setForm(prev => ({ ...prev, usageLimit: e.target.value }))}
                      placeholder="Infinite (leave blank)"
                      min={1}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="date"
                      value={form.expiry}
                      onChange={(e) => setForm(prev => ({ ...prev, expiry: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                      <input 
                        type="radio" 
                        name="status"
                        value="active"
                        checked={form.status === 'active'}
                        onChange={() => setForm(prev => ({ ...prev, status: 'active' }))}
                        className="accent-brand-rose"
                      />
                      Active (Usable)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                      <input 
                        type="radio" 
                        name="status"
                        value="inactive"
                        checked={form.status === 'inactive'}
                        onChange={() => setForm(prev => ({ ...prev, status: 'inactive' }))}
                        className="accent-brand-rose"
                      />
                      Inactive (Disabled)
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-center text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 text-center text-sm font-semibold text-white bg-brand-rose hover:bg-brand-rose/90 rounded-xl transition-colors shadow-lg shadow-brand-rose/25 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Save Coupon</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
