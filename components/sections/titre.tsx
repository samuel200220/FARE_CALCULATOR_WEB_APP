import React from 'react'

const Titre = () => {
  return (
    // <div className='mb-7 mt-9 flex items-center justify-center'>
    //     <h1 className='text-blue-600 text-3xl'>Calculez vos Tarifs Avec Fare Calculator</h1>
    // </div>
    <section className='mb-7 mt-9 dark:bg-[#0D1B2A] bg-white flex flex-col items-center justify-center px-4'>
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
  <p className='text-center text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 dark:text-white'>
    Solution professionnelle pour obtenir des devis instantanés et précis
  </p>
</section>

  )
}

export default Titre