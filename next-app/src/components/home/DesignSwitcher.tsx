"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const DESIGNS = [
  {
    id: 'design-1',
    path: '/design-1',
    num: '01',
    title: '3D Cake Studio',
    subtitle: 'Interactive Canvas Customizer & Live Recipe Builder',
    tag: 'Interactive Studio',
    accent: '#F59E0B',
    bg: '#171A24',
    textColor: '#FBBF24',
  },
  {
    id: 'design-2',
    path: '/design-2',
    num: '02',
    title: 'Bento Grid & Radar',
    subtitle: 'Apple-Style Modular Tiles & Vadodara Radar',
    tag: '2026 Tech Bento',
    accent: '#F43F5E',
    bg: '#FFF0F5',
    textColor: '#881337',
  },
  {
    id: 'design-3',
    path: '/design-3',
    num: '03',
    title: 'Midnight Velvet',
    subtitle: 'OLED Dark Mode & 12:00 AM Romantic Surprises',
    tag: 'Midnight Cinema',
    accent: '#F59E0B',
    bg: '#1A0E22',
    textColor: '#FCD34D',
  },
  {
    id: 'design-4',
    path: '/design-4',
    num: '04',
    title: 'Quick-Commerce',
    subtitle: 'Swiggy/Zepto 35-Min Stepper & Sticky Checkout Drawer',
    tag: 'Hyper-Local Speed',
    accent: '#10B981',
    bg: '#ECFDF5',
    textColor: '#065F46',
  },
  {
    id: 'design-5',
    path: '/design-5',
    num: '05',
    title: 'Neubrutalist Pop',
    subtitle: 'Bold 4px Black Borders, Hard Drop Shadows & Marquee',
    tag: 'Gen-Z Brutalism',
    accent: '#FFE500',
    bg: '#FEF08A',
    textColor: '#000000',
  },
  {
    id: 'design-6',
    path: '/design-6',
    num: '06',
    title: 'Winni.in Style ⭐',
    subtitle: 'Full Indian Gifting Portal with Carousel & Quick Categories',
    tag: 'Winni Reference',
    accent: '#DC0013',
    bg: '#FFF1F2',
    textColor: '#9F1239',
  },
];

export default function DesignSwitcher({ activeDesign }: { activeDesign?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      aria-label="Design System Showcase Switcher" 
      className="sticky top-0 z-50 w-full bg-[#111827] text-white shadow-xl border-b border-gray-800 transition-all duration-300 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent font-bold tracking-wide">
            UI/UX PRO MAX SHOWCASE
          </span>
          <span className="hidden md:inline-block px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">
            5 Live Prototypes
          </span>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {DESIGNS.map((d) => {
            const isActive = activeDesign === d.id || pathname === d.path;
            return (
              <Link
                key={d.id}
                href={d.path}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 text-[11px] font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-pink-500/30 scale-105 font-semibold ring-1 ring-pink-300'
                    : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{d.num}.</span>
                <span>{d.title}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800/60 hover:bg-gray-800 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand design info" : "Collapse design info"}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded details bar */}
      {!collapsed && (
        <div className="bg-[#1a2234] border-t border-gray-800/80 px-4 py-2 hidden lg:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-gray-300">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Current Theme:</span>
              {DESIGNS.filter(d => d.id === activeDesign || pathname === d.path).map(d => (
                <div key={d.id} className="flex items-center gap-2">
                  <span className="font-semibold text-white">{d.title}</span>
                  <span className="text-gray-400">— {d.subtitle}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: d.bg, color: d.textColor }}>
                    {d.tag}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-gray-400">
              Vadodara Local Delivery (Alkapuri, Akota, Manjalpur, Karelibaug, Gotri, Vasna)
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
