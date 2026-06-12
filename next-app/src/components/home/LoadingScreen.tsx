'use client';
// ============================================
// Loading Screen — Cake Connection
// Cinematic intro with monogram + typewriter reveal
// ============================================

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const SESSION_KEY = 'cc_loading_shown';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      setIsVisible(false);
    }
  }, []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, '1');
    // small delay so exit animation plays
    setTimeout(() => {
      setIsVisible(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      if (onComplete) onComplete();
      return;
    }

    // Animate progress bar over 2.3s
    const duration = 2300;
    const interval = 16;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased * 100);
      if (t >= 1) {
        clearInterval(timer);
        handleComplete();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, onComplete, handleComplete]);

  // Monogram letter animation
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.5,
      filter: 'blur(10px)',
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        delay: 0.3 + i * 0.15,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    }),
  };

  // Brand name text clip-reveal
  const brandNameVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.9,
        duration: 0.1,
      },
    },
  };

  // Tagline fade-in
  const taglineVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.6,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  // Screen exit
  const screenExitVariants = {
    visible: { y: 0, opacity: 1 },
    exit: {
      y: '-100%',
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={onComplete}
    >
      {isVisible && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface-primary"
          variants={screenExitVariants}
          initial="visible"
          exit="exit"
        >
          {/* Background ambient glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(183,110,121,0.08) 0%, rgba(183,110,121,0.03) 40%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Monogram */}
          <div className="relative mb-8 flex items-center justify-center">
  <motion.div variants={letterVariants} initial="hidden" animate="visible">
    <Image src="/logo.png" alt="Cake Connection" width={300} height={100} priority className="object-contain drop-shadow-2xl brightness-110" />
  </motion.div>
</div>

          {/* Brand name with clip/typewriter reveal */}
          <motion.div
            variants={brandNameVariants}
            initial="hidden"
            animate="visible"
            className="relative mb-4 overflow-hidden"
          >
            <motion.h1
              className="font-display text-2xl font-light tracking-[0.3em] text-brand-cream sm:text-3xl md:text-4xl"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{
                delay: 0.9,
                duration: 1.0,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
              }}
            >
              CAKE CONNECTION
            </motion.h1>

            {/* Cursor sweep line */}
            <motion.span
              className="absolute right-0 top-0 h-full w-[2px] bg-brand-rose"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                delay: 0.9,
                duration: 1.2,
                times: [0, 0.05, 0.85, 1],
              }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={taglineVariants}
            initial="hidden"
            animate="visible"
            className="mb-16 font-serif text-base tracking-[0.15em] text-text-secondary sm:text-lg md:text-xl"
          >
            Crafted For Emotions
          </motion.p>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-surface-secondary">
            <motion.div
              className="h-full origin-left"
              style={{
                width: `${progress}%`,
                background:
                  'linear-gradient(90deg, #B76E79, #D4A574, #C9A96E)',
              }}
              layout
            />
            {/* Glow tip */}
            <motion.div
              className="absolute top-1/2 h-[6px] w-[60px] -translate-y-1/2"
              style={{
                left: `${progress}%`,
                background:
                  'radial-gradient(ellipse, rgba(183,110,121,0.6) 0%, transparent 70%)',
                filter: 'blur(2px)',
              }}
            />
          </div>

          {/* Decorative corner marks */}
          <div className="pointer-events-none absolute inset-6 sm:inset-10">
            {/* Top-left */}
            <motion.div
              className="absolute left-0 top-0"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="h-8 w-[1px] bg-brand-rose" />
              <div className="absolute left-0 top-0 h-[1px] w-8 bg-brand-rose" />
            </motion.div>
            {/* Top-right */}
            <motion.div
              className="absolute right-0 top-0"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="h-8 w-[1px] ml-auto bg-brand-rose" />
              <div className="absolute right-0 top-0 h-[1px] w-8 bg-brand-rose" />
            </motion.div>
            {/* Bottom-left */}
            <motion.div
              className="absolute bottom-0 left-0"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="h-8 w-[1px] bg-brand-rose" />
              <div className="absolute bottom-0 left-0 h-[1px] w-8 bg-brand-rose" />
            </motion.div>
            {/* Bottom-right */}
            <motion.div
              className="absolute bottom-0 right-0"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="h-8 w-[1px] ml-auto bg-brand-rose" />
              <div className="absolute bottom-0 right-0 h-[1px] w-8 bg-brand-rose" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


