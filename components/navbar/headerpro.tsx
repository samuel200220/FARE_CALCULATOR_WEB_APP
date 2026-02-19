'use client';

import React, { useState, useEffect } from "react";
import { Crown, Globe, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import SidebarToggle from "../sidebar1";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useEntreprise } from '@/hooks/useEntreprise';

import { useAuth } from "@/context/AuthContext";

const Headerpro = () => {
  const t = useTranslations("headerPro");
  const router = useRouter();
  const pathname = usePathname();
  const { entreprise } = useEntreprise();
  const { logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initials = getInitials(entreprise?.nom);

  const changeLocale = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <header className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isScrolled
      ? "h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-lg"
      : "h-20 bg-white dark:bg-slate-950 border-b border-transparent"
      }`}>
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">

        {/* Left: Logo & Sidebar */}
        <div className="flex items-center gap-4">
          <SidebarToggle />
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:block font-black text-2xl tracking-tight text-slate-900 dark:text-white">
              Farcal<span className="text-primary text-xl tracking-widest ml-1 font-black uppercase">Pro</span>
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">

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
              <DropdownMenuItem onClick={() => changeLocale("fr")} className="p-3 rounded-xl cursor-pointer hover:bg-primary/10 font-bold">🇫🇷 {t("french")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale("en")} className="p-3 rounded-xl cursor-pointer hover:bg-primary/10 font-bold">🇬🇧 {t("english")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale("de")} className="p-3 rounded-xl cursor-pointer hover:bg-primary/10 font-bold">🇩🇪 {t("german")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          {/* Entreprise Profile (Desktop) */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5">
            <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-white font-black text-xs shadow-md">
              {initials}
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
              {entreprise?.nom ?? 'Entreprise'}
            </span>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            onClick={logout}
            className="h-10 px-4 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold group"
          >
            <LogOut className="w-5 h-5 md:mr-2 group-hover:translate-x-1 transition-transform" />
            <span className="hidden md:inline">{t("logout")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Headerpro;

function getInitials(name?: string) {
  if (!name) return "EN";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase();
}