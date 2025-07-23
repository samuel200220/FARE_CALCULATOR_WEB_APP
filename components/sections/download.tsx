'use client';

import Image from 'next/image';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

export default function Download() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0D1B2A] transition-colors duration-500">
      <div className="flex flex-col md:flex-row items-center w-full max-w-6xl p-8 bg-white dark:bg-[#1B263B] rounded-3xl shadow-2xl">

        {/* Texte */}
        <div className="flex-1 p-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Téléchargez Fare Calculator
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg leading-relaxed">
            Rejoignez des milliers d’utilisateurs au Cameroun : passagers, conducteurs et agences. Simplifiez vos trajets, calculez vos tarifs et optimisez votre mobilité avec FareGo. Disponible sur iOS et Android.
          </p>

          <div className="mt-8 flex justify-center md:justify-start space-x-4">
            <button className="bg-black text-white px-5 py-3 rounded-full flex items-center hover:bg-gray-800 transition transform hover:scale-105">
              <FaApple className="mr-3 text-2xl" />
              App Store
            </button>

            <button className="bg-green-600 text-white px-5 py-3 rounded-full flex items-center hover:bg-green-700 transition transform hover:scale-105">
              <FaGooglePlay className="mr-3 text-2xl" />
              Google Play
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 p-6 flex justify-center items-center">
          <Image
            src="/fare_logo.png" // Remplace par une image mockup mobile si tu en as
            alt="Application FareGo"
            width={350}
            height={700}
            className="rounded-3xl shadow-xl object-cover max-h-[700px]"
          />
        </div>

      </div>
    </div>
  );
}
