const withNextIntl = require('next-intl/plugin')(
  './i18n/request.ts'
);

module.exports = withNextIntl({
  // Autres configurations Next.js
  experimental: {
    typedRoutes: true
  }
});