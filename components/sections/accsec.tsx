'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function FareSections() {
  const t = useTranslations('fareSections');

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-100 dark:bg-[#0D1B2A] transition-colors duration-500">

      {/* Section Agences */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl p-6">
        <div className="flex-1 flex justify-center items-center p-6">
          <Image
            src="/Voyage.png"
            alt="Flotte de bus"
            width={600}
            height={600}
            className="rounded-3xl shadow-2xl object-cover w-full h-full max-h-[700px]"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center p-6">
          <h2 className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            {t('agencies.subtitle')}
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4">
            {t('agencies.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg leading-relaxed">
            {t('agencies.description')}
          </p>
          <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full shadow-lg transition transform hover:scale-105 text-lg">
            {t('agencies.button')}
          </button>
        </div>
      </div>

      {/* Section Institutions */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl p-6">
        <div className="flex-1 flex flex-col justify-center p-6">
          <h2 className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            {t('institutions.subtitle')}
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4">
            {t('institutions.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg leading-relaxed">
            {t('institutions.description')}
          </p>
          <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full shadow-lg transition transform hover:scale-105 text-lg">
            {t('institutions.button')}
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center p-6">
          <Image
            src="/transport.jpg"
            alt="Illustration transport institutionnel"
            width={600}
            height={600}
            className="rounded-3xl shadow-2xl object-cover w-full h-full max-h-[700px]"
          />
        </div>
      </div>

      {/* Section Conducteurs */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl p-6">
        <div className="flex-1 flex flex-col justify-center p-6">
          <h2 className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            {t('drivers.subtitle')}
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4">
            {t('drivers.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg leading-relaxed">
            {t('drivers.description')}
          </p>
          <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full shadow-lg transition transform hover:scale-105 text-lg">
            {t('drivers.button')}
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center p-6">
          <Image
            src="/chauffeur.jpg"
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
