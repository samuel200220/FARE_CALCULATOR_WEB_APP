'use client';

import React from "react";
import { Crown } from "lucide-react";
import { FaGlobe } from "react-icons/fa";
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

const Header = () => {
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth(); // ✅ Récupère l'utilisateur connecté

  const changeLocale = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  const firstLetter = user?.nom?.[0] || user?.email?.[0] || "U";

  return (
    <header className="sticky top-0 z-[100] h-16 md:h-20 flex items-center justify-between px-4 lg:px-6 bg-gradient-to-r from-blue-700 to-violet-700 dark:from-[#0D1B2A] dark:to-gray-900 w-full shadow-lg">
      {/* Logo / Titre */}
      <div className="flex items-center gap-4">
        <Sidebar2 />
        <Link
          href="/"
          className="font-bold text-white items-center text-xl md:text-2xl lg:text-3xl flex gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">{t("title")}</div>
            <div className="sm:hidden flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
        </Link>
      </div>

      {/* Actions - Desktop */}
      <div className="hidden lg:flex items-center gap-6">
        <Link
          href="/aide1"
          className="text-white font-medium text-[16px] hover:text-yellow-300 transition-colors relative group"
        >
          {t("help")}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>

      {/* Actions - Mobile & Desktop */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Avatar utilisateur connecté */}
        {user && (
          <div className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
            {firstLetter.toUpperCase()}
          </div>
        )}

        {/* Menu Langues */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <FaGlobe className="mr-1 md:mr-2 w-4 h-4" />
              <span className="hidden sm:inline">{t("language_switch")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            <DropdownMenuItem
              onClick={() => changeLocale("fr")}
              className="cursor-pointer hover:bg-blue-50"
            >
              🇫🇷 {t("french")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLocale("en")}
              className="cursor-pointer hover:bg-blue-50"
            >
              🇬🇧 {t("english")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLocale("de")}
              className="cursor-pointer hover:bg-blue-50"
            >
              🇩🇪 {t("german")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark / Light mode - Desktop */}
        <div className="hidden md:flex">
          <ModeToggle />
        </div>

        {/* Connexion */}
        {!user && (
          <Link href="/connexion1">
            <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-lg px-4 py-2">
              <span className="hidden sm:inline">{t("sign_in")}</span>
              <span className="sm:hidden">🔑</span>
            </Button>
          </Link>
        )}

        {/* Dark / Light mode - Mobile */}
        <div className="md:hidden">
          <ModeToggle />
        </div>
        <Link href="/connexion1">
                  <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-yellow-300/50 transition-all">
                    <span className="hidden sm:inline">{t("logout")}</span>
                    <span className="sm:hidden">🚪</span>
                  </Button>
                </Link>
      </div>
    </header>
  );
};

export default Header;
