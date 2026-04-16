import React from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Trash2, Wallet } from 'lucide-react';
import { cn } from '../utils/cn';
const ExpenseItem = ({ exp, onRemove, isSwiped, onDragStart, onDragEnd }) => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({ x: isSwiped ? -100 : 0 });
  }, [isSwiped, controls]);

  const getFontSize = (val) => {
    const len = val.toString().length;
    if (len > 50) return "text-[8px] leading-[1.1] opacity-90 transition-all";
    if (len > 35) return "text-[9px] leading-tight";
    if (len > 25) return "text-[10px]";
    if (len > 18) return "text-xs";
    if (len > 12) return "text-sm";
    return "text-base";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group expense-item"
    >
      {/* Swipe background indicator - Neon Ruby Area */}
      <div 
        onClick={() => onRemove(exp.id)}
        className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-500 rounded-[24px] shadow-[0_4px_20px_rgba(244,63,94,0.15)] cursor-pointer flex items-center justify-end px-8 text-white"
      >
        <Trash2 size={24} className="animate-pulse" />
      </div>

      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.05}
        animate={controls}
        transition={{ type: 'spring', stiffness: 700, damping: 50 }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--card-bg)] border border-[var(--border)] rounded-[24px] p-5 shadow-lg active:scale-[0.98] transition-shadow touch-pan-y gap-2"
      >
        <div className="flex-1 w-full overflow-hidden">
          <p className="text-base md:text-lg font-bold text-[var(--text)] capitalize leading-tight break-words">
            {exp.name}
          </p>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <p className={cn("font-black text-[var(--text)] tracking-tighter break-all tabular-nums", getFontSize(exp.amount))}>
            {new Intl.NumberFormat('uz-UZ').format(exp.amount).replace(/,/g, ' ')} 
            <span className="text-[10px] font-bold opacity-30 ml-1 uppercase">so'm</span>
          </p>
          
          <button
            onClick={() => onRemove(exp.id)}
            className="hidden md:flex text-red-500 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ExpenseList({ expenses, onRemove, onClearAll }) {
  const [swipedId, setSwipedId] = React.useState(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.expense-item')) setSwipedId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-20 px-6 glass rounded-[32px] border-dashed border-2 border-[var(--border)] flex flex-col items-center gap-6">
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30"
        >
          <Wallet size={40} className="text-white" />
        </motion.div>
        <div>
          <p className="text-[var(--text)] font-black text-xl tracking-tight">Hali xarajatlar yo'q</p>
          <p className="text-[var(--text-muted)] font-medium text-sm mt-1">Boshlash uchun biror narsa yozing</p>
        </div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = {
    'Bugun': [],
    'Kecha': [],
    'Oldingi kunlar': [],
  };

  expenses.forEach(exp => {
    const d = new Date(exp.date);
    if (d >= today) groups['Bugun'].push(exp);
    else if (d >= yesterday) groups['Kecha'].push(exp);
    else groups['Oldingi kunlar'].push(exp);
  });

  return (
    <div className="space-y-6 pb-20">
      {Object.entries(groups).map(([label, items]) => {
        if (items.length === 0) return null;
        
        return (
          <div key={label} className="relative">
            <h3 className="text-center text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mb-8 mt-6">
              {label}
            </h3>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((exp) => (
                  <ExpenseItem 
                    key={exp.id}
                    exp={exp}
                    onRemove={onRemove}
                    isSwiped={swipedId === exp.id}
                    onDragStart={() => setSwipedId(exp.id)}
                    onDragEnd={(_, info) => {
                      if (info.velocity.x < -50 || info.offset.x < -30) {
                        setSwipedId(exp.id);
                      } else {
                        setSwipedId(null);
                      }
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {expenses.length > 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-2"
        >
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(244, 63, 94, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onClearAll}
            className="w-full py-5 text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] border border-rose-500/20 rounded-[24px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 size={14} />
            Barchasini o'chirish
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
