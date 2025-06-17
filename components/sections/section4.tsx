import React from 'react'

const Section4 = () => {
  return (
    <section id='propos' className='hidden lg:flex mt-40 mb-0 justify-center h-[630px] bg-white dark:bg-[#0D1B2A] pt-14 items-center flex-col'>
        <h2 className='text-5xl sm:text-4xl md:text-2xl lg:text-5xl text-center mb-8 text-blue-700 font-bold dark:text-white'>A Propos De Nous</h2>
        <div className='flex justify-center items-center gap-6'>
            <div className='w-72 h-80 flex-none m-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-4xl border overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
                <h3 className='text-violet-500 text-center mb-5 text-2xl'>Pourquoi</h3>
                <hr className='bg-black'/>
                <p className='text-sm dark:text-white'>Découvrez pourquoi notre entreprise est le choix idéal pour vos besoins de transport. Avec une équipe dédiée et un service client exceptionnel, nous mettons tout en œuvre pour vous offrir une expérience de voyage agréable et sans stress. Rejoignez-nous dès maintenant !</p>
            </div>
            <div className='w-72 h-80 flex-none m-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-4xl border overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
            <h3 className='text-violet-500 text-center mb-5 text-2xl'>Vision</h3>
                <hr className='bg-black'/>
                <p className='text-sm dark:text-white'>Notre vision est de révolutionner le secteur du transport en proposant des solutions innovantes et durables. Nous aspirons à devenir un leader mondial en offrant un service fiable, écologique et accessible à tous, aujourd’hui et demain.</p>
            </div>
            <div className='w-73 h-80 flex-none m-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-4xl border overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
            <h3 className='text-violet-500 text-center mb-5 text-2xl'>Objectif</h3>
                <hr className='bg-black'/>
                <p className='text-sm dark:text-white'>Notre objectif est de garantir la satisfaction de chaque client grâce à une ponctualité irréprochable et un professionnalisme constant. Nous visons à élargir notre réseau pour desservir encore plus de destinations, tout en maintenant des standards élevés.</p>
            </div>
        </div>
    </section>
  )
}

export default Section4