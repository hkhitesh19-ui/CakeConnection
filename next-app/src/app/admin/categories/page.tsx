"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FolderTree, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  GripVertical,
  FolderInput,
  ArrowUpDown
} from 'lucide-react';

interface Category {
  id: string;
  group_name: string;
  name: string;
  slug: string;
  display_order: number;
}

const DEFAULT_GROUPS = [
  'Delivery based Cakes',
  'Design Bases Cakes',
  'Festival or Special Occassion Based',
  'By Flavour',
  'By Occasion'
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Drag & Drop State
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Group Switcher Modal-free Popover State
  const [groupSwitchCatId, setGroupSwitchCatId] = useState<string | null>(null);

  // Form State (Inline, NO POPUP)
  const [editId, setEditId] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(DEFAULT_GROUPS[0]);
  const [customGroupName, setCustomGroupName] = useState('');
  const [isCustomGroup, setIsCustomGroup] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');

  // Inline Feedback
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract all unique groups dynamically from database + defaults
  const availableGroups = useMemo(() => {
    const set = new Set<string>(DEFAULT_GROUPS);
    categories.forEach(c => {
      if (c.group_name && c.group_name.trim()) {
        set.add(c.group_name.trim());
      }
    });
    return Array.from(set);
  }, [categories]);

  // Group categories for right-side display, sorted by display_order
  const groupedCategories = useMemo(() => {
    return categories.reduce((acc, cat) => {
      const g = cat.group_name || 'Other';
      if (!acc[g]) acc[g] = [];
      acc[g].push(cat);
      return acc;
    }, {} as Record<string, Category[]>);
  }, [categories]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editId) {
      setSlug(slugify(val));
    }
  };

  const handleGroupSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomGroup(true);
      setCustomGroupName('');
    } else {
      setIsCustomGroup(false);
      setSelectedGroup(val);
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDisplayOrder(cat.display_order ? cat.display_order.toString() : '1');

    if (availableGroups.includes(cat.group_name)) {
      setIsCustomGroup(false);
      setSelectedGroup(cat.group_name);
    } else {
      setIsCustomGroup(true);
      setCustomGroupName(cat.group_name || '');
    }

    setStatusMessage(null);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const cancelEdit = () => {
    setEditId('');
    setName('');
    setSlug('');
    setDisplayOrder('1');
    setIsCustomGroup(false);
    setSelectedGroup(availableGroups[0] || DEFAULT_GROUPS[0]);
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const finalGroup = isCustomGroup ? customGroupName.trim() : selectedGroup.trim();

    if (!finalGroup) {
      setStatusMessage({ type: 'error', text: 'Please select or enter a Category Group.' });
      return;
    }

    if (!name.trim()) {
      setStatusMessage({ type: 'error', text: 'Category Name is required.' });
      return;
    }

    if (!slug.trim()) {
      setStatusMessage({ type: 'error', text: 'URL Slug is required.' });
      return;
    }

    setSaving(true);
    try {
      const isEditing = Boolean(editId);
      const method = isEditing ? 'PUT' : 'POST';

      const payload: any = {
        group_name: finalGroup,
        name: name.trim(),
        slug: slug.trim(),
        display_order: parseInt(displayOrder, 10) || 1,
      };

      if (isEditing) {
        payload.id = editId;
      }

      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to save category');
      }

      setStatusMessage({
        type: 'success',
        text: isEditing ? `Category "${name}" updated successfully!` : `Category "${name}" added successfully!`,
      });

      if (!isEditing) {
        setName('');
        setSlug('');
        setDisplayOrder((prev) => (parseInt(prev, 10) + 1).toString());
      } else {
        cancelEdit();
      }

      await fetchCategories();

      setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Something went wrong while saving.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete category');
      }

      if (editId === id) {
        cancelEdit();
      }

      await fetchCategories();
      setStatusMessage({
        type: 'success',
        text: `Category "${catName}" deleted successfully!`,
      });

      setTimeout(() => {
        setStatusMessage(null);
      }, 3500);
    } catch (err: any) {
      alert(err.message || 'Error deleting category');
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================================
  // POSITION SHIFTING & REORDERING LOGIC
  // ========================================================

  /**
   * Save a reordered list of categories to Supabase
   */
  const saveReorderedCategories = async (updatedItems: { id: string; display_order: number; group_name?: string }[]) => {
    setIsReordering(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reorder categories');
      }
      setStatusMessage({
        type: 'success',
        text: 'Positions saved successfully!',
      });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error updating category positions',
      });
    } finally {
      setIsReordering(false);
    }
  };

  /**
   * Move category 1 step UP or DOWN within its group
   */
  const shiftStep = async (cat: Category, direction: 'up' | 'down') => {
    const groupItems = (groupedCategories[cat.group_name] || []).slice().sort((a, b) => a.display_order - b.display_order);
    const currentIndex = groupItems.findIndex(c => c.id === cat.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= groupItems.length) return;

    // Swap
    const newGroupList = [...groupItems];
    const [moved] = newGroupList.splice(currentIndex, 1);
    newGroupList.splice(targetIndex, 0, moved);

    // Re-index display_orders sequentially (1, 2, 3...)
    const reindexed = newGroupList.map((item, index) => ({
      ...item,
      display_order: index + 1
    }));

    // Optimistic local state update
    setCategories(prev => {
      const otherCategories = prev.filter(c => c.group_name !== cat.group_name);
      return [...otherCategories, ...reindexed];
    });

    // Save to database
    await saveReorderedCategories(reindexed.map(r => ({ id: r.id, display_order: r.display_order })));
  };

  /**
   * Jump directly to ANY position number (e.g. 1st, 5th, last)
   */
  const jumpToPosition = async (cat: Category, newPosition1Indexed: number) => {
    const groupItems = (groupedCategories[cat.group_name] || []).slice().sort((a, b) => a.display_order - b.display_order);
    const currentIndex = groupItems.findIndex(c => c.id === cat.id);
    if (currentIndex === -1) return;

    const targetIndex = Math.max(0, Math.min(groupItems.length - 1, newPosition1Indexed - 1));
    if (currentIndex === targetIndex) return;

    const newGroupList = [...groupItems];
    const [moved] = newGroupList.splice(currentIndex, 1);
    newGroupList.splice(targetIndex, 0, moved);

    const reindexed = newGroupList.map((item, index) => ({
      ...item,
      display_order: index + 1
    }));

    setCategories(prev => {
      const otherCategories = prev.filter(c => c.group_name !== cat.group_name);
      return [...otherCategories, ...reindexed];
    });

    await saveReorderedCategories(reindexed.map(r => ({ id: r.id, display_order: r.display_order })));
  };

  /**
   * Move category to a completely different Group
   */
  const changeCategoryGroup = async (cat: Category, targetGroup: string) => {
    if (cat.group_name === targetGroup) {
      setGroupSwitchCatId(null);
      return;
    }

    const targetGroupItems = (groupedCategories[targetGroup] || []);
    const newDisplayOrder = targetGroupItems.length + 1;

    setGroupSwitchCatId(null);

    // Optimistic UI update
    setCategories(prev => prev.map(c => {
      if (c.id === cat.id) {
        return { ...c, group_name: targetGroup, display_order: newDisplayOrder };
      }
      return c;
    }));

    // Save update to server
    try {
      setIsReordering(true);
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id, group_name: targetGroup, display_order: newDisplayOrder }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setStatusMessage({
        type: 'success',
        text: `Moved "${cat.name}" to group "${targetGroup}"!`,
      });
      setTimeout(() => setStatusMessage(null), 3000);
      await fetchCategories();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to move category group' });
      await fetchCategories();
    } finally {
      setIsReordering(false);
    }
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      setDragOverId(targetId);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetCat: Category) => {
    e.preventDefault();
    setDragOverId(null);

    if (!draggedId || draggedId === targetCat.id) {
      setDraggedId(null);
      return;
    }

    const draggedCat = categories.find(c => c.id === draggedId);
    setDraggedId(null);

    if (!draggedCat) return;

    // Reorder within the same group
    if (draggedCat.group_name === targetCat.group_name) {
      const groupItems = (groupedCategories[targetCat.group_name] || []).slice().sort((a, b) => a.display_order - b.display_order);
      const fromIndex = groupItems.findIndex(c => c.id === draggedCat.id);
      const toIndex = groupItems.findIndex(c => c.id === targetCat.id);

      if (fromIndex === -1 || toIndex === -1) return;

      const newGroupList = [...groupItems];
      const [moved] = newGroupList.splice(fromIndex, 1);
      newGroupList.splice(toIndex, 0, moved);

      const reindexed = newGroupList.map((item, index) => ({
        ...item,
        display_order: index + 1
      }));

      setCategories(prev => {
        const otherCategories = prev.filter(c => c.group_name !== targetCat.group_name);
        return [...otherCategories, ...reindexed];
      });

      await saveReorderedCategories(reindexed.map(r => ({ id: r.id, display_order: r.display_order })));
    } else {
      // Dragged into a different group
      await changeCategoryGroup(draggedCat, targetCat.group_name);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Categories Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-brand-rose border border-brand-rose/20">
              {categories.length} Total
            </span>
            {isReordering && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving Position...
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Reorder and shift any category anytime using <strong>Drag & Drop</strong>, <strong>▲/▼ arrows</strong>, or <strong>direct position jumper</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editId && (
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Switch to Add Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: ON-PAGE INLINE ADD / EDIT FORM (NO POPUP)   */}
        {/* ======================================================== */}
        <div ref={formRef} className="lg:col-span-4 lg:sticky lg:top-6">
          <div className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
            editId 
              ? 'border-brand-rose ring-2 ring-brand-rose/20 shadow-brand-rose/10' 
              : 'border-gray-200'
          }`}>
            
            {/* Card Header */}
            <div className={`p-4 sm:p-5 border-b ${
              editId 
                ? 'bg-rose-50/70 border-brand-rose/20' 
                : 'bg-gray-50/70 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${editId ? 'bg-brand-rose text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {editId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-base sm:text-lg">
                      {editId ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {editId ? 'Updating category details' : 'Fill details below to add instantly'}
                    </p>
                  </div>
                </div>

                {editId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white transition-colors"
                    title="Cancel Edit"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
              
              {/* Status Banner */}
              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`p-3 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
                      statusMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {statusMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span className="flex-1">{statusMessage.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Group Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category Group <span className="text-red-500">*</span>
                </label>
                
                {!isCustomGroup ? (
                  <select
                    value={selectedGroup}
                    onChange={handleGroupSelect}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 outline-none transition-all shadow-sm"
                  >
                    {availableGroups.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Brand New Group...</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customGroupName}
                      onChange={(e) => setCustomGroupName(e.target.value)}
                      placeholder="e.g. Luxury Cakes Collection"
                      required
                      autoFocus
                      className="w-full bg-white border border-brand-rose/60 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 outline-none transition-all shadow-sm"
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Typing new custom group</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomGroup(false);
                          setSelectedGroup(availableGroups[0] || DEFAULT_GROUPS[0]);
                        }}
                        className="text-brand-rose hover:underline font-medium cursor-pointer"
                      >
                        Choose from existing groups
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  required
                  placeholder="e.g. Pinata Breakable Cakes"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 outline-none transition-all shadow-sm"
                />
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  required
                  placeholder="e.g. pinata-breakable-cakes"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 font-mono placeholder:text-gray-400 focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 outline-none transition-all shadow-sm"
                />
                <p className="text-[11px] text-gray-400 mt-1 truncate">
                  Preview: /cakes/{slug || 'category-slug'}
                </p>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Initial Display Order Position
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  min="1"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 outline-none transition-all shadow-sm"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  You can also drag or shift positions anytime using the table controls on the right.
                </p>
              </div>

              {/* Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-rose/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{editId ? 'Updating...' : 'Adding Category...'}</span>
                    </>
                  ) : (
                    <>
                      {editId ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{editId ? 'Update Category' : 'Save & Add Category'}</span>
                    </>
                  )}
                </button>

                {editId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Quick Shifting Guide Card */}
          <div className="mt-4 p-4 rounded-2xl bg-rose-50/50 border border-brand-rose/15 text-xs text-gray-600 space-y-2">
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-rose" />
              <span>How to Shift Positions:</span>
            </h4>
            <ul className="space-y-1 pl-4 list-disc text-gray-600">
              <li><strong>Drag & Drop:</strong> Grab the <span className="font-mono bg-white px-1 border rounded">⠿</span> handle and drag rows up/down.</li>
              <li><strong>▲ / ▼ Arrows:</strong> Click arrows to swap position immediately.</li>
              <li><strong>Jump Selector:</strong> Click position number dropdown to jump directly to any position.</li>
              <li><strong>Move Group:</strong> Click the group icon to shift category to another section.</li>
            </ul>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: CATEGORIES LIST WITH INTERACTIVE SHIFTING  */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-brand-rose mb-3" />
              <p className="text-sm font-medium text-gray-500">Loading categories from database...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No categories found</h3>
              <p className="text-xs text-gray-500 mt-1">Use the form on the left to add your first category.</p>
            </div>
          ) : (
            Object.entries(groupedCategories).map(([group, cats]) => {
              const sortedCats = cats.slice().sort((a, b) => a.display_order - b.display_order);

              return (
                <div 
                  key={group}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Group Heading */}
                  <div className="px-5 py-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-rose-50 text-brand-rose">
                        <FolderTree className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                        {group}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-200/70 text-gray-700">
                        {sortedCats.length} {sortedCats.length === 1 ? 'category' : 'categories'}
                      </span>
                    </div>
                  </div>

                  {/* Categories Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/40 text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
                          <th className="px-3 py-3 w-10 text-center">Drag</th>
                          <th className="px-3 py-3 w-28 text-center">Position</th>
                          <th className="px-4 py-3">Category Name</th>
                          <th className="px-4 py-3">Slug</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {sortedCats.map((cat, index) => {
                          const isBeingEdited = editId === cat.id;
                          const isDragged = draggedId === cat.id;
                          const isDragOver = dragOverId === cat.id;
                          const isFirst = index === 0;
                          const isLast = index === sortedCats.length - 1;

                          return (
                            <tr 
                              key={cat.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, cat.id)}
                              onDragOver={(e) => handleDragOver(e, cat.id)}
                              onDrop={(e) => handleDrop(e, cat)}
                              className={`transition-all ${
                                isDragged ? 'opacity-40 bg-gray-100' : ''
                              } ${
                                isDragOver ? 'border-t-2 border-brand-rose bg-rose-50/40' : ''
                              } ${
                                isBeingEdited 
                                  ? 'bg-rose-50/50 ring-1 ring-inset ring-brand-rose/40 font-medium' 
                                  : 'hover:bg-gray-50/80'
                              }`}
                            >
                              {/* Drag Handle */}
                              <td className="px-3 py-3 text-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 transition-colors">
                                <div className="p-1 rounded hover:bg-gray-100 inline-flex items-center justify-center">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                              </td>

                              {/* Interactive Position Controls */}
                              <td className="px-3 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  {/* Direct Position Selector Dropdown */}
                                  <select
                                    value={index + 1}
                                    onChange={(e) => jumpToPosition(cat, parseInt(e.target.value, 10))}
                                    title="Jump directly to position"
                                    className="w-11 h-7 text-xs font-mono font-bold text-center bg-gray-100 hover:bg-rose-50 hover:text-brand-rose border border-gray-200 rounded-lg cursor-pointer transition-colors focus:ring-2 focus:ring-brand-rose/20 outline-none"
                                  >
                                    {sortedCats.map((_, posIdx) => (
                                      <option key={posIdx + 1} value={posIdx + 1}>
                                        #{posIdx + 1}
                                      </option>
                                    ))}
                                  </select>

                                  {/* Move Up Button */}
                                  <button
                                    type="button"
                                    onClick={() => shiftStep(cat, 'up')}
                                    disabled={isFirst || isReordering}
                                    title={isFirst ? 'Already at top' : 'Move Up 1 Position'}
                                    className="p-1 rounded-md text-gray-500 hover:text-brand-rose hover:bg-rose-50 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Move Down Button */}
                                  <button
                                    type="button"
                                    onClick={() => shiftStep(cat, 'down')}
                                    disabled={isLast || isReordering}
                                    title={isLast ? 'Already at bottom' : 'Move Down 1 Position'}
                                    className="p-1 rounded-md text-gray-500 hover:text-brand-rose hover:bg-rose-50 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Fast Jump to Top / Bottom */}
                                  <div className="hidden sm:flex items-center gap-0.5 pl-0.5 border-l border-gray-200">
                                    <button
                                      type="button"
                                      onClick={() => jumpToPosition(cat, 1)}
                                      disabled={isFirst || isReordering}
                                      title="Send to Very Top (#1)"
                                      className="p-1 rounded-md text-gray-400 hover:text-brand-rose hover:bg-rose-50 disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                    >
                                      <ChevronsUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => jumpToPosition(cat, sortedCats.length)}
                                      disabled={isLast || isReordering}
                                      title="Send to Very Bottom"
                                      className="p-1 rounded-md text-gray-400 hover:text-brand-rose hover:bg-rose-50 disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                    >
                                      <ChevronsDown className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Category Name */}
                              <td className="px-4 py-3.5">
                                <div className="font-semibold text-gray-900 flex items-center gap-2">
                                  <span>{cat.name}</span>
                                </div>
                              </td>

                              {/* Slug */}
                              <td className="px-4 py-3.5 font-mono text-xs text-gray-500">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                  {cat.slug}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1 relative">
                                  
                                  {/* Shift Group Popover Trigger */}
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setGroupSwitchCatId(groupSwitchCatId === cat.id ? null : cat.id)}
                                      title="Shift to Another Group"
                                      className="inline-flex items-center gap-1 p-1.5 text-gray-500 hover:text-brand-rose hover:bg-rose-50 rounded-lg text-xs transition-colors cursor-pointer"
                                    >
                                      <FolderInput className="w-3.5 h-3.5" />
                                      <span className="hidden xl:inline text-[11px]">Group</span>
                                    </button>

                                    {/* Group Switch Menu Popover */}
                                    {groupSwitchCatId === cat.id && (
                                      <div className="absolute right-0 top-full mt-1 z-30 w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-2 space-y-1 text-left">
                                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                                          Move to Group:
                                        </div>
                                        {availableGroups.map((g) => (
                                          <button
                                            key={g}
                                            type="button"
                                            onClick={() => changeCategoryGroup(cat, g)}
                                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                                              g === cat.group_name 
                                                ? 'bg-rose-50 text-brand-rose font-bold' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                          >
                                            <span className="truncate">{g}</span>
                                            {g === cat.group_name && <span className="text-[10px] text-brand-rose">Current</span>}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Edit Button */}
                                  <button
                                    onClick={() => startEdit(cat)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                      isBeingEdited
                                        ? 'bg-brand-rose text-white'
                                        : 'text-gray-600 hover:text-brand-rose hover:bg-rose-50'
                                    }`}
                                    title="Edit category"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>{isBeingEdited ? 'Editing' : 'Edit'}</span>
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    onClick={() => handleDelete(cat.id, cat.name)}
                                    disabled={deletingId === cat.id}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                    title="Delete category"
                                  >
                                    {deletingId === cat.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
