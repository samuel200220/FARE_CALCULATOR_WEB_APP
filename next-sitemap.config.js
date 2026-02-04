/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fare-calculator-web-app-pcto.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.8,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin' },
    ],
  },
};
