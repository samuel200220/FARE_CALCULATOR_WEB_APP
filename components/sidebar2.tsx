'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  HelpCircle, PartyPopper
} from 'lucide-react';
import { ModeToggle } from './ui/mode-toggle';
import { useTranslations } from 'next-intl';

export default function Sidebar2() {
  const t = useTranslations('sidebar');
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fermer la sidebar en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative w-10 h-10 flex bg-blue-700 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        <div className="p-5 text-2xl font-bold text-blue-700 border-b border-gray-300 dark:border-gray-700">
          {t('brand')}
        </div>
        <nav className="p-4 space-y-4 text-gray-700 dark:text-gray-200">
          <NavItem href="/" icon={<PartyPopper />} label={t('welcome')} />
          <NavItem href="/aide1" icon={<HelpCircle />} label={t('help')} />
          <div className="flex flex-row space-x-2">
            <ModeToggle />
            <h5>{t('theme')}</h5>
          </div>
        </nav>
      </aside>

      {/* Bouton d'ouverture */}
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-violet-800 dark:bg-violet-800 text-white rounded-md shadow"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </button>
    </div>
  );
}

// Composant NavItem avec lien
function NavItem({ icon, label, href }: { icon: JSX.Element; label: string; href: string }) {
  return (
    <Link href={href as any}>
      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}
