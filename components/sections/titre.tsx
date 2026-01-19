'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const Titre = () => {
  const t = useTranslations('titreano');

  return (
    <section className='pt-32 pb-10 flex flex-col items-center justify-center px-4 overflow-hidden relative'>
      {/* Background ambient glow (Optional) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-400/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='relative z-10 text-center max-w-4xl mx-auto space-y-6'
      >
        <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight'>
          <span className='block text-gray-900 dark:text-white mb-2'>
            {t('mainTitleLine1')}
          </span>
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400'>
            {t('mainTitleLine2')}
          </span>
        </h1>

        <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed'>
          {t('description')}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          {/* <Link href={"/inscription1"}>
            <Button className='h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-1'>
              {t('signup')}
            </Button>
          </Link>
          <Link href={"/connexion1"}>
            <Button variant="outline" className='h-12 px-8 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 text-lg font-medium text-gray-700 dark:text-gray-200 transition-all hover:-translate-y-1'>
              {t('login')}
            </Button>
          </Link> */}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Titre;