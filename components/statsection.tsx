'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';

type Stat = {
  labelKey: string;
  target: number;
  suffix?: string;
};

const stats: Stat[] = [
  { labelKey: 'taxis', target: 100, suffix: '+' },
  { labelKey: 'users', target: 5000, suffix: '+' },
  { labelKey: 'ridesPerDay', target: 120, suffix: '/j' },
];

export default function StatsSection() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const t = useTranslations('StatsSection');

  useEffect(() => {
    if (!inView) return;

    const intervals = stats.map((stat, i) => {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let currentStep = 0;

      return setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        // Ease out function
        const ease = 1 - Math.pow(1 - progress, 3);

        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[i] = Math.ceil(stat.target * ease);
          return newCounts;
        });

        if (currentStep >= steps) {
          clearInterval(intervals[i]);
        }
      }, stepTime);
    });

    return () => intervals.forEach(i => i && clearInterval(i));
  }, [inView]);

  return (
    <section ref={ref} className="py-20 px-4 relative">
      {/* Background Strip */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 bg-blue-600/5 dark:bg-white/5 -skew-y-2 -z-10" />

      <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-white mb-16">
        {t('title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border-b-4 border-blue-500 hover:-translate-y-2 transition-transform duration-300 text-center"
          >
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4 font-mono">
              {counts[index]}{stat.suffix}
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium text-lg uppercase tracking-wide">
              {t(stat.labelKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}