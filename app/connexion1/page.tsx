'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <div className="min-h-screen flex p-20 rounded-2xl shadow-lg">
      {/* Left Section */}
      <div className="w-1/2 bg-blue-700 text-white p-16 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Fare Calculator <br /> Votre Tarif a Portee De Main
        </h1>
        <p className="text-lg leading-relaxed">
          Plus besoin de stresser sur le cout du trajet, <br />
          Avec Fare Calculator, obtenez une estimation  <br />
          rapide du cout de vos deplacements.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 p-16 bg-white flex flex-col justify-center">

        <h2 className="text-2xl font-bold mb-6">Connexion</h2>

        <form className="space-y-4">
          <input
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
          <input
            type="password"
            placeholder="Confirmer votre mot de passe"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              I accept the <a href="#" className="underline text-blue-900">Terms and Conditions</a>
            </span>
          </div> */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
          >
            Se Connecter
          </button>
          <h5>Pas de compte?<Link href={'/inscription1'} className="text-blue-900 mr-4 ml-2">Cliquez ici</Link></h5>
        </form>
      </div>
    </div>
  );
}
