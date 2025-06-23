'use client';

import { Lightbulb } from 'lucide-react';

export default function Pourquoi() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] dark:bg-[#0D1B2A] text-white">
      {/* En-tête */}
      <section className="bg-blue-900 text-white py-16 px-6 text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Lightbulb className="w-10 h-10 text-yellow-400" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Pourquoi Fare Calculator ?
          </h1>
        </div>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl font-medium">
          Nous avons créé Fare Calculator pour répondre à un besoin essentiel : 
          rendre le transport urbain plus transparent, équitable et accessible à tous.
        </p>
      </section>

      {/* Contenu */}
      <section className="bg-[#fefae0] dark:bg-gray-900 text-gray-800 dark:text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-yellow-400">
            Le besoin derrière la solution
          </h2>
          <p className="text-lg leading-relaxed">
            Aujourd’hui, les utilisateurs ne savent pas toujours combien coûte un trajet. 
            Que vous soyez un client occasionnel, un professionnel ou une entreprise, 
            il est crucial d’estimer précisément un tarif avant d’accepter ou de proposer un service.
            <br /><br />
            Fare Calculator permet aux utilisateurs anonymes de faire quelques estimations gratuites, 
            tout en offrant plus de possibilités aux comptes inscrits ou professionnels. C’est une 
            solution rapide, efficace et pensée pour tous les profils de voyageurs ou de chauffeurs.
          </p>
        </div>
      </section>
    </div>
  );
}
