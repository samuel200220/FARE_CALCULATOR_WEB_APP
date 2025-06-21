'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SupportArticlePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      {/* Retour */}
      <div className="mb-6">
        <Link href="/aide1" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft className="mr-2" /> Retour au centre d'aide
        </Link>
      </div>

      {/* Contenu de l'article */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Démarrer avec Fare Calculator</h1>

        <p className="mb-4">
          Bienvenue sur Fare Calculator ! Cette application vous permet d'estimer rapidement les tarifs de vos trajets selon la distance, l'heure et d'autres paramètres.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Étape 1 : Remplir les champs de départ et destination</h2>
        <p className="mb-4">
          Entrez l'adresse de départ et de destination. Des suggestions automatiques vous aideront à compléter les champs.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Étape 2 : Choisir une heure</h2>
        <p className="mb-4">
          Vous pouvez sélectionner l'heure souhaitée pour obtenir une estimation plus précise.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Étape 3 : Cliquer sur "Calculer tarif"</h2>
        <p className="mb-4">
          Cliquez sur le bouton, et Fare Calculator affichera le coût estimé du trajet.
        </p>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Dernière mise à jour : 18 juin 2025
        </p>
      </div>
    </div>
  );
}
