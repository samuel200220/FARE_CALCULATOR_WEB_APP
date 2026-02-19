'use client';

import React, { useState, useEffect } from "react";
import { Crown, Globe, LogOut, HelpCircle, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import Sidebar2 from "../sidebar2";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const { user, entreprise, logout } = useAuth();
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

  const displayUser = user || entreprise;
  const firstLetter = displayUser?.nom?.[0] || displayUser?.email?.[0] || "U";

  return (
    <header className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isScrolled
      ? "h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-lg shadow-slate-900/5"
      : "h-20 bg-white dark:bg-slate-950 border-b border-transparent"
      }`}>
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">

        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Sidebar2 />
            <Link href="/" className="group flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105
                ${entreprise
                  ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-amber-500/20'
                  : (user
                    ? 'bg-slate-950 dark:bg-slate-900 shadow-slate-900/20'
                    : 'bg-blue-600 dark:bg-blue-800 shadow-blue-500/20'
                  )}
              `}>
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="hidden sm:block font-black text-2xl tracking-tight text-slate-900 dark:text-white">
                Farcal<span className="text-primary">.</span>
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/aide1"
              className="text-slate-600 dark:text-slate-400 font-bold hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              <HelpCircle className="w-4 h-4" />
              {t("help")}
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* User Info (Desktop) */}
          {displayUser && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm">
                {firstLetter.toUpperCase()}
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {displayUser.nom || displayUser.email?.split('@')[0]}
              </span>
            </div>
          )}

          {/* Language Switch */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-transparent transition-all"
              >
                <Globe className="w-4 h-4 mr-2 text-primary" />
                <span className="hidden sm:inline font-bold">{t("language_switch")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px] p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-2xl">
              {[
                { code: "fr", label: t("french"), flag: "🇫🇷" },
                { code: "en", label: t("english"), flag: "🇬🇧" },
                { code: "de", label: t("german"), flag: "🇩🇪" }
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

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            {!user && !entreprise ? (
              <Link href="/connexion1">
                <Button className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                  <User className="w-4 h-4 mr-2 md:hidden" />
                  <span className="hidden md:inline">{t("sign_in")}</span>
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                onClick={logout}
                className="h-10 px-4 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold group"
              >
                <LogOut className="w-5 h-5 md:mr-2 group-hover:translate-x-1 transition-transform" />
                <span className="hidden md:inline">{t("logout")}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
