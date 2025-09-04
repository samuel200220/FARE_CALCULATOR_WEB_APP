import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Liste des langues supportées
  locales: ['en', 'fr', 'de'],
  
  // Langue par défaut
  defaultLocale: 'en',
  
  // Préfixe des routes
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      fr: '/a-propos',
      de: '/uber-uns'
    },
    '/contact': {
      en: '/contact',
      fr: '/contact',
      de: '/kontakt'
    },
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];