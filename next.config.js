const withNextIntl = require('next-intl/plugin')(
  './i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true, // ✅ placé à la racine
  // Autres configurations Next.js
};

module.exports = withNextIntl(nextConfig);
