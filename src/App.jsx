import React from 'react';
import { Share2, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BentoDashboard from './components/BentoDashboard';
import SmartInput from './components/SmartInput';
import ExpenseList from './components/ExpenseList';
import { useExpenses } from './hooks/useExpenses';
import { useTheme } from './hooks/useTheme';

function App() {
  const { expenses, addExpense, removeExpense, limit, setLimit } = useExpenses();
  const { theme, toggleTheme } = useTheme();

  const handleShare = async () => {
    // ... avvalgi share mantiqi o'zgarmadi
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
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 md:px-8 transition-colors duration-500 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-[var(--text)]">Hisob.vibe</h1>
            <p className="text-[var(--text-muted)] font-bold mt-1">Xarajatlarni aqlli kuzating</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-full transition-all shadow-lg flex items-center justify-center text-[var(--text)]"
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-full transition-all shadow-lg text-[var(--text)]"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </header>

        <main>
          <BentoDashboard expenses={expenses} limit={limit} setLimit={setLimit} />
          <SmartInput onAdd={addExpense} />
          <ExpenseList expenses={expenses} onRemove={removeExpense} />
        </main>
      </div>
    </div>
  );
}

export default App;
