"use client";

// ============================================
// Not Found Page — 404
// ============================================

import Link from 'next/link';
import { SEOHead } from '@/components/seo/SEOHead';
import { Container, Button } from '@/components/ui';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <>
      <SEOHead title="Page Not Found" noIndex />
      <section className="min-h-[60vh] flex items-center justify-center">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-8xl md:text-9xl font-bold text-gradient-rose">404</h1>
            <p className="mt-4 text-2xl font-display text-text-primary">Page Not Found</p>
            <p className="mt-2 text-text-secondary max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button variant="primary" size="lg" leftIcon={<Home size={18} />} onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
              <Link href="/cakes">
                <Button variant="outline" size="lg" leftIcon={<ArrowLeft size={18} />}>
                  Browse Cakes
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
