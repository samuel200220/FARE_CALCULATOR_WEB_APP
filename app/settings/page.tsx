'use client';

import {
  UserCog, Bell, Sliders, MessageCircleQuestion,
  FileText, Mail, ShieldCheck, CreditCard,
  UploadCloud, DownloadCloud
} from 'lucide-react';

export default function SettingsPage() {
  const settingsOptions = [
    {
      icon: <UserCog className="text-blue-600" />,
      title: 'Mon profil',
      description: 'Changer le nom d’affichage, mot de passe, email, etc.',
    },
    {
      icon: <Bell className="text-green-600" />,
      title: 'Notifications email',
      description: 'Activer ou désactiver les notifications selon les événements.',
    },
    {
      icon: <Sliders className="text-blue-500" />,
      title: 'Champs & règles',
      description: 'Personnaliser les règles du système de course.',
    },
    {
      icon: <MessageCircleQuestion className="text-yellow-500" />,
      title: 'Forums de feedback',
      description: 'Gérer les retours utilisateurs.',
    },
    {
      icon: <FileText className="text-purple-600" />,
      title: 'Sujets des articles',
      description: 'Modifier les sujets liés à la base de connaissances.',
    },
    {
      icon: <Mail className="text-indigo-600" />,
      title: 'Emails personnalisés',
      description: 'Définir les adresses pour l’envoi/réception de messages.',
    },
    {
      icon: <ShieldCheck className="text-red-600" />,
      title: 'Agents et permissions',
      description: 'Gérer les accès et rôles administratifs.',
    },
    {
      icon: <CreditCard className="text-pink-600" />,
      title: 'Compte & facturation',
      description: 'Changer le plan, méthode de paiement, langue, etc.',
    },
    {
      icon: <UploadCloud className="text-gray-700 dark:text-gray-300" />,
      title: 'Importer du contenu',
      description: 'Importer à partir de ZenDesk, Gmail, etc.',
    },
    {
      icon: <DownloadCloud className="text-gray-700 dark:text-gray-300" />,
      title: 'Exporter des données',
      description: 'Exporter tickets, votes, utilisateurs, etc.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-white">Paramètres</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {settingsOptions.map((option, idx) => (
          <div
            key={idx}
            className="flex items-start p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="mr-4">{option.icon}</div>
            <div>
              <h2 className="text-lg font-semibold">{option.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
