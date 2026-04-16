import React from 'react';
import { Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export default function BentoDashboard({ expenses, limit, setLimit }) {
  const [showLimitModal, setShowLimitModal] = React.useState(false);
  const [showExcessModal, setShowExcessModal] = React.useState(false);
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
    
    // Funny validation: If limit > 1 billion UZS
    if (newLimit >= 1000000000) {
      setShowExcessModal(true);
      return;
    }

    if (!isNaN(newLimit) && newLimit > 0) {
      setLimit(newLimit);
      setShowLimitModal(false);
    }
  };

  const todayTotalFormatted = new Intl.NumberFormat('uz-UZ').format(todayTotal).replace(/,/g, ' ');

  const getFontSize = (val) => {
    const len = val.toString().length;
    if (len > 60) return "text-[10px] sm:text-xs md:text-sm leading-tight";
    if (len > 40) return "text-xs sm:text-sm md:text-base leading-tight";
    if (len > 25) return "text-base sm:text-lg md:text-xl";
    if (len > 18) return "text-xl sm:text-2xl md:text-3xl";
    if (len > 12) return "text-2xl sm:text-3xl md:text-4xl";
    return "text-4xl sm:text-5xl md:text-6xl";
  };

  const getSmallFontSize = (val) => {
    const len = val.toString().length;
    if (len > 60) return "text-[8px] sm:text-[9px] leading-tight";
    if (len > 40) return "text-[10px] sm:text-xs leading-tight";
    if (len > 25) return "text-xs sm:text-sm md:text-base";
    if (len > 15) return "text-sm sm:text-base md:text-lg";
    return "text-lg sm:text-xl md:text-2xl";
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {/* Bugungi xarajat - Main Card */}
      <div className="col-span-2 glass rounded-[32px] p-6 md:p-8 flex flex-col justify-center items-start h-[160px] sm:h-[180px] md:h-[240px] relative overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#9333EA] shadow-[0_20px_50px_rgba(79,70,229,0.3)] border-none">
        <div className="glow-orb absolute -right-10 -top-10 w-80 h-80 bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="glow-orb absolute -left-10 -bottom-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px]"></div>
        
        <p className="text-indigo-100 font-black text-[10px] tracking-[0.4em] uppercase opacity-90 mb-2 z-10">Bugungi xarajat</p>
        <div className="w-full overflow-hidden z-10">
          <h2 className={cn("font-black tracking-tighter text-white break-all leading-tight tabular-nums transition-all duration-500", getFontSize(todayTotal))}>
            {todayTotalFormatted}
            <span className={cn("font-bold text-indigo-100/60 ml-2 tracking-normal align-baseline", todayTotal.toString().length > 20 ? "text-xs sm:text-sm" : "text-sm md:text-xl")}>so'm</span>
          </h2>
        </div>
      </div>

      {/* Limit progress bar */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setLimitInput(limit.toString());
          setShowLimitModal(true);
        }}
        className="col-span-1 glass rounded-[24px] p-4 md:p-5 flex flex-col items-start justify-between h-[140px] md:h-[160px] cursor-pointer hover:scale-[1.02] relative group overflow-hidden"
      >
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-white bg-indigo-600 dark:bg-indigo-500 px-2 py-1 rounded-full shadow-md z-20">
          <Settings2 size={10} />
        </div>
        <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">Limit</p>
        <div className="flex items-baseline gap-1 mt-2 mb-3 w-full overflow-hidden">
          <p className={cn("font-black tracking-tighter text-[var(--text)] break-all tabular-nums w-full leading-none", getSmallFontSize(remaining))}>
            {new Intl.NumberFormat('uz-UZ').format(remaining).replace(/,/g, ' ')}
          </p>
        </div>
        <div className="w-full bg-[var(--border)] h-2.5 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-[width] duration-1000 ease-out shadow-sm", 
              progress > 90 ? "bg-red-500" : progress > 70 ? "bg-orange-500" : "bg-indigo-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      {/* Funny Excessive Limit Modal */}
      <AnimatePresence>
        {showExcessModal && (
          <div 
            onClick={() => setShowExcessModal(false)}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
              className="bg-[var(--card-bg)] border-2 border-amber-500/50 p-10 rounded-[40px] shadow-[0_0_50px_rgba(245,158,11,0.3)] max-w-sm w-full text-center relative overflow-hidden"
            >
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-6xl mb-6 inline-block"
              >
                🤑
              </motion.div>

              <h3 className="text-2xl font-black text-[var(--text)] mb-4 tracking-tight uppercase">
                Opa-cha, sekinroq!
              </h3>
              
              <p className="text-[var(--text-muted)] font-bold mb-8 leading-relaxed">
                Sizda buncha pul yo'q-ku! <br/>
                Keling, biroz realroq limit belgilaymiz.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExcessModal(false)}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-2xl font-black shadow-xl shadow-amber-500/30 uppercase tracking-widest cursor-pointer"
              >
                Xafa bo'lmasdan to'g'irlash
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Adjust Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <div 
            onClick={() => setShowLimitModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
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
                  className="flex-1 py-4 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-900/20 font-sans cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSaveLimit}
                  className="flex-1 py-4 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 font-sans cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Oylik jami */}
      <div className="col-span-1 glass rounded-[24px] p-4 md:p-5 flex flex-col items-start justify-between h-[140px] md:h-[160px] overflow-hidden">
        <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">Oylik jami</p>
        <div className="flex items-baseline gap-1 mt-2 mb-3 w-full overflow-hidden">
          <h3 className={cn("font-black tracking-tighter text-[var(--text)] leading-none break-all tabular-nums w-full", getSmallFontSize(monthTotal))}>
            {new Intl.NumberFormat('uz-UZ').format(monthTotal).replace(/,/g, ' ')}
          </h3>
        </div>
        <div className="w-full">
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Joriy oy</p>
        </div>
      </div>
    </div>
  );
}
