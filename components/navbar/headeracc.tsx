"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Crown, LogIn, UserPlus, LogOut, HelpCircle } from 'lucide-react';
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
import Sidebar from '../sidebar';
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Headeracc = () => {
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLocale = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <header className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isScrolled
      ? "h-16 bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/5"
      : "h-20 bg-background border-b border-transparent"
      }`}>
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">

        {/* Left: Logo & Sidebar */}
        <div className="flex items-center gap-4">
          <Sidebar />
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:block font-black text-2xl tracking-tight text-slate-900 dark:text-white">
              Farcal<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/aide1"
            className="text-slate-600 dark:text-slate-400 font-bold hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-wider"
          >
            <HelpCircle className="w-4 h-4" />
            {t('help')}
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* Language Switch */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-transparent transition-all"
              >
                <Globe className="w-4 h-4 mr-2 text-primary" />
                <span className="hidden sm:inline font-bold">{t('language_switch')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px] p-2 rounded-2xl bg-card/95 backdrop-blur-xl border-border shadow-2xl">
              {[
                { code: "fr", label: t('french'), flag: "🇫🇷" },
                { code: "en", label: t('english'), flag: "🇬🇧" },
                { code: "de", label: t('german'), flag: "🇩🇪" }
              ].map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLocale(lang.code)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors font-bold"
                >
                  <span className="text-lg">{lang.flag}</span>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/inscription1">
              <Button variant="ghost" className="h-10 px-5 rounded-xl text-primary font-bold hover:bg-primary/5 transition-all">
                {t('sign_up')}
              </Button>
            </Link>
            <Link href="/connexion1">
              <Button className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                {t('sign_in')}
              </Button>
            </Link>
          </div>

          {/* Mobile Auth Icons */}
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/connexion1">
              <Button size="icon" className="h-10 w-10 bg-primary text-white rounded-xl shadow-lg">
                <LogIn className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/inscription1">
              <Button size="icon" variant="outline" className="h-10 w-10 border-primary text-primary rounded-xl">
                <UserPlus className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Headeracc;