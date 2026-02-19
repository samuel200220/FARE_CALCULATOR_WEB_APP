'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Sidebar2 from '@/components/sidebar2';
import Header from '@/components/navbar/header';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqPage() {
  const t = useTranslations('Faq');

  const faqData = [
    {
      question: t('questions.q1.question'),
      answer: t('questions.q1.answer'),
    },
    {
      question: t('questions.q2.question'),
      answer: t('questions.q2.answer'),
    },
    {
      question: t('questions.q3.question'),
      answer: t('questions.q3.answer'),
    },
    {
      question: t('questions.q4.question'),
      answer: t('questions.q4.answer'),
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaq = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <Header />


      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-blue-400/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 lg:py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 block">
            Support Center
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            {t('header.title')}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            {t('header.subtitle')}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl mx-auto mb-16 px-4"
        >
          <div className="relative group">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-6 pl-16 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 shadow-xl shadow-slate-200/50 dark:shadow-none font-medium text-lg"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredFaq.map((item, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${index === openIndex
                  ? 'bg-white dark:bg-slate-900 border-primary/20 shadow-2xl shadow-primary/5 ring-1 ring-primary/10'
                  : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
              >
                <button
                  onClick={() => setOpenIndex(index === openIndex ? null : index)}
                  className="w-full p-8 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${index === openIndex ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                      <HelpCircle className="h-6 w-6" />
                    </div>
                    <span className={`text-xl font-bold transition-colors duration-500 ${index === openIndex ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                      }`}>
                      {item.question}
                    </span>
                  </div>
                  <div className={`transition-transform duration-500 ${index === openIndex ? 'rotate-180 text-primary' : 'text-slate-400'}`}>
                    <ChevronDown className="h-6 w-6" />
                  </div>
                </button>

                <AnimatePresence>
                  {index === openIndex && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-8 pt-2 ml-[4.5rem] max-w-3xl">
                        <div className="h-px bg-slate-100 dark:bg-slate-800 mb-6 w-full opacity-50"></div>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFaq.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-slate-100/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-700"
            >
              <Search className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
              <p className="text-xl text-slate-500 dark:text-slate-400 font-bold">
                {t('noResults')}
              </p>
            </motion.div>
          )}
        </div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 p-12 rounded-[3rem] bg-gradient-to-br from-primary to-blue-700 text-white text-center relative overflow-hidden shadow-2xl group"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4">Still need help?</h3>
            <p className="text-white/80 font-medium mb-8 max-w-md mx-auto">
              Our support team is available 24/7 to help you with any questions or issues.
            </p>
            <button className="bg-white text-primary px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}