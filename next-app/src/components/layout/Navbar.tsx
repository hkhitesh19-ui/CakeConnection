'use client';
// ============================================
// Navbar Component — Cake Connection
// Floating Glassmorphism Luxury Navbar
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { navigationConfig, whatsappConfig } from '@/config/site.config';
import { useCartStore, useWishlistStore, useUIStore } from '@/stores';
import { useScrollPosition, useClickOutside } from '@/hooks';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';

export function Navbar() {
  const pathname = usePathname();
  const { y: scrollY, direction } = useScrollPosition();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getItemCount());
  const { isMobileMenuOpen, setMobileMenuOpen, isSearchOpen, setSearchOpen } =
    useUIStore();

  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [navItems, setNavItems] = useState(navigationConfig);
  const [isMounted, setIsMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hide navbar on scroll down, show on scroll up (after 100px)
  const isHidden = scrollY > 100 && direction === 'down';
  const isScrolled = scrollY > 20;

  // Close mega menu when route changes
  useEffect(() => {
    setActiveMega(null);
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Fetch dynamic categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('cake_categories').select('*').order('display_order');
      if (data && !error) {
        const groups = ['Delivery based Cakes', 'Design Bases Cakes', 'Festival or Special Occassion Based'];
        const dynamicMegaMenu = groups.map(group => {
          const items = data.filter((c: any) => c.group_name === group).map((c: any) => ({
            label: c.name,
            href: `/cakes?category=${c.slug}`
          }));
          return { title: group, items };
        }).filter(section => section.items.length > 0);

        setNavItems(prev => prev.map(nav => {
          if (nav.label === 'Cakes') {
            return { ...nav, megaMenu: dynamicMegaMenu };
          }
          return nav;
        }));
      }
    };
    fetchCategories();
  }, []);

  // Mega menu hover with debounce
  const handleMegaEnter = useCallback((label: string) => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setActiveMega(label);
  }, []);

  const handleMegaLeave = useCallback(() => {
    megaTimerRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 200);
  }, []);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(megaMenuRef, () => setActiveMega(null));

  return (
    <>
      <motion.header
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-[300] transition-all duration-500',
          isHidden && '-translate-y-full'
        )}
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Top Announcement Bar */}
        <div className="bg-brand-rose/90 text-white text-center py-1.5 text-xs sm:text-sm font-medium tracking-wide">
          <span className="inline-flex items-center gap-2">
            ✨ Free Delivery on Orders Above ₹999 | Same Day Delivery in Vadodara ✨
          </span>
        </div>

        {/* Main Navbar */}
        <nav
          className={cn(
            'transition-all duration-500',
            isScrolled
              ? 'bg-surface-primary/85 backdrop-blur-xl border-b border-border-secondary shadow-2xl shadow-black/20'
              : 'bg-surface-primary/60 backdrop-blur-lg border-b border-transparent'
          )}
        >
          <div className="container-luxury">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Left: Mobile Menu + Logo */}
              <div className="flex items-center gap-3 lg:gap-0">
                {/* Mobile Menu Toggle */}
                <button
                  id="mobile-menu-toggle"
                  className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center group" id="navbar-logo">
                  <img src="/logo.png?v=new1" alt="Cake Connection" className="w-auto h-10 md:h-12 object-contain" />
                </Link>
              </div>

              {/* Center: Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1" ref={megaMenuRef}>
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMegaEnter(item.label)}
                    onMouseLeave={handleMegaLeave}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300',
                        activeMega === item.label
                          ? 'text-brand-rose bg-brand-rose/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-glass-light'
                      )}
                      id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.label}
                      {item.megaMenu && (
                        <motion.span
                          animate={{ rotate: activeMega === item.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={14} />
                        </motion.span>
                      )}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                      {activeMega === item.label && item.megaMenu && (
                        <MegaMenu
                          sections={item.megaMenu}
                          onMouseEnter={() => handleMegaEnter(item.label)}
                          onMouseLeave={handleMegaLeave}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Right: Action Icons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Search */}
                <button
                  id="navbar-search"
                  className="p-2 lg:p-2.5 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-glass-light"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search products"
                >
                  <Search size={20} />
                </button>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  id="navbar-wishlist"
                  className="relative p-2 lg:p-2.5 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-glass-light"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  {isMounted && wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  id="navbar-cart"
                  className="relative p-2 lg:p-2.5 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-glass-light"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag size={20} />
                  {isMounted && cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </Link>

                {/* User Profile */}
                <Link
                  href="/account"
                  id="navbar-profile"
                  className="hidden sm:flex p-2 lg:p-2.5 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-glass-light"
                  aria-label="My account"
                >
                  <User size={20} />
                </Link>

                {/* WhatsApp Quick Order */}
                <a
                  href={whatsappConfig.getOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="navbar-whatsapp"
                  className="hidden md:flex items-center gap-2 ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-text-primary text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-green-600/20 hover:shadow-green-600/40"
                >
                  <MessageCircle size={16} />
                  <span className="hidden lg:inline">Quick Order</span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu onClose={() => setMobileMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}


