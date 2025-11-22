import React from 'react'

const loginWithGoogle = () => {
  window.location.href = "https://farcal-back.onrender.com/login/oauth2/code/google";
};

export default function Googleconnexion() {
  return (
    <button onClick={loginWithGoogle} className='bg-violet-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-violet-600 transition-colors'>
      Se connecter avec Google
    </button>
  );
}
