'use client';
// ============================================
// Mobile Menu Component — Cake Connection
// ============================================

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X, ChevronDown, ChevronRight, Heart, User, Package, MessageCircle, Phone, Search } from 'lucide-react';
import { navigationConfig, siteConfig, whatsappConfig } from '@/config/site.config';
import { useUIStore } from '@/stores';

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[350]"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-surface-primary z-[400] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-secondary">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-rose via-brand-rose-light to-brand-rose-gold flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-text-primary">CC</span>
            </div>
            <span className="font-serif text-lg font-semibold text-text-primary">
              Cake <span className="text-gradient-rose">Connection</span>
            </span>
          </Link>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        {/* Search Bar Trigger */}
        <div className="px-4 pt-3 pb-1">
          <button
            onClick={() => {
              onClose();
              setSearchOpen(true);
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border-secondary text-text-muted hover:text-text-primary text-sm font-medium text-left transition-colors cursor-pointer"
          >
            <Search size={18} className="text-text-muted" />
            <span>Search cakes, flowers...</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="px-4 space-y-1">
            {navigationConfig.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => item.megaMenu ? setExpandedItem(expandedItem === item.label ? null : item.label) : onClose()}
                  className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-text-primary hover:bg-surface-glass-light rounded-lg transition-colors"
                >
                  <span>{item.label}</span>
                  {item.megaMenu ? (
                    <motion.span animate={{ rotate: expandedItem === item.label ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} />
                    </motion.span>
                  ) : (
                    <ChevronRight size={18} className="text-text-muted" />
                  )}
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: expandedItem === item.label ? 'auto' : 0, opacity: expandedItem === item.label ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  {item.megaMenu?.map((section) => (
                    <div key={section.title} className="pl-4 py-2">
                      <p className="px-4 py-1 text-xs font-semibold text-brand-rose uppercase tracking-wider">{section.title}</p>
                      <div className="mt-1 space-y-0.5">
                        {section.items.map((subItem) => (
                          <Link key={subItem.label} href={subItem.href} onClick={onClose}
                            className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-glass-light rounded-lg transition-colors">
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </nav>

          {/* Quick Links */}
          <div className="mt-6 px-4 space-y-1">
            <div className="h-px bg-border-secondary my-4" />
            <Link href="/account" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-glass-light rounded-lg">
              <User size={18} /> My Account
            </Link>
            <Link href="/wishlist" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-glass-light rounded-lg">
              <Heart size={18} /> Wishlist
            </Link>
            <Link href="/orders" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-glass-light rounded-lg">
              <Package size={18} /> My Orders
            </Link>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-secondary space-y-3">
          <a href={whatsappConfig.getOrderUrl()} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-text-primary text-sm font-semibold rounded-lg transition-colors">
            <MessageCircle size={18} /> Order via WhatsApp
          </a>
          <a href={`tel:${siteConfig.contact.phone}`}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border-secondary text-text-secondary hover:text-text-primary text-sm font-medium rounded-lg transition-colors">
            <Phone size={18} /> Call Us
          </a>
        </div>
      </motion.div>
    </>
  );
}


