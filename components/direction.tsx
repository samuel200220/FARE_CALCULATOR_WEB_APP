'use client';

import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function InscriptionSection() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const t = useTranslations('InscriptionSection');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email);
    router.push('/inscription1');
  };

  return (
    <section className="w-full py-16 mb-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0D1B2A] dark:to-[#1B263B] text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-white">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          {t('description')}
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="relative w-full sm:w-auto">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              placeholder={t('placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            {t('button')}
          </button>
        </form>
      </div>
    </section>
  );
}