'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from "next/image";

const Section5 = () => {
  const t = useTranslations('Section5');

  return (
    <section id="mobile" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 skew-y-3 transform origin-top-left -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-blue-900 dark:text-white mb-12">
          {t('title')}
        </h2>

        <div className="relative w-full max-w-4xl mx-auto">
          {/* Glass Container for Image */}
          <div className="
                relative rounded-3xl p-4 sm:p-8
                bg-white/30 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10
                shadow-2xl
            ">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/mobile_img1.png"
                alt="mobile app"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Decoration Circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500 rounded-full blur-3xl opacity-20 animate-pulse delay-700" />
        </div>
      </div>
    </section>
  );
};

export default Section5;