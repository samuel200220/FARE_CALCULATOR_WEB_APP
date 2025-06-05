'use client';

import { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { ModeToggle } from './ui/mode-toggle';
import { useTheme } from 'next-themes';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Écouteur global pour fermer si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 mt-4 text-xl rounded bg-transparent shadow"
      >
        {isOpen ? <FaTimes className='text-white' /> : <FaBars className='text-white' />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 z-10 dark:bg-gray-800 bg-blue-600 text-white p-6 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className="space-y-4 mt-20">
          <li><a href="/" className=" hover:text-blue-300">Accueil</a></li>
          <li><a href="#" className="hover:text-blue-300">Profil</a></li>
          <li><a href="#" className="hover:text-blue-300">Paramètres</a></li>
          <li><a href="/connexion1" className="hover:text-blue-300">Déconnexion</a></li>
        </ul>

        {mounted && (
          <div className="mt-6 flex items-center gap-2">
            <span>{resolvedTheme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
            <ModeToggle />
          </div>
        )}
      </div>
    </>
  );
}
