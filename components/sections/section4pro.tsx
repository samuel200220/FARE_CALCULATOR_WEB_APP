'use client';

import { Lightbulb, Eye, Target } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const Section4pro = () => {
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
    <section id="propos" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center text-slate-900 dark:text-white mb-20 relative z-10"
      >
        {t('title')}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {infos.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={{ pathname: info.link }} className="block group h-full">
              <div className="
                  h-full p-10 rounded-[2.5rem] transition-all duration-500
                  bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10
                  hover:border-primary/30 hover:shadow-2xl hover:-translate-y-2
              ">
                <div className="flex flex-col items-center h-full text-center">
                  <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-3xl mb-8 group-hover:rotate-12 group-hover:bg-primary/10 transition-all duration-500">
                    {info.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    {info.title}
                  </h3>
                  <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-blue-400 rounded-full mb-8 opacity-30 group-hover:opacity-100 transition-all duration-500" />
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light">
                    {info.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Section4pro;