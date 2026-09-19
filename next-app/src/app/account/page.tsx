"use client";

// ============================================
// Account Page — Cake Connection
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  User,
  MapPin,
  Package,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/utils';

// ── Mock Data ────────────────────────────────

const MOCK_USER = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 98765 43210',
  initials: 'JD',
  memberSince: 'January 2024',
};

const MOCK_ADDRESSES = [
  {
    id: '1',
    label: 'Home',
    fullName: 'John Doe',
    phone: '+91 98765 43210',
    line1: '42, Sunrise Apartments, SG Highway',
    line2: 'Near Iskcon Temple',
    city: 'Vadodara',
    state: 'Gujarat',
    pincode: '380015',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    fullName: 'John Doe',
    phone: '+91 98765 43210',
    line1: 'Tower B, 5th Floor, Navrangpura',
    line2: 'Corporate Park',
    city: 'Vadodara',
    state: 'Gujarat',
    pincode: '380009',
    isDefault: false,
  },
];

// ── Animations ───────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.08 } },
};

// ── Tab types ────────────────────────────────

type TabType = 'profile' | 'addresses' | 'orders';

const TABS: { value: TabType; label: string; icon: React.ElementType }[] = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'addresses', label: 'Addresses', icon: MapPin },
  { value: 'orders', label: 'Orders', icon: Package },
];

// ── Main Page ────────────────────────────────

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  return (
    <>
      <SEOHead title="My Account" description="Manage your account, addresses and orders." noIndex />

      <motion.div initial="hidden" animate="visible" variants={pageVariants}>
        {/* Header */}
        <section className="relative overflow-hidden bg-surface-primary py-8 sm:py-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-brand-rose/[0.04] blur-3xl" />
          </div>
          <Container as="div" size="xl" className="relative">
            <motion.div variants={fadeUp}>
              <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm">
                <Link href="/" className="flex items-center gap-1 text-text-muted hover:text-brand-rose transition-colors">
                  <Home className="h-3.5 w-3.5" /> Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-text-muted/50" />
                <span className="text-text-accent font-medium">My Account</span>
              </nav>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
                My <span className="text-gradient-rose">Account</span>
              </h1>
            </motion.div>
          </Container>
        </section>

        {/* Content */}
        <section className="bg-[#FAF9F6] pb-24 border-t border-gray-150">
          <Container as="div" size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-10 pt-6">

              {/* Tabs */}
              <motion.div variants={fadeUp}>
                {/* Desktop sidebar */}
                <div className="hidden lg:block sticky top-28 space-y-1.5">
                  {TABS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setActiveTab(value)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-left',
                        activeTab === value
                          ? 'bg-brand-rose/15 text-brand-rose border border-brand-rose/30'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
                {/* Mobile tabs */}
                <div className="flex lg:hidden gap-2 overflow-x-auto pb-2">
                  {TABS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setActiveTab(value)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer',
                        activeTab === value
                          ? 'bg-brand-rose text-white'
                          : 'bg-surface-secondary text-text-secondary border border-border-secondary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Tab Content */}
              <motion.div variants={fadeUp}>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="glass rounded-2xl p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-rose via-brand-rose-light to-brand-rose-gold flex items-center justify-center shadow-lg shadow-brand-rose/20 flex-shrink-0">
                          <span className="text-2xl font-bold text-white font-display">{MOCK_USER.initials}</span>
                        </div>
                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left">
                          <h2 className="font-display text-2xl font-bold text-text-primary">{MOCK_USER.name}</h2>
                          <div className="mt-3 space-y-2">
                            <p className="flex items-center gap-2 text-sm text-text-secondary justify-center sm:justify-start">
                              <Mail className="h-4 w-4 text-text-muted" />
                              {MOCK_USER.email}
                            </p>
                            <p className="flex items-center gap-2 text-sm text-text-secondary justify-center sm:justify-start">
                              <Phone className="h-4 w-4 text-text-muted" />
                              {MOCK_USER.phone}
                            </p>
                            <p className="flex items-center gap-2 text-sm text-text-secondary justify-center sm:justify-start">
                              <Calendar className="h-4 w-4 text-text-muted" />
                              Member since {MOCK_USER.memberSince}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-border-secondary">
                        <button
                          disabled
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-secondary text-text-muted text-sm font-medium border border-border-secondary cursor-not-allowed opacity-50"
                          title="Coming Soon"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit Profile
                          <span className="text-[10px] bg-brand-rose/20 text-brand-rose px-2 py-0.5 rounded-full ml-1">Coming Soon</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Orders', value: '4', icon: Package },
                        { label: 'Wishlist', value: '3', icon: Star },
                        { label: 'Addresses', value: '2', icon: MapPin },
                      ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="rounded-2xl bg-surface-secondary border border-border-secondary p-4 text-center">
                          <Icon className="h-5 w-5 text-brand-rose mx-auto mb-2" />
                          <p className="text-2xl font-bold text-text-primary">{value}</p>
                          <p className="text-xs text-text-muted mt-1">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className="space-y-4">
                    {MOCK_ADDRESSES.map((addr) => (
                      <div key={addr.id} className="rounded-2xl bg-surface-secondary border border-border-secondary p-5 hover:border-brand-rose/20 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-text-primary">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-rose/15 text-brand-rose px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary">{addr.fullName}</p>
                            <p className="text-xs text-text-muted mt-1">{addr.line1}</p>
                            {addr.line2 && <p className="text-xs text-text-muted">{addr.line2}</p>}
                            <p className="text-xs text-text-muted">{addr.city}, {addr.state} — {addr.pincode}</p>
                            <p className="text-xs text-text-muted mt-1">{addr.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button disabled className="p-2 text-text-muted cursor-not-allowed opacity-40" title="Coming Soon">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button disabled className="p-2 text-text-muted cursor-not-allowed opacity-40" title="Coming Soon">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border-secondary py-4 text-sm font-medium text-text-muted cursor-not-allowed opacity-50 hover:border-brand-rose/20 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Address
                      <span className="text-[10px] bg-brand-rose/20 text-brand-rose px-2 py-0.5 rounded-full">Coming Soon</span>
                    </button>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <div className="glass rounded-2xl p-6 text-center">
                      <Package className="h-10 w-10 text-brand-rose mx-auto mb-3" />
                      <h3 className="font-display text-lg font-semibold text-text-primary mb-2">Order History</h3>
                      <p className="text-text-secondary text-sm mb-4">View all your past orders and track active deliveries.</p>
                      <Link
                        href="/orders"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-rose text-white font-semibold text-sm hover:bg-brand-rose-dark transition-colors"
                      >
                        View All Orders
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </Container>
        </section>
      </motion.div>
    </>
  );
}
