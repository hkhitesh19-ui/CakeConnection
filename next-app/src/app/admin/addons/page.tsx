'use client';
// ============================================
// Admin Add-on Items Management Page
// Full CRUD for Celebration Add-on Items:
// Flower Bouquets, Chocolates, Candles, Acrylic Toppers, TeddyBear, Greeting Card
// ============================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Package,
  Gift,
  Tag,
  DollarSign,
  Layers,
} from 'lucide-react';
import { ADDON_CATEGORIES, DEFAULT_ADDON_ITEMS, AddonProduct } from '@/data/addons';
import { cn, formatPrice } from '@/utils';

export default function AdminAddonsPage() {
  const [items, setItems] = useState<AddonProduct[]>(DEFAULT_ADDON_ITEMS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AddonProduct | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<AddonProduct>>({
    name: '',
    category: 'flowers',
    price: 99,
    compareAtPrice: 149,
    image: '',
    description: '',
    inStock: true,
  });

  // Fetch Items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/addons');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data);
      } else {
        setItems(DEFAULT_ADDON_ITEMS);
      }
    } catch (err) {
      console.error('Failed to load addons:', err);
      setItems(DEFAULT_ADDON_ITEMS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: (selectedCategory !== 'all' ? selectedCategory : 'flowers') as any,
      price: 99,
      compareAtPrice: 149,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400&h=400',
      description: '',
      inStock: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: AddonProduct) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    try {
      setIsSaving(true);
      if (editingItem) {
        // PUT update
        const res = await fetch('/api/admin/addons', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...formData }),
        });
        const json = await res.json();
        if (json.success) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? { ...it, ...formData } as AddonProduct : it))
          );
          showToast(`"${formData.name}" updated successfully!`);
          setIsModalOpen(false);
        } else {
          showToast(json.error || 'Failed to update', 'error');
        }
      } else {
        // POST create
        const res = await fetch('/api/admin/addons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          await fetchItems();
          showToast(`"${formData.name}" created successfully!`);
          setIsModalOpen(false);
        } else {
          showToast(json.error || 'Failed to create', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Error occurred', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Item
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/addons?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        showToast('Add-on item deleted successfully');
      } else {
        showToast(json.error || 'Failed to delete', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting item', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Toggle In Stock
  const handleToggleStock = async (item: AddonProduct) => {
    const updated = !item.inStock;
    try {
      const res = await fetch('/api/admin/addons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, inStock: updated }),
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, inStock: updated } : it))
        );
        showToast(`"${item.name}" is now ${updated ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch (err) {
      showToast('Failed to update stock status', 'error');
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (!confirm('Are you sure you want to reset all Add-on items to the default 30 products? Any custom additions will be replaced.')) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/admin/addons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const json = await res.json();
      if (json.success) {
        setItems(DEFAULT_ADDON_ITEMS);
        showToast('Reset to 30 default Add-on products complete!');
      }
    } catch (err) {
      showToast('Failed to reset', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const inStockCount = items.filter((i) => i.inStock !== false).length;
    const avgPrice = Math.round(items.reduce((acc, i) => acc + i.price, 0) / (items.length || 1));
    return {
      total: items.length,
      categories: ADDON_CATEGORIES.length,
      inStock: inStockCount,
      avgPrice,
    };
  }, [items]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-bottom-5',
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-red-50 border-red-300 text-red-800'
          )}
        >
          {statusMessage.type === 'success' ? <Check className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-brand-rose">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add-on Items Management</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1.5 ml-12">
            Configure celebration add-on products shown in the <span className="font-semibold text-gray-800">"Make it Extra Special"</span> popup modal across all cake pages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 ml-12 sm:ml-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-medium transition-all"
            title="Restore 30 factory defaults"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-rose hover:bg-rose-600 text-white text-sm font-semibold shadow-md shadow-rose-500/20 hover:shadow-rose-500/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Add-on</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-brand-rose" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          <span className="text-xs text-gray-500 mt-1 block">Active across catalog</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.categories}</p>
          <span className="text-xs text-purple-600 font-medium mt-1 block">Bouquets, Chocolates, Teddies...</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In Stock</span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-2">{stats.inStock}</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">Ready for instant delivery</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Price</span>
            <Tag className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{formatPrice(stats.avgPrice)}</p>
          <span className="text-xs text-gray-500 mt-1 block">Average order add-on value</span>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all',
              selectedCategory === 'all'
                ? 'bg-brand-rose text-white shadow-sm shadow-rose-500/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            ✨ All Categories ({items.length})
          </button>

          {ADDON_CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all',
                  isSelected
                    ? 'bg-brand-rose text-white shadow-sm shadow-rose-500/20'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className={cn('text-xs px-1.5 py-0.5 rounded-full', isSelected ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search add-on products by name, keyword or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 focus:border-brand-rose"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">
          <div className="w-8 h-8 border-4 border-brand-rose border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Loading Add-on catalog...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No Add-on Products Found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No products matching "${searchQuery}". Try clearing search.`
              : 'There are no products in this category yet.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 bg-brand-rose text-white text-sm font-semibold rounded-xl hover:bg-rose-600"
          >
            + Add First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const catMeta = ADDON_CATEGORIES.find((c) => c.id === item.category);
            const discount =
              item.compareAtPrice && item.compareAtPrice > item.price
                ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
                : 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Top Section */}
                <div className="p-4">
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-200">
                      <img
                        src={item.image || '/images/hero-flowers.png'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', '/images/hero-flowers.png');
                        }}
                      />
                      {discount > 0 && (
                        <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-brand-rose border border-rose-100">
                          <span>{catMeta?.emoji || '🎁'}</span>
                          <span>{catMeta?.label || item.category}</span>
                        </span>

                        <button
                          onClick={() => handleToggleStock(item)}
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ml-auto',
                            item.inStock !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          )}
                          title="Click to toggle stock status"
                        >
                          {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </div>

                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {item.description || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</span>
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">ID: {item.id}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    Order: {item.displayOrder || 99}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:text-brand-rose hover:border-brand-rose/40 rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-bold hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Add-on item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-rose/10 text-brand-rose flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {editingItem ? 'Edit Add-on Product' : 'Add New Add-on Product'}
                  </h3>
                  <p className="text-xs text-gray-500">Visible in the customer "Make it Extra Special" popup modal</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[calc(85vh-120px)] overflow-y-auto">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 focus:border-brand-rose"
                  required
                >
                  {ADDON_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ferrero Rocher Luxury Box (8 Pieces)"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 focus:border-brand-rose"
                  required
                />
              </div>

              {/* Price & Compare Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="249"
                    value={formData.price ?? ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 focus:border-brand-rose"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    MRP / Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="299"
                    value={formData.compareAtPrice ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compareAtPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 focus:border-brand-rose"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Product Image URL or Path *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://... or /images/..."
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 focus:border-brand-rose"
                    required
                  />
                  {formData.image && (
                    <div className="w-11 h-11 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', '/images/hero-flowers.png');
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Crispy whole hazelnut chocolates with crushed hazelnut chocolate shell..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 focus:border-brand-rose resize-none"
                />
              </div>

              {/* In Stock & Display Order */}
              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.inStock !== false}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 text-brand-rose rounded border-gray-300 focus:ring-brand-rose"
                  />
                  <span className="text-sm font-semibold text-gray-800">In Stock for Order</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Display Priority (Order)
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder ?? 99}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-brand-rose text-white text-sm font-semibold hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{editingItem ? 'Save Changes' : 'Create Add-on'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
