import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

const Titreano = () => {
  return (
    // <div className='mb-7 mt-9 flex items-center justify-center'>
    //     <h1 className='text-blue-600 text-3xl'>Calculez vos Tarifs Avec Fare Calculator</h1>
    // </div>
    <section className='mb-7 mt-9 dark:bg-[#0D1B2A] bg-white flex flex-col items-center justify-center px-4 pb-6'>
  <div className='mb-6 mt-9 flex items-center justify-center'>
    <h1 className='text-blue-700 text-center font-bold dark:text-white dark:font-bold text-3xl sm:text-5xl md:text-5xl lg:text-6xl'>
      <span className='block text-black dark:text-white font-bold'>
        Calculez vos Tarifs de Transport en
      </span>
      <span className='block text-blue-500 font-bold'>
        Temps réel
      </span>
    </h1>
  </div>
  <p className='text-center text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 dark:text-white'>
    Solution professionnelle pour obtenir des devis instantanés et précis
  </p>
  <div>
    <Link href={"/inscription1"} >
    <Button className='mr-6 cursor-pointer bg-violet-800 dark:bg-violet-900 hover:bg-violet-800 dark:hover:bg-violet-900 transform transition-transform duration-300 ease-in-out hover:scale-105 lg:text-[18px] md:text-[18px] sm:text-[18px] text-[16px] text-white'>S'inscrire</Button>
    </Link>
    <Link href={"/connexion1"} >
    <Button className='cursor-pointer bg-violet-800 dark:bg-violet-900 hover:bg-violet-800 dark:hover:bg-violet-900 transform transition-transform duration-300 ease-in-out hover:scale-105 lg:text-[18px] md:text-[18px] sm:text-[18px] text-[16px] text-white'>Se connecter</Button>
    </Link>
  </div>
</section>

  )
}

export default Titreano