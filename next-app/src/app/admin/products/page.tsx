"use client";

import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  Table,
  Save,
  Loader2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect, useMemo, useRef } from 'react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ── View Mode: 'table' vs 'excel' ──────────────────────────
  const [viewMode, setViewMode] = useState<'table' | 'excel'>('table');

  // ── Excel In-Grid Edits State ──────────────────────────────
  // key: productId -> { name, price500g, price1kg, price1_5kg, price2kg, isAvailable }
  const [excelEdits, setExcelEdits] = useState<Record<string, any>>({});
  const [isSavingExcel, setIsSavingExcel] = useState(false);
  const [isSyncingFile, setIsSyncingFile] = useState(false);
  const [syncToast, setSyncToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Search state ──────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');

  // ── Category / Sub-category filter states ─────────────────
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  // ── Sort states (tri-state: null → 'asc' → 'desc' → null) ──
  type SortField =
    | 'index'
    | 'photo'
    | 'name'
    | 'category'
    | 'price500g'
    | 'price1kg'
    | 'price1_5kg'
    | 'price2kg'
    | 'stock'
    | 'id'
    | 'price';

  const [sortBy, setSortBy] = useState<SortField | null>(null);
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
  const handleSortToggle = (column: SortField) => {
    if (sortBy !== column) {
      setSortBy(column);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortBy(null);
      setSortOrder(null);
    }
  };

  const SortIcon = ({ column }: { column: SortField }) => {
    if (sortBy !== column) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    if (sortOrder === 'asc') return <ChevronUp className="w-3.5 h-3.5 text-brand-rose" />;
    return <ChevronDown className="w-3.5 h-3.5 text-brand-rose" />;
  };

  // ── Excel Header Sort Button Component ────────────────────
  const ExcelSortHeader = ({
    column,
    label,
    className = '',
    align = 'left',
  }: {
    column: SortField;
    label: string;
    className?: string;
    align?: 'left' | 'center' | 'right';
  }) => {
    const isActive = sortBy === column;
    return (
      <th className={`${className} select-none transition-colors p-0`}>
        <button
          type="button"
          onClick={() => handleSortToggle(column)}
          title={`Sort by ${label} (${
            isActive
              ? sortOrder === 'asc'
                ? 'Ascending → Click for Descending'
                : 'Descending → Click to Reset'
              : 'Click to Sort Ascending'
          })`}
          className={`w-full h-full flex items-center gap-1.5 px-3 py-2.5 hover:bg-emerald-100/80 transition-colors cursor-pointer group ${
            align === 'center'
              ? 'justify-center'
              : align === 'right'
              ? 'justify-end'
              : 'justify-start'
          } ${
            isActive
              ? 'text-emerald-950 font-black bg-emerald-100/60'
              : 'text-emerald-950/80 hover:text-emerald-950'
          }`}
        >
          <span className="truncate">{label}</span>
          <span
            className={`transition-all duration-150 flex-shrink-0 ${
              isActive
                ? 'text-emerald-800 scale-110'
                : 'text-emerald-400/80 group-hover:text-emerald-700'
            }`}
          >
            {!isActive ? (
              <ChevronsUpDown className="w-3 h-3 opacity-40 group-hover:opacity-80" />
            ) : sortOrder === 'asc' ? (
              <ChevronUp className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
            )}
          </span>
        </button>
      </th>
    );
  };

  // ── Helper to extract variant price ───────────────────────
  const getVarPrice = (p: any, weight: string) => {
    const vars = p.product_variations || p.product_variants || p.variants || [];
    const target = weight.toLowerCase().trim();
    const v = vars.find((item: any) => (item.weight || '').toLowerCase().trim().includes(target));
    return v?.price !== undefined ? v.price : '';
  };

  // ── Computed: filtered + sorted products ──────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

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

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedSubcategory) {
      const target = selectedSubcategory.toLowerCase();
      result = result.filter((p) => {
        if (!p.subcategory) return false;
        const pSubs = p.subcategory.split(',').map((s: string) => s.trim().toLowerCase());
        return pSubs.includes(target);
      });
    }

    if (sortBy && sortOrder) {
      result.sort((a, b) => {
        let cmp = 0;

        if (sortBy === 'index') {
          const idxA = products.findIndex((p) => p.id === a.id);
          const idxB = products.findIndex((p) => p.id === b.id);
          cmp = idxA - idxB;
        } else if (sortBy === 'photo') {
          const hasPhotoA = (Array.isArray(a.images) && a.images.length > 0 && !!(typeof a.images[0] === 'string' ? a.images[0] : a.images[0]?.url)) ? 1 : 0;
          const hasPhotoB = (Array.isArray(b.images) && b.images.length > 0 && !!(typeof b.images[0] === 'string' ? b.images[0] : b.images[0]?.url)) ? 1 : 0;
          cmp = hasPhotoB - hasPhotoA;
        } else if (sortBy === 'name') {
          const nameA = (excelEdits[a.id]?.name !== undefined ? excelEdits[a.id].name : (a.name || '')).trim().toLowerCase();
          const nameB = (excelEdits[b.id]?.name !== undefined ? excelEdits[b.id].name : (b.name || '')).trim().toLowerCase();
          cmp = nameA.localeCompare(nameB);
        } else if (sortBy === 'category') {
          const catA = (a.category || '').trim().toLowerCase();
          const catB = (b.category || '').trim().toLowerCase();
          cmp = catA.localeCompare(catB);
        } else if (sortBy === 'price500g') {
          const rawA = excelEdits[a.id]?.price500g !== undefined ? excelEdits[a.id].price500g : getVarPrice(a, '500g');
          const rawB = excelEdits[b.id]?.price500g !== undefined ? excelEdits[b.id].price500g : getVarPrice(b, '500g');
          const numA = rawA !== '' && rawA !== null && rawA !== undefined ? Number(rawA) : NaN;
          const numB = rawB !== '' && rawB !== null && rawB !== undefined ? Number(rawB) : NaN;
          if (isNaN(numA) && isNaN(numB)) cmp = 0;
          else if (isNaN(numA)) cmp = 1;
          else if (isNaN(numB)) cmp = -1;
          else cmp = numA - numB;
        } else if (sortBy === 'price1kg') {
          const rawA = excelEdits[a.id]?.price1kg !== undefined ? excelEdits[a.id].price1kg : getVarPrice(a, '1kg');
          const rawB = excelEdits[b.id]?.price1kg !== undefined ? excelEdits[b.id].price1kg : getVarPrice(b, '1kg');
          const numA = rawA !== '' && rawA !== null && rawA !== undefined ? Number(rawA) : NaN;
          const numB = rawB !== '' && rawB !== null && rawB !== undefined ? Number(rawB) : NaN;
          if (isNaN(numA) && isNaN(numB)) cmp = 0;
          else if (isNaN(numA)) cmp = 1;
          else if (isNaN(numB)) cmp = -1;
          else cmp = numA - numB;
        } else if (sortBy === 'price1_5kg') {
          const rawA = excelEdits[a.id]?.price1_5kg !== undefined ? excelEdits[a.id].price1_5kg : getVarPrice(a, '1.5kg');
          const rawB = excelEdits[b.id]?.price1_5kg !== undefined ? excelEdits[b.id].price1_5kg : getVarPrice(b, '1.5kg');
          const numA = rawA !== '' && rawA !== null && rawA !== undefined ? Number(rawA) : NaN;
          const numB = rawB !== '' && rawB !== null && rawB !== undefined ? Number(rawB) : NaN;
          if (isNaN(numA) && isNaN(numB)) cmp = 0;
          else if (isNaN(numA)) cmp = 1;
          else if (isNaN(numB)) cmp = -1;
          else cmp = numA - numB;
        } else if (sortBy === 'price2kg') {
          const rawA = excelEdits[a.id]?.price2kg !== undefined ? excelEdits[a.id].price2kg : getVarPrice(a, '2kg');
          const rawB = excelEdits[b.id]?.price2kg !== undefined ? excelEdits[b.id].price2kg : getVarPrice(b, '2kg');
          const numA = rawA !== '' && rawA !== null && rawA !== undefined ? Number(rawA) : NaN;
          const numB = rawB !== '' && rawB !== null && rawB !== undefined ? Number(rawB) : NaN;
          if (isNaN(numA) && isNaN(numB)) cmp = 0;
          else if (isNaN(numA)) cmp = 1;
          else if (isNaN(numB)) cmp = -1;
          else cmp = numA - numB;
        } else if (sortBy === 'stock') {
          const availA = (excelEdits[a.id]?.isAvailable !== undefined ? excelEdits[a.id].isAvailable : (a.is_available ?? a.isAvailable ?? true)) ? 1 : 0;
          const availB = (excelEdits[b.id]?.isAvailable !== undefined ? excelEdits[b.id].isAvailable : (b.is_available ?? b.isAvailable ?? true)) ? 1 : 0;
          cmp = availB - availA;
        } else if (sortBy === 'id') {
          const idA = (a.id || '').toLowerCase();
          const idB = (b.id || '').toLowerCase();
          cmp = idA.localeCompare(idB);
        } else if (sortBy === 'price') {
          cmp = (Number(a.price) || 0) - (Number(b.price) || 0);
        }

        return sortOrder === 'desc' ? -cmp : cmp;
      });
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSubcategory, sortBy, sortOrder, excelEdits]);

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

  useEffect(() => {
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

  // ── Excel Export Handler ──────────────────────────────────
  const handleExportExcel = () => {
    window.open('/api/admin/products/excel?format=xlsx', '_blank');
  };

  // ── Excel File Upload / Import Handler ────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSyncingFile(true);
    setSyncToast(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/products/excel', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setSyncToast({
          type: 'success',
          message: data.message || `Successfully synced ${data.updatedCount} products from Excel!`,
        });
        await fetchProducts();
      } else {
        setSyncToast({
          type: 'error',
          message: data.message || 'Failed to sync from Excel file.',
        });
      }
    } catch (err: any) {
      setSyncToast({ type: 'error', message: err.message || 'Error processing Excel file' });
    } finally {
      setIsSyncingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setSyncToast(null), 6000);
    }
  };

  // ── Live Grid Inline Cell Edit Handler ────────────────────
  const handleCellEdit = (productId: string, field: string, value: any) => {
    setExcelEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        productId,
        [field]: value,
      },
    }));
  };

  // ── Save All In-Browser Live Excel Edits ───────────────────
  const handleSaveAllExcelEdits = async () => {
    const editRows = Object.values(excelEdits);
    if (editRows.length === 0) return;

    setIsSavingExcel(true);
    try {
      const res = await fetch('/api/admin/products/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: editRows }),
      });
      const data = await res.json();

      if (data.success) {
        setSyncToast({
          type: 'success',
          message: `Live Excel: ${data.updatedCount} products updated in database & edit forms!`,
        });
        setExcelEdits({});
        await fetchProducts();
      } else {
        setSyncToast({ type: 'error', message: data.message || 'Failed to save changes.' });
      }
    } catch (err: any) {
      setSyncToast({ type: 'error', message: err.message || 'Network error saving Excel edits.' });
    } finally {
      setIsSavingExcel(false);
      setTimeout(() => setSyncToast(null), 6000);
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

  const hasUnsavedEdits = Object.keys(excelEdits).length > 0;

  return (
    <div className="space-y-4">
      {/* ── Top Header & Actions Bar ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-display font-bold text-gray-900">Products</h2>
            {/* View Mode Toggle */}
            <div className="inline-flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Standard Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('excel')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'excel'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-500 hover:text-emerald-700'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Live Excel Sheet</span>
                {hasUnsavedEdits && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            </div>

            <Link
              href="/admin/cakes"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-brand-rose hover:bg-rose-100 transition-all border border-rose-200/80 shadow-2xs"
              title="Open Giftlaya-style Visual Cards & Pricing Quick Editor"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Cakes Quick Edit</span>
            </Link>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">
            Manage catalogue, real-time prices, photos, and variants. Live synced across Excel and Edit Forms.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Export Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-700 rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            title="Download all products with variants as an Excel file (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel (.xlsx)</span>
          </button>

          {/* Sync / Upload from Excel */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-700 rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer">
            {isSyncingFile ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{isSyncingFile ? 'Syncing...' : 'Sync from Excel'}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isSyncingFile}
            />
          </label>

          {/* Add Product Button */}
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* ── Toast Notification Banner ── */}
      {syncToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium ${
            syncToast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{syncToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncToast(null)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* ── Live Excel Grid Quick Notification & Save Bar ── */}
      {viewMode === 'excel' && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-emerald-950">
                📊 Live Excel Grid Active — Real-time 2-Way Sync
              </p>
              <p className="text-[11px] text-emerald-700">
                Edit prices or product names directly in the cells below. Changes save straight to the database and automatically reflect in the Edit Product forms.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {hasUnsavedEdits && (
              <button
                type="button"
                onClick={() => setExcelEdits({})}
                className="text-xs text-gray-500 hover:text-red-600 underline cursor-pointer px-2"
              >
                Discard edits
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveAllExcelEdits}
              disabled={!hasUnsavedEdits || isSavingExcel}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                hasUnsavedEdits
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/30'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSavingExcel ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>
                {isSavingExcel
                  ? 'Saving to DB...'
                  : hasUnsavedEdits
                  ? `Save All Live Changes (${Object.keys(excelEdits).length})`
                  : 'All Live Changes Saved'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ── Filters & Search ── */}
      <div className="bg-white shadow-2xs border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, category, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 bg-white border border-gray-200 rounded-lg pl-9 pr-3 text-xs text-gray-900 focus:outline-none focus:border-brand-rose transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto items-center flex-wrap">
          {/* Main Category Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('');
              }}
              className="appearance-none w-full h-8 bg-white border border-gray-200 rounded-lg pl-8 pr-7 text-xs text-gray-700 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none focus:border-brand-rose"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Category Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="appearance-none w-full h-8 bg-white border border-gray-200 rounded-lg pl-3 pr-7 text-xs text-gray-700 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none focus:border-brand-rose"
            >
              <option value="">All Sub-categories</option>
              {uniqueSubcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters button */}
          {(selectedCategory || selectedSubcategory || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedSubcategory('');
                setSearchQuery('');
                setSortBy(null);
                setSortOrder(null);
              }}
              className="h-8 px-2 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Clear all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════ */}
      {/* ── MODE 1: LIVE EXCEL SPREADSHEET VIEW ────────────────── */}
      {/* ═════════════════════════════════════════════════════════ */}
      {viewMode === 'excel' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xs border border-emerald-300/80 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[980px] text-xs font-mono table-fixed">
              <thead>
                <tr className="bg-emerald-50 border-b border-emerald-200 text-emerald-950 text-[11px] font-bold uppercase tracking-wider">
                  <ExcelSortHeader column="index" label="#" align="center" className="w-10 border-r border-emerald-200/70" />
                  <ExcelSortHeader column="photo" label="Photo" align="center" className="w-14 border-r border-emerald-200/70" />
                  <ExcelSortHeader column="name" label="Product Name (Live Edit)" align="left" className="w-60 border-r border-emerald-200/70" />
                  <ExcelSortHeader column="category" label="Category" align="center" className="w-24 border-r border-emerald-200/70" />
                  <ExcelSortHeader column="price500g" label="500g (₹)" align="right" className="w-24 border-r border-emerald-200/70" />
                  <ExcelSortHeader column="price1kg" label="1kg (₹)" align="right" className="w-24 border-r border-emerald-200/70" />
                  <ExcelSortHeader column="price1_5kg" label="1.5kg (₹)" align="right" className="w-24 border-r border-emerald-200/70" />
                  <ExcelSortHeader column="price2kg" label="2kg (₹)" align="right" className="w-24 border-r border-emerald-200/70" />
                  <ExcelSortHeader column="stock" label="In Stock" align="center" className="w-20 border-r border-emerald-200/70" />
                  <ExcelSortHeader column="id" label="Edit Form" align="center" className="w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500 font-sans">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                      Loading live spreadsheet...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-gray-500 font-sans">
                      No matching products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, idx) => {
                    const rowEdit = excelEdits[p.id] || {};
                    const isRowModified = !!excelEdits[p.id];

                    const currentName = rowEdit.name !== undefined ? rowEdit.name : p.name;
                    const price500 = rowEdit.price500g !== undefined ? rowEdit.price500g : getVarPrice(p, '500g');
                    const price1k = rowEdit.price1kg !== undefined ? rowEdit.price1kg : getVarPrice(p, '1kg');
                    const price1_5k = rowEdit.price1_5kg !== undefined ? rowEdit.price1_5kg : getVarPrice(p, '1.5kg');
                    const price2k = rowEdit.price2kg !== undefined ? rowEdit.price2kg : getVarPrice(p, '2kg');
                    const isAvailable = rowEdit.isAvailable !== undefined ? rowEdit.isAvailable : (p.is_available ?? p.isAvailable ?? true);

                    const imgUrl = Array.isArray(p.images) && p.images.length > 0
                      ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url || '')
                      : '';

                    return (
                      <tr
                        key={p.id}
                        className={`transition-colors ${
                          isRowModified
                            ? 'bg-amber-50/60 hover:bg-amber-50'
                            : idx % 2 === 0
                            ? 'bg-white hover:bg-gray-50/80'
                            : 'bg-gray-50/40 hover:bg-gray-50'
                        }`}
                      >
                        {/* Index */}
                        <td className="px-2 py-1.5 text-center text-gray-400 font-mono text-[11px] border-r border-gray-100">
                          {idx + 1}
                        </td>

                        {/* Photo Thumbnail */}
                        <td className="px-2 py-1.5 text-center border-r border-gray-100">
                          <div className="w-9 h-9 rounded-lg border border-gray-200 overflow-hidden mx-auto bg-gray-100 flex items-center justify-center">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </td>

                        {/* Product Name (Inline editable) */}
                        <td className="px-2 py-1.5 border-r border-gray-100 font-sans truncate">
                          <input
                            type="text"
                            value={currentName}
                            title={currentName}
                            onChange={(e) => handleCellEdit(p.id, 'name', e.target.value)}
                            className="w-full h-7 px-2 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-gray-200 focus:border-emerald-500 rounded text-xs text-gray-900 font-medium outline-none transition-all truncate focus:truncate-none"
                          />
                        </td>

                        {/* Category */}
                        <td className="px-2 py-1.5 border-r border-gray-100 font-sans text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                            {p.category}
                          </span>
                        </td>

                        {/* 500g Price (Inline editable) */}
                        <td className="px-2 py-1.5 border-r border-gray-100 text-right">
                          <input
                            type="number"
                            value={price500}
                            onChange={(e) => handleCellEdit(p.id, 'price500g', e.target.value)}
                            placeholder="—"
                            className="w-full h-7 px-2 text-right bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-gray-200 focus:border-emerald-500 rounded text-xs text-gray-900 font-semibold outline-none transition-all"
                          />
                        </td>

                        {/* 1kg Price (Inline editable) */}
                        <td className="px-2 py-1.5 border-r border-gray-100 text-right">
                          <input
                            type="number"
                            value={price1k}
                            onChange={(e) => handleCellEdit(p.id, 'price1kg', e.target.value)}
                            placeholder="—"
                            className="w-full h-7 px-2 text-right bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-gray-200 focus:border-emerald-500 rounded text-xs text-gray-900 font-semibold outline-none transition-all"
                          />
                        </td>

                        {/* 1.5kg Price (Inline editable) */}
                        <td className="px-2 py-1.5 border-r border-gray-100 text-right">
                          <input
                            type="number"
                            value={price1_5k}
                            onChange={(e) => handleCellEdit(p.id, 'price1_5kg', e.target.value)}
                            placeholder="—"
                            className="w-full h-7 px-2 text-right bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-gray-200 focus:border-emerald-500 rounded text-xs text-gray-900 font-semibold outline-none transition-all"
                          />
                        </td>

                        {/* 2kg Price (Inline editable) */}
                        <td className="px-2 py-1.5 border-r border-gray-100 text-right">
                          <input
                            type="number"
                            value={price2k}
                            onChange={(e) => handleCellEdit(p.id, 'price2kg', e.target.value)}
                            placeholder="—"
                            className="w-full h-7 px-2 text-right bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-gray-200 focus:border-emerald-500 rounded text-xs text-gray-900 font-semibold outline-none transition-all"
                          />
                        </td>

                        {/* Stock toggle */}
                        <td className="px-2 py-1.5 text-center border-r border-gray-100 font-sans">
                          <button
                            type="button"
                            onClick={() => handleCellEdit(p.id, 'isAvailable', !isAvailable)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              isAvailable
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {isAvailable ? 'YES' : 'NO'}
                          </button>
                        </td>

                        {/* Edit Form Link */}
                        <td className="px-2 py-1.5 text-center font-sans">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-rose hover:underline"
                            title="Open in full Edit Product Form"
                          >
                            <span>Edit Form</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        /* ═════════════════════════════════════════════════════════ */
        /* ── MODE 2: STANDARD TABLE VIEW ────────────────────────── */
        /* ═════════════════════════════════════════════════════════ */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xs border border-gray-200 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold w-16">Image</th>
                  <th className="px-6 py-3 font-semibold">
                    <button
                      onClick={() => handleSortToggle('name')}
                      className="flex items-center gap-1.5 hover:text-gray-900 transition-colors group cursor-pointer"
                    >
                      <span>Product Name</span>
                      <SortIcon column="name" />
                    </button>
                  </th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">
                    <button
                      onClick={() => handleSortToggle('price')}
                      className="flex items-center gap-1.5 hover:text-gray-900 transition-colors group cursor-pointer"
                    >
                      <span>Price</span>
                      <SortIcon column="price" />
                    </button>
                  </th>
                  <th className="px-6 py-3 font-semibold">Stock</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
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
                      <td className="px-6 py-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200 overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={
                                typeof product.images[0] === 'string'
                                  ? product.images[0]
                                  : product.images[0]?.url
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                                e.currentTarget.className = 'w-5 h-5 object-contain opacity-50';
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{product.name}</span>
                          <span className="text-[11px] text-gray-400 font-mono">{product.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="capitalize font-semibold text-gray-800 text-xs">
                            {product.category}
                          </span>
                          {product.subcategory ? (
                            <div className="flex flex-wrap gap-1 max-w-[240px]">
                              {product.subcategory
                                .split(',')
                                .slice(0, 2)
                                .map((sub: string, i: number) => (
                                  <span
                                    key={i}
                                    className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-rose-50 text-brand-rose border border-brand-rose/20 truncate max-w-[140px]"
                                  >
                                    {sub.trim()}
                                  </span>
                                ))}
                              {product.subcategory.split(',').length > 2 && (
                                <span
                                  className="text-[10px] font-semibold text-gray-400 self-center"
                                  title={product.subcategory}
                                >
                                  +{product.subcategory.split(',').length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No subcategories</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-semibold text-gray-900 text-sm">
                        ₹{product.price}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`text-xs ${
                            !(product.in_stock ?? product.is_available)
                              ? 'text-red-500 font-medium'
                              : 'text-gray-600'
                          }`}
                        >
                          {product.product_variations?.length > 0
                            ? `${product.product_variations.length} variants`
                            : (product.in_stock ?? product.is_available)
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(
                            (product.in_stock ?? product.is_available) ? 'Active' : 'Out of Stock'
                          )}`}
                        >
                          {(product.in_stock ?? product.is_available) ? 'Active' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-3 flex justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-brand-rose hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
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
      )}
    </div>
  );
}
