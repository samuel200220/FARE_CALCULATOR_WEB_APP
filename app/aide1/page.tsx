'use client';

import { useState, useRef, useEffect, JSX } from 'react';
import SidebarToggle from '@/components/sidebar1';
import { Compass, Settings2, Clock3, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState<null | {
    title: string;
    icon: JSX.Element;
    articles: number;
    content: JSX.Element;
  }>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Fermer modal si clic à l'extérieur
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectedCategory &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelectedCategory(null);
      }
    };

    if (selectedCategory) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [selectedCategory]);

  const categories = [
    {
      icon: <Compass className="w-10 h-10 text-pink-600" />,
      title: 'Commencer avec Fare Calculator',
      articles: 7,
      content: (
        <div className="relative w-full h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      {/* Contenu de l'article */}
      <div className="relative w-full h-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">

        <p className="mb-4">
          Bienvenue sur Fare Calculator ! Cette application vous permet d'estimer rapidement les tarifs de vos trajets selon la distance, l'heure et d'autres paramètres.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Étape 1 : Remplir les champs de départ et destination</h2>
        <p className="mb-4">
          Entrez l'adresse de départ et de destination. Des suggestions automatiques vous aideront à compléter les champs.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Étape 2 : Choisir une heure</h2>
        <p className="mb-4">
          Vous pouvez sélectionner l'heure souhaitée pour obtenir une estimation plus précise.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Étape 3 : Cliquer sur "Calculer tarif"</h2>
        <p className="mb-4">
          Cliquez sur le bouton, et Fare Calculator affichera le coût estimé du trajet.
        </p>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Dernière mise à jour : 18 juin 2025
        </p>
      </div>
    </div>
      ),
    },
    {
      icon: <Settings2 className="w-10 h-10 text-green-600" />,
      title: 'Gérer vos paramètres',
      articles: 5,
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Paramétrage</h3>
          <p>Modifiez vos données personnelles, votre mot de passe ou préférences de notification.</p>
        </div>
      ),
    },
    {
      icon: <Clock3 className="w-10 h-10 text-cyan-600" />,
      title: 'Historique des trajets',
      articles: 9,
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Vos trajets passés</h3>
          <p>Consultez l’historique complet de vos déplacements et exportez les données si nécessaire.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Section bleu */}
      <div className="bg-blue-700 py-20 text-center text-white relative overflow-hidden">
      <SidebarToggle />
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Comment pouvons-nous vous aider ?</h1>
        <div className="max-w-xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Entrez votre question ici..."
            className="flex-1 h-12 px-4 rounded-md text-black outline-none w-full"
          />
          <button className="bg-pink-500 hover:bg-pink-600 transition text-white px-5 py-2 rounded-md">
            Rechercher
          </button>
        </div>
      </div>

      {/* Cartes des catégories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto py-12 px-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(cat)}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <div className="flex justify-center mb-4">{cat.icon}</div>
            <h2 className="text-lg font-semibold text-center">{cat.title}</h2>
            <p className="text-sm text-center text-blue-600 mt-1">{cat.articles} article(s)</p>
          </div>
        ))}
      </div>

      {/* Bouton de contact */}
      <div className="text-center mb-10">
        <button className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition">
          Nous contacter
        </button>
      </div>

      {/* Modal personnalisé */}
      {selectedCategory && (
        <div className="w-full h-full p-6 fixed inset-0 z-50 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-white w-full h-full dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
              onClick={() => setSelectedCategory(null)}
            >
              <X />
            </button>
            <div className="mb-4 flex justify-center">{selectedCategory.icon}</div>
            <h2 className="text-xl font-bold mb-2">{selectedCategory.title}</h2>
            <div className="relative w-full h-full mb-6 text-sm text-gray-700 dark:text-gray-300">
              {selectedCategory.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
