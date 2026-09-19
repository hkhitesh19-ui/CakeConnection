"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Globe, Bot, MapPin, Save, Loader2, Plus, Trash2, Eye, Info,
  ChevronDown, ExternalLink, Code
} from 'lucide-react';
import { useSiteStore } from '@/stores/siteStore';

// ---- Types ----

interface SEORouteData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

interface AEOQuestion {
  id: string;
  question: string;
  answer: string;
  sourcePage: string;
}

interface GEOConfig {
  serviceRadiusKm: number;
  citiesCovered: string[];
  googleBusinessUrl: string;
}

// ---- Route options for dropdown ----

const ROUTE_OPTIONS = [
  { value: '/', label: 'Homepage (/)' },
  { value: '/cakes', label: 'Cakes (/cakes)' },
  { value: '/flowers', label: 'Flowers (/flowers)' },
  { value: '/combos', label: 'Combos (/combos)' },
  { value: '/about', label: 'About (/about)' },
  { value: '/faq', label: 'FAQ (/faq)' },
  { value: '/cart', label: 'Cart (/cart)' },
  { value: 'birthday-cake-vadodara', label: 'Birthday Cake Vadodara' },
  { value: 'eggless-cake-vadodara', label: 'Eggless Cake Vadodara' },
  { value: 'online-cake-delivery-vadodara', label: 'Online Cake Delivery Vadodara' },
  { value: 'same-day-delivery-vadodara', label: 'Same Day Delivery Vadodara' },
];

// ---- Tabs ----

type TabId = 'seo' | 'aeo' | 'geo';

const TABS: { id: TabId; label: string; icon: typeof Search }[] = [
  { id: 'seo', label: 'Page SEO', icon: Search },
  { id: 'aeo', label: 'AEO', icon: Bot },
  { id: 'geo', label: 'GEO / Local', icon: MapPin },
];

export default function AdminSEO() {
  const [activeTab, setActiveTab] = useState<TabId>('seo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // SEO State
  const [selectedRoute, setSelectedRoute] = useState('/');
  const [seoRoutes, setSeoRoutes] = useState<Record<string, SEORouteData>>({});
  const [seoForm, setSeoForm] = useState<SEORouteData>({
    title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '',
  });

  // AEO State
  const [aeoQuestions, setAeoQuestions] = useState<AEOQuestion[]>([]);
  const [aeoForm, setAeoForm] = useState<AEOQuestion>({
    id: '', question: '', answer: '', sourcePage: '/',
  });
  const [editingAeoId, setEditingAeoId] = useState<string | null>(null);

  // GEO State
  const [geoConfig, setGeoConfig] = useState<GEOConfig>({
    serviceRadiusKm: 25, citiesCovered: [], googleBusinessUrl: '',
  });
  const [cityInput, setCityInput] = useState('');

  const generalSettings = useSiteStore((s) => s.generalSettings);

  useEffect(() => {
    fetchSEOData();
  }, []);

  useEffect(() => {
    if (seoRoutes[selectedRoute]) {
      setSeoForm(seoRoutes[selectedRoute]);
    } else {
      setSeoForm({ title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '' });
    }
  }, [selectedRoute, seoRoutes]);

  async function fetchSEOData() {
    try {
      const res = await fetch('/api/admin/seo');
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.seo?.routes) setSeoRoutes(json.data.seo.routes);
        if (json.data.aeo?.questions) setAeoQuestions(json.data.aeo.questions);
        if (json.data.geo) setGeoConfig(json.data.geo);
      }
    } catch (err) {
      console.error('Error fetching SEO data:', err);
    } finally {
      setLoading(false);
    }
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  // ---- SEO Handlers ----
  async function handleSaveSEO(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const updatedRoutes = { ...seoRoutes, [selectedRoute]: seoForm };
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'seo', data: { routes: updatedRoutes } }),
      });
      const json = await res.json();
      if (json.success) {
        setSeoRoutes(updatedRoutes);
        showSuccess('SEO settings saved!');
      } else {
        alert('Failed: ' + json.error);
      }
    } catch { alert('Error saving SEO settings'); }
    finally { setSaving(false); }
  }

  // ---- AEO Handlers ----
  function handleAddAeo() {
    setEditingAeoId('new');
    setAeoForm({ id: '', question: '', answer: '', sourcePage: '/' });
  }

  function handleEditAeo(q: AEOQuestion) {
    setEditingAeoId(q.id);
    setAeoForm(q);
  }

  function handleDeleteAeo(id: string) {
    setAeoQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  async function handleSaveAeo(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    let updated: AEOQuestion[];
    if (editingAeoId === 'new') {
      const newQ = { ...aeoForm, id: `aeo-${Date.now()}` };
      updated = [...aeoQuestions, newQ];
    } else {
      updated = aeoQuestions.map((q) => (q.id === editingAeoId ? aeoForm : q));
    }
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'aeo', data: { questions: updated } }),
      });
      const json = await res.json();
      if (json.success) {
        setAeoQuestions(updated);
        setEditingAeoId(null);
        showSuccess('AEO Q&A saved!');
      } else { alert('Failed: ' + json.error); }
    } catch { alert('Error saving AEO config'); }
    finally { setSaving(false); }
  }

  async function handleSaveAllAeo() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'aeo', data: { questions: aeoQuestions } }),
      });
      const json = await res.json();
      if (json.success) showSuccess('All AEO Q&A saved!');
      else alert('Failed: ' + json.error);
    } catch { alert('Error saving AEO config'); }
    finally { setSaving(false); }
  }

  // ---- GEO Handlers ----
  function handleAddCity() {
    if (cityInput.trim() && !geoConfig.citiesCovered.includes(cityInput.trim())) {
      setGeoConfig((prev) => ({ ...prev, citiesCovered: [...prev.citiesCovered, cityInput.trim()] }));
      setCityInput('');
    }
  }

  function handleRemoveCity(city: string) {
    setGeoConfig((prev) => ({ ...prev, citiesCovered: prev.citiesCovered.filter((c) => c !== city) }));
  }

  async function handleSaveGeo(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'geo', data: geoConfig }),
      });
      const json = await res.json();
      if (json.success) showSuccess('GEO settings saved!');
      else alert('Failed: ' + json.error);
    } catch { alert('Error saving GEO config'); }
    finally { setSaving(false); }
  }

  // ---- LocalBusiness schema preview ----
  function generateSchemaPreview() {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Bakery",
      "name": generalSettings.storeName,
      "image": "/og-image.jpg",
      "telephone": generalSettings.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": generalSettings.address,
        "addressLocality": generalSettings.city,
        "addressRegion": generalSettings.state,
        "postalCode": generalSettings.pincode,
        "addressCountry": "IN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": generalSettings.coordinates.lat,
        "longitude": generalSettings.coordinates.lng,
      },
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": generalSettings.coordinates.lat,
          "longitude": generalSettings.coordinates.lng,
        },
        "geoRadius": `${geoConfig.serviceRadiusKm}000`,
      },
      "openingHours": `${generalSettings.hours.days} ${generalSettings.hours.open}-${generalSettings.hours.close}`,
      "sameAs": [generalSettings.socials.instagram, generalSettings.socials.facebook].filter(Boolean),
      ...(geoConfig.googleBusinessUrl ? { "url": geoConfig.googleBusinessUrl } : {}),
    }, null, 2);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-rose" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">SEO / AEO / GEO</h2>
          <p className="text-gray-500">Manage search engine optimization, answer engine optimization, and local SEO.</p>
        </div>
        {successMsg && (
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium rounded-xl">
            ✓ {successMsg}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 font-medium text-sm rounded-t-xl transition-colors border-b-2 -mb-[1px] ${
              activeTab === tab.id
                ? 'border-brand-rose text-brand-rose bg-brand-rose/5'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'seo' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SEO Form */}
            <div className="lg:col-span-2 bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Page SEO Editor</h3>
                  <p className="text-xs text-gray-500">Edit meta tags for each route.</p>
                </div>
              </div>

              {/* Route Selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Select Page</label>
                <div className="relative">
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose appearance-none"
                  >
                    {ROUTE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <form onSubmit={handleSaveSEO} className="space-y-4">
                {/* Title Tag */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Title Tag</label>
                    <span className={`text-xs ${seoForm.title.length > 60 ? 'text-red-400' : seoForm.title.length >= 50 ? 'text-green-400' : 'text-gray-500'}`}>
                      {seoForm.title.length}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoForm.title}
                    onChange={(e) => setSeoForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="E.g., Premium Cakes Online | Vadodara"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                  />
                  {seoForm.title.length > 60 && (
                    <p className="text-xs text-red-400 mt-1">Title exceeds recommended 60 characters — may be truncated in search results.</p>
                  )}
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Meta Description</label>
                    <span className={`text-xs ${seoForm.description.length > 160 ? 'text-red-400' : seoForm.description.length >= 150 ? 'text-green-400' : 'text-gray-500'}`}>
                      {seoForm.description.length}/160
                    </span>
                  </div>
                  <textarea
                    value={seoForm.description}
                    onChange={(e) => setSeoForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="A concise description of the page content..."
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors resize-none"
                  />
                  {seoForm.description.length > 160 && (
                    <p className="text-xs text-red-400 mt-1">Description exceeds recommended 160 characters.</p>
                  )}
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={seoForm.keywords}
                    onChange={(e) => setSeoForm((p) => ({ ...p, keywords: e.target.value }))}
                    placeholder="cake delivery, birthday cake, vadodara"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                  />
                </div>

                {/* OG Image URL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">OG Image URL</label>
                  <input
                    type="url"
                    value={seoForm.ogImage}
                    onChange={(e) => setSeoForm((p) => ({ ...p, ogImage: e.target.value }))}
                    placeholder="https://... (1200x630 recommended)"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                  />
                </div>

                {/* Canonical URL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Canonical URL</label>
                  <input
                    type="url"
                    value={seoForm.canonicalUrl}
                    onChange={(e) => setSeoForm((p) => ({ ...p, canonicalUrl: e.target.value }))}
                    placeholder="https://cakeconnection.in/..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                  />
                </div>

                <div className="pt-4 flex justify-end border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-rose/20 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save SEO Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Google SERP Preview */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <Eye className="w-5 h-5 text-brand-rose" />
                <h3 className="text-lg font-bold text-gray-900">SERP Preview</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">How this page may appear in Google search results:</p>

              <div className="bg-white rounded-xl p-4 space-y-1">
                <p className="text-sm text-[#1a0dab] font-medium leading-snug hover:underline cursor-pointer truncate">
                  {seoForm.title || 'Page Title — Cake Connection'}
                </p>
                <p className="text-xs text-[#006621] truncate">
                  cakeconnection.in{selectedRoute.startsWith('/') ? selectedRoute : `/${selectedRoute}`}
                </p>
                <p className="text-xs text-[#545454] leading-relaxed line-clamp-2">
                  {seoForm.description || 'Add a meta description to see the preview...'}
                </p>
              </div>

              {seoForm.ogImage && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">OG Image Preview:</p>
                  <div className="rounded-xl border border-gray-200 overflow-hidden aspect-[1200/630]">
                    <img src={seoForm.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Quick Checks</p>
                <div className="space-y-1.5">
                  <CheckItem label="Title length" ok={seoForm.title.length >= 30 && seoForm.title.length <= 60} />
                  <CheckItem label="Description length" ok={seoForm.description.length >= 120 && seoForm.description.length <= 160} />
                  <CheckItem label="Keywords present" ok={seoForm.keywords.length > 0} />
                  <CheckItem label="OG Image set" ok={seoForm.ogImage.length > 0} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'aeo' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Info Card */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex gap-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900 mb-1">What is AEO (Answer Engine Optimization)?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                AEO optimizes your content for AI-powered search engines (ChatGPT, Gemini, Perplexity, etc.). 
                By providing concise, authoritative answers to target questions, your business is more likely to be cited 
                as a source in AI-generated responses. Add Q&A pairs below that cover your most important search queries.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Target Q&A Pairs</h3>
                  <p className="text-xs text-gray-500">{aeoQuestions.length} question{aeoQuestions.length !== 1 ? 's' : ''} configured</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveAllAeo} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save All
                </button>
                <button onClick={handleAddAeo} className="flex items-center gap-2 px-4 py-2 bg-brand-rose hover:bg-brand-rose/90 text-white rounded-xl text-sm transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Q&A
                </button>
              </div>
            </div>

            {/* Editing Form */}
            {editingAeoId && (
              <form onSubmit={handleSaveAeo} className="mb-6 p-4 bg-gray-100 border border-brand-rose/20 rounded-xl space-y-4">
                <h4 className="text-sm font-semibold text-brand-rose uppercase tracking-wider">
                  {editingAeoId === 'new' ? 'Add New Q&A' : 'Edit Q&A'}
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Target Question</label>
                  <input
                    type="text"
                    value={aeoForm.question}
                    onChange={(e) => setAeoForm((p) => ({ ...p, question: e.target.value }))}
                    placeholder="E.g., What is the best cake shop in Vadodara?"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Concise Answer</label>
                    <span className={`text-xs ${aeoForm.answer.length > 300 ? 'text-red-400' : 'text-gray-500'}`}>
                      {aeoForm.answer.length}/300
                    </span>
                  </div>
                  <textarea
                    value={aeoForm.answer}
                    onChange={(e) => setAeoForm((p) => ({ ...p, answer: e.target.value.slice(0, 300) }))}
                    placeholder="A concise, authoritative answer (max 300 chars)..."
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Source Page URL</label>
                  <input
                    type="text"
                    value={aeoForm.sourcePage}
                    onChange={(e) => setAeoForm((p) => ({ ...p, sourcePage: e.target.value }))}
                    placeholder="/"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setEditingAeoId(null)} className="px-4 py-2 bg-white text-gray-600 rounded-xl text-sm hover:bg-gray-50 border border-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {editingAeoId === 'new' ? 'Add' : 'Update'}
                  </button>
                </div>
              </form>
            )}

            {/* Q&A List */}
            <div className="space-y-3">
              {aeoQuestions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No Q&A pairs yet. Click "Add Q&A" to get started.</p>
              ) : (
                aeoQuestions.map((q) => (
                  <div key={q.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm mb-1">Q: {q.question}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">A: {q.answer}</p>
                        <p className="text-xs text-gray-500 mt-2">Source: {q.sourcePage}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => handleEditAeo(q)} className="p-2 text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                          <Search className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteAeo(q.id)} className="p-2 text-gray-500 hover:text-red-500 bg-white hover:bg-red-50 border border-gray-200 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'geo' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GEO Form */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Local SEO Settings</h3>
                  <p className="text-xs text-gray-500">Auto-populated from General Settings.</p>
                </div>
              </div>

              {/* Existing business info from general settings */}
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">From General Settings</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Store Name:</span>
                  <span className="text-gray-900">{generalSettings.storeName}</span>
                  <span className="text-gray-500">Address:</span>
                  <span className="text-gray-900 truncate">{generalSettings.address}</span>
                  <span className="text-gray-500">City:</span>
                  <span className="text-gray-900">{generalSettings.city}</span>
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-900">{generalSettings.phone}</span>
                  <span className="text-gray-500">Coordinates:</span>
                  <span className="text-gray-900">{generalSettings.coordinates.lat}, {generalSettings.coordinates.lng}</span>
                </div>
              </div>

              <form onSubmit={handleSaveGeo} className="space-y-4">
                {/* Service Radius */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Service Area Radius (km)</label>
                  <input
                    type="number"
                    value={geoConfig.serviceRadiusKm}
                    onChange={(e) => setGeoConfig((p) => ({ ...p, serviceRadiusKm: Number(e.target.value) }))}
                    min={1}
                    max={100}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                  />
                </div>

                {/* Cities Covered */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Cities / Areas Covered</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCity(); } }}
                      placeholder="Add a city or area..."
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                    />
                    <button type="button" onClick={handleAddCity} className="px-4 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white rounded-xl transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {geoConfig.citiesCovered.map((city) => (
                      <span key={city} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-lg text-sm text-gray-900">
                        {city}
                        <button type="button" onClick={() => handleRemoveCity(city)} className="text-gray-500 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Google Business URL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Google Business Profile URL</label>
                  <input
                    type="url"
                    value={geoConfig.googleBusinessUrl}
                    onChange={(e) => setGeoConfig((p) => ({ ...p, googleBusinessUrl: e.target.value }))}
                    placeholder="https://g.page/..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                  />
                </div>

                <div className="pt-4 flex justify-end border-t border-gray-200">
                  <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-rose/20 disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save GEO Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Schema Preview */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <Code className="w-5 h-5 text-brand-rose" />
                <h3 className="text-lg font-bold text-gray-900">LocalBusiness Schema Preview</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                This JSON-LD structured data will help Google understand your business location and service area.
              </p>
              <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-800 overflow-auto max-h-[500px] font-mono leading-relaxed">
                {generateSchemaPreview()}
              </pre>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ---- Helper Component ----

function CheckItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${ok ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {ok ? '✓' : '✗'}
      </span>
      <span className={ok ? 'text-green-400' : 'text-red-400'}>{label}</span>
    </div>
  );
}
