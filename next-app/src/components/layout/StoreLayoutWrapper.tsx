'use client';
"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFAB } from './WhatsAppFAB';
import { ToastContainer } from '../ui/ToastContainer';

import { useEffect } from 'react';
import { useSiteStore } from '@/stores';

import { MobileBottomNav } from './MobileBottomNav';

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const { generalSettings, fetchSettings } = useSiteStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  const themeHex = generalSettings?.themeColor || '#D81B60';

  const isCustomLanding = pathname?.startsWith('/design-') || pathname === '/homepage2' || pathname === '/homepage-gpt';

  if (isAdmin || isCustomLanding) {
    return (
      <>
        <style jsx global>{`
          :root {
            --color-brand-rose: ${themeHex} !important;
            --color-text-accent: ${themeHex} !important;
            --color-border-primary: ${themeHex}4d !important;
            --color-border-accent: ${themeHex}80 !important;
          }
        `}</style>
        {children}
        <WhatsAppFAB />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <style jsx global>{`
        :root {
          --color-brand-rose: ${themeHex} !important;
          --color-text-accent: ${themeHex} !important;
          --color-border-primary: ${themeHex}4d !important;
          --color-border-accent: ${themeHex}80 !important;
        }
      `}</style>
      <Navbar />
      <main className="flex-1 pt-[148px] lg:pt-[112px] pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <WhatsAppFAB />
      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
}

