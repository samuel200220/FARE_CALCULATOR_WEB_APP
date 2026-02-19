'use client';

import Image from 'next/image';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function Download() {
  const t = useTranslations('download');

  return (
    <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500 py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center w-full max-w-7xl p-10 lg:p-16 bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-white/10 gap-12">

        {/* Texte */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {t('title')}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mt-8 text-xl leading-relaxed font-light">
            {t('description')}
          </p>

          <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
            <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1">
              <FaApple className="text-3xl" />
              <div className="text-left">
                <p className="text-xs opacity-70">Download on the</p>
                <p className="text-xl font-bold">App Store</p>
              </div>
            </button>

            <button className="bg-primary text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl hover:-translate-y-1 shadow-primary/20">
              <FaGooglePlay className="text-3xl" />
              <div className="text-left">
                <p className="text-xs opacity-70">Get it on</p>
                <p className="text-xl font-bold">Google Play</p>
              </div>
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 -z-10"></div>
          <Image
            src="/logo_farcal.png"
            alt="Application FareGo"
            width={400}
            height={800}
            style={{ height: 'auto' }}
            className="rounded-[2.5rem] shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

      </div>
    </div>
  );
}