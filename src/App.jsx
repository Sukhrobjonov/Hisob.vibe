import React from 'react';
import { Share2, Sun, Moon, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BentoDashboard from './components/BentoDashboard';
import SmartInput from './components/SmartInput';
import ExpenseList from './components/ExpenseList';
import ConfirmModal from './components/ConfirmModal';
import { useExpenses } from './hooks/useExpenses';
import { useTheme } from './hooks/useTheme';

function App() {
  const { expenses, addExpense, removeExpense, clearAll, limit, setLimit } = useExpenses();
  const { theme, toggleTheme } = useTheme();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Lowered threshold to 200px for better accessibility
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmClear = () => {
    clearAll();
    setIsConfirmOpen(false);
  };

  const handleShare = async () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthExpenses = expenses.filter(exp => new Date(exp.date) >= startOfMonth);
    const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const summaryText = `Hisob.vibe: Jami oylik xarajatlar - ${new Intl.NumberFormat('uz-UZ').format(monthTotal).replace(/,/g, ' ')} so'm.\n\n` +
      monthExpenses.slice(0, 10).map(e => `- ${e.name}: ${new Intl.NumberFormat('uz-UZ').format(e.amount).replace(/,/g, ' ')} so'm`).join('\n') +
      (monthExpenses.length > 10 ? '\n...va boshqalar' : '');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mening xarajatlarim',
          text: summaryText,
        });
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      alert("Kechirasiz, brauzeringiz 'Share' funksiyasini qo'llab-quvvatlamaydi. Matn nusxalandi!");
      navigator.clipboard.writeText(summaryText);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 md:px-8 selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="glow-orb absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[160px]" />
        <div className="glow-orb absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 md:p-3.5 bg-indigo-600 text-white rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.5)] z-[100] cursor-pointer hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all border border-white/20 outline-none"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto relative z-10 text-left">
        <header className="mb-12 flex justify-between items-start">
          <div className="flex flex-col text-left">
            <motion.a 
              href="/"
              whileHover={{ scale: 1.02 }}
              className="text-4xl font-black tracking-tighter text-[var(--text)] cursor-pointer hover:text-indigo-500 transition-colors inline-block no-underline"
            >
              Hisob.vibe
            </motion.a>
            <p className="text-[var(--text-muted)] font-bold mt-1">Xarajatlarni aqlli kuzating</p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => toggleTheme(e)}
              className="p-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-full shadow-lg flex items-center justify-center text-[var(--text)] cursor-pointer"
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-full shadow-lg text-[var(--text)] cursor-pointer"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </header>

        <main>
          <BentoDashboard expenses={expenses} limit={limit} setLimit={setLimit} />
          <SmartInput onAdd={addExpense} />
          <ExpenseList 
            expenses={expenses} 
            onRemove={removeExpense} 
            onClearAll={() => setIsConfirmOpen(true)} 
          />
        </main>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        message="Barcha xarajatlarni to'liq o'chirib tashlamoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi."
      />
    </div>
  );
}

export default App;
