'use client';

import { Eye } from 'lucide-react';

export default function Vision() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] dark:bg-[#0D1B2A] text-white">
      {/* En-tête */}
      <section className="bg-blue-900 text-white py-16 px-6 text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Eye className="w-10 h-10 text-blue-300" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Notre Vision
          </h1>
        </div>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl font-medium">
          Construire un futur où chaque trajet est prévisible, juste et connecté, grâce à l'innovation.
        </p>
      </section>

      {/* Contenu */}
      <section className="bg-[#fefae0] dark:bg-gray-900 text-gray-800 dark:text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-yellow-400">
            Une vision d’équité et de technologie
          </h2>
          <p className="text-lg leading-relaxed">
            Notre vision est de rendre le transport urbain intelligent, transparent et équitable. 
            Grâce à Fare Calculator, nous rêvons d’un monde où chaque utilisateur peut prendre 
            des décisions éclairées, planifier ses trajets en toute confiance, et éviter les abus tarifaires.
            <br /><br />
            Nous voulons devenir une référence en matière d’estimation tarifaire automatisée, 
            intégrée à des plateformes locales et internationales. Une solution au service de la mobilité durable, 
            inclusive, et propulsée par la donnée.
          </p>
        </div>
      </section>
    </div>
  );
}
