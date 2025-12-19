'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Menu, Home, User, Settings, LogOut,
  HelpCircle, LayoutDashboard, History, Crown, PartyPopper, X
} from 'lucide-react';
import { ModeToggle } from './ui/mode-toggle';
import { useTranslations } from 'next-intl';

export default function SidebarToggle() {
  const t = useTranslations('sidebarPro');
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fermer la sidebar en cliquant en dehors ou avec ESC
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
      document.body.style.overflow = 'hidden'; // Empêche le défilement
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Animation d'entrée pour les éléments
  const navItems = [
    { href: "/", icon: <PartyPopper />, label: t('welcome') },
    { href: "/versionpro", icon: <Home />, label: t('home') },
    { href: "/profil1", icon: <User />, label: t('profile') },
    { href: "/parametres", icon: <Settings />, label: t('settings') },
    { href: "/statistiques", icon: <LayoutDashboard />, label: t('dashboard') },
    { href: "/historique", icon: <History />, label: t('history') },
    { href: "/aide1", icon: <HelpCircle />, label: t('help') },
    { href: "/connexionpro", icon: <LogOut />, label: t('logout') },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Bouton d'ouverture */}
      <button
        className="flex items-center justify-center w-10 h-10 bg-violet-700 hover:bg-violet-600 dark:bg-violet-800 dark:hover:bg-violet-700 text-white rounded-md shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl z-50 transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
                {t('brand')}
              </h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          {/* <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('navigation')}
          </p> */}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
          {navItems.map((item, index) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              delay={index * 50}
              isOpen={isOpen}
            />
          ))}
        </nav>

        {/* Pied de page */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <ModeToggle />
              </div>
              <div>
                <h5 className="font-medium text-gray-800 dark:text-gray-200">{t('theme')}</h5>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">{t('theme_desc')}</p> */}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItem({ 
  icon, 
  label, 
  href, 
  delay = 0,
  isOpen 
}: { 
  icon: JSX.Element; 
  label: string; 
  href: string;
  delay?: number;
  isOpen: boolean;
}) {
  return (
    <Link 
      href={href as unknown as Parameters<typeof Link>[0]['href']}
      className="block"
    >
      <div 
        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-violet-50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 hover:translate-x-2 hover:shadow-md group"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
          transition: `all 0.3s ease-out ${delay}ms`
        }}
      >
        <div className="p-2 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-gray-700 dark:to-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <div className="text-blue-600 dark:text-blue-300">
            {icon}
          </div>
        </div>
        <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
          {label}
        </span>
      </div>
    </Link>
  );
}