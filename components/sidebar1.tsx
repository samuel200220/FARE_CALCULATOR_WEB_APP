'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Menu, Home, User, Settings, LogOut,
  HelpCircle, LayoutDashboard, History, Crown,PartyPopper
} from 'lucide-react';

export default function SidebarToggle() {
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
        <div className="p-5 text-2xl font-bold text-blue-700 text-center border-b border-gray-300 dark:border-gray-700 flex items-center gap-2">
          Fare Calculator
          <Crown className="w-6 h-6 text-yellow-500" />
        </div>
        <nav className="p-4 space-y-4 text-gray-700 dark:text-gray-200">
          <NavItem href="/" icon={<PartyPopper />} label="Bienvenue" />
          <NavItem href="/versionpro" icon={<Home />} label="Accueil" />
          <NavItem href="/profil1" icon={<User />} label="Profil" />
          <NavItem href="/parametres" icon={<Settings />} label="Paramètres" />
          <NavItem href="/statistiques" icon={<LayoutDashboard />} label="Tableau de Bord" />
          <NavItem href="/historique" icon={<History />} label="Historique" />
          <NavItem href="/aide1" icon={<HelpCircle />} label="Aide" />
          <NavItem href="/connexionpro" icon={<LogOut />} label="Déconnexion" />
        </nav>
      </aside>

      {/* Bouton d'ouverture */}
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-blue-700 dark:bg-gray-500 text-white rounded-md shadow hover:bg-blue-800"
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
    <Link href={href}>
      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}
