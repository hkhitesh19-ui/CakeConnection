"use client";

import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Tag, Image as ImageIcon } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          <h2 className="text-3xl font-display font-bold text-white mb-2">Products</h2>
          <p className="text-text-muted">Manage your inventory, prices, and product details.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white font-medium rounded-xl transition-colors shadow-lg shadow-brand-rose/20">
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-secondary border border-border-secondary rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search products..."
            className="w-full bg-brand-black border border-border-secondary rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-brand-rose transition-colors"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-black border border-border-secondary rounded-lg text-text-secondary hover:text-white hover:border-text-muted transition-colors flex-1 sm:flex-none justify-center">
            <Tag className="w-4 h-4" />
            <span>Category</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-secondary border border-border-secondary rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-brand-black/50 text-text-muted text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium w-16">Image</th>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-secondary">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-rose" />
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-brand-black/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center border border-border-secondary">
                      <ImageIcon className="w-5 h-5 text-text-muted" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-text-muted">{product.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-white">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${!product.in_stock ? 'text-red-500 font-medium' : 'text-text-secondary'}`}>
                      {product.product_variations?.length > 0 
                        ? `${product.product_variations.length} variants`
                        : product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.in_stock ? 'Active' : 'Out of Stock')}`}>
                      {product.in_stock ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button className="p-2 text-text-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
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
