"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutTemplate, 
  Plus, 
  Save, 
  Loader2, 
  Image as ImageIcon, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface PromoStrip {
  id: string;
  title: string;
  text: string;
  link?: string;
  isActive: boolean;
}

const DEFAULT_STRIPS: PromoStrip[] = [
  { id: 'strip-1', title: 'Free Delivery Strip', text: 'Get free delivery on orders above ₹999 across Vadodara!', link: '/cakes', isActive: true },
  { id: 'strip-2', title: 'Midnight Delivery', text: 'Surprise your loved ones with 12:00 AM Midnight Delivery!', link: '/midnight-cake-delivery-vadodara', isActive: true },
  { id: 'strip-3', title: 'Special Discount', text: 'Use code SWEET10 for 10% off on your first cake order', link: '/cakes', isActive: false },
];

export default function AdminCMS() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [savingStrips, setSavingStrips] = useState(false);

  // Form state for Hero Banner
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    imageUrl: '',
  });

  // Promotional Strips state
  const [promoStrips, setPromoStrips] = useState<PromoStrip[]>(DEFAULT_STRIPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrip, setEditingStrip] = useState<PromoStrip | null>(null);
  const [stripFormData, setStripFormData] = useState({
    title: '',
    text: '',
    link: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCMSContent();
  }, []);

  async function fetchCMSContent() {
    try {
      const response = await fetch('/api/admin/cms');
      const resData = await response.json();
      if (resData.success && resData.data) {
        setSections(resData.data);
        const heroSection = resData.data.find((s: any) => s.section_name === 'hero_banner');
        if (heroSection) {
          setHeroForm(heroSection.content_json);
        }
        const stripsSection = resData.data.find((s: any) => s.section_name === 'promo_strips');
        if (stripsSection && Array.isArray(stripsSection.content_json) && stripsSection.content_json.length > 0) {
          setPromoStrips(stripsSection.content_json);
        }
      }
    } catch (error) {
      console.error('Error fetching CMS content:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    try {
      const response = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_name: 'hero_banner',
          content_json: heroForm,
          is_active: true
        })
      });
      const resData = await response.json();
      if (resData.success) {
        alert('Hero Banner updated successfully!');
      } else {
        alert('Failed to update Hero Banner: ' + (resData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving CMS:', error);
      alert('Error saving CMS content');
    } finally {
      setSavingHero(false);
    }
  };

  const saveStripsToDB = async (updatedStrips: PromoStrip[]) => {
    setSavingStrips(true);
    try {
      const response = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_name: 'promo_strips',
          content_json: updatedStrips,
          is_active: true,
        }),
      });
      const resData = await response.json();
      if (!resData.success) {
        alert('Failed to save promotional strips: ' + (resData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error saving promo strips:', err);
      alert('Connection error saving promotional strips');
    } finally {
      setSavingStrips(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingStrip(null);
    setStripFormData({
      title: '',
      text: '',
      link: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (strip: PromoStrip) => {
    setEditingStrip(strip);
    setStripFormData({
      title: strip.title,
      text: strip.text,
      link: strip.link || '',
      isActive: strip.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveStripModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripFormData.title.trim() || !stripFormData.text.trim()) {
      alert('Please fill in title and text.');
      return;
    }

    let updated: PromoStrip[];
    if (editingStrip) {
      updated = promoStrips.map((s) =>
        s.id === editingStrip.id
          ? {
              ...s,
              title: stripFormData.title.trim(),
              text: stripFormData.text.trim(),
              link: stripFormData.link.trim() || undefined,
              isActive: stripFormData.isActive,
            }
          : s
      );
    } else {
      const newStrip: PromoStrip = {
        id: `strip-${Date.now()}`,
        title: stripFormData.title.trim(),
        text: stripFormData.text.trim(),
        link: stripFormData.link.trim() || undefined,
        isActive: stripFormData.isActive,
      };
      updated = [...promoStrips, newStrip];
    }

    setPromoStrips(updated);
    setIsModalOpen(false);
    await saveStripsToDB(updated);
  };

  const handleToggleActive = async (id: string) => {
    const updated = promoStrips.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setPromoStrips(updated);
    await saveStripsToDB(updated);
  };

  const handleDeleteStrip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional strip?')) return;
    const updated = promoStrips.filter((s) => s.id !== id);
    setPromoStrips(updated);
    await saveStripsToDB(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-rose" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">CMS & Banners</h2>
          <p className="text-gray-500">Manage homepage content, banners, and promotional announcement strips.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Banner Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Hero Banner</h3>
              <p className="text-xs text-gray-500">Main homepage banner seen by visitors.</p>
            </div>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Main Title</label>
              <input 
                type="text" 
                value={heroForm.title}
                onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="E.g., Sweet Delights Delivered"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Subtitle Text</label>
              <textarea 
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="E.g., Freshly baked cakes for every occasion..."
                rows={3}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Button Text</label>
                <input 
                  type="text" 
                  value={heroForm.buttonText}
                  onChange={(e) => setHeroForm(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="E.g., Shop Now"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Button Link</label>
                <input 
                  type="text" 
                  value={heroForm.buttonLink}
                  onChange={(e) => setHeroForm(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="E.g., /shop"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Background Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={heroForm.imageUrl}
                  onChange={(e) => setHeroForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                  required
                />
                {heroForm.imageUrl && (
                  <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <img src={heroForm.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'; e.currentTarget.className = "w-6 h-6 object-contain opacity-50"; }} />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-gray-200">
              <button 
                type="submit" 
                disabled={savingHero}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-rose/20 disabled:opacity-50 cursor-pointer"
              >
                {savingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Hero Banner</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Promotional Offers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Promotional Strips</h3>
                  <p className="text-xs text-gray-500">Add, edit, or toggle promotional notification bars.</p>
                </div>
              </div>
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-brand-rose text-white hover:bg-brand-rose/90 text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Strip</span>
              </button>
            </div>

            <div className="space-y-3">
              {promoStrips.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No promotional strips added yet. Click &quot;Add Strip&quot; to create one.
                </div>
              ) : (
                promoStrips.map((strip) => (
                  <div 
                    key={strip.id} 
                    className={`p-4 border rounded-xl flex items-start justify-between gap-3 transition-all ${
                      strip.isActive ? 'bg-gray-50 border-gray-200' : 'bg-gray-50/50 border-gray-100 opacity-60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{strip.title}</h4>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
                          strip.isActive 
                            ? 'border-green-500/20 bg-green-500/10 text-green-600' 
                            : 'border-gray-300 bg-gray-200 text-gray-500'
                        }`}>
                          {strip.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 italic mb-1">&quot;{strip.text}&quot;</p>
                      {strip.link && (
                        <p className="text-[11px] text-brand-rose flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate">{strip.link}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button 
                        onClick={() => handleToggleActive(strip.id)}
                        title={strip.isActive ? 'Deactivate' : 'Activate'}
                        className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          strip.isActive 
                            ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' 
                            : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenEditModal(strip)}
                        title="Edit Strip"
                        className="p-1.5 text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteStrip(strip.id)}
                        title="Delete Strip"
                        className="p-1.5 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg transition-colors border border-gray-200 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {savingStrips && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-rose" />
              <span>Saving strip updates to database...</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingStrip ? 'Edit Promotional Strip' : 'Add New Promotional Strip'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStripModal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Internal Title / Label
                  </label>
                  <input
                    type="text"
                    value={stripFormData.title}
                    onChange={(e) => setStripFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="E.g., Free Delivery Strip"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Announcement Text (Shown to Users)
                  </label>
                  <textarea
                    value={stripFormData.text}
                    onChange={(e) => setStripFormData((prev) => ({ ...prev, text: e.target.value }))}
                    placeholder="E.g., Get free delivery on orders above ₹999!"
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 text-sm resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Action Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={stripFormData.link}
                    onChange={(e) => setStripFormData((prev) => ({ ...prev, link: e.target.value }))}
                    placeholder="E.g., /cakes or /offers"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActiveStrip"
                    checked={stripFormData.isActive}
                    onChange={(e) => setStripFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-brand-rose rounded border-gray-300 focus:ring-brand-rose"
                  />
                  <label htmlFor="isActiveStrip" className="text-xs font-semibold text-gray-700 cursor-pointer">
                    Enable this strip actively on storefront
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-medium bg-brand-rose hover:bg-brand-rose/90 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    {editingStrip ? 'Update Strip' : 'Create Strip'}
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
