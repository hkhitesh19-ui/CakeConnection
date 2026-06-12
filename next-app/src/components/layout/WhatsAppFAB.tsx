'use client';
// ============================================
// WhatsApp FAB — Floating Action Button
// ============================================

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { whatsappConfig } from '@/config/site.config';

export function WhatsAppFAB() {
  return (
    <motion.a
      href={whatsappConfig.getOrderUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-green-500 hover:bg-green-600 text-text-primary rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260 }}
      aria-label="Chat on WhatsApp"
      id="whatsapp-fab"
    >
      <MessageCircle size={26} />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
    </motion.a>
  );
}

