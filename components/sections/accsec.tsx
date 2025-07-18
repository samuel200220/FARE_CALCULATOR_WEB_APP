'use client';

import Image from 'next/image';

export default function Accsec() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#0D1B2A] transition-colors duration-500">
      <div className="flex flex-col md:flex-row w-full max-w-7xl p-6">
        
        {/* Texte */}
        <div className="flex-1 flex flex-col justify-center min-h-screen p-6">
          <h2 className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            Fare Calculator pour Conducteurs
          </h2>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4">
            Conduisez et Gagnez à Votre Rythme
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg leading-relaxed">
            Rejoignez notre réseau de conducteurs et proposez vos trajets en toute liberté. Avec Fare Calculator, vous fixez vos tarifs, gérez vos disponibilités et augmentez vos revenus facilement.
          </p>
          
          <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full shadow-lg transition transform hover:scale-105 text-lg">
            S’inscrire comme Conducteur
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center items-center min-h-screen p-6">
          <Image
            src="/chauffeur.jpg" // Remplace par ton image réelle
            alt="Conducteur souriant dans une voiture"
            width={600}
            height={600}
            className="rounded-3xl shadow-2xl object-cover w-full h-full max-h-[700px]"
          />
        </div>

      </div>
    </div>
  );
}
