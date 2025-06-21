'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Bell, Lock, Moon, User } from 'lucide-react';
import SidebarToggle from '@/components/sidebar1';

export default function ParametresPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <SidebarToggle />
          <h1 className="text-3xl ml-6 font-bold text-blue-700">Paramètres</h1>
        </div>

        {/* Contenu en deux colonnes sur écran large */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations de profil */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="text-blue-600" /> Informations du profil
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse e-mail</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </form>
          </section>

          {/* Sécurité */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="text-blue-600" /> Sécurité
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
                <input
                  type="password"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </form>
          </section>

          {/* Préférences – pleine largeur sur toutes tailles */}
          <section className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="text-blue-600" /> Préférences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notifications</span>
                <Switch
                  checked={notificationsEnabled}
                  onChange={setNotificationsEnabled}
                  className={`${
                    notificationsEnabled ? 'bg-blue-600' : 'bg-gray-400'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mode sombre</span>
                <Switch
                  checked={darkModeEnabled}
                  onChange={setDarkModeEnabled}
                  className={`${
                    darkModeEnabled ? 'bg-blue-600' : 'bg-gray-400'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      darkModeEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
