'use client';

import { Car, PackageSearch } from 'lucide-react';
import { FaPlaneDeparture } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const Section2 = () => {
  const t = useTranslations('section2');

  const services = [
    {
      icon: <Car className="w-10 h-10 text-primary mb-4" />,
      title: t('services.taxi.title'),
      description: t('services.taxi.description'),
      link: '#',
    },
    {
      icon: <FaPlaneDeparture className="w-10 h-10 text-primary mb-4" />,
      title: t('services.trip.title'),
      description: t('services.trip.description'),
      link: 'https://lets-go-liart-phi.vercel.app/',
    },
    {
      icon: <PackageSearch className="w-10 h-10 text-primary mb-4" />,
      title: t('services.delivery.title'),
      description: t('services.delivery.description'),
      link: '#',
    },
  ];

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background transition-colors duration-500">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center text-foreground mb-20 relative z-10"
      >
        {t('title')}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {services.map((service, index) => {
          return (
            <motion.a
              href={service.link}
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              target={service.link.startsWith('http') ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="
                   h-full p-10 rounded-[2.5rem] transition-all duration-500
                   bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10
                   hover:border-primary/30 hover:translate-y-[-8px] hover:shadow-2xl shadow-xl
                ">
                <div className="flex flex-col items-center text-center">
                  <div className="p-5 bg-primary/5 dark:bg-primary/10 rounded-[1.5rem] mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
};

export default Section2;