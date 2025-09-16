'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Bell, Lock, User } from 'lucide-react';
import SidebarToggle from '@/components/sidebar1';
import { useTranslations } from 'next-intl';

export default function ParametresPage() {
  const t = useTranslations('Parametres');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <SidebarToggle />
          <h1 className="text-3xl ml-6 font-bold text-blue-700">{t('title')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profil */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="text-blue-600" /> {t('sections.profile')}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('fields.fullName')}</label>
                <input
                  type="text"
                  placeholder={t('placeholders.fullName')}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('fields.email')}</label>
                <input
                  type="email"
                  placeholder={t('placeholders.email')}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </form>
          </section>

          {/* Sécurité */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="text-blue-600" /> {t('sections.security')}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('fields.currentPassword')}</label>
                <input
                  type="password"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('fields.newPassword')}</label>
                <input
                  type="password"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </form>
          </section>

          {/* Préférences */}
          <section className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="text-blue-600" /> {t('sections.preferences')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('fields.notifications')}</span>
                <Switch
                  checked={notificationsEnabled}
                  onChange={setNotificationsEnabled}
                  className={`${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-400'} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('fields.darkMode')}</span>
                <Switch
                  checked={darkModeEnabled}
                  onChange={setDarkModeEnabled}
                  className={`${darkModeEnabled ? 'bg-blue-600' : 'bg-gray-400'} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${darkModeEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
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