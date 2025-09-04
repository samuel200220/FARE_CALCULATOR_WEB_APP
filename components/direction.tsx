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
    router.push('/inscription1'); // Redirection après inscription
  };

  return (
    <section className="w-full py-16 mb-20 dark:bg-gradient-to-r dark:from-[#0D1B2A] dark:via-[#0D1B2A] dark:to-[#0D1B2A] bg-gradient-to-r from-blue-200 via-white to-blue-200 text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-700 mb-8 dark:text-white">
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
              className="pl-10 pr-4 py-2 rounded-full dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-80"
            />
          </div>
          <button
            type="submit"
            className="bg-violet-900 hover:bg-violet-900 text-white px-6 py-2 rounded-full font-semibold transition-colors"
          >
            {t('button')}
          </button>
        </form>
      </div>
    </section>
  );
}
