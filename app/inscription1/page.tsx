'use client';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');
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
        <div className="flex justify-end mb-6">
          <Link href={'/'}>
          <button className="border border-blue-900 text-blue-900 px-4 py-1 rounded-full hover:bg-blue-900 hover:text-white transition">
            Commencez Gratuitement
          </button>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6">Inscription</h2>
        <p className="mb-6 text-gray-600">Creer votre compte gratuitement</p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded-md"
          />
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
            S'inscrire
          </button>
          <h5>Deja inscrit?<Link href={'/connexion1'} className="text-blue-900 mr-4 ml-2">Connexion</Link></h5>
        </form>
        {/* <div className='justify-end'>
          <h5>Deja inscrit?</h5>
          <Link href={'/connexion1'} className="text-blue-900 mr-4">Connexion</Link>
          </div> */}
      </div>
    </div>
  );
}
