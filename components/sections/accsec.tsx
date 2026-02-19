'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function FareSections() {
  const t = useTranslations('fareSections');

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "circOut" as any }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "circOut" as any }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-background transition-colors duration-500 py-12 lg:py-24 gap-24 lg:gap-40 overflow-hidden">

      {/* Section Agences */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl px-4 sm:px-6 lg:px-8 gap-16 items-center">
        <motion.div
          className="flex-1 relative order-2 md:order-1"
          {...fadeInLeft}
        >
          <div className="absolute -inset-6 bg-primary/20 blur-[100px] rounded-full -z-10 opacity-30"></div>
          <Image
            src="/Voyage.png"
            alt="Flotte de bus"
            width={700}
            height={450}
            className="rounded-[3rem] shadow-2xl object-cover w-full h-[450px] border border-white/20"
          />
        </motion.div>

        <motion.div
          className="flex-1 flex flex-col justify-center order-1 md:order-2"
          {...fadeInRight}
        >
          <h2 className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 px-4 py-1.5 rounded-full bg-primary/5 w-fit">
            {t('agencies.subtitle')}
          </h2>
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1]">
            {t('agencies.title')}
          </h1>
          <p className="text-muted-foreground mt-8 text-xl leading-relaxed font-medium opacity-80">
            {t('agencies.description')}
          </p>
          <button className="mt-10 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-[2rem] shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-primary/40 text-lg font-black w-fit">
            {t('agencies.button')}
          </button>
        </motion.div>
      </div>

      {/* Section Institutions */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl px-4 sm:px-6 lg:px-8 gap-16 items-center">
        <motion.div
          className="flex-1 flex flex-col justify-center"
          {...fadeInLeft}
        >
          <h2 className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 px-4 py-1.5 rounded-full bg-primary/5 w-fit">
            {t('institutions.subtitle')}
          </h2>
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1]">
            {t('institutions.title')}
          </h1>
          <p className="text-muted-foreground mt-8 text-xl leading-relaxed font-medium opacity-80">
            {t('institutions.description')}
          </p>
          <button className="mt-10 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-[2rem] shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-primary/40 text-lg font-black w-fit">
            {t('institutions.button')}
          </button>
        </motion.div>

        <motion.div
          className="flex-1 relative"
          {...fadeInRight}
        >
          <div className="absolute -inset-6 bg-primary/20 blur-[100px] rounded-full -z-10 opacity-30"></div>
          <Image
            src="/transport.jpg"
            alt="Illustration transport institutionnel"
            width={700}
            height={450}
            className="rounded-[3rem] shadow-2xl object-cover w-full h-[450px] border border-white/20"
            priority
          />
        </motion.div>
      </div>

      {/* Section Conducteurs */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl px-4 sm:px-6 lg:px-8 gap-16 items-center">
        <motion.div
          className="flex-1 relative order-2 md:order-1"
          {...fadeInLeft}
        >
          <div className="absolute -inset-6 bg-primary/20 blur-[100px] rounded-full -z-10 opacity-30"></div>
          <Image
            src="/chauffeur.jpg"
            alt="Conducteur souriant dans une voiture"
            width={700}
            height={450}
            className="rounded-[3rem] shadow-2xl object-cover w-full h-[450px] border border-white/20"
            priority
          />
        </motion.div>

        <motion.div
          className="flex-1 flex flex-col justify-center order-1 md:order-2"
          {...fadeInRight}
        >
          <h2 className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 px-4 py-1.5 rounded-full bg-primary/5 w-fit">
            {t('drivers.subtitle')}
          </h2>
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1]">
            {t('drivers.title')}
          </h1>
          <p className="text-muted-foreground mt-8 text-xl leading-relaxed font-medium opacity-80">
            {t('drivers.description')}
          </p>
          <button className="mt-10 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-[2rem] shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-primary/40 text-lg font-black w-fit">
            {t('drivers.button')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}