'use client';
// ============================================
// Add-on Items Modal ("Make it Extra Special")
// Inspired by IGP & Winni e-commerce flow
// Dynamic Supabase + Admin Panel sync
// 6 Curated Categories: Flower Bouquets, Chocolates, Candles,
// Acrylic Toppers, TeddyBear, Greeting Cards (5 products each)
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, ShoppingBag, Sparkles, Gift } from 'lucide-react';
import { cn, formatPrice } from '@/utils';
import { DEFAULT_ADDON_ITEMS, ADDON_CATEGORIES, AddonProduct } from '@/data/addons';

export type { AddonProduct };

interface AddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedAddons: AddonProduct[]) => void;
  cakeName: string;
  cakePrice: number;
}

export function AddonModal({
  isOpen,
  onClose,
  onConfirm,
  cakeName,
  cakePrice,
}: AddonModalProps) {
  const [catalog, setCatalog] = useState<AddonProduct[]>(DEFAULT_ADDON_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set());

  // Dynamically sync with Admin Panel / Supabase
  useEffect(() => {
    async function loadLiveCatalog() {
      try {
        const res = await fetch('/api/admin/addons');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCatalog(json.data);
        }
      } catch (err) {
        // Silently fallback to DEFAULT_ADDON_ITEMS
      }
    }
    if (isOpen) {
      loadLiveCatalog();
    }
  }, [isOpen]);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Only show in-stock products to shoppers
  const inStockCatalog = useMemo(() => {
    return catalog.filter((item) => item.inStock !== false);
  }, [catalog]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return inStockCatalog;
    return inStockCatalog.filter((item) => item.category === selectedCategory);
  }, [inStockCatalog, selectedCategory]);

  const selectedProducts = useMemo(() => {
    return inStockCatalog.filter((item) => selectedAddonIds.has(item.id));
  }, [inStockCatalog, selectedAddonIds]);

  const addonSubtotal = useMemo(() => {
    return selectedProducts.reduce((sum, item) => sum + item.price, 0);
  }, [selectedProducts]);

  const totalAmount = cakePrice + addonSubtotal;

  const handleProceed = () => {
    onConfirm(selectedProducts);
  };

  const handleSkip = () => {
    onConfirm([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-150 flex flex-col max-h-[92vh] z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-150 bg-gradient-to-r from-rose-50/70 via-white to-pink-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-brand-rose/10 flex items-center justify-center text-brand-rose">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-gray-900">
                  Make it Extra Special 🎁
                </h3>
                <p className="text-xs text-gray-500">
                  Pair your {cakeName} with celebratory flowers, chocolates & gifts
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="px-5 py-2.5 border-b border-gray-100 bg-gray-50/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                selectedCategory === 'all'
                  ? 'bg-brand-rose text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-rose/50 hover:bg-rose-50/30'
              )}
            >
              ✨ All Items ({inStockCatalog.length})
            </button>

            {ADDON_CATEGORIES.map((cat) => {
              const count = inStockCatalog.filter((i) => i.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer',
                    isSelected
                      ? 'bg-brand-rose text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-rose/50 hover:bg-rose-50/30'
                  )}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className={cn('text-[10px] px-1.5 py-0.2 rounded-full', isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600')}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Add-ons Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedAddonIds.has(item.id);
                const discount =
                  item.compareAtPrice && item.compareAtPrice > item.price
                    ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
                    : 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAddon(item.id)}
                    className={cn(
                      'group relative flex flex-col justify-between rounded-2xl border-2 p-3 transition-all duration-200 cursor-pointer select-none bg-white',
                      isSelected
                        ? 'border-brand-rose bg-rose-50/20 shadow-md ring-2 ring-brand-rose/20'
                        : 'border-gray-200 hover:border-brand-rose/50 hover:shadow-sm'
                    )}
                  >
                    {/* Item Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2.5 border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', '/images/hero-flowers.png');
                        }}
                      />
                      {discount > 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                          {discount}% OFF
                        </span>
                      )}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-brand-rose text-white flex items-center justify-center shadow-md">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs sm:text-sm font-bold text-brand-rose">
                          {formatPrice(item.price)}
                        </span>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatPrice(item.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAddon(item.id);
                        }}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1',
                          isSelected
                            ? 'bg-brand-rose text-white shadow-xs'
                            : 'bg-rose-50 text-brand-rose hover:bg-brand-rose hover:text-white'
                        )}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-3 w-3 stroke-[3]" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 stroke-[3]" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="px-5 py-3.5 border-t border-gray-200 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shadow-lg">
            <div>
              <p className="text-[11px] text-gray-500">
                {selectedAddonIds.size > 0 ? (
                  <span className="font-semibold text-brand-rose">
                    +{selectedAddonIds.size} celebration add-on{selectedAddonIds.size > 1 ? 's' : ''} selected
                  </span>
                ) : (
                  'No add-ons selected'
                )}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-gray-400">Total:</span>
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Skip & Proceed
              </button>

              <button
                type="button"
                onClick={handleProceed}
                className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-brand-rose text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-rose/30 hover:bg-brand-rose-dark transition-all cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Continue to Cart →</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
