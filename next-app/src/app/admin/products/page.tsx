"use client";

import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Tag, Image as ImageIcon, ChevronUp, ChevronDown, ChevronsUpDown, X } from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Search state ──────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');

  // ── Category / Sub-category filter states ─────────────────
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  // ── Sort states (tri-state: null → 'asc' → 'desc' → null) ──
  const [sortBy, setSortBy] = useState<'name' | 'price' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  // ── Derived: unique categories & subcategories from product data ──
  const uniqueCategories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return cats.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const uniqueSubcategories = useMemo(() => {
    const filtered = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;
    const allSubs = new Set<string>();
    filtered.forEach((p) => {
      if (p.subcategory) {
        p.subcategory.split(',').forEach((s: string) => {
          const trimmed = s.trim();
          if (trimmed) allSubs.add(trimmed);
        });
      }
    });
    return Array.from(allSubs).sort((a, b) => a.localeCompare(b));
  }, [products, selectedCategory]);

  // ── Tri-state sort toggle handler ─────────────────────────
  const handleSortToggle = (column: 'name' | 'price') => {
    if (sortBy !== column) {
      // First click on a new column → ascending
      setSortBy(column);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      // Reset
      setSortBy(null);
      setSortOrder(null);
    }
  };

  // ── Sort icon helper ──────────────────────────────────────
  const SortIcon = ({ column }: { column: 'name' | 'price' }) => {
    if (sortBy !== column) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    if (sortOrder === 'asc') return <ChevronUp className="w-3.5 h-3.5 text-brand-rose" />;
    return <ChevronDown className="w-3.5 h-3.5 text-brand-rose" />;
  };

  // ── Computed: filtered + sorted products ──────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sub-category filter (supports multiple categories per product)
    if (selectedSubcategory) {
      const target = selectedSubcategory.toLowerCase();
      result = result.filter((p) => {
        if (!p.subcategory) return false;
        const pSubs = p.subcategory.split(',').map((s: string) => s.trim().toLowerCase());
        return pSubs.includes(target);
      });
    }

    // Sorting
    if (sortBy && sortOrder) {
      result.sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'name') {
          cmp = (a.name || '').localeCompare(b.name || '');
        } else if (sortBy === 'price') {
          cmp = (Number(a.price) || 0) - (Number(b.price) || 0);
        }
        return sortOrder === 'desc' ? -cmp : cmp;
      });
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSubcategory, sortBy, sortOrder]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/admin/products');
        const resData = await response.json();
        if (resData.success && resData.data) {
          setProducts(resData.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Out of Stock': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Draft': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Products</h2>
          <p className="text-gray-500">Manage your inventory, prices, and product details.</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-rose/20">
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:border-brand-rose transition-colors"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto items-center flex-wrap">
          {/* Main Category Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('');
              }}
              className="appearance-none w-full bg-white border border-gray-200 rounded-lg pl-9 pr-8 py-2.5 text-gray-600 hover:text-gray-900 hover:border-text-muted transition-colors cursor-pointer focus:outline-none focus:border-brand-rose text-sm"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Sub-Category Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-200 rounded-lg pl-4 pr-8 py-2.5 text-gray-600 hover:text-gray-900 hover:border-text-muted transition-colors cursor-pointer focus:outline-none focus:border-brand-rose text-sm"
            >
              <option value="">All Sub-categories</option>
              {uniqueSubcategories.map((sub) => (
                <option key={sub} value={sub}>{sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Clear filters button — only visible when any filter is active */}
          {(selectedCategory || selectedSubcategory || searchQuery) && (
            <button
              onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); setSearchQuery(''); setSortBy(null); setSortOrder(null); }}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold w-16">Image</th>
                <th className="px-6 py-4 font-semibold">
                  <button
                    onClick={() => handleSortToggle('name')}
                    className="flex items-center gap-1.5 hover:text-gray-900 transition-colors group"
                  >
                    <span>Product Name</span>
                    <SortIcon column="name" />
                  </button>
                </th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">
                  <button
                    onClick={() => handleSortToggle('price')}
                    className="flex items-center gap-1.5 hover:text-gray-900 transition-colors group"
                  >
                    <span>Price</span>
                    <SortIcon column="price" />
                  </button>
                </th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-rose" />
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {products.length === 0
                      ? 'No products found. Add your first product to get started.'
                      : 'No products match your filters. Try adjusting your search or category selection.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'; e.currentTarget.className = "w-5 h-5 object-contain opacity-50"; }} 
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-gray-500">{product.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="capitalize font-semibold text-gray-800 text-xs">{product.category}</span>
                      {product.subcategory ? (
                        <div className="flex flex-wrap gap-1 max-w-[240px]">
                          {product.subcategory.split(',').slice(0, 2).map((sub: string, i: number) => (
                            <span key={i} className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-rose-50 text-brand-rose border border-brand-rose/20 truncate max-w-[140px]">
                              {sub.trim()}
                            </span>
                          ))}
                          {product.subcategory.split(',').length > 2 && (
                            <span className="text-[10px] font-semibold text-gray-400 self-center" title={product.subcategory}>
                              +{product.subcategory.split(',').length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No subcategories</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${!(product.in_stock ?? product.is_available) ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                      {product.product_variations?.length > 0 
                        ? `${product.product_variations.length} variants`
                        : (product.in_stock ?? product.is_available) ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor((product.in_stock ?? product.is_available) ? 'Active' : 'Out of Stock')}`}>
                      {(product.in_stock ?? product.is_available) ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
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
    </div>
  );
}
