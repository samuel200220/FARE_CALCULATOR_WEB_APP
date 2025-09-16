'use client';

import { useState } from 'react';
import { Pencil, UserCircle2 } from 'lucide-react';

export default function Profil() {
  const [user, setUser] = useState({
    nom: 'Samuel Fotsing',
    email: 'samuel@example.com',
    telephone: '+237 6 99 99 99 99',
    ville: 'Douala',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Ici, tu peux envoyer les données à ton backend
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700 dark:text-white">Profil Utilisateur</h1>
          {!isEditing && (
            <button
              className="flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:underline"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-4 h-4" />
              Modifier
            </button>
          )}
        </div>

        <div className="flex items-center justify-center mb-6">
          <UserCircle2 className="text-blue-700 dark:text-white" size={100} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Nom complet"
            name="nom"
            value={user.nom}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <InputField
            label="Adresse email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <InputField
            label="Téléphone"
            name="telephone"
            value={user.telephone}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <InputField
            label="Ville"
            name="ville"
            value={user.ville}
            onChange={handleChange}
            disabled={!isEditing}
          />

          {isEditing && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Enregistrer
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  disabled,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 rounded border ${
          disabled
            ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-gray-100 dark:bg-gray-800'
        } border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600`}
      />
    </div>
  );
}
