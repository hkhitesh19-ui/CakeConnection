'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Flower2, MessageCircle } from 'lucide-react';
import { cn } from '@/utils';
import { whatsappConfig } from '@/config/site.config';

export function MobileBottomNav() {
  const pathname = usePathname();

  // On individual product pages (e.g. /cakes/red-velvet-dream), the sticky "Add to Cart" bar is shown instead
  const isProductDetailPage = pathname?.startsWith('/cakes/') && pathname !== '/cakes' && pathname !== '/cakes/vadodara';

  if (isProductDetailPage) {
    return null;
  }

  const isHome = pathname === '/';
  const isFastDelivery = pathname === '/cakes' && (typeof window !== 'undefined' && window.location.search.includes('fast'));
  const isFlowers = pathname === '/flowers' || pathname?.startsWith('/flowers');

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-[120] lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1 safe-area-pb"
    >
      <div className="grid grid-cols-4 items-center h-14">
        {/* 1. Home with CakeConnection Logo */}
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer group',
            isHome ? 'text-brand-rose' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center p-0.5 transition-transform group-hover:scale-105',
            isHome ? 'ring-2 ring-brand-rose/30 bg-rose-50' : 'bg-gray-100/80'
          )}>
            <img
              src="/logo.png"
              alt="CakeConnection"
              className="h-5 w-auto object-contain"
            />
          </div>
          <span className={cn(
            'text-[10px] font-bold tracking-tight',
            isHome ? 'text-brand-rose font-extrabold' : 'text-gray-600'
          )}>
            Home
          </span>
        </Link>

        {/* 2. 1-2 Hours Delivery Cakes */}
        <Link
          href="/cakes?sort=fast"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer group text-amber-600 hover:text-amber-700'
          )}
        >
          <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-amber-50 group-hover:bg-amber-100 transition-colors">
            <Zap className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-tight text-amber-700">
            1-2 Hr Cakes
          </span>
        </Link>

        {/* 3. Flower Bouquets */}
        <Link
          href="/flowers"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer group',
            isFlowers ? 'text-brand-rose' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
            isFlowers ? 'bg-pink-50 ring-2 ring-brand-rose/30' : 'bg-gray-100/80 group-hover:bg-pink-50'
          )}>
            <Flower2 className={cn(
              'h-4.5 w-4.5',
              isFlowers ? 'text-brand-rose' : 'text-gray-700 group-hover:text-pink-500'
            )} />
          </div>
          <span className={cn(
            'text-[10px] font-bold tracking-tight',
            isFlowers ? 'text-brand-rose font-extrabold' : 'text-gray-600'
          )}>
            Flowers
          </span>
        </Link>

        {/* 4. WhatsApp */}
        <a
          href={whatsappConfig.getOrderUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer group text-emerald-600 hover:text-emerald-700"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </div>
          <span className="text-[10px] font-bold tracking-tight text-emerald-600">
            WhatsApp
          </span>
        </a>
      </div>
    </nav>
  );
}
