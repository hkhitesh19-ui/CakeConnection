"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ExternalLink,
  Edit2,
  Save,
  Check,
  RotateCcw,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  X,
  PackageCheck,
  PackageX,
  IndianRupee,
  Layers,
  ChevronDown,
  Plus,
  Upload,
  Camera
} from 'lucide-react';

interface ProductVariant {
  id?: string;
  weight: string;
  price: number;
  compare_at_price?: number | null;
  sku?: string;
  stock?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  flavour?: string;
  images?: Array<string | { url: string; alt?: string }>;
  is_available?: boolean;
  isAvailable?: boolean;
  product_variations?: ProductVariant[];
  product_variants?: ProductVariant[];
  variants?: ProductVariant[];
  rating?: number;
  price?: number;
}

interface EditState {
  name: string;
  isAvailable: boolean;
  price250g: string | number;
  price500g: string | number;
  price1kg: string | number;
  price1_5kg: string | number;
  price2kg: string | number;
  hasCustom250g?: boolean;
  photoUrl?: string;
}

const FLAVOUR_CATEGORIES = [
  { id: 'all', label: 'All Cakes' },
  { id: '250g', label: 'Mini 250g Cakes', query: '250g' },
  { id: 'chocolate', label: 'Chocolate & Truffle', query: 'choco' },
  { id: 'black-forest', label: 'Black Forest', query: 'forest' },
  { id: 'fruit', label: 'Fresh Fruit & Exotic', query: 'fruit' },
  { id: 'rasmalai', label: 'Rasmalai & Fusion', query: 'rasmalai' },
  { id: 'red-velvet', label: 'Red Velvet', query: 'velvet' },
  { id: 'anniversary', label: 'Anniversary & Heart', query: 'love' },
  { id: 'cartoon', label: 'Theme & Cartoon', query: 'theme' },
];

export default function CakesQuickPricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Edit tracking: { [productId]: EditState }
  const [edits, setEdits] = useState<Record<string, EditState>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [justSavedIds, setJustSavedIds] = useState<Set<string>>(new Set());
  const [isSavingAll, setIsSavingAll] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlavour, setSelectedFlavour] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest'>('name_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Toast Notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to extract variant price (with fallback to MRP if price is 0)
  const getWeightPrice = (p: Product, weightTarget: string): string | number => {
    const variations = p.product_variations || p.product_variants || p.variants || [];
    const targetNorm = weightTarget.toLowerCase().trim();
    const found = variations.find((v) => {
      const w = (v.weight || '').toLowerCase().trim();
      if (targetNorm === '1.5kg') {
        return w === '1.5kg' || w.includes('1.5') || w.includes('1.75') || w.includes('1.750');
      }
      return w === targetNorm || w.includes(targetNorm);
    });
    if (!found) return '';
    const pr = Number(found.price);
    if (!isNaN(pr) && pr > 0) return found.price;
    // Fallback to compare_at_price (MRP) if discounted price is 0 or empty
    const cmp = Number((found as any).compare_at_price || (found as any).compareAtPrice);
    if (!isNaN(cmp) && cmp > 0) return cmp;
    return '';
  };

  // Helper to calculate the true starting / minimum price of any cake (from edits or variants)
  const getStartingPrice = (p: Product): number => {
    const edit = edits[p.id];
    const prices: number[] = [];

    if (edit) {
      if (edit.price250g !== '' && !isNaN(Number(edit.price250g)) && Number(edit.price250g) > 0) {
        prices.push(Number(edit.price250g));
      }
      if (edit.price500g !== '' && !isNaN(Number(edit.price500g)) && Number(edit.price500g) > 0) {
        prices.push(Number(edit.price500g));
      }
      if (edit.price1kg !== '' && !isNaN(Number(edit.price1kg)) && Number(edit.price1kg) > 0) {
        prices.push(Number(edit.price1kg));
      }
      if (edit.price1_5kg !== '' && !isNaN(Number(edit.price1_5kg)) && Number(edit.price1_5kg) > 0) {
        prices.push(Number(edit.price1_5kg));
      }
      if (edit.price2kg !== '' && !isNaN(Number(edit.price2kg)) && Number(edit.price2kg) > 0) {
        prices.push(Number(edit.price2kg));
      }
    }

    // Check all database variants
    const variations = p.product_variations || p.product_variants || p.variants || [];
    variations.forEach((v) => {
      const pr = Number(v.price);
      if (!isNaN(pr) && pr > 0) {
        prices.push(pr);
      } else {
        const cmp = Number((v as any).compare_at_price || (v as any).compareAtPrice);
        if (!isNaN(cmp) && cmp > 0) {
          prices.push(cmp);
        }
      }
    });

    // Check base product price if present
    if (p.price && !isNaN(Number(p.price)) && Number(p.price) > 0) {
      prices.push(Number(p.price));
    }

    return prices.length > 0 ? Math.min(...prices) : 999999;
  };

  // Helper to extract image URL
  const getProductImage = (p: Product): string => {
    if (edits[p.id]?.photoUrl) return edits[p.id].photoUrl!;
    if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
      return '/images/placeholder-cake.jpg';
    }
    const first = p.images[0];
    if (typeof first === 'string') return first;
    return first?.url || '/images/placeholder-cake.jpg';
  };

  // Fetch all cakes from API
  const fetchCakes = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && data.data) {
        // Filter strictly for cakes
        const allItems: Product[] = data.data;
        const cakesOnly = allItems.filter(
          (p) => !p.category || p.category.toLowerCase() === 'cakes' || p.category.toLowerCase().includes('cake')
        );
        setProducts(cakesOnly);
      } else {
        showToast('Failed to load cake catalog', 'error');
      }
    } catch (err: any) {
      console.error('Error fetching cakes:', err);
      showToast('Network error loading cakes', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  // Initialize or get current edit state of a product
  const getEditState = (p: Product): EditState => {
    if (edits[p.id]) return edits[p.id];
    const initial250 = getWeightPrice(p, '250g');
    const origPhoto = !p.images || !Array.isArray(p.images) || p.images.length === 0 ? '' : (typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url || '');
    return {
      name: p.name || '',
      isAvailable: p.is_available ?? p.isAvailable ?? true,
      price250g: initial250,
      price500g: getWeightPrice(p, '500g'),
      price1kg: getWeightPrice(p, '1kg'),
      price1_5kg: getWeightPrice(p, '1.5kg'),
      price2kg: getWeightPrice(p, '2kg'),
      hasCustom250g: initial250 !== '',
      photoUrl: origPhoto,
    };
  };

  // Handler for modifying a single field
  const handleEditChange = (p: Product, field: keyof EditState, value: any) => {
    const current = getEditState(p);
    const updated = { ...current, [field]: value };
    setEdits((prev) => ({
      ...prev,
      [p.id]: updated,
    }));
  };

  // Quick Image Upload for individual cake card
  const [uploadingCakeId, setUploadingCakeId] = useState<string | null>(null);

  const handleQuickImageUpload = async (product: Product, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    handleEditChange(product, 'photoUrl', localUrl);

    setUploadingCakeId(product.id);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'cakes');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        handleEditChange(product, 'photoUrl', data.url);
        showToast(`✓ Photo uploaded for "${product.name}"! Click Save to apply.`);
      } else {
        showToast(data.message || 'Failed to upload image', 'error');
      }
    } catch (err: any) {
      showToast('Error uploading image', 'error');
    } finally {
      setUploadingCakeId(null);
    }
  };

  // Check if a specific product has modifications
  const isProductModified = (p: Product): boolean => {
    if (!edits[p.id]) return false;
    const current = edits[p.id];
    const orig250 = getWeightPrice(p, '250g');
    const orig500 = getWeightPrice(p, '500g');
    const orig1kg = getWeightPrice(p, '1kg');
    const orig1_5kg = getWeightPrice(p, '1.5kg');
    const orig2kg = getWeightPrice(p, '2kg');
    const origAvail = p.is_available ?? p.isAvailable ?? true;
    const origPhoto = !p.images || !Array.isArray(p.images) || p.images.length === 0 ? '' : (typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url || '');

    return (
      current.name !== p.name ||
      current.isAvailable !== origAvail ||
      (!!current.photoUrl && current.photoUrl !== origPhoto) ||
      String(current.price250g) !== String(orig250) ||
      String(current.price500g) !== String(orig500) ||
      String(current.price1kg) !== String(orig1kg) ||
      String(current.price1_5kg) !== String(orig1_5kg) ||
      String(current.price2kg) !== String(orig2kg)
    );
  };

  // Reset edits for a single product
  const handleResetProduct = (productId: string) => {
    setEdits((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  // Save a single product
  const handleSaveProduct = async (p: Product) => {
    const edit = edits[p.id];
    if (!edit && !isProductModified(p)) return;

    const payload = edit || getEditState(p);
    setSavingId(p.id);

    try {
      const row = {
        productId: p.id,
        name: payload.name.trim() || p.name,
        isAvailable: payload.isAvailable,
        photoUrl: payload.photoUrl,
        price250g: payload.price250g !== '' ? payload.price250g : undefined,
        price500g: payload.price500g !== '' ? payload.price500g : undefined,
        price1kg: payload.price1kg !== '' ? payload.price1kg : undefined,
        price1_5kg: payload.price1_5kg !== '' ? payload.price1_5kg : undefined,
        price2kg: payload.price2kg !== '' ? payload.price2kg : undefined,
      };

      const res = await fetch('/api/admin/products/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: [row] }),
      });

      const data = await res.json();
      if (data.success) {
        // Mark as saved
        setJustSavedIds((prev) => new Set(prev).add(p.id));
        setTimeout(() => {
          setJustSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(p.id);
            return next;
          });
        }, 3500);

        // Update local product data to reflect new saved values
        setProducts((prev) =>
          prev.map((item) => {
            if (item.id !== p.id) return item;
            return {
              ...item,
              name: row.name,
              is_available: row.isAvailable,
              isAvailable: row.isAvailable,
              images: row.photoUrl ? [{ url: row.photoUrl, alt: row.name }] : item.images,
              product_variations: (item.product_variations || []).map((v) => {
                const w = (v.weight || '').toLowerCase();
                let price = v.price;
                if (w.includes('250g') && row.price250g !== undefined) price = Number(row.price250g);
                if (w.includes('500g') && row.price500g !== undefined) price = Number(row.price500g);
                if (w === '1kg' && row.price1kg !== undefined) price = Number(row.price1kg);
                if (w.includes('1.5kg') && row.price1_5kg !== undefined) price = Number(row.price1_5kg);
                if (w.includes('2kg') && row.price2kg !== undefined) price = Number(row.price2kg);
                return { ...v, price };
              }),
            };
          })
        );

        // Clear edit state for this product
        handleResetProduct(p.id);
        showToast(`✓ "${row.name}" updated successfully!`);
      } else {
        showToast(data.message || 'Failed to update cake', 'error');
      }
    } catch (err: any) {
      console.error('Error saving cake:', err);
      showToast('Error saving changes', 'error');
    } finally {
      setSavingId(null);
    }
  };

  // Save all modified products in batch
  const handleSaveAll = async () => {
    const modifiedProducts = products.filter((p) => isProductModified(p));
    if (modifiedProducts.length === 0) return;

    setIsSavingAll(true);
    try {
      const updates = modifiedProducts.map((p) => {
        const edit = getEditState(p);
        return {
          productId: p.id,
          name: edit.name.trim() || p.name,
          isAvailable: edit.isAvailable,
          photoUrl: edit.photoUrl,
          price250g: edit.price250g !== '' ? edit.price250g : undefined,
          price500g: edit.price500g !== '' ? edit.price500g : undefined,
          price1kg: edit.price1kg !== '' ? edit.price1kg : undefined,
          price1_5kg: edit.price1_5kg !== '' ? edit.price1_5kg : undefined,
          price2kg: edit.price2kg !== '' ? edit.price2kg : undefined,
        };
      });

      const res = await fetch('/api/admin/products/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✓ Successfully updated all ${data.updatedCount} cakes!`);
        setEdits({});
        await fetchCakes();
      } else {
        showToast(data.message || 'Failed to save all changes', 'error');
      }
    } catch (err: any) {
      showToast('Network error while saving all cakes', 'error');
    } finally {
      setIsSavingAll(false);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const edit = edits[p.id];
        const currentName = edit?.name || p.name || '';
        return (
          currentName.toLowerCase().includes(q) ||
          (p.slug || '').toLowerCase().includes(q) ||
          (p.flavour || '').toLowerCase().includes(q) ||
          (p.subcategory || '').toLowerCase().includes(q)
        );
      });
    }

    // Category / Flavour bubble filter
    if (selectedFlavour !== 'all') {
      const cat = FLAVOUR_CATEGORIES.find((c) => c.id === selectedFlavour);
      if (cat && cat.query) {
        const q = cat.query.toLowerCase();
        if (cat.id === '250g') {
          list = list.filter((p) => {
            const has250Var = (p.product_variations || p.product_variants || p.variants || []).some((v) =>
              (v.weight || '').toLowerCase().includes('250g')
            );
            return has250Var || (p.name || '').toLowerCase().includes('250g');
          });
        } else {
          list = list.filter(
            (p) =>
              (p.name || '').toLowerCase().includes(q) ||
              (p.flavour || '').toLowerCase().includes(q) ||
              (p.subcategory || '').toLowerCase().includes(q)
          );
        }
      }
    }

    // Stock filter (cakes with no price are treated as out of stock)
    if (stockFilter === 'in_stock') {
      list = list.filter((p) => {
        const avail = edits[p.id]?.isAvailable ?? (p.is_available ?? p.isAvailable ?? true);
        const hasPrice = getStartingPrice(p) < 999999;
        return avail && hasPrice;
      });
    } else if (stockFilter === 'out_of_stock') {
      list = list.filter((p) => {
        const avail = edits[p.id]?.isAvailable ?? (p.is_available ?? p.isAvailable ?? true);
        const hasPrice = getStartingPrice(p) < 999999;
        return !avail || !hasPrice;
      });
    }

    // Sorting
    list.sort((a, b) => {
      const nameA = (edits[a.id]?.name || a.name || '').toLowerCase();
      const nameB = (edits[b.id]?.name || b.name || '').toLowerCase();

      const priceA = getStartingPrice(a);
      const priceB = getStartingPrice(b);

      switch (sortBy) {
        case 'name_asc':
          return nameA.localeCompare(nameB);
        case 'name_desc':
          return nameB.localeCompare(nameA);
        case 'price_asc': {
          const valA = priceA === 999999 ? Infinity : priceA;
          const valB = priceB === 999999 ? Infinity : priceB;
          return valA - valB;
        }
        case 'price_desc': {
          const valA = priceA === 999999 ? -1 : priceA;
          const valB = priceB === 999999 ? -1 : priceB;
          return valB - valA;
        }
        case 'newest':
        default:
          return 0;
      }
    });

    return list;
  }, [products, searchQuery, selectedFlavour, stockFilter, sortBy, edits]);

  const totalModifiedCount = useMemo(() => {
    return products.filter((p) => isProductModified(p)).length;
  }, [products, edits]);

  const inStockCount = useMemo(() => {
    return products.filter((p) => {
      const avail = edits[p.id]?.isAvailable ?? (p.is_available ?? p.isAvailable ?? true);
      const hasPrice = getStartingPrice(p) < 999999;
      return avail && hasPrice;
    }).length;
  }, [products, edits]);

  return (
    <div className="min-h-full space-y-6 pb-20">
      {/* ── Toast Notification ─────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-500/90 text-white border-emerald-400'
                : 'bg-rose-600/90 text-white border-rose-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-75 transition-opacity cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Header Bar ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-rose">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Instant Catalog Manager</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mt-1">
              Cakes Quick Edit & Pricing
            </h1>
            <p className="text-gray-500 text-sm mt-1 max-w-2xl">
              Giftlaya-style visual editor. Edit cake names and all 4 weight prices (500g, 1kg, 1.5kg, 2kg, 250g) in the same place with instant single-click save.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => fetchCakes(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh cakes from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/cakes"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-rose bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
              title="Open customer-facing catalog in new tab"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View /cakes</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            {totalModifiedCount > 0 && (
              <button
                onClick={() => setEdits({})}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-white hover:bg-gray-100 border border-gray-300 transition-all cursor-pointer"
                title="Discard all unsaved edits"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Discard Changes</span>
              </button>
            )}

            <button
              onClick={handleSaveAll}
              disabled={totalModifiedCount === 0 || isSavingAll}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                totalModifiedCount > 0
                  ? 'bg-brand-rose text-white hover:bg-brand-rose/90 shadow-brand-rose/25 animate-pulse'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              }`}
            >
              {isSavingAll ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save All Changes ({totalModifiedCount})</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100/70 text-brand-rose">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{products.length}</div>
              <div className="text-xs text-gray-500 font-medium">Total Live Cakes</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-700">{inStockCount}</div>
              <div className="text-xs text-gray-500 font-medium">In Stock & Active</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/70 text-amber-600">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-amber-700">4 Weights</div>
              <div className="text-xs text-gray-500 font-medium">500g, 1kg, 1.5kg, 2kg</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              totalModifiedCount > 0 ? 'bg-rose-500 text-white animate-bounce' : 'bg-gray-200 text-gray-500'
            }`}>
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-xl font-bold ${totalModifiedCount > 0 ? 'text-brand-rose' : 'text-gray-900'}`}>
                {totalModifiedCount}
              </div>
              <div className="text-xs text-gray-500 font-medium">Unsaved Modifications</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Controls Bar ───────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cake by name, flavour, SKU, or tag..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Stock Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Stock Filter */}
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  stockFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStockFilter('in_stock')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  stockFilter === 'in_stock' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => setStockFilter('out_of_stock')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  stockFilter === 'out_of_stock' ? 'bg-white text-rose-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Out of Stock
              </button>
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="appearance-none pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 cursor-pointer"
              >
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Switcher */}
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                title="Visual Card Grid (Giftlaya Style)"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-brand-rose shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="Compact Table List"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-brand-rose shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Flavour & Category Quick-Filter Bubbles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {FLAVOUR_CATEGORIES.map((cat) => {
            const isActive = selectedFlavour === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFlavour(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-brand-rose text-white border-brand-rose shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content: Cards Grid or Table ───────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-200 shadow-xs">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-brand-rose rounded-full animate-spin mb-4" />
          <p className="text-gray-700 font-semibold text-sm">Loading 101 cakes & pricing data...</p>
          <p className="text-gray-400 text-xs mt-1">Connecting to Supabase database</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 shadow-xs text-center px-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-brand-rose mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No cakes found</h3>
          <p className="text-gray-500 text-sm max-w-md mt-1">
            No cakes matched your search "{searchQuery}" or filter. Try adjusting your query or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFlavour('all');
              setStockFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-brand-rose text-white rounded-xl text-xs font-bold hover:bg-brand-rose/90 transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ══════════════════════════════════════════════════════
           VISUAL CARDS GRID (GIFTLAYA CATALOG STYLE)
           ══════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const edit = getEditState(product);
            const isModified = isProductModified(product);
            const isSaving = savingId === product.id;
            const isJustSaved = justSavedIds.has(product.id);
            const imgUrl = getProductImage(product);

            return (
              <div
                key={product.id}
                className={`group relative bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col shadow-xs hover:shadow-md ${
                  isModified
                    ? 'border-brand-rose ring-2 ring-brand-rose/20 shadow-md'
                    : isJustSaved
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-gray-200/90 hover:border-gray-300'
                }`}
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={edit.name || product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />

                  {/* Stock Status Badge & Starting Price Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    {(() => {
                      const hasPrice = getStartingPrice(product) < 999999;
                      const isReallyInStock = edit.isAvailable && hasPrice;
                      return (
                        <>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs bg-white/95">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isReallyInStock ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span className={isReallyInStock ? 'text-emerald-700' : 'text-rose-700'}>
                              {isReallyInStock ? 'In Stock' : hasPrice ? 'Out of Stock' : 'Out of Stock (No Price)'}
                            </span>
                          </div>

                          {hasPrice && (
                            <div className="px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs bg-gray-900/85 text-white">
                              From ₹{getStartingPrice(product)}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Top-Right Quick Links */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <label
                      title="Upload / Change Photo for this cake"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-brand-rose shadow-md transition-all cursor-pointer"
                    >
                      {uploadingCakeId === product.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-rose" />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingCakeId === product.id}
                        className="hidden"
                        onChange={(e) => handleQuickImageUpload(product, e)}
                      />
                    </label>
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      title="Preview on live website"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-brand-rose shadow-md transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      title="Open full product edit form (description, images, SEO)"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-brand-rose shadow-md transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Unsaved indicator banner */}
                  {isModified && (
                    <div className="absolute bottom-0 inset-x-0 bg-brand-rose/95 text-white text-[10px] font-bold text-center py-1 tracking-wider uppercase backdrop-blur-xs">
                      Unsaved Changes
                    </div>
                  )}

                  {/* Just saved banner */}
                  {isJustSaved && (
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[10px] font-bold text-center py-1 tracking-wider uppercase flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" /> Saved to Supabase
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {/* Name Edit Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                      <span>Cake Name</span>
                      {edit.name !== product.name && (
                        <span className="text-[10px] text-amber-600 lowercase font-medium">edited</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={edit.name}
                        onChange={(e) => handleEditChange(product, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose transition-all"
                        placeholder="Cake Title"
                      />
                    </div>
                    {edit.name !== product.name && (
                      <p className="text-[11px] text-gray-400 truncate italic">
                        Original: {product.name}
                      </p>
                    )}
                  </div>

                  {/* ── 4 Weights Pricing Matrix ─────────────── */}
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Weight Prices (₹)
                      </span>
                      {/* Toggle 250g if not yet active */}
                      {!edit.hasCustom250g && (
                        <button
                          type="button"
                          onClick={() => handleEditChange(product, 'hasCustom250g', true)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-rose hover:underline cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ 250g Mini</span>
                        </button>
                      )}
                    </div>

                    {/* Weight Pricing Inputs */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* 250g Box (if active) */}
                      {edit.hasCustom250g && (
                        <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-200 col-span-2 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-purple-900 whitespace-nowrap">
                            Mini 250g:
                          </span>
                          <div className="relative flex-1 max-w-[120px]">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-700">₹</span>
                            <input
                              type="number"
                              value={edit.price250g}
                              onChange={(e) => handleEditChange(product, 'price250g', e.target.value)}
                              placeholder="Price"
                              className="w-full pl-6 pr-2 py-1 bg-white border border-purple-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 text-right"
                            />
                          </div>
                        </div>
                      )}

                      {/* 500g */}
                      <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                          500g (0.5kg)
                        </span>
                        <div className="relative mt-1">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">₹</span>
                          <input
                            type="number"
                            value={edit.price500g}
                            onChange={(e) => handleEditChange(product, 'price500g', e.target.value)}
                            placeholder="500g"
                            className="w-full pl-5 pr-1.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 text-right"
                          />
                        </div>
                      </div>

                      {/* 1kg */}
                      <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                          1 kg
                        </span>
                        <div className="relative mt-1">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">₹</span>
                          <input
                            type="number"
                            value={edit.price1kg}
                            onChange={(e) => handleEditChange(product, 'price1kg', e.target.value)}
                            placeholder="1kg"
                            className="w-full pl-5 pr-1.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 text-right"
                          />
                        </div>
                      </div>

                      {/* 1.5kg */}
                      <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                          1.5 kg
                        </span>
                        <div className="relative mt-1">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">₹</span>
                          <input
                            type="number"
                            value={edit.price1_5kg}
                            onChange={(e) => handleEditChange(product, 'price1_5kg', e.target.value)}
                            placeholder="1.5kg"
                            className="w-full pl-5 pr-1.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 text-right"
                          />
                        </div>
                      </div>

                      {/* 2kg */}
                      <div className="p-2 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                          2 kg
                        </span>
                        <div className="relative mt-1">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">₹</span>
                          <input
                            type="number"
                            value={edit.price2kg}
                            onChange={(e) => handleEditChange(product, 'price2kg', e.target.value)}
                            placeholder="2kg"
                            className="w-full pl-5 pr-1.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 text-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock Toggle & Quick Save Button */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    {/* Stock Switch */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={edit.isAvailable}
                        onChange={(e) => handleEditChange(product, 'isAvailable', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500 relative" />
                      <span className="text-[11px] font-semibold text-gray-600">
                        {edit.isAvailable && getStartingPrice(product) < 999999 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </label>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      {isModified && (
                        <button
                          type="button"
                          onClick={() => handleResetProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Reset changes for this cake"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSaveProduct(product)}
                        disabled={isSaving}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          isJustSaved
                            ? 'bg-emerald-600 text-white'
                            : isModified
                            ? 'bg-brand-rose text-white hover:bg-brand-rose/90 shadow-brand-rose/20 ring-2 ring-brand-rose/30'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isJustSaved ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>{isModified ? 'Save' : 'Save'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════
           COMPACT TABLE VIEW
           ══════════════════════════════════════════════════════ */
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Photo</th>
                  <th className="py-3 px-4">Cake Title</th>
                  <th className="py-3 px-3 w-28 text-right">250g (₹)</th>
                  <th className="py-3 px-3 w-28 text-right">500g (₹)</th>
                  <th className="py-3 px-3 w-28 text-right">1 kg (₹)</th>
                  <th className="py-3 px-3 w-28 text-right">1.5 kg (₹)</th>
                  <th className="py-3 px-3 w-28 text-right">2 kg (₹)</th>
                  <th className="py-3 px-4 w-28 text-center">Stock</th>
                  <th className="py-3 px-4 w-32 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredProducts.map((product) => {
                  const edit = getEditState(product);
                  const isModified = isProductModified(product);
                  const isSaving = savingId === product.id;
                  const isJustSaved = justSavedIds.has(product.id);
                  const imgUrl = getProductImage(product);

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        isModified ? 'bg-rose-50/30' : isJustSaved ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Photo Thumbnail */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 mx-auto border border-gray-200">
                          <Image
                            src={imgUrl}
                            alt={edit.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>

                      {/* Title input */}
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={edit.name}
                          onChange={(e) => handleEditChange(product, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
                        />
                      </td>

                      {/* 250g */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={edit.price250g}
                          onChange={(e) => handleEditChange(product, 'price250g', e.target.value)}
                          placeholder="—"
                          className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
                        />
                      </td>

                      {/* 500g */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={edit.price500g}
                          onChange={(e) => handleEditChange(product, 'price500g', e.target.value)}
                          className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
                        />
                      </td>

                      {/* 1kg */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={edit.price1kg}
                          onChange={(e) => handleEditChange(product, 'price1kg', e.target.value)}
                          className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
                        />
                      </td>

                      {/* 1.5kg */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={edit.price1_5kg}
                          onChange={(e) => handleEditChange(product, 'price1_5kg', e.target.value)}
                          className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
                        />
                      </td>

                      {/* 2kg */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          value={edit.price2kg}
                          onChange={(e) => handleEditChange(product, 'price2kg', e.target.value)}
                          className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
                        />
                      </td>

                      {/* Stock Toggle */}
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleEditChange(product, 'isAvailable', !edit.isAvailable)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            edit.isAvailable && getStartingPrice(product) < 999999
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          }`}
                        >
                          {edit.isAvailable && getStartingPrice(product) < 999999 ? 'In Stock' : 'Out'}
                        </button>
                      </td>

                      {/* Save button */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSaveProduct(product)}
                            disabled={isSaving}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              isJustSaved
                                ? 'bg-emerald-600 text-white'
                                : isModified
                                ? 'bg-brand-rose text-white hover:bg-brand-rose/90'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {isSaving ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : isJustSaved ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            <span>{isJustSaved ? 'Saved' : 'Save'}</span>
                          </button>

                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-brand-rose rounded-lg hover:bg-gray-100"
                            title="Preview on live site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Sticky Bottom Bar when edits exist ────────────── */}
      <AnimatePresence>
        {totalModifiedCount > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-40 bg-gray-900/95 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 border border-gray-800"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-brand-rose animate-ping" />
              <div>
                <div className="text-sm font-bold">
                  {totalModifiedCount} {totalModifiedCount === 1 ? 'Cake has' : 'Cakes have'} unsaved changes
                </div>
                <div className="text-xs text-gray-400">
                  Save now to update live prices on website & database
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEdits({})}
                className="px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSavingAll}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-rose text-white rounded-xl text-xs font-bold hover:bg-brand-rose/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSavingAll ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save All ({totalModifiedCount})</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
