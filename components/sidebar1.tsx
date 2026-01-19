'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Home,
  User,
  Settings,
  LogOut,
  HelpCircle,
  LayoutDashboard,
  History,
  Crown,
  PartyPopper,
  X,
} from 'lucide-react';
import { ModeToggle } from './ui/mode-toggle';
import { useTranslations } from 'next-intl';
import { useEntreprise } from '@/hooks/useEntreprise';

type NavItemType = {
  href: string;
  icon: JSX.Element;
  label: string;
  requiresAuth?: boolean;
  isLogout?: boolean;
};

export default function SidebarToggle() {
  const t = useTranslations('sidebarPro');
  const { entreprise } = useEntreprise();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  /* =======================
     Gestion fermeture sidebar
     ======================= */
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

  /* =======================
     Navigation
     ======================= */
  const navItems: NavItemType[] = [
    { href: '/', icon: <PartyPopper />, label: t('welcome') },
    { href: '/versionpro', icon: <Home />, label: t('home'), requiresAuth: true },
    { href: '/profil1', icon: <User />, label: t('profile'), requiresAuth: true },
    { href: '/statistiques', icon: <LayoutDashboard />, label: t('dashboard'), requiresAuth: true },
    { href: '/historique', icon: <History />, label: t('history'), requiresAuth: true },
    { href: '/parametres', icon: <Settings />, label: t('settings'), requiresAuth: true },
    { href: '/aide1', icon: <HelpCircle />, label: t('help') },
    { href: '/connexionpro', icon: <LogOut />, label: t('logout'), requiresAuth: true, isLogout: true },
  ];

  // Filtrer les items selon l'authentification
  const visibleItems = navItems.filter(
    item => !item.requiresAuth || entreprise
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bouton ouverture */}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-700 text-white shadow-lg transition hover:scale-105 hover:bg-violet-600 active:scale-95 dark:bg-violet-800"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl z-50 transform transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 p-2">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {t('brand')}
              </h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          {/* Info entreprise */}
          {entreprise && (
            <div className="mt-4 flex items-center gap-3 px-3 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-violet-600 dark:bg-violet-500 text-white rounded-full flex items-center justify-center font-semibold">
                {getInitials(entreprise.nom)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {entreprise.nom}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {entreprise.email || '—'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-220px)]">
          {visibleItems.map((item, index) => (
            <NavItem
              key={item.href + item.label}
              {...item}
              delay={index * 50}
              isOpen={isOpen}
              onClick={item.isLogout ? () => setIsOpen(false) : undefined}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
            <ModeToggle />
            <span className="text-sm text-gray-700 dark:text-gray-200">{t('theme')}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =======================
   Nav Item
   ======================= */
function NavItem({
  icon,
  label,
  href,
  delay = 0,
  isOpen,
  onClick
}: {
  icon: JSX.Element;
  label: string;
  href: string;
  delay?: number;
  isOpen: boolean;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
          transitionDelay: `${delay}ms`,
        }}
      >
        <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
      </div>
    </Link>
  );
}

function getInitials(name?: string) {
  if (!name) return 'EN';
  
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  
  if (words.length === 0) return 'EN';
  
  return words
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
}