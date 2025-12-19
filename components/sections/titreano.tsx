'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

const Titreano = () => {
  const t = useTranslations('titreano');

  return (
    <section className='mb-7 mt-9 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0D1B2A] dark:to-[#1B263B] flex flex-col items-center justify-center px-4 pb-6 overflow-auto'>
      <div className='mb-6 mt-9 flex items-center justify-center'>
        <h1 className='text-blue-900 text-center font-bold dark:text-white text-3xl sm:text-5xl md:text-5xl lg:text-6xl'>
          <span className='block text-gray-800 dark:text-white font-bold'>
            {t('mainTitleLine1')}
          </span>
          <span className='block text-blue-600 font-bold'>
            {t('mainTitleLine2')}
          </span>
        </h1>
      </div>
      <p className='text-center text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 text-gray-700 dark:text-gray-300'>
        {t('description')}
      </p>
      <div className="flex gap-4">
        <Link href={"/inscription1"}>
          <Button className='cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transform transition-all duration-300 ease-in-out hover:scale-105 lg:text-[18px] md:text-[18px] sm:text-[18px] text-[16px] text-white rounded-xl px-8 py-3'>
            {t('signup')}
          </Button>
        </Link>
        <Link href={"/connexion1"}>
          <Button className='cursor-pointer bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 transform transition-all duration-300 ease-in-out hover:scale-105 lg:text-[18px] md:text-[18px] sm:text-[18px] text-[16px] text-white rounded-xl px-8 py-3'>
            {t('login')}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Titreano;