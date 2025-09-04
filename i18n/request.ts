import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Vérifie si la locale est dans la liste des locales supportées
  const resolvedLocale = typeof locale === 'string' ? locale : routing.defaultLocale;
  if (!routing.locales.includes(resolvedLocale as any)) {
    // Utilise la langue par défaut si locale invalide
    return {
      locale: routing.defaultLocale,
      messages: (await import(`../messages/${routing.defaultLocale}.json`)).default
    };
  }

  // Retourne la locale courante et ses messages
  return {
    locale: resolvedLocale, // OBLIGATOIRE
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  };
});
