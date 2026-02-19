"use client";

import React, { useState, useEffect } from "react";
import { Globe, Crown, LogIn, UserPlus, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../sidebar";
import { motion } from "framer-motion";

const Headerano = () => {
  const a = useTranslations('titreano');
  const t = useTranslations("headerPro");
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
    <header className={`
        fixed top-0 left-0 right-0 z-[100] transition-all duration-300
        flex items-center justify-between
        ${scrolled
        ? 'h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-lg'
        : 'h-20 bg-transparent'}
    `}>
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        {/* Logo / Title */}
        <div className="flex items-center gap-4">
          <Sidebar />
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <span className={`hidden sm:block font-black text-2xl tracking-tight transition-colors ${scrolled ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white"
              }`}>
              Farcal<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <nav className="hidden lg:flex items-center gap-8 mr-4">
            <Link
              href="/aide1"
              className="text-slate-600 dark:text-slate-400 font-bold hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              <HelpCircle className="w-4 h-4" />
              {t("help")}
            </Link>
          </nav>

          {/* Language Switch */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-10 px-4 rounded-xl border border-transparent transition-all ${scrolled
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  : "bg-white/10 dark:bg-slate-900/10 backdrop-blur-md text-slate-800 dark:text-white"
                  }`}
              >
                <Globe className="w-4 h-4 mr-2 text-primary" />
                <span className="hidden sm:inline font-bold">{t("language_switch")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px] p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-2xl">
              <DropdownMenuItem onClick={() => changeLocale("fr")} className="p-3 rounded-xl cursor-pointer hover:bg-primary/10 font-bold">🇫🇷 {t("french")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale("en")} className="p-3 rounded-xl cursor-pointer hover:bg-primary/10 font-bold">🇬🇧 {t("english")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale("de")} className="p-3 rounded-xl cursor-pointer hover:bg-primary/10 font-bold">🇩🇪 {t("german")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/connexion1">
              <Button variant="ghost" className="h-10 px-5 rounded-xl text-primary font-bold hover:bg-primary/5 transition-all">
                {a("login")}
              </Button>
            </Link>
            <Link href="/inscription1">
              <Button className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                {a("signup")}
              </Button>
            </Link>
          </div>

          {/* Mobile Auth Icons */}
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/connexion1">
              <Button size="icon" className="h-10 w-10 bg-primary text-white rounded-xl shadow-lg">
                <LogIn className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/inscription1">
              <Button size="icon" variant="outline" className="h-10 w-10 border-primary text-primary rounded-xl">
                <UserPlus className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Headerano;
