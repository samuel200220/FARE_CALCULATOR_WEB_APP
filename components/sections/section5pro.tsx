'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from "next/image";

const Section5pro = () => {
  const t = useTranslations('Section5');

  return (
    <section
      id="mobile"
      className="lg:mt-40 md:mt-40 sm:mt-40 mt-20 w-full h-full bg-white dark:bg-[#0D1B2A] pt-20 sm:mb-24 md:mb-20 justify-center items-center mb-20 flex flex-col"
    >
      <h2 className="text-xl sm:text-4xl md:text-2xl lg:text-5xl text-center text-blue-600 font-bold dark:text-white">
        {t('title')}
      </h2>

      <div className="flex justify-center relative items-center gap-10">
        <div className="w-full h-full relative">
          <Image
            src="/mobile_img1.png"
            alt="mobile app"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Section5pro;
