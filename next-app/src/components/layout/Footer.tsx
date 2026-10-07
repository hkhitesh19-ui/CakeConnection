'use client';
// ============================================
// Footer Component — Cake Connection
// Premium luxury dark footer
// ============================================

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight, Heart } from 'lucide-react';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa6';
import { siteConfig } from '@/config/site.config';
import { Container } from '@/components/ui';
import { useInView } from '@/hooks';

const footerLinks = {
  shop: [
    { label: 'All Cakes', href: '/cakes' },
    { label: 'Flower Bouquets', href: '/flowers/vadodara' },
    { label: 'Gift Combos', href: '/combos' },
    { label: 'Same Day Delivery (2-4 Hrs)', href: '/same-day-cake-delivery-vadodara' },
    { label: '100% Eggless Cakes', href: '/eggless-cake-delivery-vadodara' },
  ],
  celebrations: [
    { label: 'Birthday Cakes', href: '/birthday-cake-vadodara' },
    { label: 'Anniversary Cakes', href: '/anniversary-cake-vadodara' },
    { label: 'Photo Print Cakes', href: '/photo-cake-vadodara' },
    { label: 'Designer & Theme Cakes', href: '/designer-cake-vadodara' },
    { label: '1st Birthday Cakes', href: '/1st-birthday-cake-vadodara' },
    { label: 'Chocolate Truffle Cakes', href: '/chocolate-cake-vadodara' },
    { label: 'Red Velvet Cakes', href: '/red-velvet-cake-vadodara' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Vadodara Cake Hub', href: '/cakes/vadodara' },
    { label: 'Delivery Areas & Pincodes', href: '/delivery-areas' },
  ],
  support: [
    { label: 'FAQs & Sizing Guide', href: '/faq' },
    { label: 'Shipping & Delivery Policy', href: '/shipping-policy' },
    { label: 'Return & Refund Policy', href: '/return-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

const VADODARA_LOCALITIES = [
  { name: 'Alkapuri', slug: 'alkapuri' },
  { name: 'Gotri', slug: 'gotri' },
  { name: 'Manjalpur', slug: 'manjalpur' },
  { name: 'Akota', slug: 'akota' },
  { name: 'Sayajigunj', slug: 'sayajigunj' },
  { name: 'Fatehgunj', slug: 'fatehgunj' },
  { name: 'Karelibaug', slug: 'karelibaug' },
  { name: 'Old Padra Road', slug: 'old-padra-road' },
  { name: 'Waghodia Road', slug: 'waghodia-road' },
  { name: 'Subhanpura', slug: 'subhanpura' },
  { name: 'Diwalipura', slug: 'diwalipura' },
  { name: 'Vadiwadi', slug: 'vadiwadi' },
];

const socialLinks = [
  { icon: FaInstagram, href: siteConfig.social.instagram, label: 'Instagram' },
  { icon: FaFacebook, href: siteConfig.social.facebook, label: 'Facebook' },
  { icon: FaYoutube, href: siteConfig.social.youtube || '#', label: 'YouTube' },
];

export function Footer() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <footer ref={ref} className="relative bg-surface-primary border-t border-border-secondary">
      {/* Decorative top gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-rose/50 to-transparent" />

      {/* Newsletter Section */}
      <div className="border-b border-border-secondary">
        <Container className="py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="text-center lg:text-left">
              <h3 className="font-display text-2xl lg:text-3xl font-semibold text-text-primary">
                Join the <span className="text-gradient-rose">Sweet Circle</span>
              </h3>
              <p className="mt-2 text-text-secondary text-sm lg:text-base max-w-md">
                Get exclusive offers, new arrivals, and sweet inspirations delivered to your inbox.
              </p>
            </div>
            <form className="flex w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3 bg-surface-secondary text-text-primary text-sm rounded-l-xl border border-border-secondary focus:border-brand-rose focus:outline-none transition-colors placeholder:text-text-muted"
                id="newsletter-email"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-brand-rose hover:bg-brand-rose-dark text-white text-sm font-semibold rounded-r-xl transition-colors flex items-center gap-2 whitespace-nowrap"
                id="newsletter-submit"
              >
                Subscribe
                <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>
        </Container>
      </div>

      {/* Main Footer Content */}
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <img src="/logo.png?v=new1" alt="Cake Connection Logo" className="w-auto h-12 object-contain" />
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xs">
              Delivering happiness with premium cakes and beautiful flower bouquets across Vadodara.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-secondary hover:bg-brand-rose/20 border border-border-secondary hover:border-brand-rose/50 flex items-center justify-center text-text-muted hover:text-brand-rose transition-all duration-300"
                  aria-label={social.label}>
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Shop Cakes</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-brand-rose transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Celebrations Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Celebrations</h4>
            <ul className="space-y-2.5">
              {footerLinks.celebrations.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-brand-rose transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Info & Support Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-brand-rose transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerLinks.support.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-brand-rose transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <MapPin size={16} className="text-brand-rose mt-0.5 shrink-0" />
                <span>GF9 RutuPlatina Complex, Besides Duliram Pendawala, Eva Mall Rd, Manjalpur, Vadodara</span>
              </li>
              <li>
                <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-3 text-sm text-text-secondary hover:text-brand-rose transition-colors">
                  <Phone size={16} className="text-brand-rose shrink-0" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 text-sm text-text-secondary hover:text-brand-rose transition-colors">
                  <Mail size={16} className="text-brand-rose shrink-0" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Localities Directory Row */}
        <div className="mt-12 pt-8 border-t border-border-secondary/60">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Cake Delivery in Vadodara Localities (Same-Day &amp; Express):
            </h5>
            <Link href="/delivery-areas" className="text-xs text-brand-rose hover:underline font-medium">
              View All Areas, Pincodes &amp; ETA →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-text-muted leading-relaxed">
            {VADODARA_LOCALITIES.map((loc, i) => (
              <span key={loc.slug} className="inline-flex items-center gap-2">
                <Link
                  href={`/cakes/vadodara/${loc.slug}`}
                  className="hover:text-brand-rose transition-colors"
                >
                  Cake Delivery {loc.name}
                </Link>
                {i < VADODARA_LOCALITIES.length - 1 && <span className="text-border-secondary">•</span>}
              </span>
            ))}
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-border-secondary">
        <Container className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart size={12} className="text-brand-rose fill-brand-rose" /> in Vadodara
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}


