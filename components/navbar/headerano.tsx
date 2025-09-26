"use client";

import React from "react";
//import { Crown } from "lucide-react";
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
//import SidebarToggle from "../sidebar1";
import { useTranslations } from "next-intl";
//import { useRouter, usePathname } from "next/navigation";
import Sidebar2 from "../sidebar2";

const Headerano = () => {
  const a = useTranslations('titreano');
  const t = useTranslations("headerPro");
  //const router = useRouter();
  //const pathname = usePathname();

  // const changeLanguage = (locale: string) => {
  //   const segments = pathname.split("/");
  //   segments[1] = locale;
  //   router.push(segments.join("/") as any);
  // };
  const changeLocale = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload(); // recharge pour appliquer la langue
  };

  return (
    <header className="sticky top-0 z-[100] h-20 flex items-center justify-between px-0 lg:px-4 md:px-4 sm:px-4 py-4 bg-blue-700 w-full dark:bg-[#0D1B2A]">
      {/* Logo / Titre */}
      <nav className="flex items-center gap-6">
        <Sidebar2 />
        <Link
          href="#"
          scroll={true}
          className="font-bold text-white items-center text-xl lg:text-3xl sm:text-3xl md:text-3xl ml-11 flex gap-2"
        >
          Fare Calculator
          {/* <Crown className="w-6 h-6 text-yellow-400" /> */}
        </Link>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4 dark:flex dark:items-center dark:gap-4">
        <Link
          href="/aide1"
          className="hidden lg:flex text-white text-sm font-medium text-[18px] hover:text-violet-800"
        >
          {t("help")}
        </Link>

        {/* <Navigation /> */}

        {/* Menu Langues */}
        <DropdownMenu>
          <DropdownMenuTrigger id="lang-switcher-trigger" asChild>
            <Button className="bg-transparent border-none shadow-none text-white hover:text-violet-800 hover:bg-transparent">
              <FaGlobe className="mr-2" />
              {t("language_switch")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeLocale("fr")}>
              {t("french")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLocale("en")}>
              {t("english")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLocale("de")}>
              {t("german")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href={"/inscription1"} className='hidden lg:flex'>
                <Button className='cursor-pointer bg-violet-800 dark:bg-violet-900 hover:bg-violet-800 dark:hover:bg-violet-900 text-[18px] text-white transform transition-transform duration-300 ease-in-out hover:scale-105'>{a("signup")}</Button>
                </Link>
                <Link href={"/connexion1"} >
                <Button className='cursor-pointer mr-2 bg-violet-800 dark:bg-violet-900 hover:bg-violet-800 dark:hover:bg-violet-900 transform transition-transform duration-300 ease-in-out hover:scale-105 lg:text-[18px] md:text-[18px] sm:text-[18px] text-[16px] text-white'>{a("login")}</Button>
                </Link>
        {/* Déconnexion */}

        {/* Dark / Light mode */}
        <div className="hidden sm:flex">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};


export default Headerano;
