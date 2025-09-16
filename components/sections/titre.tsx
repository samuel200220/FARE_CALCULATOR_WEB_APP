'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

const Titre = () => {
  const t = useTranslations('titreano'); // clé principale dans le JSON

  return (
    <section className='mb-7 mt-9 dark:bg-[#0D1B2A] bg-white flex flex-col items-center justify-center px-4 pb-6'>
      <div className='mb-6 mt-9 flex items-center justify-center'>
        <h1 className='text-blue-700 text-center font-bold dark:text-white dark:font-bold text-3xl sm:text-5xl md:text-5xl lg:text-6xl'>
          <span className='block text-black dark:text-white font-bold'>
            {t('mainTitleLine1')}
          </span>
          <span className='block text-blue-500 font-bold'>
            {t('mainTitleLine2')}
          </span>
        </h1>
      </div>
      <p className='text-center text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 dark:text-white'>
        {t('description')}
      </p>
    </section>
  );
};

export default Titre;