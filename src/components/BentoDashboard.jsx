import React from 'react';
import { Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';
import { cn } from '../utils/cn';

export default function BentoDashboard({ expenses, limit, setLimit }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Bugungi xarajatlar
  const todayExpenses = expenses.filter(exp => new Date(exp.date) >= today);
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Oylik jami
  const monthExpenses = expenses.filter(exp => new Date(exp.date) >= startOfMonth);
  const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Limit progress
  const progress = Math.min((monthTotal / limit) * 100, 100);
  const remaining = Math.max(limit - monthTotal, 0);

  const handleSetLimit = () => {
    const newLimit = prompt("Yangi limitni kiritig (UZS):", limit);
    if (newLimit && !isNaN(newLimit)) {
      setLimit(parseInt(newLimit, 10));
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
          <span className="text-lg md:text-2xl font-bold text-indigo-200/60 mb-2 md:mb-3 tracking-normal">so'm</span>
        </h2>
      </div>

      {/* Limit progress bar */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={handleSetLimit}
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
