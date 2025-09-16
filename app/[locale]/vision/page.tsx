'use client';

import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Vision() {
  const t = useTranslations('Vision'); // clé principale pour cette page

  return (
    <div className="min-h-screen bg-[#0D1B2A] dark:bg-[#0D1B2A] text-white">
      {/* En-tête */}
      <section className="bg-blue-900 text-white py-16 px-6 text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Eye className="w-10 h-10 text-blue-300" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {t('header.title')}
          </h1>
        </div>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl font-medium">
          {t('header.subtitle')}
        </p>
      </section>

      {/* Contenu */}
      <section className="bg-[#fefae0] dark:bg-gray-900 text-gray-800 dark:text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-yellow-400">
            {t('content.title')}
          </h2>
          <p className="text-lg leading-relaxed">
            {t('content.description')}
          </p>
        </div>
      </section>
    </div>
  );
}