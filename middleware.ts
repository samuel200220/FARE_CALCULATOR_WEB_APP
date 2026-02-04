import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Matcher qui exclut les fichiers statiques et API
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
