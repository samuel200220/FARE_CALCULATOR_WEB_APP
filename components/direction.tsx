'use client';

import { Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function InscriptionSection() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const t = useTranslations('InscriptionSection');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/inscription1');
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="
            p-8 sm:p-12 rounded-[2.5rem]
            bg-gradient-to-br from-blue-600 to-violet-700 dark:from-blue-900 dark:to-violet-900
            text-white shadow-2xl relative overflow-hidden
        ">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
            {t('title')}
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
            {t('description')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto relative z-10">
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                placeholder={t('placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 h-14 rounded-2xl bg-white text-gray-900 border-none focus:ring-4 focus:ring-white/30 transition-shadow placeholder:text-gray-400 shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-black transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              {t('button')} <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}