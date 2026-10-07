'use client';

// ============================================
// AI Daily Google Post Generator & Auto-Scheduler
// Cake Connection Admin Panel
// Connected to GBP: order.cakeconnection@gmail.com
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Send,
  Eye,
  Check,
  Edit3,
  Share2,
  Phone,
  ShoppingBag,
  Info,
} from 'lucide-react';
import type { GooglePostItem } from '@/app/api/admin/google-posts/route';

export default function GooglePostsAdminPage() {
  const [posts, setPosts] = useState<GooglePostItem[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isConfirmingAll, setIsConfirmingAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Editable fields for active post
  const activePost = posts[selectedDayIndex];
  const [editCaption, setEditCaption] = useState('');
  const [editTime, setEditTime] = useState('');

  // Fetch weekly posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/google-posts');
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching google posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (activePost) {
      setEditCaption(activePost.caption);
      setEditTime(activePost.scheduledTime);
    }
  }, [selectedDayIndex, posts]);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleCopyPost = (post: GooglePostItem) => {
    const fullText = `${post.caption}\n\n${post.hashtags}\n\nOrder link: ${post.ctaUrl}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(post.id);
    showToast(`Copied ${post.day}'s post text to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveActivePost = async () => {
    if (!activePost) return;
    try {
      const res = await fetch('/api/admin/google-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_post',
          postId: activePost.id,
          postData: {
            caption: editCaption,
            scheduledTime: editTime,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
        showToast(`Saved changes for ${activePost.day}'s post!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmAll = async () => {
    try {
      setIsConfirmingAll(true);
      const res = await fetch('/api/admin/google-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm_all' }),
      });
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
        showToast('All 7 daily posts confirmed & auto-scheduled for the week!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmingAll(false);
    }
  };

  const handleGenerateFresh = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch('/api/admin/google-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      });
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
        showToast('Fresh 7-day AI posts generated for the week!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-brand-rose border-t-transparent animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Google Posts Scheduler...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700 text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-brand-rose border border-brand-rose/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Business Profile Marketing Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            AI Daily Google Post Generator &amp; Scheduler
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Generates 7 targeted daily marketing posts weekly for your Google Business Profile (Vadodara Live Bakery). Review, approve, and auto-schedule for the whole week in 1 click.
          </p>

          <div className="mt-3 flex items-center gap-3 flex-wrap text-xs text-gray-600">
            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GBP Linked: <strong className="text-gray-900">order.cakeconnection@gmail.com</strong></span>
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              Rating: <strong className="text-gray-900">4.6 ★ (690+ Reviews)</strong>
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleGenerateFresh}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate (AI)</span>
          </button>

          <button
            type="button"
            onClick={handleConfirmAll}
            disabled={isConfirmingAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-rose hover:bg-brand-rose/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-rose/20 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isConfirmingAll ? 'Scheduling...' : 'Confirm & Schedule Week'}</span>
          </button>
        </div>
      </div>

      {/* Week Day Tabs (Monday - Sunday) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {posts.map((post, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={post.id}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-rose-50 border-brand-rose ring-2 ring-brand-rose/20 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-brand-rose' : 'text-gray-500'}`}>
                  {post.day}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Scheduled" />
              </div>
              <p className="font-bold text-gray-900 text-sm mt-1 truncate">{post.cakeName}</p>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>{post.scheduledTime}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail: Split Layout (Editor on Left, Google Maps Preview on Right) */}
      {activePost && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Editor & Content Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-150 pb-4 flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-brand-rose uppercase tracking-wider">
                  {activePost.day} • {activePost.date}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">{activePost.theme}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Scheduled for Auto-Post</span>
              </span>
            </div>

            {/* Cake details */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
              <img
                src={activePost.cakeImage}
                alt={activePost.cakeName}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{activePost.cakeName}</p>
                <p className="text-xs text-gray-500 mt-0.5">Price: ₹{activePost.price} (Eggless)</p>
                <p className="text-[11px] text-brand-rose font-semibold truncate">Target: {activePost.cakeSlug}</p>
              </div>
            </div>

            {/* Editable Caption */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Marketing Post Caption (AI Generated &amp; Editable)
              </label>
              <textarea
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                rows={9}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm leading-relaxed focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 outline-none transition-all resize-y font-sans shadow-xs"
              />
            </div>

            {/* Time & CTA Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Auto-Schedule Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:border-brand-rose outline-none"
                    placeholder="e.g. 10:30 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Call to Action Button
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 font-semibold">
                  <ShoppingBag className="w-4 h-4 text-brand-rose" />
                  <span>{activePost.ctaButton === 'ORDER_ONLINE' ? 'Order Online (Website Link)' : 'Call Now (+91 72038 24012)'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-150 flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleCopyPost(activePost)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer"
              >
                {copiedId === activePost.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === activePost.id ? 'Copied to Clipboard!' : 'Copy Text for GBP'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveActivePost}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Save Post Changes</span>
              </button>
            </div>
          </div>

          {/* Right: Google Business Profile Post Mockup (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-rose" />
                <span>Live Google Post Preview</span>
              </span>
              <a
                href="https://g.page/r/CfA2zsVxH2jOEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-brand-rose hover:underline flex items-center gap-1"
              >
                <span>View Live GBP</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Google Search/Maps Post Widget Mockup */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
              {/* Google Business Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">Cake Connection</h4>
                  <p className="text-[11px] text-gray-500">Scheduled for {activePost.day}, {editTime}</p>
                </div>
              </div>

              {/* Photo */}
              <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                <img
                  src={activePost.cakeImage}
                  alt={activePost.cakeName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  ₹{activePost.price} • Live Cake
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-4">
                <p className="text-gray-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                  {editCaption}
                </p>

                <p className="text-brand-rose text-xs font-semibold">
                  {activePost.hashtags}
                </p>

                {/* Google CTA Button */}
                <div className="pt-2">
                  <a
                    href={activePost.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold uppercase tracking-wider text-center block shadow-sm transition-all"
                  >
                    {activePost.ctaButton === 'ORDER_ONLINE' ? 'Order Online' : 'Call Now'}
                  </a>
                </div>
              </div>
            </div>

            {/* Help Callout */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>How Auto-Schedule Works:</span>
              </div>
              <p className="leading-relaxed">
                Click <strong>&quot;Confirm &amp; Schedule Week&quot;</strong> on Sunday evening. The daily post triggers automatically at your scheduled time. You can also click <strong>&quot;Copy Text for GBP&quot;</strong> to paste directly into your Google Maps manager in seconds.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
