// ❌ NE PAS mettre "use client" ici

import LandingPageClient from './LandingPageClient';

export default function Page() {
  return <LandingPageClient />;
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' },
    { locale: 'de' }
  ];
}
