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
import { HeaderSearch } from './HeaderSearch';
import { ExpressDeliveryScooter } from '@/components/common/ExpressDeliveryScooter';

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

  // Keep navbar permanently sticky on scroll (always visible)
  const isHidden = false;
  const isScrolled = scrollY > 10;

  // Close mega menu when route changes
  useEffect(() => {
    setActiveMega(null);
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

      // Fetch dynamic categories for MegaMenu
      useEffect(() => {
        async function fetchCategories() {
          try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (data.success && data.data) {
              const categories = data.data;
              
              // Group categories by group_name
              const grouped = categories.reduce((acc: any, cat: any) => {
                const group = cat.group_name || 'Other';
                if (!acc[group]) acc[group] = [];
                acc[group].push({ label: cat.name, href: `/cakes?category=${cat.slug}` });
                return acc;
              }, {});

              // Build MegaMenuSection array
              const dynamicMegaMenu = Object.entries(grouped).map(([title, items]) => ({
                title,
                items: items as any[]
              }));

              setNavItems((prev) => 
                prev.map(item => {
                  if (item.label === 'Cakes') {
                    return { ...item, megaMenu: dynamicMegaMenu };
                  }
                  return item;
                })
              );
            }
          } catch (error) {
            console.error('Failed to fetch categories:', error);
          }
        }
        fetchCategories();
      }, []);      // Mega menu hover with debounce
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
            className="fixed top-0 left-0 right-0 z-[300] transition-all duration-300"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
          >
            {/* Top Announcement Bar */}
            <div className="bg-brand-rose/95 text-white py-1.5 px-3 text-xs sm:text-sm font-medium tracking-wide flex items-center justify-between sm:justify-center gap-2 sm:gap-4 overflow-hidden shadow-xs">
              <span className="inline-flex items-center gap-2 truncate">
                ✨ Free Delivery all Over Vadodara | Same Day Delivery in Vadodara ✨
              </span>
              <div className="flex-shrink-0">
                <ExpressDeliveryScooter
                  isMobile
                  className="!bg-white/15 !border-white/30 !text-white hover:!bg-white/25 !py-0.5 !px-2.5 shadow-none"
                />
              </div>
            </div>

        {/* Main Navbar */}
        <nav
          className={cn(
            'transition-all duration-300 relative',
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
              : 'bg-white/90 backdrop-blur-lg border-b border-gray-100'
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
                  <img src="/logo.png" alt="Cake Connection" className="w-auto h-10 md:h-12 object-contain" />
                </Link>
              </div>

              {/* Center: Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1" ref={megaMenuRef}>
                {navItems.map((item) => (
                  <div
                    key={item.label}
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
                          navItem={item}
                          onMouseEnter={() => handleMegaEnter(item.label)}
                          onMouseLeave={handleMegaLeave}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Winni-Style 2 Hour Delivery Gifts Animated Scooter */}
                <div className="ml-1 pl-2 border-l border-gray-200">
                  <ExpressDeliveryScooter />
                </div>
              </div>

              {/* Center-Right: Desktop Direct Search Bar */}
              <div className="hidden lg:block w-64 xl:w-80">
                <HeaderSearch idPrefix="desktop" />
              </div>

              {/* Right: Action Icons */}
              <div className="flex items-center gap-1 sm:gap-2">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  <span className="hidden lg:inline">Order on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Mobile Direct Search Bar — Always visible right below logo row */}
            <div className="lg:hidden pb-2.5 pt-0.5">
              <HeaderSearch idPrefix="mobile" placeholder="Search cakes, flavours, occasions..." />
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


