import React from 'react'
import { useTranslations } from 'next-intl';

const loginWithGoogle = () => {
  window.location.href = "https://farcal-back.onrender.com/oauth2/authorization/google";
};

export default function Googleconnexion() {
  const t = useTranslations('landing');
  return (
    <button onClick={loginWithGoogle} className='bg-violet-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-violet-600 transition-colors'>
      {t('google')}
    </button>
  );
}
