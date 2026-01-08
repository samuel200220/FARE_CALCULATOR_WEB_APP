'use client';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const testimonials = [
  {
    name: 'Thomas Sankara',
    title: 'Directrice Logistique',
    quote: 'Service exceptionnelle ! Le calculateur de tarifs nous fait gagner un temps précieux dans nos devis quotidiens.',
    color: 'bg-red-500',
    initial: 'T'
  },
  {
    name: 'Djouhou Pascaline',
    title: "Chef d'Entreprise",
    quote: 'Interface intuitive et tarifs transparents. Nous recommandons vivement cette solution à nos partenaires.',
    color: 'bg-blue-600',
    initial: 'D'
  },
  {
    name: 'TAGATSING Samuel',
    title: 'Responsable Achats',
    quote: 'La précision des calculs et la rapidité du service ont transformé notre processus de commande.',
    color: 'bg-purple-600',
    initial: 'S'
  },
];

export default function Section7() {
  const t = useTranslations('Section7');
  return (
    <section className="py-24 px-4 relative">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 text-blue-900 dark:text-white">
        {t('title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="
                relative p-8 rounded-3xl
                bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-100 dark:border-gray-700
                shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2
            "
          >
            <FaQuoteLeft className="absolute top-8 right-8 text-4xl text-blue-100 dark:text-blue-900/30" />

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-full ${t.color} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                {t.initial}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {t.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {t.title}
                </p>
              </div>
            </div>

            <div className="flex gap-1 text-amber-400 mb-4 text-sm">
              {[...Array(5)].map((_, idx) => <FaStar key={idx} />)}
            </div>

            <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed relative z-10">
              &quot;{t.quote}&quot;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}