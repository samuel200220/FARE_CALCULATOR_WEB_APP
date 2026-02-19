'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { motion } from 'framer-motion';

const Section5 = () => {
  const t = useTranslations('Section5');

  return (
    <section id="mobile" className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-center text-slate-900 dark:text-white mb-16"
        >
          {t('title')}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-5xl mx-auto"
        >
          {/* Glass Container for Image */}
          <div className="
                relative rounded-[3rem] p-6 lg:p-12
                bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10
                shadow-2xl overflow-hidden
            ">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            <div className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="/mobile_img1.png"
                alt="mobile app preview"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
          </div>

          {/* Decoration Elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary rounded-full blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400 rounded-full blur-[100px] opacity-20 animate-pulse delay-700" />
        </motion.div>
      </div>
    </section>
  );
};

export default Section5;