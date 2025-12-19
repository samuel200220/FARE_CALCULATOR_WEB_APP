'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from "next/image";

const Section5 = () => {
  const t = useTranslations('Section5');

  return (
    <section
      id="mobile"
      className="lg:mt-40 md:mt-40 sm:mt-40 mt-20 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0D1B2A] dark:to-[#1B263B] pt-20 sm:mb-24 md:mb-20 justify-center items-center mb-20 flex flex-col"
    >
      <h2 className="text-xl sm:text-4xl md:text-2xl lg:text-5xl text-center text-blue-900 font-bold dark:text-white mb-8">
        {t('title')}
      </h2>

      <div className="flex justify-center relative items-center gap-10 max-w-6xl mx-auto">
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
          <Image
            src="/mobile_img1.png"
            alt="mobile app"
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Section5;