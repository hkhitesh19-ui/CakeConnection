'use client';
// ============================================
// Root Layout Component — Cake Connection
// ============================================

import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFAB } from './WhatsAppFAB';

export function RootLayout() {
  const { pathname } = useLocation() || { pathname: '' };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-[calc(2.5rem+4rem)] lg:pt-[calc(2.5rem+5rem)]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

