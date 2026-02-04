import React from 'react';
import { useTranslations } from 'next-intl';
import { FcGoogle } from 'react-icons/fc';

const loginWithGoogle = () => {
  window.location.href = "https://farcal-back.onrender.com/oauth2/authorization/google";
};

export default function Googleconnexion() {
  const t = useTranslations('landing');
  
  return (
    <div className="relative w-full">
      {/* Ligne de séparation */}
      {/* <div className="flex items-center justify-center my-6">
        <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
        <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">
          {t('orContinueWith') || "Ou continuer avec"}
        </span>
        <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
      </div> */}

      {/* Bouton Google */}
      <button
        onClick={loginWithGoogle}
        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] group"
      >
        <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
          <FcGoogle className="w-5 h-5" />
        </div>
        <span className="font-medium">
          {t('google') || "Continuer avec Google"}
        </span>
      </button>
    </div>
  );
}