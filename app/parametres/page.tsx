'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Bell, Lock, Moon, User } from 'lucide-react';
import SidebarToggle from '@/components/sidebar1';

export default function ParametresPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-white">
        <SidebarToggle/>
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Paramètres</h1>

      {/* Profil */}
      <section className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="text-blue-600" /> Informations du profil
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom complet</label>
            <input
              type="text"
              placeholder="Votre nom"
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Adresse e-mail</label>
            <input
              type="email"
              placeholder="email@example.com"
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </form>
      </section>

      {/* Sécurité */}
      <section className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lock className="text-blue-600" /> Sécurité
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Mot de passe actuel</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nouveau mot de passe</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </form>
      </section>

      {/* Préférences */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell className="text-blue-600" /> Préférences
        </h2>

        <div className="flex items-center justify-between py-2">
          <span>Notifications</span>
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

        <div className="flex items-center justify-between py-2">
          <span>Mode sombre</span>
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
      </section>
    </div>
  );
}
