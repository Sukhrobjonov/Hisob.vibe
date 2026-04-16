import React, { useState, useRef } from 'react';
import { Mic, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseExpenseInput } from '../utils/parser';

const QUICK_TAGS = ['🚕 Taxi', '☕️ Kofe', '🍱 Tushlik', '🛒 Bozor'];

export default function SmartInput({ onAdd }) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showExcessModal, setShowExcessModal] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const parsed = parseExpenseInput(inputValue);

    // Funny validation: If amount >= 1 billion UZS
    if (parsed && parsed.amount >= 1000000000) {
      setShowExcessModal(true);
      return;
    }
    
    // Agarda narx topilmasa yoki 0 bo'lsa, ogohlantirish beramiz
    if (!parsed || parsed.amount <= 0) {
      setShowError(true);
      return;
    }

    onAdd(parsed);
    setInputValue('');
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Kechirasiz, brauzeringiz ovozli kiritishni qo'llab-quvvatlamaydi.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'uz-UZ';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setInputValue(speechResult);
      
      setTimeout(() => {
        const parsed = parseExpenseInput(speechResult);
        
        if (parsed && parsed.amount >= 1000000000) {
          setShowExcessModal(true);
          return;
        }

        if (parsed && parsed.amount > 0) {
          onAdd(parsed);
          setInputValue('');
        } else {
          setShowError(true);
        }
      }, 500);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleTagClick = (tag) => {
    const tagText = tag.split(' ')[1];
    const parsed = parseExpenseInput(inputValue);

    if (parsed && parsed.amount >= 1000000000) {
      setShowExcessModal(true);
      return;
    }

    if (parsed && parsed.amount > 0) {
      onAdd({ name: tagText, amount: parsed.amount, date: Date.now() });
      setInputValue('');
    } else {
      // Faqat nomini kiritib, narxini yozishni kutamiz
      setInputValue(`${tagText} `);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="mb-10 w-full relative">
      <form onSubmit={handleSubmit} className="relative w-full flex items-center z-10">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nima oldingiz? (masalan: Osh 50000)"
          className="w-full h-16 pl-6 pr-24 bg-[var(--input-bg)] border border-indigo-500/20 rounded-[24px] text-lg outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 placeholder:text-[var(--text-muted)] text-[var(--text)] shadow-inner"
        />
        
        <div className="absolute right-2 flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={startListening}
            className={`p-3 rounded-full transition-all flex items-center justify-center relative cursor-pointer ${
              isListening ? 'bg-red-500 text-white' : 'text-[var(--text)] hover:bg-[var(--card-bg)] border border-transparent hover:border-[var(--border)]'
            }`}
          >
            <AnimatePresence>
              {isListening && (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-red-400 rounded-full"
                />
              )}
            </AnimatePresence>
            <Mic size={20} className="relative z-10" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!inputValue.trim()}
            className="p-3 bg-gradient-to-br from-[#4F46E5] to-[#9333EA] text-white rounded-full disabled:opacity-50 flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:scale-105 cursor-pointer"
          >
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </form>

      {/* Warning Modal */}
      <AnimatePresence>
        {showError && (
          <div 
            onClick={() => setShowError(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-bg)] border border-[var(--border)] p-8 rounded-[32px] shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-[var(--text)] mb-2">Narx kiritilmadi</h3>
              <p className="text-[var(--text-muted)] font-medium mb-6 leading-relaxed">
                Iltimos, xarajat nomini va uning **narxini** ham yozing.<br/>
                Masalan: <span className="text-indigo-500 font-bold italic">Lunch 45000</span>
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowError(false)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                Tushunarli
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                Keling, biroz realroq xarajat yozamiz.
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

      {/* Quick Tags - Grid on mobile for neat alignment, flex on larger screens */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2.5 sm:gap-3 mt-8 mb-6 px-2 sm:px-4 relative z-[50]">
        {QUICK_TAGS.map((tag) => (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="bg-[var(--card-bg)] border border-indigo-500/20 px-4 sm:px-6 py-3 rounded-2xl text-[12px] sm:text-[13px] font-black shadow-lg shadow-indigo-500/5 hover:shadow-[0_10px_20px_rgba(79,70,229,0.15)] hover:border-indigo-500/40 text-[var(--text)] cursor-pointer text-center transition-all duration-150"
          >
            {tag}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
