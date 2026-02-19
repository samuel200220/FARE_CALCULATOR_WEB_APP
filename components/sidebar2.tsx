'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Menu, Home, User, LogOut,
  HelpCircle, History, X, PartyPopper, ChevronRight, Crown
} from 'lucide-react';
import { ModeToggle } from './ui/mode-toggle';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

type NavItemType = {
  href: string;
  icon: JSX.Element;
  label: string;
  requiresAuth?: boolean;
  isLogout?: boolean;
};

export default function Sidebar2() {
  const t = useTranslations('sidebarPro');
  const router = useRouter();

  const { user, setUser, loading } = useAuth();
  const isAuthenticated = !!user;
  const userName = user?.nom || user?.email?.split('@')[0] || 'Utilisateur';

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

  const handleLogout = () => {
    setUser(null);
    setIsOpen(false);
    router.push('/connexion1');
  };

  const navItems: NavItemType[] = [
    { href: '/', icon: <PartyPopper className="w-5 h-5" />, label: t('welcome') },
    { href: '/accueil', icon: <Home className="w-5 h-5" />, label: t('home'), requiresAuth: true },
    { href: '/profil1', icon: <User className="w-5 h-5" />, label: t('profile'), requiresAuth: true },
    { href: '/historique_stand', icon: <History className="w-5 h-5" />, label: t('history'), requiresAuth: true },
    { href: '/aide1', icon: <HelpCircle className="w-5 h-5" />, label: t('help') },
    { href: '#', icon: <LogOut className="w-5 h-5" />, label: t('logout'), requiresAuth: true, isLogout: true },
  ];

  const visibleItems = navItems.filter(
    item => !item.requiresAuth || isAuthenticated
  );

  if (loading) return null;

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 dark:bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition-all border border-slate-800"
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
                      <div className="w-10 h-10 bg-slate-950 dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20 border border-slate-800">
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

                  {/* Account Summary */}
                  {isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5"
                    >
                      <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
                        {userName[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                          {userName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Connecté</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Nav Sections */}
                <nav className="flex-1 p-6 space-y-2 overflow-y-auto relative z-10">
                  {visibleItems.map((item, index) => (
                    <Link key={item.href + item.label} href={item.href} onClick={item.isLogout ? handleLogout : () => setIsOpen(false)}>
                      <motion.div
                        whileHover={{ x: 8 }}
                        className={`group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${item.isLogout
                          ? "bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 border-transparent hover:border-red-200 text-red-600"
                          : "bg-slate-50 dark:bg-slate-900/50 hover:bg-primary/5 dark:hover:bg-primary/10 border-transparent hover:border-primary/20"
                          } border`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${item.isLogout
                          ? "bg-white dark:bg-red-900/30 text-red-500"
                          : "bg-white dark:bg-slate-800 text-primary"
                          }`}>
                          {item.icon}
                        </div>
                        <span className={`font-bold text-sm flex-1 ${item.isLogout
                          ? "text-red-600 dark:text-red-400"
                          : "text-slate-700 dark:text-slate-200 group-hover:text-primary"
                          }`}>
                          {item.label}
                        </span>
                        {!item.isLogout && (
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 dark:border-white/5 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <ModeToggle />
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{t('theme')}</span>
                    </div>
                  </div>
                  <div className="text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                    Version 2.1.0
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
