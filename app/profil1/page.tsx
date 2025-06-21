'use client';

import SidebarToggle from '@/components/sidebar1';
import { useState, useEffect } from 'react';

export default function Profile() {
  const [user, setUser] = useState({
    fullName: '',
    nickName: '',
    gender: '',
    country: '',
    language: '',
    timeZone: '',
    email: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  useEffect(() => {
    const fetchedUser = {
      fullName: 'Alexa Rawles',
      nickName: 'Alexa',
      gender: 'Femme',
      country: 'États-Unis',
      language: 'Anglais',
      timeZone: 'UTC-7',
      email: 'alexrawles@gmail.com'
    };
    setUser(fetchedUser);
    setEditedUser(fetchedUser);
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setEditMode(false);
  };

  const handleSave = () => {
    setUser(editedUser);
    setEditMode(false);
    console.log('Profil mis à jour :', editedUser);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-900 dark:text-white">
        <SidebarToggle />
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Bienvenue, {user.nickName}</h1>
            <p className="text-gray-500 dark:text-gray-400">Mardi 07 Juin 2022</p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Recherche"
              className="p-2 rounded-md border dark:border-gray-700 bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            />
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div>
              <h2 className="font-semibold text-lg">{user.fullName}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="sm:ml-auto space-x-2">
            {!editMode ? (
              <button
                onClick={handleEditClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              >
                Modifier
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                >
                  Enregistrer
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition"
                >
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {[
            ['Nom complet', 'fullName'],
            ['Surnom', 'nickName'],
            ['Genre', 'gender'],
            ['Pays', 'country'],
            ['Langue', 'language'],
            ['Fuseau horaire', 'timeZone'],
            ['Adresse email', 'email']
          ].map(([label, field]) => (
            <div key={field}>
              <p className="text-gray-500 dark:text-gray-400">{label}</p>
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={editedUser[field as keyof typeof editedUser]}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                />
              ) : (
                <p className="mt-1">
                  {user[field as keyof typeof user]}
                  {field === 'email' && <span className="text-sm text-gray-400 ml-2">il y a 1 mois</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
