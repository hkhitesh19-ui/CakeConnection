"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Save, Loader2, ArrowLeft, Eye, EyeOff, Edit2, Clock
} from 'lucide-react';

// ---- Types ----

interface PageData {
  slug: string;
  title: string;
  content: string;
  status: 'published' | 'draft';
  lastUpdated: string;
}

// ---- Default Pages ----

const DEFAULT_PAGES: PageData[] = [
  {
    slug: 'about',
    title: 'About Us',
    content: 'Cake Connection is Vadodara\'s premium bakery, crafting exquisite cakes and arranging fresh flower bouquets since 2020. Our mission is to make every celebration unforgettable with handcrafted desserts and same-day delivery across the city.\n\nWe use only the finest ingredients — Belgian chocolate, fresh cream, seasonal fruits, and farm-fresh flowers — to create products that delight both eyes and taste buds.\n\nLocated at Eva Mall Road, Manjalpur, we serve 50+ pin codes across Vadodara with express 2-hour and midnight delivery options.',
    status: 'published',
    lastUpdated: new Date().toISOString(),
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    content: 'Q: What areas do you deliver to?\nA: We deliver across all major areas of Vadodara including Manjalpur, Alkapuri, Gotri, Vasna, Akota, Fatehgunj, Karelibaug, and 50+ pin codes.\n\nQ: How do I track my order?\nA: Track your order via the "My Orders" section or contact us on WhatsApp with your order number.\n\nQ: Do you offer same-day delivery?\nA: Yes! Order before 6 PM for same-day delivery. Midnight delivery is also available.\n\nQ: Can I customize my cake?\nA: Absolutely! Contact us on WhatsApp for custom designs, flavours, and messages.',
    status: 'published',
    lastUpdated: new Date().toISOString(),
  },
  {
    slug: 'delivery-info',
    title: 'Delivery Information',
    content: 'We offer multiple delivery options across Vadodara:\n\n• 2-Hour Express Delivery (₹149 surcharge)\n• 4-Hour Delivery (₹99 surcharge)\n• 6-Hour Delivery (₹49 surcharge)\n• Same Day Delivery (₹29, order by noon)\n• Next Day Delivery (Free)\n• Midnight Delivery (11:30 PM - 12:15 AM)\n\nFree delivery on orders above ₹999. We cover 50+ pin codes across Vadodara.',
    status: 'published',
    lastUpdated: new Date().toISOString(),
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    content: 'By using Cake Connection\'s website and services, you agree to the following terms:\n\n1. All orders are subject to availability and delivery area coverage.\n2. Prices are inclusive of GST unless stated otherwise.\n3. Delivery times are estimates and may vary during peak hours or festivals.\n4. Custom orders require minimum 24-hour advance notice.\n5. We reserve the right to substitute flowers/decorations with similar quality alternatives.\n6. Images are representational; actual products may vary slightly.\n7. Payment must be completed before delivery.\n8. Cancellation is allowed up to 4 hours before the scheduled delivery time.',
    status: 'published',
    lastUpdated: new Date().toISOString(),
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    content: 'Cake Connection respects your privacy. This policy describes how we collect, use, and protect your information.\n\nInformation We Collect:\n• Name, email, phone number, and delivery address when you place an order\n• Payment information (processed securely via third-party gateways)\n• Browsing data and cookies for improving your experience\n\nHow We Use Your Data:\n• To process and deliver your orders\n• To send order updates via SMS/email/WhatsApp\n• To improve our services and personalize your experience\n\nWe never sell your personal data to third parties. Contact us at hello@cakeconnection.in for privacy-related queries.',
    status: 'published',
    lastUpdated: new Date().toISOString(),
  },
  {
    slug: 'refund',
    title: 'Refund Policy',
    content: 'At Cake Connection, customer satisfaction is our priority.\n\nRefund Eligibility:\n• Damaged or incorrect items — full refund or replacement\n• Quality issues reported within 2 hours of delivery with photo evidence\n• Order cancellation before preparation has started\n\nNon-Refundable:\n• Custom/personalized orders once preparation begins\n• Change of mind after delivery\n• Perishable items consumed or tampered with\n\nRefund Process:\n1. Contact us on WhatsApp with your order number and photos\n2. Our team will review within 24 hours\n3. Approved refunds are processed within 5-7 business days to the original payment method',
    status: 'published',
    lastUpdated: new Date().toISOString(),
  },
];

export default function AdminPages() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PageData | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      const res = await fetch('/api/admin/cms');
      const json = await res.json();
      if (json.success && json.data) {
        const pageSections = json.data.filter((s: any) => s.section_name?.startsWith('page_'));
        if (pageSections.length > 0) {
          const loadedPages: PageData[] = pageSections.map((s: any) => ({
            slug: s.section_name.replace('page_', ''),
            title: s.content_json?.title || '',
            content: s.content_json?.content || '',
            status: s.is_active ? 'published' : 'draft',
            lastUpdated: s.updated_at || new Date().toISOString(),
          }));
          // Merge with defaults to ensure all pages exist
          const mergedPages = DEFAULT_PAGES.map((dp) => {
            const found = loadedPages.find((lp) => lp.slug === dp.slug);
            return found || dp;
          });
          setPages(mergedPages);
        } else {
          setPages(DEFAULT_PAGES);
        }
      } else {
        setPages(DEFAULT_PAGES);
      }
    } catch {
      setPages(DEFAULT_PAGES);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(page: PageData) {
    setEditingSlug(page.slug);
    setEditForm({ ...page });
  }

  function handleCancelEdit() {
    setEditingSlug(null);
    setEditForm(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_name: `page_${editForm.slug}`,
          content_json: { title: editForm.title, content: editForm.content },
          is_active: editForm.status === 'published',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPages((prev) =>
          prev.map((p) =>
            p.slug === editForm.slug ? { ...editForm, lastUpdated: new Date().toISOString() } : p
          )
        );
        setEditingSlug(null);
        setEditForm(null);
        setSuccessMsg('Page saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert('Failed: ' + json.error);
      }
    } catch {
      alert('Error saving page');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-rose" />
      </div>
    );
  }

  // ---- Edit Mode ----
  if (editingSlug && editForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={handleCancelEdit} className="p-2 bg-white hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-1">Edit Page</h2>
            <p className="text-gray-500 text-sm">Editing: {editForm.title}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6"
        >
          <form onSubmit={handleSave} className="space-y-5">
            {/* Page Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Page Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm((p) => p ? { ...p, title: e.target.value } : p)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Content</label>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm((p) => p ? { ...p, content: e.target.value } : p)}
                rows={18}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors resize-y font-mono text-sm leading-relaxed"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Use line breaks for formatting. Each paragraph is separated by a blank line.</p>
            </div>

            {/* Status Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Status</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditForm((p) => p ? { ...p, status: 'published' } : p)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    editForm.status === 'published'
                      ? 'bg-green-500/10 text-green-500 border-green-500/20'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-green-500/20'
                  }`}
                >
                  <Eye className="w-4 h-4" /> Published
                </button>
                <button
                  type="button"
                  onClick={() => setEditForm((p) => p ? { ...p, status: 'draft' } : p)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    editForm.status === 'draft'
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-orange-500/20'
                  }`}
                >
                  <EyeOff className="w-4 h-4" /> Draft
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3 justify-end border-t border-gray-200">
              <button type="button" onClick={handleCancelEdit} className="px-5 py-3 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-rose/20 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Page
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // ---- Table View ----
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Pages</h2>
          <p className="text-gray-500">Manage content for static pages — About, FAQ, Terms, Privacy, etc.</p>
        </div>
        {successMsg && (
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium rounded-xl">
            ✓ {successMsg}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Page Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page, idx) => (
                <motion.tr
                  key={page.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-rose/10 flex items-center justify-center text-brand-rose flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">/{page.slug}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {new Date(page.lastUpdated).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      page.status === 'published'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(page)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 rounded-xl border border-gray-200 transition-colors text-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
