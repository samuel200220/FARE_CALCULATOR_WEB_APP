"use client";

import React from 'react';
import { FaGlobe, FaCrown } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '../ui/button';
import Link from 'next/link';
import { ModeToggle } from '../ui/mode-toggle';
import Sidebar2 from '../sidebar2';
import { useRouter, usePathname } from "next/navigation";
import Sidebar from '../sidebar';

const Headeracc = () => {
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const segments = pathname.split("/");
    segments[1] = locale;
    const newUrl = segments.join("/");
    router.push(newUrl);
  };

  return (
    <header className="sticky top-0 z-[100] h-16 md:h-20 flex items-center justify-between px-4 lg:px-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700 w-full shadow-sm">
      {/* Logo / Titre */}
      <div className="flex items-center gap-4">
        <Sidebar />
        <Link
          href="/"
          className="font-bold text-blue-800 dark:text-white items-center text-xl md:text-2xl lg:text-3xl flex gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              {t('title')}
            </div>
            <div className="sm:hidden flex items-center gap-2">
              <FaCrown className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </Link>
      </div>

      {/* Actions - Desktop */}
      <div className="hidden lg:flex items-center gap-6">
        <Link
          href="/aide1"
          className="text-blue-800 dark:text-gray-300 font-medium text-[16px] hover:text-violet-600 dark:hover:text-violet-400 transition-colors relative group"
        >
          {t('help')}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 dark:bg-violet-400 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>

      {/* Actions - Mobile & Desktop */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Menu Langues */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              size="sm"
              className="bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-blue-800 dark:text-gray-300 border border-blue-200 dark:border-gray-600"
            >
              <FaGlobe className="mr-1 md:mr-2 w-4 h-4" />
              <span className="hidden sm:inline">{t('language_switch')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px] bg-white dark:bg-gray-800">
            <DropdownMenuItem 
              onClick={() => changeLocale('en')}
              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              🇬🇧 {t('english')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => changeLocale('fr')}
              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              🇫🇷 {t('french')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => changeLocale('de')}
              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              🇩🇪 Deutsch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark / Light mode - Desktop */}
        <div className="hidden md:flex">
          <ModeToggle />
        </div>

        {/* Inscription */}
        <Link href="/inscription1" className="hidden sm:block">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white transform transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg px-4 py-2"
          >
            {t('sign_up')}
          </Button>
        </Link>

        {/* Connexion */}
        <Link href="/connexion1">
          <Button 
            className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 dark:from-violet-700 dark:to-violet-800 dark:hover:from-violet-800 dark:hover:to-violet-900 text-white transform transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg px-4 py-2"
          >
            <span className="hidden sm:inline">{t('sign_in')}</span>
            <span className="sm:hidden">🔑</span>
          </Button>
        </Link>

        {/* Inscription mobile */}
        <Link href="/inscription1" className="sm:hidden">
          <Button 
            size="sm"
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            +
          </Button>
        </Link>

        {/* Dark / Light mode - Mobile */}
        <div className="md:hidden">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Headeracc;