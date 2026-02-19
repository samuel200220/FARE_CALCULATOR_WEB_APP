'use client';

import { FaCheckCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type Plan = {
  key: 'basic' | 'pro' | 'enterprise';
  bg: string;
  textColor: string;
  href: string;
};

export default function Pricing() {
  const t = useTranslations('pricing');

  const plans: Plan[] = [
    {
      key: 'basic',
      bg: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 shadow-blue-500/20',
      textColor: 'text-white',
      href: '/inscription1',
    },
    {
      key: 'pro',
      bg: 'bg-slate-950 hover:bg-black shadow-slate-900/40',
      textColor: 'text-white',
      href: '/inscriptionpro',
    },
    {
      key: 'enterprise',
      bg: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-amber-500/30',
      textColor: 'text-slate-900',
      href: '/contact',
    },
  ];

  return (
    <div className="mb-0 py-24 px-4 sm:px-6 lg:px-8 bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t('title')}
        </h2>
        <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">
          {t('description')}
        </p>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-[2.5rem] p-10 w-full lg:w-96 flex flex-col transition-all duration-500 hover:-translate-y-2 border backdrop-blur-xl group
                ${plan.bg} ${plan.textColor} ${plan.key === 'pro' ? 'scale-105 z-10' : ''} border-white/10 shadow-2xl`}
            >
              <h3 className="text-2xl font-bold mb-6">
                {t(`plans.${plan.key}.title`)}
              </h3>
              <div className="mb-8">
                <span className="text-5xl font-extrabold">
                  {t(`plans.${plan.key}.price`)}
                </span>
                <span className="text-lg opacity-80 pl-1"> /mois</span>
              </div>
              <p className="mb-8 text-lg opacity-90 leading-relaxed">
                {t(`plans.${plan.key}.description`)}
              </p>

              <ul className="space-y-4 mb-10 flex-grow text-left">
                {t
                  .raw(`plans.${plan.key}.features`)
                  .map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <FaCheckCircle className={`${plan.key === 'enterprise' ? 'text-slate-800' : 'text-white/80'} text-xl shrink-0`} />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full h-14 rounded-2xl text-lg font-bold transition-all shadow-lg
                    ${plan.key === 'enterprise'
                      ? 'bg-slate-900 text-white hover:bg-black'
                      : 'bg-white text-slate-900 hover:bg-blue-50'
                    }`}
                >
                  {t(`plans.${plan.key}.cta`)}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}