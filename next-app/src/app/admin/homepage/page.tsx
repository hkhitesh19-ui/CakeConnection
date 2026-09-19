"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  Grid3X3,
  Gift,
  Star,
  Truck,
  Flower2,
  ShieldCheck,
  MessageSquareQuote,
  Camera,
  HelpCircle,
  Megaphone,
  Sparkles,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────

interface HeroConfig {
  subtitle: string;
  title1: string;
  title2: string;
  description: string;
  button1Text: string;
  button1Url: string;
  button2Text: string;
  button2Url: string;
  image: string;
}

interface CategoryItem {
  name: string;
  image: string;
  link: string;
}

interface OccasionItem {
  name: string;
  image: string;
  link: string;
}

interface BestsellerConfig {
  title: string;
  subtitle: string;
  count: number;
}

interface DeliveryBannerConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
}

interface ComboConfig {
  title: string;
  description: string;
}

interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

interface TestimonialItem {
  name: string;
  rating: number;
  text: string;
  tag: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FooterCTAConfig {
  headline: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
}

// ─── Reusable Sub-Components ────────────────────────────

const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all text-sm";
const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5";
const textareaCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all resize-none text-sm";

function SectionCard({
  id,
  icon: Icon,
  title,
  subtitle,
  open,
  onToggle,
  saving,
  onSave,
  feedback,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  saving: boolean;
  onSave: () => void;
  feedback: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-200 pt-4">
          {children}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {feedback && (
              <span className={`text-xs font-medium ${feedback.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {feedback}
              </span>
            )}
            <div className="ml-auto" />
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-brand-rose/20 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Section</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddItemBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-dashed border-gray-200 hover:border-brand-rose/50 text-gray-600 hover:text-brand-rose rounded-xl transition-colors text-xs font-medium cursor-pointer"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}

function RemoveItemBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
      title="Remove item"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

// ─── Main Page Component ────────────────────────────────

export default function AdminHomepage() {
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ homepage_hero: true });
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  // Section states
  const [hero, setHero] = useState<HeroConfig>({
    subtitle: '', title1: '', title2: '', description: '',
    button1Text: '', button1Url: '', button2Text: '', button2Url: '', image: '',
  });
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [occasions, setOccasions] = useState<OccasionItem[]>([]);
  const [bestsellers, setBestsellers] = useState<BestsellerConfig>({ title: '', subtitle: '', count: 8 });
  const [deliveryBanner, setDeliveryBanner] = useState<DeliveryBannerConfig>({ title: '', subtitle: '', buttonText: '', buttonUrl: '' });
  const [bestsellerFlowers, setBestsellerFlowers] = useState<BestsellerConfig>({ title: '', subtitle: '', count: 8 });
  const [combos, setCombos] = useState<ComboConfig>({ title: '', description: '' });
  const [trustBadges, setTrustBadges] = useState<TrustBadge[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [instagramImages, setInstagramImages] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [footerCta, setFooterCta] = useState<FooterCTAConfig>({ headline: '', subtitle: '', buttonText: '', buttonUrl: '' });

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    try {
      const res = await fetch('/api/admin/homepage');
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.homepage_hero) setHero(d.homepage_hero);
        if (d.homepage_categories) setCategories(d.homepage_categories);
        if (d.homepage_occasions) setOccasions(d.homepage_occasions);
        if (d.homepage_bestsellers) setBestsellers(d.homepage_bestsellers);
        if (d.homepage_delivery_banner) setDeliveryBanner(d.homepage_delivery_banner);
        if (d.homepage_bestseller_flowers) setBestsellerFlowers(d.homepage_bestseller_flowers);
        if (d.homepage_combos) setCombos(d.homepage_combos);
        if (d.homepage_trust_badges) setTrustBadges(d.homepage_trust_badges);
        if (d.homepage_testimonials) setTestimonials(d.homepage_testimonials);
        if (d.homepage_instagram) setInstagramImages(d.homepage_instagram);
        if (d.homepage_faq) setFaqs(d.homepage_faq);
        if (d.homepage_footer_cta) setFooterCta(d.homepage_footer_cta);
      }
    } catch (err) {
      console.error('Failed to fetch homepage sections:', err);
    } finally {
      setLoading(false);
    }
  }

  const saveSection = useCallback(async (sectionKey: string, config: any) => {
    setSavingSection(sectionKey);
    setFeedback((prev) => ({ ...prev, [sectionKey]: '' }));
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: sectionKey, config }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback((prev) => ({ ...prev, [sectionKey]: '✓ Saved successfully' }));
      } else {
        setFeedback((prev) => ({ ...prev, [sectionKey]: 'Error: ' + (json.error || 'Save failed') }));
      }
    } catch {
      setFeedback((prev) => ({ ...prev, [sectionKey]: 'Error: Network error' }));
    } finally {
      setSavingSection(null);
      setTimeout(() => setFeedback((prev) => ({ ...prev, [sectionKey]: '' })), 4000);
    }
  }, []);

  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-rose" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Homepage CMS</h2>
        <p className="text-gray-500">Manage all homepage sections — hero, categories, testimonials, FAQ, and more.</p>
      </div>

      <div className="space-y-4">

        {/* ─── 1. Hero Section ─── */}
        <SectionCard
          id="homepage_hero" icon={LayoutTemplate} title="Hero Section" subtitle="Main landing area with titles, buttons, and hero image"
          open={!!openSections.homepage_hero} onToggle={() => toggleSection('homepage_hero')}
          saving={savingSection === 'homepage_hero'} onSave={() => saveSection('homepage_hero', hero)}
          feedback={feedback.homepage_hero || ''}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Subtitle / Tag</label>
              <input className={inputCls} value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Hero Image URL</label>
              <div className="flex gap-2">
                <input className={inputCls} value={hero.image} onChange={(e) => setHero({ ...hero, image: e.target.value })} />
                {hero.image && (
                  <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <img src={hero.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'; e.currentTarget.className = "w-6 h-6 object-contain opacity-50"; }} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title Line 1</label>
              <input className={inputCls} value={hero.title1} onChange={(e) => setHero({ ...hero, title1: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Title Line 2</label>
              <input className={inputCls} value={hero.title2} onChange={(e) => setHero({ ...hero, title2: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={textareaCls} rows={3} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Button 1 Text</label>
              <input className={inputCls} value={hero.button1Text} onChange={(e) => setHero({ ...hero, button1Text: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Button 1 URL</label>
              <input className={inputCls} value={hero.button1Url} onChange={(e) => setHero({ ...hero, button1Url: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Button 2 Text</label>
              <input className={inputCls} value={hero.button2Text} onChange={(e) => setHero({ ...hero, button2Text: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Button 2 URL</label>
              <input className={inputCls} value={hero.button2Url} onChange={(e) => setHero({ ...hero, button2Url: e.target.value })} />
            </div>
          </div>
        </SectionCard>

        {/* ─── 2. Categories Section ─── */}
        <SectionCard
          id="homepage_categories" icon={Grid3X3} title="Categories Section" subtitle="Category cards shown on homepage"
          open={!!openSections.homepage_categories} onToggle={() => toggleSection('homepage_categories')}
          saving={savingSection === 'homepage_categories'} onSave={() => saveSection('homepage_categories', categories)}
          feedback={feedback.homepage_categories || ''}
        >
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input className={inputCls} value={cat.name} onChange={(e) => { const u = [...categories]; u[i] = { ...u[i], name: e.target.value }; setCategories(u); }} />
                  </div>
                  <div>
                    <label className={labelCls}>Image URL</label>
                    <div className="flex gap-2">
                      <input className={inputCls} value={cat.image} onChange={(e) => { const u = [...categories]; u[i] = { ...u[i], image: e.target.value }; setCategories(u); }} />
                      {cat.image && (
                        <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                          <img src={cat.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'; e.currentTarget.className = "w-5 h-5 object-contain opacity-50"; }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Link</label>
                    <input className={inputCls} value={cat.link} onChange={(e) => { const u = [...categories]; u[i] = { ...u[i], link: e.target.value }; setCategories(u); }} />
                  </div>
                </div>
                <RemoveItemBtn onClick={() => setCategories(categories.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
          <AddItemBtn onClick={() => setCategories([...categories, { name: '', image: '', link: '' }])} label="Add Category" />
        </SectionCard>

        {/* ─── 3. Shop By Occasion ─── */}
        <SectionCard
          id="homepage_occasions" icon={Gift} title="Shop By Occasion" subtitle="Occasion-based shopping cards"
          open={!!openSections.homepage_occasions} onToggle={() => toggleSection('homepage_occasions')}
          saving={savingSection === 'homepage_occasions'} onSave={() => saveSection('homepage_occasions', occasions)}
          feedback={feedback.homepage_occasions || ''}
        >
          <div className="space-y-3">
            {occasions.map((occ, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Occasion Name</label>
                    <input className={inputCls} value={occ.name} onChange={(e) => { const u = [...occasions]; u[i] = { ...u[i], name: e.target.value }; setOccasions(u); }} />
                  </div>
                  <div>
                    <label className={labelCls}>Image URL</label>
                    <div className="flex gap-2">
                      <input className={inputCls} value={occ.image} onChange={(e) => { const u = [...occasions]; u[i] = { ...u[i], image: e.target.value }; setOccasions(u); }} />
                      {occ.image && (
                        <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                          <img src={occ.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'; e.currentTarget.className = "w-5 h-5 object-contain opacity-50"; }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Link</label>
                    <input className={inputCls} value={occ.link} onChange={(e) => { const u = [...occasions]; u[i] = { ...u[i], link: e.target.value }; setOccasions(u); }} />
                  </div>
                </div>
                <RemoveItemBtn onClick={() => setOccasions(occasions.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
          <AddItemBtn onClick={() => setOccasions([...occasions, { name: '', image: '', link: '' }])} label="Add Occasion" />
        </SectionCard>

        {/* ─── 4. Bestseller Cakes ─── */}
        <SectionCard
          id="homepage_bestsellers" icon={Star} title="Bestseller Cakes" subtitle="Section title and how many products to show"
          open={!!openSections.homepage_bestsellers} onToggle={() => toggleSection('homepage_bestsellers')}
          saving={savingSection === 'homepage_bestsellers'} onSave={() => saveSection('homepage_bestsellers', bestsellers)}
          feedback={feedback.homepage_bestsellers || ''}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Section Title</label>
              <input className={inputCls} value={bestsellers.title} onChange={(e) => setBestsellers({ ...bestsellers, title: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input className={inputCls} value={bestsellers.subtitle} onChange={(e) => setBestsellers({ ...bestsellers, subtitle: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Products to Show</label>
              <input type="number" min={1} max={20} className={inputCls} value={bestsellers.count} onChange={(e) => setBestsellers({ ...bestsellers, count: parseInt(e.target.value) || 8 })} />
            </div>
          </div>
        </SectionCard>

        {/* ─── 5. Delivery Banner ─── */}
        <SectionCard
          id="homepage_delivery_banner" icon={Truck} title="Delivery Banner" subtitle="Promotional delivery strip on homepage"
          open={!!openSections.homepage_delivery_banner} onToggle={() => toggleSection('homepage_delivery_banner')}
          saving={savingSection === 'homepage_delivery_banner'} onSave={() => saveSection('homepage_delivery_banner', deliveryBanner)}
          feedback={feedback.homepage_delivery_banner || ''}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} value={deliveryBanner.title} onChange={(e) => setDeliveryBanner({ ...deliveryBanner, title: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input className={inputCls} value={deliveryBanner.subtitle} onChange={(e) => setDeliveryBanner({ ...deliveryBanner, subtitle: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Button Text</label>
              <input className={inputCls} value={deliveryBanner.buttonText} onChange={(e) => setDeliveryBanner({ ...deliveryBanner, buttonText: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Button URL</label>
              <input className={inputCls} value={deliveryBanner.buttonUrl} onChange={(e) => setDeliveryBanner({ ...deliveryBanner, buttonUrl: e.target.value })} />
            </div>
          </div>
        </SectionCard>

        {/* ─── 6. Bestseller Flowers ─── */}
        <SectionCard
          id="homepage_bestseller_flowers" icon={Flower2} title="Bestseller Flowers" subtitle="Section title and product count for flower carousel"
          open={!!openSections.homepage_bestseller_flowers} onToggle={() => toggleSection('homepage_bestseller_flowers')}
          saving={savingSection === 'homepage_bestseller_flowers'} onSave={() => saveSection('homepage_bestseller_flowers', bestsellerFlowers)}
          feedback={feedback.homepage_bestseller_flowers || ''}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Section Title</label>
              <input className={inputCls} value={bestsellerFlowers.title} onChange={(e) => setBestsellerFlowers({ ...bestsellerFlowers, title: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input className={inputCls} value={bestsellerFlowers.subtitle} onChange={(e) => setBestsellerFlowers({ ...bestsellerFlowers, subtitle: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Products to Show</label>
              <input type="number" min={1} max={20} className={inputCls} value={bestsellerFlowers.count} onChange={(e) => setBestsellerFlowers({ ...bestsellerFlowers, count: parseInt(e.target.value) || 8 })} />
            </div>
          </div>
        </SectionCard>

        {/* ─── 7. Combo Gifts ─── */}
        <SectionCard
          id="homepage_combos" icon={Sparkles} title="Combo Gifts" subtitle="Section heading for combo gift products"
          open={!!openSections.homepage_combos} onToggle={() => toggleSection('homepage_combos')}
          saving={savingSection === 'homepage_combos'} onSave={() => saveSection('homepage_combos', combos)}
          feedback={feedback.homepage_combos || ''}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Section Title</label>
              <input className={inputCls} value={combos.title} onChange={(e) => setCombos({ ...combos, title: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <input className={inputCls} value={combos.description} onChange={(e) => setCombos({ ...combos, description: e.target.value })} />
            </div>
          </div>
        </SectionCard>

        {/* ─── 8. Trust Badges ─── */}
        <SectionCard
          id="homepage_trust_badges" icon={ShieldCheck} title="Trust Badges" subtitle="Trust indicators displayed on homepage"
          open={!!openSections.homepage_trust_badges} onToggle={() => toggleSection('homepage_trust_badges')}
          saving={savingSection === 'homepage_trust_badges'} onSave={() => saveSection('homepage_trust_badges', trustBadges)}
          feedback={feedback.homepage_trust_badges || ''}
        >
          <div className="space-y-3">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Icon Name</label>
                    <input className={inputCls} placeholder="e.g. Shield, Truck" value={badge.icon} onChange={(e) => { const u = [...trustBadges]; u[i] = { ...u[i], icon: e.target.value }; setTrustBadges(u); }} />
                  </div>
                  <div>
                    <label className={labelCls}>Title</label>
                    <input className={inputCls} value={badge.title} onChange={(e) => { const u = [...trustBadges]; u[i] = { ...u[i], title: e.target.value }; setTrustBadges(u); }} />
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <input className={inputCls} value={badge.description} onChange={(e) => { const u = [...trustBadges]; u[i] = { ...u[i], description: e.target.value }; setTrustBadges(u); }} />
                  </div>
                </div>
                <RemoveItemBtn onClick={() => setTrustBadges(trustBadges.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
          <AddItemBtn onClick={() => setTrustBadges([...trustBadges, { icon: '', title: '', description: '' }])} label="Add Badge" />
        </SectionCard>

        {/* ─── 9. Testimonials ─── */}
        <SectionCard
          id="homepage_testimonials" icon={MessageSquareQuote} title="Testimonials" subtitle="Customer reviews shown on homepage"
          open={!!openSections.homepage_testimonials} onToggle={() => toggleSection('homepage_testimonials')}
          saving={savingSection === 'homepage_testimonials'} onSave={() => saveSection('homepage_testimonials', testimonials)}
          feedback={feedback.homepage_testimonials || ''}
        >
          <div className="space-y-3">
            {testimonials.map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>Customer Name</label>
                      <input className={inputCls} value={t.name} onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], name: e.target.value }; setTestimonials(u); }} />
                    </div>
                    <div>
                      <label className={labelCls}>Rating (1-5)</label>
                      <input type="number" min={1} max={5} className={inputCls} value={t.rating} onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], rating: parseInt(e.target.value) || 5 }; setTestimonials(u); }} />
                    </div>
                    <div>
                      <label className={labelCls}>Tag</label>
                      <input className={inputCls} placeholder="e.g. Birthday" value={t.tag} onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], tag: e.target.value }; setTestimonials(u); }} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Review Text</label>
                    <textarea className={textareaCls} rows={2} value={t.text} onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], text: e.target.value }; setTestimonials(u); }} />
                  </div>
                </div>
                <RemoveItemBtn onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
          <AddItemBtn onClick={() => setTestimonials([...testimonials, { name: '', rating: 5, text: '', tag: '' }])} label="Add Testimonial" />
        </SectionCard>

        {/* ─── 10. Instagram Gallery ─── */}
        <SectionCard
          id="homepage_instagram" icon={Camera} title="Instagram Gallery" subtitle="Image URLs for Instagram-style gallery grid"
          open={!!openSections.homepage_instagram} onToggle={() => toggleSection('homepage_instagram')}
          saving={savingSection === 'homepage_instagram'} onSave={() => saveSection('homepage_instagram', instagramImages)}
          feedback={feedback.homepage_instagram || ''}
        >
          <div className="space-y-3">
            {instagramImages.map((url, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <input className={inputCls} placeholder="https://..." value={url} onChange={(e) => { const u = [...instagramImages]; u[i] = e.target.value; setInstagramImages(u); }} />
                </div>
                {url && (
                  <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'; e.currentTarget.className = "w-5 h-5 object-contain opacity-50"; }} />
                  </div>
                )}
                <RemoveItemBtn onClick={() => setInstagramImages(instagramImages.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
          <AddItemBtn onClick={() => setInstagramImages([...instagramImages, ''])} label="Add Image" />
        </SectionCard>

        {/* ─── 11. FAQ ─── */}
        <SectionCard
          id="homepage_faq" icon={HelpCircle} title="FAQ Section" subtitle="Frequently asked questions displayed on homepage"
          open={!!openSections.homepage_faq} onToggle={() => toggleSection('homepage_faq')}
          saving={savingSection === 'homepage_faq'} onSave={() => saveSection('homepage_faq', faqs)}
          feedback={feedback.homepage_faq || ''}
        >
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className={labelCls}>Question</label>
                    <input className={inputCls} value={faq.question} onChange={(e) => { const u = [...faqs]; u[i] = { ...u[i], question: e.target.value }; setFaqs(u); }} />
                  </div>
                  <div>
                    <label className={labelCls}>Answer</label>
                    <textarea className={textareaCls} rows={3} value={faq.answer} onChange={(e) => { const u = [...faqs]; u[i] = { ...u[i], answer: e.target.value }; setFaqs(u); }} />
                  </div>
                </div>
                <RemoveItemBtn onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
          <AddItemBtn onClick={() => setFaqs([...faqs, { question: '', answer: '' }])} label="Add FAQ" />
        </SectionCard>

        {/* ─── 12. Footer CTA ─── */}
        <SectionCard
          id="homepage_footer_cta" icon={Megaphone} title="Footer CTA" subtitle="Bottom call-to-action banner"
          open={!!openSections.homepage_footer_cta} onToggle={() => toggleSection('homepage_footer_cta')}
          saving={savingSection === 'homepage_footer_cta'} onSave={() => saveSection('homepage_footer_cta', footerCta)}
          feedback={feedback.homepage_footer_cta || ''}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Headline</label>
              <input className={inputCls} value={footerCta.headline} onChange={(e) => setFooterCta({ ...footerCta, headline: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input className={inputCls} value={footerCta.subtitle} onChange={(e) => setFooterCta({ ...footerCta, subtitle: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Button Text</label>
              <input className={inputCls} value={footerCta.buttonText} onChange={(e) => setFooterCta({ ...footerCta, buttonText: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Button URL</label>
              <input className={inputCls} value={footerCta.buttonUrl} onChange={(e) => setFooterCta({ ...footerCta, buttonUrl: e.target.value })} />
            </div>
          </div>
        </SectionCard>

      </div>
    </motion.div>
  );
}
