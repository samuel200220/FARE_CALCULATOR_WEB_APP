'use client';

import { Car, PackageSearch } from 'lucide-react';
import { FaPlaneDeparture } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const Section2 = () => {
  const t = useTranslations('section2');

  const services = [
    {
      icon: <Car className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />,
      title: t('services.taxi.title'),
      description: t('services.taxi.description'),
      link: '#',
    },
    {
      icon: <FaPlaneDeparture className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mb-4" />,
      title: t('services.trip.title'),
      description: t('services.trip.description'),
      link: 'https://lets-go-liart-phi.vercel.app/',
    },
    {
      icon: <PackageSearch className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-4" />,
      title: t('services.delivery.title'),
      description: t('services.delivery.description'),
      link: '#',
    },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-blue-900 dark:text-white mb-16 relative z-10">
        {t('title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {services.map((service, index) => {
          return (
            <a
              href={service.link}
              key={index}
              target={service.link.startsWith('http') ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="
                   h-full p-8 rounded-3xl transition-all duration-500
                   bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10
                   hover:bg-white/80 dark:hover:bg-white/10 hover:translate-y-[-5px] hover:shadow-2xl shadow-lg
                ">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-white dark:bg-white/5 rounded-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default Section2;