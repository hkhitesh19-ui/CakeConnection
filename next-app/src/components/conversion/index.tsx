import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

export function DeliveryCountdown() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // A simple mock timer counting down to 6 PM today
    const calculateTimeLeft = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(18, 0, 0, 0); // 6 PM
      
      if (now > cutoff) {
        cutoff.setDate(cutoff.getDate() + 1); // Next day 6 PM
      }

      const diff = cutoff.getTime() - now.getTime();
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${h}h ${m}m`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-brand-rose/10 border border-brand-rose/20 text-brand-rose px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium w-max">
      <Clock className="w-4 h-4 animate-pulse" />
      <span>Order within {timeLeft} for Same Day Delivery</span>
    </div>
  );
}

export function TrustBadges() {
  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <div className="flex items-center gap-2 text-text-muted text-sm">
        <span className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">🛡️</span>
        <span className="font-medium">Secure Payment</span>
      </div>
      <div className="flex items-center gap-2 text-text-muted text-sm">
        <span className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">🎂</span>
        <span className="font-medium">100% Freshness</span>
      </div>
      <div className="flex items-center gap-2 text-text-muted text-sm">
        <span className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">🚚</span>
        <span className="font-medium">On-Time Delivery</span>
      </div>
    </div>
  );
}

export function SocialProof() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-24 left-4 z-50 bg-brand-black/90 backdrop-blur-md border border-border-secondary p-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-xs"
        >
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-xl">🎉</div>
          <div>
            <p className="text-white text-sm font-medium">Someone in Vadodara</p>
            <p className="text-text-muted text-xs">just bought a Chocolate Truffle Cake</p>
          </div>
          <button onClick={() => setVisible(false)} className="absolute top-1 right-2 text-text-muted hover:text-white text-xs">✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-black/90 backdrop-blur-md border-t border-border-secondary p-4 md:hidden flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div>
        <p className="text-white font-bold">$45.00</p>
        <p className="text-brand-rose text-xs font-medium">Free Delivery</p>
      </div>
      <button className="px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-rose/20">
        Add to Cart
      </button>
    </div>
  );
}
