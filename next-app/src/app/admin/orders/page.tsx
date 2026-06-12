"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Eye, 
  Printer, 
  X, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useUIStore } from '@/stores';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { addToast } = useUIStore();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      const resData = await response.json();
      if (resData.success && resData.data) {
        setOrders(resData.data);
      } else {
        addToast({ type: 'error', message: 'Failed to load orders.' });
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      addToast({ type: 'error', message: 'Network error loading orders.' });
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId: string, updates: { order_status?: string; payment_status?: string }) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        // Update local list state
        setOrders((prev: any[]) => prev.map(o => o.id === orderId ? { ...o, ...updates, updated_at: resData.data.updated_at } : o));
        // Update selected modal if open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev: any) => ({ ...prev, ...updates }));
        }
        addToast({ type: 'success', message: 'Order status updated successfully.' });
      } else {
        addToast({ type: 'error', message: resData.message || 'Failed to update status.' });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      addToast({ type: 'error', message: 'Connection error updating status.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'preparing': 
      case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'out-for-delivery': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'cancelled':
      case 'refunded': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'failed':
      case 'refunded': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'out-for-delivery') return 'Out for Delivery';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filtering and Searching
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm);
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && order.order_status === 'pending';
    if (statusFilter === 'processing') return matchesSearch && ['confirmed', 'preparing'].includes(order.order_status);
    if (statusFilter === 'out-for-delivery') return matchesSearch && order.order_status === 'out-for-delivery';
    if (statusFilter === 'delivered') return matchesSearch && order.order_status === 'delivered';
    if (statusFilter === 'cancelled') return matchesSearch && ['cancelled', 'refunded'].includes(order.order_status);
    return matchesSearch;
  });

  const printDocument = (type: 'kot' | 'invoice') => {
    if (!selectedOrder) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const address = selectedOrder.delivery_address;
    const addressStr = `${address.addressLine1}${address.deliveryArea ? ', ' + address.deliveryArea : ''}, ${address.city}, ${address.state} — ${address.pincode}`;

    const itemsHTML = selectedOrder.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: left;">
          <strong>${item.name}</strong><br/>
          <small style="color: #666;">Size/Wt: ${item.weight}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity || item.qty}</td>
        ${type === 'invoice' ? `
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price * (item.quantity || item.qty)}</td>
        ` : ''}
      </tr>
    `).join('');

    const content = `
      <html>
        <head>
          <title>${type === 'kot' ? 'KOT' : 'Invoice'} - ${selectedOrder.order_number}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .details { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
            .details td { padding: 5px 0; vertical-align: top; }
            .items { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .items th { background: #f2f2f2; padding: 10px; border: 1px solid #ddd; font-weight: bold; text-align: left; }
            .items td { border: 1px solid #ddd; }
            .totals { width: 250px; margin-left: auto; margin-top: 20px; font-weight: bold; line-height: 1.8; }
            .instructions { background: #f9f9f9; border-left: 4px solid #D81B60; padding: 10px; margin-top: 20px; font-size: 13px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${type === 'kot' ? '🍰 KITCHEN ORDER TICKET (KOT)' : '🎂 CAKE CONNECTION INVOICE'}</h2>
            <h3>Order #: ${selectedOrder.order_number}</h3>
            <p>Delivery Date: <strong>${selectedOrder.delivery_date}</strong> | Slot: <strong>${selectedOrder.delivery_slot}</strong></p>
          </div>
          
          <table class="details">
            <tr>
              <td style="width: 50%;">
                <strong>Sender (Bill To):</strong><br/>
                Name: ${selectedOrder.customer_name}<br/>
                Phone: ${selectedOrder.delivery_address.senderPhone || selectedOrder.customer_phone}<br/>
                WhatsApp: ${selectedOrder.delivery_address.senderWhatsApp || 'N/A'}<br/>
                Email: ${selectedOrder.customer_email}
              </td>
              <td>
                <strong>Receiver (Ship To):</strong><br/>
                Phone: ${selectedOrder.customer_phone}<br/>
                Address: ${addressStr}
              </td>
            </tr>
          </table>

          ${selectedOrder.special_instructions ? `
            <div class="instructions">
              <strong>Special Instructions / Message on Cake:</strong><br/>
              ${selectedOrder.special_instructions}
            </div>
          ` : ''}

          <table class="items">
            <thead>
              <tr>
                <th style="text-align: left;">Item Name</th>
                <th style="width: 80px; text-align: center;">Qty</th>
                ${type === 'invoice' ? `
                  <th style="width: 100px; text-align: right;">Rate</th>
                  <th style="width: 120px; text-align: right;">Total</th>
                ` : ''}
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          ${type === 'invoice' ? `
            <div class="totals">
              <div style="display: flex; justify-content: space-between;">
                <span>Subtotal:</span> <span>₹${selectedOrder.subtotal}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Delivery Charge:</span> <span>₹${selectedOrder.delivery_charge}</span>
              </div>
              ${selectedOrder.discount ? `
                <div style="display: flex; justify-content: space-between; color: red;">
                  <span>Discount:</span> <span>-₹${selectedOrder.discount}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 5px; margin-top: 5px; font-size: 16px;">
                <span>Grand Total:</span> <span>₹${selectedOrder.total}</span>
              </div>
            </div>
          ` : ''}

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Orders Pipeline</h2>
          <p className="text-text-muted">Manage and track all customer orders dynamically.</p>
        </div>
        <button 
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-secondary hover:bg-surface-tertiary text-white font-medium rounded-xl border border-border-secondary transition-colors"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin text-brand-rose" /> : null}
          <span>Refresh Pipeline</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-secondary border border-border-secondary rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order #, Name, Email, Phone..."
            className="w-full bg-brand-black border border-border-secondary rounded-lg pl-11 pr-4 py-2.5 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-rose transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'pending', label: 'Pending' },
            { key: 'processing', label: 'Baking/Preparing' },
            { key: 'out-for-delivery', label: 'Out for Delivery' },
            { key: 'delivered', label: 'Delivered' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-brand-rose text-white border-brand-rose shadow-lg shadow-brand-rose/25'
                  : 'bg-brand-black text-text-secondary border-border-secondary hover:text-white hover:border-text-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-secondary border border-border-secondary rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-brand-black/50 text-text-muted text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Order Number</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Delivery Date & Slot</th>
                <th className="px-6 py-4 font-medium">Items Count</th>
                <th className="px-6 py-4 font-medium">Grand Total</th>
                <th className="px-6 py-4 font-medium">Payment status</th>
                <th className="px-6 py-4 font-medium">Order Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-secondary text-sm">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-text-muted">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-rose mx-auto mb-2" />
                    Syncing order records...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-text-muted">
                    No orders found matching filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-black/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white tracking-wider">{order.order_number}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{order.customer_name}</p>
                        <p className="text-xs text-text-muted">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-text-secondary">{order.delivery_date}</p>
                        <p className="text-xs text-text-muted truncate max-w-[200px]" title={order.delivery_slot}>
                          {order.delivery_slot}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 font-bold text-white">₹{Number(order.total).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.payment_status}
                        onChange={(e) => handleUpdateStatus(order.id, { payment_status: e.target.value })}
                        disabled={updatingId === order.id}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border focus:outline-none appearance-none pr-6 cursor-pointer ${getPaymentStatusColor(order.payment_status)}`}
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23807A74' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")",
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 6px center',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.order_status}
                        onChange={(e) => handleUpdateStatus(order.id, { order_status: e.target.value })}
                        disabled={updatingId === order.id}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border focus:outline-none appearance-none pr-6 cursor-pointer ${getStatusColor(order.order_status)}`}
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23807A74' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")",
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 6px center',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-text-muted hover:text-brand-rose hover:bg-brand-rose/10 rounded-xl transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-secondary border border-border-secondary w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-border-secondary flex justify-between items-center bg-brand-black/45">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Order details
                    <span className="font-mono text-brand-rose text-base">#{selectedOrder.order_number}</span>
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-text-muted hover:text-white bg-surface-tertiary hover:bg-surface-elevated rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                
                {/* 2 Column Customer info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Sender Details */}
                  <div className="bg-surface-primary border border-border-secondary rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-secondary pb-2">
                      Sender Details (Bill To)
                    </h4>
                    <div className="space-y-2 text-sm text-text-secondary">
                      <p><span className="text-text-muted font-medium">Name:</span> <strong className="text-white">{selectedOrder.customer_name}</strong></p>
                      <p><span className="text-text-muted font-medium">Email:</span> {selectedOrder.customer_email}</p>
                      <p className="flex items-center gap-2">
                        <span className="text-text-muted font-medium">WhatsApp:</span> 
                        <span className="text-white font-semibold">{selectedOrder.delivery_address?.senderWhatsApp || 'N/A'}</span>
                        {selectedOrder.delivery_address?.senderWhatsApp && (
                          <a 
                            href={`https://wa.me/${selectedOrder.delivery_address.senderWhatsApp.replace(/\+/g, '').replace(/\s+/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-green-500 hover:underline bg-green-500/10 px-2 py-0.5 rounded-full font-bold ml-1"
                          >
                            <MessageCircle className="w-3 h-3" /> Chat
                          </a>
                        )}
                      </p>
                      <p><span className="text-text-muted font-medium">Calling:</span> {selectedOrder.delivery_address?.senderPhone || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Receiver & Shipping Details */}
                  <div className="bg-surface-primary border border-border-secondary rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-secondary pb-2">
                      Receiver Details (Ship To)
                    </h4>
                    <div className="space-y-2 text-sm text-text-secondary">
                      <p><span className="text-text-muted font-medium">Receiver Phone:</span> <strong className="text-white">{selectedOrder.customer_phone}</strong></p>
                      <p>
                        <span className="text-text-muted font-medium">Delivery Address:</span> 
                        <span className="text-white"> {selectedOrder.delivery_address?.addressLine1}</span>
                      </p>
                      <p>
                        <span className="text-text-muted font-medium">Delivery Area:</span> 
                        <span className="text-white font-semibold"> {selectedOrder.delivery_address?.deliveryArea || 'N/A'}</span>
                      </p>
                      <p>
                        <span className="text-text-muted font-medium">City / State:</span> 
                        <span className="text-white font-semibold"> {selectedOrder.delivery_address?.city || 'Vadodara'}, {selectedOrder.delivery_address?.state || 'Gujarat'} — {selectedOrder.delivery_address?.pincode}</span>
                      </p>
                    </div>
                  </div>

                </div>

                {/* Delivery details Date / Slot / Speed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-black/35 rounded-2xl p-4 border border-border-secondary">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose flex-shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Delivery Date</p>
                      <p className="text-sm font-bold text-white">{selectedOrder.delivery_date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Delivery Time Slot</p>
                      <p className="text-sm font-bold text-white">{selectedOrder.delivery_slot}</p>
                    </div>
                  </div>
                </div>

                {/* Special instructions / Message on cake */}
                {selectedOrder.special_instructions && (
                  <div className="bg-surface-primary border border-l-4 border-brand-rose border-border-secondary rounded-2xl p-4 text-sm">
                    <h5 className="font-bold text-white mb-1">Cake Message & Special Instructions:</h5>
                    <p className="text-text-secondary whitespace-pre-line">{selectedOrder.special_instructions}</p>
                  </div>
                )}

                {/* Items Ordered List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Ordered Items</h4>
                  <div className="border border-border-secondary rounded-2xl overflow-hidden bg-surface-primary">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-black/20 text-text-muted text-xs uppercase border-b border-border-secondary">
                          <th className="px-4 py-3 font-medium">Item Details</th>
                          <th className="px-4 py-3 font-medium text-center">Qty</th>
                          <th className="px-4 py-3 font-medium text-right">Rate</th>
                          <th className="px-4 py-3 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-secondary text-sm">
                        {selectedOrder.items?.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-brand-black/10">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-surface-tertiary flex-shrink-0" />
                                ) : null}
                                <div>
                                  <p className="font-medium text-white">{item.name}</p>
                                  <p className="text-xs text-text-muted">Weight: {item.weight}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-text-secondary">{item.quantity || item.qty}</td>
                            <td className="px-4 py-3 text-right text-text-secondary">₹{item.price}</td>
                            <td className="px-4 py-3 text-right font-semibold text-white">₹{item.price * (item.quantity || item.qty)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="flex justify-end">
                  <div className="w-80 space-y-2 text-sm text-text-secondary bg-surface-primary border border-border-secondary rounded-2xl p-5">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-white">₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge:</span>
                      <span className="text-white">₹{selectedOrder.delivery_charge}</span>
                    </div>
                    {selectedOrder.discount ? (
                      <div className="flex justify-between text-brand-red">
                        <span>Discount:</span>
                        <span>-₹{selectedOrder.discount}</span>
                      </div>
                    ) : null}
                    <div className="h-px bg-border-secondary my-2" />
                    <div className="flex justify-between text-base font-bold text-white">
                      <span>Grand Total:</span>
                      <span className="text-brand-rose">₹{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between text-xs text-text-muted mt-2 pt-2 border-t border-border-secondary">
                      <span>Method:</span>
                      <span className="uppercase font-semibold">{selectedOrder.payment_method}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-border-secondary flex flex-wrap gap-3 bg-brand-black/35 justify-between items-center">
                {/* Print commands */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => printDocument('kot')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-surface-tertiary hover:bg-surface-elevated text-white text-xs font-semibold rounded-xl border border-border-secondary transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-brand-rose" />
                    Print KOT (Kitchen)
                  </button>
                  <button 
                    onClick={() => printDocument('invoice')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-surface-tertiary hover:bg-surface-elevated text-white text-xs font-semibold rounded-xl border border-border-secondary transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-brand-rose" />
                    Print Invoice
                  </button>
                </div>

                {/* Status Dropdowns */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted font-semibold">Payment Status:</span>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, { payment_status: e.target.value })}
                      disabled={updatingId === selectedOrder.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${getPaymentStatusColor(selectedOrder.payment_status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted font-semibold">Order Status:</span>
                    <select
                      value={selectedOrder.order_status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, { order_status: e.target.value })}
                      disabled={updatingId === selectedOrder.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${getStatusColor(selectedOrder.order_status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
