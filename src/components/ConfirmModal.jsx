import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-lg"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-[var(--card-bg)] border border-[var(--border)] pt-10 pb-6 px-8 rounded-[40px] shadow-2xl max-w-[340px] w-full relative overflow-hidden mx-4"
          >
            {/* Premium Close Button - Explicitly Forced to Top Right */}
            <div className="absolute top-4 right-4 z-[100]">
              <motion.button 
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-300 group cursor-pointer"
              >
                <X size={18} className="group-hover:scale-110" />
              </motion.button>
            </div>

            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-[24px] flex items-center justify-center mx-auto mb-4 relative group">
              <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <AlertTriangle size={32} className="relative z-10" />
            </div>

            <h3 className="text-xl font-black text-[var(--text)] mb-2 text-center tracking-tight">
              {title || "Ishonchingiz komilmi?"}
            </h3>
            
            <p className="text-[var(--text-muted)] font-medium mb-6 text-center leading-tight px-2 text-xs sm:text-sm">
              {message}
            </p>

            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="w-full py-3.5 bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-600/20 text-xs uppercase tracking-[0.2em] relative overflow-hidden group cursor-pointer"
              >
                <span className="relative z-10">O'chirish</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 bg-transparent text-[var(--text-muted)] rounded-2xl font-bold text-xs uppercase tracking-widest hover:text-[var(--text)] hover:bg-[var(--border)]/30 transition-all cursor-pointer"
              >
                Bekor qilish
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
