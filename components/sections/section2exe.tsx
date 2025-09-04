'use client';

import Link from 'next/link';
import { Calculator, History, BarChart3 } from 'lucide-react';

const services = [
  {
    icon: <Calculator className="w-10 h-10 text-blue-600 mb-3" />,
    title: 'Calculer un Tarif',
    description:
      'Estimez rapidement le coût de votre trajet selon la distance, la ville, et votre type de compte.',
    link: '/calculate',
  },
  {
    icon: <History className="w-10 h-10 text-green-600 mb-3" />,
    title: 'Historique de Trajets',
    description:
      'Consultez et gérez vos précédents calculs. Accès réservé aux utilisateurs enregistrés.',
    link: '/historique',
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-purple-600 mb-3" />,
    title: 'Analyse des Coûts',
    description:
      'Visualisez des statistiques clés sur les trajets, les distances, et les coûts moyens.',
    link: '/stats',
  },
];

const Section2 = () => {
  return (
    <section
      id="services"
      className="bg-white dark:bg-[#0D1B2A] pt-10 pb-20 mt-20 px-4 sm:px-6 lg:px-8"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-blue-700 dark:text-white mb-12">
        Nos Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <Link href={service.link as any} legacyBehavior key={index}>
            <a>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl border shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  {service.icon}
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Section2;
