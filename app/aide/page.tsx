'use client';

import SidebarToggle from '@/components/sidebar1';
import { MessageCircleQuestion, Mail, Phone, Info } from 'lucide-react';

export default function Aide() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <SidebarToggle/>
        <div className="flex items-center mb-6 space-x-3">
          <MessageCircleQuestion className="text-blue-600 w-8 h-8" />
          <h1 className="text-3xl font-bold text-blue-700">Centre d'Aide</h1>
        </div>

        <p className="mb-4 text-lg">
          Bienvenue dans le centre d’assistance de <span className="font-semibold">Fare Calculator</span>. Retrouvez ici les réponses aux questions les plus fréquentes, ainsi que les moyens de nous contacter si vous avez besoin d’aide supplémentaire.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <Info className="text-blue-500" /> Questions fréquentes
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Comment réserver une course ?</strong> — Remplissez les champs "Départ", "Destination" et "Heure", puis cliquez sur <em>Calculer tarif</em>.</li>
            <li><strong>Comment modifier ou annuler une course ?</strong> — Accédez à la section "Historique" pour gérer vos réservations.</li>
            <li><strong>Comment connaître le tarif d’une course ?</strong> — Le tarif est calculé automatiquement après avoir rempli le formulaire de réservation.</li>
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <Mail className="text-blue-500" /> Contactez-nous
          </h2>
          <p>Vous n’avez pas trouvé réponse à votre question ? N’hésitez pas à nous contacter :</p>
          <div className="mt-4 space-y-2">
            <p><strong>Email :</strong> <a href="mailto:support@farecalculator.com" className="text-blue-600 hover:underline">support@farecalculator.com</a></p>
            <p><strong>Téléphone :</strong> <a href="tel:+237600000000" className="text-blue-600 hover:underline">+237 600 000 000</a></p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <Phone className="text-blue-500" /> Assistance en ligne
          </h2>
          <p>Disponible du lundi au samedi de 8h à 20h.</p>
        </div>
      </div>
    </div>
  );
}
