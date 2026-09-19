"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, FolderTree, Loader2, X } from 'lucide-react';

interface Category {
  id: string;
  group_name: string;
  name: string;
  slug: string;
  display_order: number;
}

const GROUPS = ['By Occasion', 'By Design', 'By Flavour'];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [editId, setEditId] = useState('');
  const [groupName, setGroupName] = useState(GROUPS[0]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editId) setSlug(slugify(val));
  };

  const openModal = (cat?: Category) => {
    if (cat) {
      setEditId(cat.id);
      setGroupName(cat.group_name || GROUPS[0]);
      setName(cat.name);
      setSlug(cat.slug);
      setDisplayOrder(cat.display_order.toString());
    } else {
      setEditId('');
      setGroupName(GROUPS[0]);
      setName('');
      setSlug('');
      setDisplayOrder('1');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const body = { id: editId, group_name: groupName, name, slug, display_order: Number(displayOrder) };
      
      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // Group categories for display
  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.group_name]) acc[cat.group_name] = [];
    acc[cat.group_name].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Categories</h2>
          <p className="text-gray-500">Manage product categories and navigation groups.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-rose/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-rose" /></div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedCategories).map(([group, cats]) => (
            <motion.div 
              key={group}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-lg shadow-brand-rose/5 border border-brand-rose/20 rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-brand-rose/20 bg-brand-rose/5">
                <h3 className="text-xl font-bold text-brand-rose flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-brand-rose" />
                  {group}
                </h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Category Name</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                    <th className="px-6 py-4 font-semibold">Order</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cats.sort((a, b) => a.display_order - b.display_order).map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-black">{cat.name}</td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-700">{cat.slug}</td>
                      <td className="px-6 py-4 text-black font-medium">{cat.display_order}</td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <button onClick={() => openModal(cat)} className="p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white shadow-2xl shadow-brand-rose/20 border border-brand-rose/10 rounded-3xl w-full max-w-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-brand-rose/10 bg-brand-rose/5">
              <h3 className="text-xl font-bold text-brand-rose">{editId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-brand-rose/60 hover:text-brand-rose hover:bg-brand-rose/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Group</label>
                <select 
                  value={groupName} 
                  onChange={e => setGroupName(e.target.value)}
                  className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10 outline-none transition-all shadow-sm"
                >
                  {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={handleNameChange}
                  required
                  placeholder="e.g. Birthday Cakes"
                  className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10 outline-none transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)}
                  required
                  placeholder="birthday-cakes"
                  className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10 outline-none font-mono text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Order</label>
                <input 
                  type="number" 
                  value={displayOrder} 
                  onChange={e => setDisplayOrder(e.target.value)}
                  required
                  min="1"
                  className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full px-4 py-3.5 bg-brand-rose hover:bg-brand-rose/90 text-white rounded-xl transition-all font-semibold flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg shadow-brand-rose/25"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Category'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 text-gray-600 hover:text-gray-900 hover:border-gray-200 hover:bg-gray-50 rounded-xl transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
