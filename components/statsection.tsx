'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';

type Stat = {
  labelKey: string; // clé de traduction
  target: number;
};

const stats: Stat[] = [
  { labelKey: 'taxis', target: 100 },
  { labelKey: 'users', target: 5000 },
  { labelKey: 'ridesPerDay', target: 120 },
];

export default function StatsSection() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const { ref, inView } = useInView({ triggerOnce: true });
  const t = useTranslations('StatsSection');

  useEffect(() => {
    if (!inView) return;

    const intervals = stats.map((stat, i) => {
      return setInterval(() => {
        setCounts((prev) => {
          const newCounts = [...prev];
          if (newCounts[i] < stat.target) {
            newCounts[i] += Math.ceil(stat.target / 50);
            if (newCounts[i] > stat.target) newCounts[i] = stat.target;
          }
          return newCounts;
        });
      }, 30);
    });

    const stopAfter = setTimeout(() => {
      intervals.forEach(clearInterval);
    }, 2000);

    return () => {
      intervals.forEach(clearInterval);
      clearTimeout(stopAfter);
    };
  }, [inView]);

  return (
    <section
      ref={ref}
      className="bg-yellow-50 dark:bg-[#0D1B2A] py-16 px-4 sm:px-8 text-center mb-20"
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10">
        {t('title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
          >
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              {counts[index]}+
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {t(stat.labelKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}