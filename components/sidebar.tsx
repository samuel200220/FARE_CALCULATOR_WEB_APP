'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Menu, HelpCircle, PartyPopper, X, ChevronRight, Crown
} from 'lucide-react';
import { ModeToggle } from './ui/mode-toggle';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function Sidebar() {
  const t = useTranslations('sidebarPro');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { href: "/", icon: <PartyPopper className="w-5 h-5" />, label: t('welcome') },
    { href: "/aide1", icon: <HelpCircle className="w-5 h-5" />, label: t('help') },
  ];

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-800 text-white shadow-lg shadow-blue-500/20 transition-all"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9998]"
                onClick={() => setIsOpen(false)}
              />

              {/* Sidebar Body */}
              <motion.aside
                ref={sidebarRef}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-950 shadow-2xl z-[9999] overflow-hidden flex flex-col"
              >
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

                {/* Header */}
                <div className="relative p-8 border-b border-slate-100 dark:border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 dark:bg-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Farcal<span className="text-primary">.</span>
                      </h1>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Navigation</p>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-6 space-y-3 overflow-y-auto relative z-10">
                  {navItems.map((item, index) => (
                    <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                      <motion.div
                        whileHover={{ x: 8 }}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-primary/5 dark:hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors flex-1">
                          {item.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                      </motion.div>
                    </Link>
                  ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-8 border-t border-slate-100 dark:border-white/5 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <ModeToggle />
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Mode {t('theme')}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Version 2.1.0</p>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}