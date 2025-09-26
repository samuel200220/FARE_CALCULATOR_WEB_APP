'use client';

//import Link from 'next/link';
import { Car, PackageSearch } from 'lucide-react';
import { FaPlaneDeparture } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const Section2 = () => {
  const t = useTranslations('section2');

  const services = [
    {
      icon: <Car className="w-10 h-10 text-blue-600 mb-3" />,
      title: t('services.taxi.title'),
      description: t('services.taxi.description'),
      link: '#',
    },
    {
      icon: <FaPlaneDeparture className="w-10 h-10 text-green-600 mb-3" />,
      title: t('services.trip.title'),
      description: t('services.trip.description'),
      link: 'https://lets-go-liart-phi.vercel.app/',
    },
    {
      icon: <PackageSearch className="w-10 h-10 text-pink-600 mb-3" />,
      title: t('services.delivery.title'),
      description: t('services.delivery.description'),
      link: '#',
    },
  ];

  return (
    <section
      id="services"
      className="bg-white dark:bg-[#0D1B2A] pt-10 pb-20 mt-20 px-4 sm:px-6 lg:px-8"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-blue-700 dark:text-white mb-12">
        {t('title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {services.map((service, index) => {
          const isExternal = service.link.startsWith('http');
          if (isExternal) {
            return (
              <a
                href={service.link}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl border shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    {service.icon}
                    <h3 className="text-xl font-semibold text-blue-700 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          }
          return (
            <a href={service.link} key={index} className="block">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl border shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  {service.icon}
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
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