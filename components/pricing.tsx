'use client';

import { FaCheckCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Pricing() {
  const t = useTranslations('pricing');

  const plans = [
    {
      key: 'basic',
      bg: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-900 dark:text-white',
      href: '/inscription1',
    },
    {
      key: 'pro',
      bg: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-gray-900 dark:text-white',
      href: '/inscriptionpro',
    },
    {
      key: 'enterprise',
      bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
      textColor: 'text-white',
      href: '/contact',
    },
  ];

  return (
    <div className="mb-0 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-200 via-gray-200 to-gray-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl text-blue-800 dark:text-white font-extrabold mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-black dark:text-gray-300 mb-12">
          {t('description')}
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 w-full md:w-80 shadow-lg ${plan.bg} ${plan.textColor} transform hover:scale-105 transition duration-300`}
            >
              <h3 className="text-2xl font-bold mb-4">
                {t(`plans.${plan.key}.title`)}
              </h3>
              <p className="text-3xl font-extrabold mb-2">
                {t(`plans.${plan.key}.price`)}
                <span className="text-base font-medium"> /mois</span>
              </p>
              <p className="mb-6 text-sm">{t(`plans.${plan.key}.description`)}</p>

              <ul className="space-y-3 mb-8">
                {t.raw(`plans.${plan.key}.features`).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center">
                    <FaCheckCircle className="text-green-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.href as any}>
                <Button
                  className={`w-full ${
                    plan.key === 'enterprise'
                      ? 'bg-green-700 hover:bg-green-800'
                      : 'bg-blue-700 hover:bg-blue-800'
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