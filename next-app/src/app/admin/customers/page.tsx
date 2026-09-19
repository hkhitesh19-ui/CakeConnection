"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  Trash2, 
  Check, 
  MessageSquare, 
  Star, 
  Loader2, 
  AlertCircle,
  Users,
  ShieldCheck,
  Calendar,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/stores';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

interface ReviewData {
  id: string;
  product_id: string;
  product_name: string;
  user_name: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

export default function AdminCustomersAndReviews() {
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState<'crm' | 'reviews'>('crm');
  const [loading, setLoading] = useState(true);
  
  // CRM state
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [crmSearch, setCrmSearch] = useState('');
  
  // Reviews state
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'verified'>('all');
  
  // Products map for review lookup
  const [productMap, setProductMap] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'crm') {
        // Fetch all orders to compute customer details
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('customer_name, customer_email, customer_phone, total, created_at')
          .order('created_at', { ascending: false });
          
        if (ordersError) throw ordersError;

        const customerMap: Record<string, CustomerData> = {};
        (ordersData || []).forEach((order) => {
          const email = (order.customer_email || 'guest@cakeconnection.in').toLowerCase().trim();
          if (!customerMap[email]) {
            customerMap[email] = {
              name: order.customer_name || 'Guest Customer',
              email: email,
              phone: order.customer_phone || 'N/A',
              ordersCount: 0,
              totalSpent: 0,
              lastOrderDate: order.created_at
            };
          }
          customerMap[email].ordersCount += 1;
          customerMap[email].totalSpent += Number(order.total || 0);
          if (new Date(order.created_at) > new Date(customerMap[email].lastOrderDate)) {
            customerMap[email].lastOrderDate = order.created_at;
          }
        });

        setCustomers(Object.values(customerMap));
      } else {
        // Fetch products first for name resolution
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name');
          
        if (productsError) throw productsError;
        
        const pMap: Record<string, string> = {};
        (productsData || []).forEach((p) => {
          pMap[p.id] = p.name;
        });
        setProductMap(pMap);

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (reviewsError) throw reviewsError;

        const mappedReviews = (reviewsData || []).map((r) => ({
          id: r.id,
          product_id: r.product_id,
          product_name: pMap[r.product_id] || 'Unknown Product',
          user_name: r.user_name || 'Anonymous',
          rating: r.rating || 5,
          comment: r.comment || '',
          is_verified: r.is_verified || false,
          created_at: r.created_at
        }));

        setReviews(mappedReviews);
      }
    } catch (err: any) {
      console.error('Error loading admin CRM/Reviews data:', err);
      addToast({ type: 'error', message: `Sync failed: ${err.message || 'Database error'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReview = async (reviewId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('reviews')
        .update({ is_verified: newStatus })
        .eq('id', reviewId);

      if (error) throw error;

      addToast({ 
        type: 'success', 
        message: newStatus ? 'Review verified successfully!' : 'Review verification removed.' 
      });

      // Update state
      setReviews(prev => 
        prev.map(r => r.id === reviewId ? { ...r, is_verified: newStatus } : r)
      );
    } catch (err: any) {
      console.error('Error verifying review:', err);
      addToast({ type: 'error', message: `Action failed: ${err.message}` });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to permanently delete this product review?')) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      addToast({ type: 'success', message: 'Review deleted successfully.' });
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err: any) {
      console.error('Error deleting review:', err);
      addToast({ type: 'error', message: `Delete failed: ${err.message}` });
    }
  };

  // Filter CRM
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(crmSearch.toLowerCase()) ||
    c.phone.includes(crmSearch)
  );

  // Filter Reviews
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.user_name.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.product_name.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.comment.toLowerCase().includes(reviewSearch.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (reviewFilter === 'pending') return !r.is_verified;
    if (reviewFilter === 'verified') return r.is_verified;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">CRM &amp; Reviews Moderation</h2>
          <p className="text-gray-500">Analyze your buyer list and moderate customer testimonials.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white shadow-sm border border-gray-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'crm' 
                ? 'bg-brand-rose text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers CRM</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'reviews' 
                ? 'bg-brand-rose text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews Moderation</span>
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 shadow-2xl">
        <AnimatePresence mode="wait">
          {activeTab === 'crm' ? (
            <motion.div
              key="crm-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Search CRM */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={crmSearch}
                    onChange={(e) => setCrmSearch(e.target.value)}
                    placeholder="Search customers by name, email, or phone..."
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all placeholder:text-gray-400 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-rose" />}
                  <span>{filteredCustomers.length} Customers Found</span>
                </div>
              </div>

              {/* CRM Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Customer Profile</th>
                      <th className="px-6 py-4 font-semibold">Contact Details</th>
                      <th className="px-6 py-4 font-semibold">Total Orders</th>
                      <th className="px-6 py-4 font-semibold">Total Spent</th>
                      <th className="px-6 py-4 font-semibold">Last Order</th>
                      <th className="px-6 py-4 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2 justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-brand-rose" />
                            <span>Compiling CRM database...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No customer profiles match your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <tr key={customer.email} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-rose/10 flex items-center justify-center border border-brand-rose/20 text-brand-rose font-bold">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{customer.name}</p>
                                <span className="text-[11px] font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                  ID: {customer.email.split('@')[0].toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-gray-600 text-xs">
                                <Mail className="w-3.5 h-3.5 text-gray-500" />
                                <span>{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 text-xs">
                                <Phone className="w-3.5 h-3.5 text-gray-500" />
                                <span>{customer.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {customer.ordersCount}
                          </td>
                          <td className="px-6 py-4 font-bold text-brand-rose">
                            ₹{customer.totalSpent.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-xs">
                            {new Date(customer.lastOrderDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-500/10 text-green-500 border-green-500/20">
                              Active Buyer
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reviews-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Search & Filters for Reviews */}
              <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    placeholder="Search reviews by product name, client, or comment..."
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all placeholder:text-gray-400 text-sm"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex bg-gray-100 border border-gray-200 p-1 rounded-lg">
                    {[
                      { value: 'all', label: 'All Reviews' },
                      { value: 'pending', label: 'Pending Only' },
                      { value: 'verified', label: 'Verified Only' }
                    ].map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setReviewFilter(filter.value as any)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                          reviewFilter === filter.value 
                            ? 'bg-white text-brand-rose shadow-sm border border-gray-200 font-semibold' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-gray-600 text-sm">
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-rose inline mr-1" />}
                    <span>{filteredReviews.length} Reviews found</span>
                  </div>
                </div>
              </div>

              {/* Reviews Moderation Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Reviewer &amp; Product</th>
                      <th className="px-6 py-4 font-semibold">Rating</th>
                      <th className="px-6 py-4 font-semibold">Comment</th>
                      <th className="px-6 py-4 font-semibold">Posted Date</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2 justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-brand-rose" />
                            <span>Fetching feedback database...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredReviews.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No reviews found matching the current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredReviews.map((review) => (
                        <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{review.user_name}</p>
                              <span className="text-[11px] text-brand-rose-gold font-medium">
                                Product: {review.product_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating 
                                      ? 'text-amber-400 fill-amber-400' 
                                      : 'text-gray-500'
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-md">
                            <p className="text-gray-600 line-clamp-3 italic">
                              "{review.comment}"
                            </p>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-600">
                            {new Date(review.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              review.is_verified
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}>
                              {review.is_verified ? 'Verified Approved' : 'Pending Verification'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleVerifyReview(review.id, review.is_verified)}
                                title={review.is_verified ? 'Unverify / Revoke Approval' : 'Approve / Mark Verified'}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                  review.is_verified
                                    ? 'text-amber-500 hover:bg-amber-500/10'
                                    : 'text-green-500 hover:bg-green-500/10'
                                }`}
                              >
                                {review.is_verified ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                title="Delete Review"
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
