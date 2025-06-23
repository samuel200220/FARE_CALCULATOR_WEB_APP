'use client';

import Link from 'next/link';
import { Calculator, History, MapPin } from 'lucide-react';
import SidebarToggle from '@/components/sidebar1';

export default function HomePage() {
  const features = [
    {
      icon: <Calculator className="w-8 h-8 text-blue-700" />,
      title: 'Calculer un tarif',
      description: 'Estimez le coût de votre trajet en quelques secondes.',
      link: '/calculateur',
    },
    {
      icon: <History className="w-8 h-8 text-green-600" />,
      title: 'Historique des trajets',
      description: 'Consultez et gérez tous vos trajets précédents.',
      link: '/historique',
    },
    {
      icon: <MapPin className="w-8 h-8 text-pink-600" />,
      title: 'Réserver un taxi',
      description: 'Réservez un taxi pour un déplacement immédiat ou futur.',
      link: '/reserver',
    },
  ];

  return (
    <div className="min-h-screen bg-fixed bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20 text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur Fare Calculator</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Votre solution rapide et fiable pour estimer le tarif de vos trajets en toute simplicité.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
      {/* Toujours visibles, en ligne même sur petits écrans */}
      <Link
        href="/accueilano"
        className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition"
      >
        Commencer gratuitement
      </Link>

      <Link
        href="/inscription1"
        className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition"
      >
        Version Simple
      </Link>

      <Link
        href="/inscriptionpro"
        className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition"
      >
        Version Pro
      </Link>
    </div>
      </section>

      {/* Fonctionnalités */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-blue-700">Fonctionnalités principales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition transform hover:scale-[1.02]">
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-center">{feature.title}</h3>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="text-center py-12 px-4">
        <h2 className="text-xl font-bold mb-4">Besoin d’aide ?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Consultez notre centre d’assistance pour trouver des réponses à vos questions.
        </p>
        <Link
          href="/aide1"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          Accéder à l’aide
        </Link>
      </section> */}
    </div>
  );
}
