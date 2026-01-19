'use client';

import React from "react";
import { Crown } from "lucide-react";
import { FaGlobe } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import SidebarToggle from "../sidebar1";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useEntreprise } from '@/hooks/useEntreprise';

const Headerpro = () => {
  const t = useTranslations("headerPro");
  const router = useRouter();
  const pathname = usePathname();
  const { entreprise } = useEntreprise();

  // ✅ Calcul des initiales sûr
  const initials = getInitials(entreprise?.nom);

  const changeLocale = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <header className="sticky top-0 z-[100] h-16 md:h-20 flex items-center justify-between px-4 lg:px-6 bg-gradient-to-r from-blue-700 to-violet-700 dark:from-[#0D1B2A] dark:to-gray-900 w-full shadow-lg">
      
      <div className="flex items-center gap-4">
        <SidebarToggle />
        <Link href="/" className="font-bold text-white items-center text-xl md:text-2xl lg:text-3xl flex gap-2 hover:opacity-90 transition-opacity">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              {t("title")}
              <Crown className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 animate-pulse" />
            </div>
            <div className="sm:hidden flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
              <FaGlobe className="mr-1 md:mr-2 w-4 h-4" />
              <span className="hidden sm:inline">{t("language_switch")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            <DropdownMenuItem onClick={() => changeLocale("fr")}>🇫🇷 {t("french")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLocale("en")}>🇬🇧 {t("english")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLocale("de")}>🇩🇪 {t("german")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 text-black font-bold text-xs">
            {initials}
          </div>
          <span className="text-sm text-white font-medium truncate max-w-[120px]">
            {entreprise?.nom ?? 'Entreprise'}
          </span>
        </div>

        <Link href="/connexionpro">
          <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-yellow-300/50 transition-all">
            <span className="hidden sm:inline">{t("logout")}</span>
            <span className="sm:hidden">🚪</span>
          </Button>
        </Link>

        <div className="md:hidden">
          <ModeToggle />
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