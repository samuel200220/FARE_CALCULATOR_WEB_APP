'use client';

import { useTranslations, useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath as any);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      {/* <div className="flex space-x-4">
        <a href={`/${locale}`} className="hover:underline">
          {t('home')}
        </a>
        <a href={`/${locale}/about`} className="hover:underline">
          {t('about')}
        </a>
        <a href={`/${locale}/contact`} className="hover:underline">
          {t('contact')}
        </a>
      </div> */}
      
      <div className="flex space-x-2">
        {routing.locales.map((lng) => (
          <button
            key={lng}
            onClick={() => switchLanguage(lng)}
            className={`px-3 py-1 rounded ${
              locale === lng ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}