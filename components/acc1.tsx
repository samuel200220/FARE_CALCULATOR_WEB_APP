"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { FaMoon, FaSun, FaCalculator, FaArrowRight } from "react-icons/fa";
import Header from "@/components/navbar/header";

export default function HomePage() {
  const { theme, setTheme } = useTheme();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      {/* <nav className="w-full flex justify-between items-center p-4 bg-white dark:bg-[#0D1B2A] shadow-lg">
        <div className="text-2xl font-bold text-blue-700 dark:text-white">FareGo</div>
        <div className="flex items-center gap-6 text-black dark:text-white">
          <Link href="/">Accueil</Link>
          <Link href="/calculateur">Calculateur</Link>
          <Link href="/about">À propos</Link>
          <Link href="/signin" className="hover:underline">Connexion</Link>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </Button>
        </div>
      </nav> */}
      <Header/>

      {/* Hero Section */}
      <section className="relative w-full flex flex-col lg:flex-row items-center justify-between px-8 py-20 bg-gradient-to-br from-white dark:from-[#0D1B2A] to-white dark:to-[#13293D] overflow-hidden">
        {/* Text content */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Estimez vos <span className="text-blue-600">Tarifs de Trajets</span> <br /> en quelques clics.
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Comparez vos coûts estimés avec les tarifs officiels des taxis au Cameroun. Simple, rapide, et accessible.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/accueilano">
              <Button className="text-lg bg-blue-700 hover:bg-violet-800 dark:bg-blue-600 dark:hover:bg-violet-900 px-6 py-4 shadow-lg">
                <FaCalculator className="mr-2" />
                Lancer une estimation
              </Button>
            </Link>
            <Link href="/download">
              <Button variant="outline" className="text-lg px-6 py-4 dark:text-white">
                Télécharger l&apos;app
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <img
            src="/acc.jpg"
            alt="Taxi Cameroun"
            className="w-full rounded-3xl shadow-xl object-cover"
          />
        </div>
      </section>

      {/* Footer simple */}
      <footer className="w-full text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
        © 2025 FareGo - Tous droits réservés
      </footer>
    </main>
  );
}
