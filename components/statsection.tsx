'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

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
    <section ref={ref} className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center text-slate-900 dark:text-white mb-20"
      >
        {t('title')}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
            className="group relative p-10 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-3 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative text-5xl md:text-6xl font-black text-primary dark:text-blue-400 mb-6 tracking-tighter">
              {counts[index]}{stat.suffix}
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-bold text-lg uppercase tracking-[0.1em] relative">
              {t(stat.labelKey)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}