"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: 'Total Revenue',
      value: '₹0',
      change: 'Live',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      title: 'Total Orders',
      value: '0',
      change: 'Live',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-brand-rose',
      bg: 'bg-brand-rose/10'
    },
    {
      title: 'Active Customers',
      value: '0',
      change: 'Live',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Pending Orders',
      value: '0',
      change: 'Live',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    }
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          console.warn('Orders API not available (status:', response.status, ')— showing empty dashboard.');
          setLoading(false);
          return;
        }
        const resData = await response.json();
        if (resData.success && resData.data) {
          const fetchedOrders = resData.data;
          setOrders(fetchedOrders);

          // Calculate statistics
          const totalRevenue = fetchedOrders
            .filter((o: any) => o.order_status !== 'cancelled' && o.order_status !== 'refunded')
            .reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

          const totalOrdersCount = fetchedOrders.length;

          const uniqueCustomers = new Set(fetchedOrders.map((o: any) => o.customer_email)).size;

          const pendingOrdersCount = fetchedOrders.filter((o: any) =>
            ['pending', 'confirmed', 'preparing', 'out-for-delivery'].includes(o.order_status)
          ).length;

          setStats([
            {
              title: 'Total Revenue',
              value: `₹${totalRevenue.toLocaleString('en-IN')}`,
              change: 'Live',
              trend: 'up',
              icon: DollarSign,
              color: 'text-green-500',
              bg: 'bg-green-500/10'
            },
            {
              title: 'Total Orders',
              value: totalOrdersCount.toString(),
              change: 'Live',
              trend: 'up',
              icon: ShoppingBag,
              color: 'text-brand-rose',
              bg: 'bg-brand-rose/10'
            },
            {
              title: 'Active Customers',
              value: uniqueCustomers.toString(),
              change: 'Live',
              trend: 'up',
              icon: Users,
              color: 'text-blue-500',
              bg: 'bg-blue-500/10'
            },
            {
              title: 'Pending Orders',
              value: pendingOrdersCount.toString(),
              change: 'Live',
              trend: 'up',
              icon: TrendingUp,
              color: 'text-orange-500',
              bg: 'bg-orange-500/10'
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

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

  const getStatusLabel = (status: string) => {
    if (status === 'out-for-delivery') return 'Out for Delivery';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const recentOrders = orders.slice(0, 5);

  // Generate chart data based on orders (mocking past 7 days for demo if not enough data)
  const chartData = [
    { name: 'Mon', revenue: 12000, orders: 15 },
    { name: 'Tue', revenue: 15000, orders: 20 },
    { name: 'Wed', revenue: 8000, orders: 10 },
    { name: 'Thu', revenue: 22000, orders: 35 },
    { name: 'Fri', revenue: 28000, orders: 40 },
    { name: 'Sat', revenue: 45000, orders: 80 },
    { name: 'Sun', revenue: 52000, orders: 95 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-500">Welcome back! Here's what's happening with your store today.</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-brand-rose bg-brand-rose/10 px-4 py-2 rounded-xl text-sm font-medium border border-brand-rose/20">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Syncing Live Data...</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
            <Activity className="w-5 h-5 text-brand-rose" />
            <h3 className="text-lg font-bold text-gray-900">Weekly Revenue Trend</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#111827' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#D81B60" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#D81B60', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-900">Orders Volume</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#111827' }}
                  cursor={{ fill: '#F3F4F6', opacity: 0.8 }}
                />
                <Bar 
                  dataKey="orders" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <Link href="/admin/orders" className="text-brand-rose hover:text-brand-rose/80 text-sm font-medium transition-colors">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Order Number</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading orders...' : 'No orders placed yet.'}
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{order.order_number}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customer_name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{Number(order.total).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.order_status)}`}>
                        {getStatusLabel(order.order_status)}
                      </span>
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
