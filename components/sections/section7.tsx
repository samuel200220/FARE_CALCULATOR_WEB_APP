'use client';

import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Thomas Sankara',
    title: 'Directrice Logistique',
    quote: 'Service exceptionnelle ! Le calculateur de tarifs nous fait gagner un temps précieux dans nos devis quotidiens.',
    color: 'bg-primary',
    initial: 'T'
  },
  {
    name: 'Djouhou Pascaline',
    title: "Chef d'Entreprise",
    quote: 'Interface intuitive et tarifs transparents. Nous recommandons vivement cette solution à nos partenaires.',
    color: 'bg-blue-400',
    initial: 'D'
  },
  {
    name: 'TAGATSING Samuel',
    title: 'Responsable Achats',
    quote: 'La précision des calculs et la rapidité du service ont transformé notre processus de commande.',
    color: 'bg-primary/80',
    initial: 'S'
  },
];

export default function Section7() {
  const t = useTranslations('Section7');
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-20 text-slate-900 dark:text-white"
      >
        {t('title')}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {testimonials.map((testi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="
                relative p-10 rounded-[2.5rem]
                bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10
                shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3
            "
          >
            <FaQuoteLeft className="absolute top-8 right-8 text-4xl text-primary/10 dark:text-primary/10" />

            <div className="flex items-center gap-5 mb-8">
              <div className={`w-16 h-16 rounded-full ${testi.color} flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20`}>
                {testi.initial}
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  {testi.name}
                </h3>
                <p className="text-primary dark:text-blue-400 font-bold tracking-wide text-sm">
                  {testi.title}
                </p>
              </div>
            </div>

            <div className="flex gap-1 text-primary mb-6 text-sm">
              {[...Array(5)].map((_, idx) => <FaStar key={idx} />)}
            </div>

            <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-lg font-light relative z-10">
              &quot;{testi.quote}&quot;
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}