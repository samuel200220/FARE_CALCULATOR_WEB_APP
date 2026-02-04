'use client';

import { Lightbulb, Eye, Target } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';

const Section4 = () => {
  const t = useTranslations('Section4');

  const infos = [
    {
      title: t('why.title'),
      description: t('why.description'),
      icon: <Lightbulb className="text-amber-500 w-10 h-10 mb-4" />,
      link: '/pourquoi',
    },
    {
      title: t('vision.title'),
      description: t('vision.description'),
      icon: <Eye className="text-blue-500 w-10 h-10 mb-4" />,
      link: '/vision',
    },
    {
      title: t('goal.title'),
      description: t('goal.description'),
      icon: <Target className="text-red-500 w-10 h-10 mb-4" />,
      link: '/objectif',
    },
  ];

  return (
    <section id="propos" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-blue-900 dark:text-white mb-16 relative z-10">
        {t('title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {infos.map((info, index) => (
          <Link key={index} href={{ pathname: info.link }} className="block group">
            <div className="
                h-full p-8 rounded-3xl transition-all duration-300
                bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10
                hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-2xl hover:-translate-y-1
            ">
              <div className="flex flex-col items-center h-full text-center">
                <div className="p-4 bg-white dark:bg-white/5 rounded-full mb-6 shadow-sm group-hover:rotate-12 transition-transform duration-500">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {info.title}
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mb-6 opacity-30 group-hover:opacity-100 transition-opacity" />
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {info.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Section4;