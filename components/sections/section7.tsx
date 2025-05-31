'use client';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Marie Dubois',
    title: 'Directrice Logistique',
    quote:
      'Service exceptionnelle ! Le calculateur de tarifs nous fait gagner un temps précieux dans nos devis quotidiens.',
    color: 'bg-red-500',
  },
  {
    name: 'Jean Martin',
    title: "Chef d'Entreprise",
    quote:
      'Interface intuitive et tarifs transparents. Nous recommandons vivement cette solution à nos partenaires.',
    color: 'bg-blue-600',
  },
  {
    name: 'Sophie Laurent',
    title: 'Responsable Achats',
    quote:
      'La précision des calculs et la rapidité du service ont transformé notre processus de commande.',
    color: 'bg-purple-600',
  },
];

export default function Testimonials() {
  return (
    <div className="dark:bg-[#0D1B2A] bg-white mt-20 p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-white">
            Ce que nos clients disent
        </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-gray-200 shadow-md rounded-xl p-6 flex flex-col gap-3 dark:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-semibold`}
              >
                {t.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {t.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t.title}
                </p>
              </div>
            </div>

            <div className="flex gap-1 text-yellow-500">
              {[...Array(5)].map((_, idx) => (
                <FaStar key={idx} />
              ))}
            </div>

            <p className="text-gray-700 italic dark:text-gray-200">"{t.quote}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
