<<<<<<< HEAD
const withNextIntl = require('next-intl/plugin')(
  './i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true, // ✅ placé à la racine
  // Autres configurations Next.js
=======
// next.config.js
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true
>>>>>>> internationalisation
};

module.exports = withNextIntl(nextConfig);
