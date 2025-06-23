'use client';

import { Lightbulb, Eye, Target } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Section4 = () => {
  const infos = [
    {
      title: 'Pourquoi',
      description:
        'Découvrez pourquoi notre entreprise est le choix idéal pour vos besoins de transport. Une équipe dédiée, un service client exceptionnel, et une expérience de voyage sans stress.',
      icon: <Lightbulb className="text-violet-500 w-10 h-10 mb-3" />,
      link: '/pourquoi',
    },
    {
      title: 'Vision',
      description:
        'Notre vision est de révolutionner le transport avec des solutions innovantes et durables. Un service fiable, écologique et accessible à tous.',
      icon: <Eye className="text-violet-500 w-10 h-10 mb-3" />,
      link: '/vision',
    },
    {
      title: 'Objectif',
      description:
        'Garantir la satisfaction de chaque client grâce à une ponctualité irréprochable et un professionnalisme constant. Étendre notre réseau tout en maintenant l’excellence.',
      icon: <Target className="text-violet-500 w-10 h-10 mb-3" />,
      link: '/objectif',
    },
  ];

  return (
    <section
      id="propos"
      className="bg-white dark:bg-[#0D1B2A] pt-20 pb-32 mt-20 px-4 sm:px-6 lg:px-8"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-blue-700 dark:text-white mb-16">
        À Propos de Nous
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {infos.map((info, index) => (
          <Link
            key={index}
            href={info.link}
            className="block"
          >
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl border shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer text-center h-full">
              <div className="flex flex-col items-center h-full">
                {info.icon}
                <h3 className="text-xl font-semibold text-violet-500 mb-3">
                  {info.title}
                </h3>
                <hr className="border-gray-300 dark:border-gray-600 w-16 mb-4" />
                <p className="text-sm text-gray-700 dark:text-gray-200">{info.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Section4;
