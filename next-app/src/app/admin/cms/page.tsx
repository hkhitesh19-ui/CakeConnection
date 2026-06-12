"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutTemplate, Plus, Save, Loader2, Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';

export default function AdminCMS() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state for Hero Banner
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    imageUrl: '',
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
      }
    } catch (error) {
      console.error('Error fetching CMS content:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
        alert('Failed to update Hero Banner: ' + resData.error);
      }
    } catch (error) {
      console.error('Error saving CMS:', error);
      alert('Error saving CMS content');
    } finally {
      setSaving(false);
    }
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
          <h2 className="text-3xl font-display font-bold text-white mb-2">CMS & Banners</h2>
          <p className="text-text-muted">Manage homepage content, banners, and promotional texts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Banner Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-secondary border border-border-secondary rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-secondary">
            <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Hero Banner</h3>
              <p className="text-xs text-text-muted">Main homepage banner seen by visitors.</p>
            </div>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Main Title</label>
              <input 
                type="text" 
                value={heroForm.title}
                onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="E.g., Sweet Delights Delivered"
                className="w-full bg-brand-black border border-border-secondary rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Subtitle Text</label>
              <textarea 
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="E.g., Freshly baked cakes for every occasion..."
                rows={3}
                className="w-full bg-brand-black border border-border-secondary rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Button Text</label>
                <input 
                  type="text" 
                  value={heroForm.buttonText}
                  onChange={(e) => setHeroForm(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="E.g., Shop Now"
                  className="w-full bg-brand-black border border-border-secondary rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Button Link</label>
                <input 
                  type="text" 
                  value={heroForm.buttonLink}
                  onChange={(e) => setHeroForm(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="E.g., /shop"
                  className="w-full bg-brand-black border border-border-secondary rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Background Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={heroForm.imageUrl}
                  onChange={(e) => setHeroForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="flex-1 bg-brand-black border border-border-secondary rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors"
                  required
                />
                {heroForm.imageUrl && (
                  <div className="w-12 h-12 rounded-xl border border-border-secondary overflow-hidden flex-shrink-0">
                    <img src={heroForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-border-secondary">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-rose/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
          className="bg-surface-secondary border border-border-secondary rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-secondary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Promotional Strips</h3>
                <p className="text-xs text-text-muted">Manage small offer banners.</p>
              </div>
            </div>
            <button className="p-2 bg-brand-black hover:bg-surface-tertiary text-white rounded-xl border border-border-secondary transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-brand-black/40 border border-border-secondary rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Free Delivery Strip</h4>
                <p className="text-xs text-text-muted">"Get free delivery on orders above ₹999!"</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-text-muted hover:text-white bg-surface-tertiary hover:bg-surface-elevated rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <div className="px-2 py-1 text-[10px] font-bold uppercase rounded-md border border-green-500/20 bg-green-500/10 text-green-500 flex items-center">
                  Active
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-brand-black/40 border border-border-secondary rounded-xl flex items-center justify-between opacity-50">
              <div>
                <h4 className="font-semibold text-white">Valentine's Special</h4>
                <p className="text-xs text-text-muted">"Use code LOVE20 for 20% off on cakes"</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-text-muted hover:text-white bg-surface-tertiary hover:bg-surface-elevated rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <div className="px-2 py-1 text-[10px] font-bold uppercase rounded-md border border-gray-500/20 bg-gray-500/10 text-gray-400 flex items-center">
                  Inactive
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
