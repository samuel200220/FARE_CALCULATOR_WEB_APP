"use client";

import React, { useState, useEffect } from "react";
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
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../sidebar";

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
    window.location.reload();
    const segments = pathname.split("/");
    segments[1] = locale;
    const newUrl = segments.join("/");
    router.push(newUrl);
  };

  return (
    <header className={`
        fixed top-0 left-0 right-0 z-[100] h-20 px-4 transition-all duration-300
        flex items-center justify-between
        ${scrolled
        ? 'bg-white/80 dark:bg-[#0D1B2A]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 shadow-sm'
        : 'bg-transparent'}
    `}>
      {/* Logo / Titre */}
      <nav className="flex items-center gap-4">
        <Sidebar />
        <Link
          href="#"
          scroll={true}
          className={`font-bold text-xl lg:text-3xl ml-2 flex gap-2 transition-colors ${scrolled ? 'text-blue-900 dark:text-white' : 'text-blue-900 dark:text-white'}`}
        >
          Fare Calculator
        </Link>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/aide1"
          className={`hidden lg:flex text-sm font-medium hover:text-violet-600 transition-colors ${scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}
        >
          {t("help")}
        </Link>

        {/* Menu Langues */}
        <DropdownMenu>
          <DropdownMenuTrigger id="lang-switcher-trigger" asChild>
            <Button variant="ghost" className={`hover:bg-black/5 dark:hover:bg-white/10 ${scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
              <FaGlobe className="mr-2" />
              {t("language_switch")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/90 dark:bg-[#0D1B2A]/90 backdrop-blur-xl border-gray-200 dark:border-gray-800">
            <DropdownMenuItem onClick={() => changeLocale("fr")}>{t("french")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLocale("en")}>{t("english")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLocale("de")}>{t("german")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden lg:flex gap-3">
          <Link href={"/connexion1"}>
            <Button variant="ghost" className="text-gray-700 dark:text-white hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-white/5">
              {a("login")}
            </Button>
          </Link>
          <Link href={"/inscription1"}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
              {a("signup")}
            </Button>
          </Link>
        </div>

        {/* Dark / Light mode */}
        <div className="hidden sm:flex">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Headerano;
