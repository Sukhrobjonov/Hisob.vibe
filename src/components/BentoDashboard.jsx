import React from 'react';
import { Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export default function BentoDashboard({ expenses, limit, setLimit }) {
  const [showLimitModal, setShowLimitModal] = React.useState(false);
  const [limitInput, setLimitInput] = React.useState(limit.toString());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const todayExpenses = expenses.filter(exp => new Date(exp.date) >= today);
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthExpenses = expenses.filter(exp => new Date(exp.date) >= startOfMonth);
  const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const progress = Math.min((monthTotal / limit) * 100, 100);
  const remaining = Math.max(limit - monthTotal, 0);

  const handleSaveLimit = () => {
    const newLimit = parseInt(limitInput, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
      setLimit(newLimit);
      setShowLimitModal(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {/* Bugungi xarajat - Main Card */}
      <div className="col-span-2 glass rounded-[32px] p-6 md:p-8 flex flex-col justify-between items-start min-h-[180px] md:min-h-[220px] relative overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#9333EA] shadow-[0_20px_50px_rgba(79,70,229,0.4)] border-none">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-900/30 rounded-full blur-3xl"></div>
        
        <p className="text-indigo-100 font-black text-[10px] tracking-[0.4em] uppercase opacity-90">Bugungi xarajat</p>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter flex items-end gap-2 flex-wrap">
          <span className="text-white drop-shadow-2xl whitespace-nowrap leading-tight">
            {new Intl.NumberFormat('uz-UZ').format(todayTotal).replace(/,/g, ' ')}
          </span>
          <span className="text-lg md:text-2xl font-bold text-indigo-200/60 mb-2 md:mb-3 tracking-normal ml-1">so'm</span>
        </h2>
      </div>

      {/* Limit progress bar */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setLimitInput(limit.toString());
          setShowLimitModal(true);
        }}
        className="col-span-1 glass rounded-[24px] p-4 md:p-5 flex flex-col justify-between min-h-[140px] md:min-h-[160px] cursor-pointer hover:scale-[1.02] relative group overflow-hidden"
      >
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-white bg-indigo-600 dark:bg-indigo-500 px-2 py-1 rounded-full shadow-md z-20">
          <Settings2 size={10} />
        </div>
        <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">Limit</p>
        <p className="text-xl md:text-2xl font-black mt-2 mb-3 tracking-tighter text-[var(--text)] whitespace-nowrap overflow-hidden text-ellipsis">
          {new Intl.NumberFormat('uz-UZ').format(remaining).replace(/,/g, ' ')}
        </p>
        <div className="w-full bg-[var(--border)] h-2.5 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-sm", 
              progress > 90 ? "bg-red-500" : progress > 70 ? "bg-orange-500" : "bg-indigo-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      {/* Adjust Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[var(--card-bg)] border border-[var(--border)] p-8 rounded-[32px] shadow-2xl max-w-sm w-full"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/10 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings2 size={32} />
              </div>
              <h3 className="text-xl font-black text-[var(--text)] mb-2 text-center">Limitni sozlash</h3>
              <p className="text-[var(--text-muted)] font-medium mb-6 text-center">
                Oylik xarajatlaringiz uchun yangi limitni belgilang.
              </p>
              
              <div className="relative mb-6">
                <input
                  autoFocus
                  type="number"
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveLimit()}
                  className="w-full py-4 px-6 bg-[var(--input-bg)] border border-indigo-500/20 rounded-2xl text-2xl font-black text-center text-indigo-500 outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold opacity-30">UZS</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="flex-1 py-4 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 rounded-2xl font-bold transition-all hover:bg-red-100 dark:hover:bg-red-900/20 font-sans"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSaveLimit}
                  className="flex-1 py-4 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 font-sans"
                >
                  Saqlash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Oylik jami */}
      <div className="col-span-1 glass rounded-[24px] p-4 md:p-5 flex flex-col justify-between min-h-[140px] md:min-h-[160px]">
        <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">Oylik jami</p>
        <div className="flex flex-col mt-2">
          <h3 className="text-xl md:text-2xl font-black tracking-tighter text-[var(--text)] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {new Intl.NumberFormat('uz-UZ').format(monthTotal).replace(/,/g, ' ')}
          </h3>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-1">Joriy oy</p>
        </div>
      </div>
    </div>
  );
}
