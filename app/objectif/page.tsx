'use client';

import { MapPinned } from 'lucide-react';

export default function About() {
  return (
    <div className="h-screen bg-[#0D1B2A] dark:bg-[#0D1B2A] text-white">
      {/* En-tête */}
      <section className="bg-blue-900 text-white py-16 px-6 text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <MapPinned className="w-10 h-10 text-yellow-400" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            À propos de Fare Calculator
          </h1>
        </div>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl font-medium">
          Chez Fare Calculator, nous ne faisons pas que calculer des tarifs. 
          Nous aidons à optimiser les trajets, rendre la mobilité plus accessible 
          et améliorer l’expérience de transport pour tous.
        </p>
      </section>

      {/* Notre Mission */}
      <section className="bg-[#fefae0] dark:bg-gray-900 text-gray-800 dark:text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-yellow-400">
            Notre Mission
          </h2>
          <p className="text-lg leading-relaxed">
            Notre mission est de simplifier le calcul des tarifs pour tous types 
            d’utilisateurs : anonymes, inscrits, ou professionnels. En fournissant une 
            estimation juste, rapide et intelligente, Fare Calculator contribue à une 
            mobilité urbaine plus fluide, plus économique et plus responsable.
          </p>
        </div>
      </section>
    </div>
  );
}
