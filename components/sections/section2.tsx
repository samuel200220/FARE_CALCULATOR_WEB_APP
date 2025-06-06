import Link from 'next/link'
import React from 'react'

const Section2 = () => {
  return (
    // <section id='services' className='bg-white dark:bg-[#0D1B2A] h-[700px] pt-32 justify-center mt-40 mb-0 dark:from-blue-800 dark:to-blue-700'>
    //     <h2 className='text-5xl sm:text-3xl md:text-2xl lg:text-5xl text-center mb-8 text-blue-700 font-bold dark:text-white dark:decoration-white'>Nos Services</h2>
    //     <div className='flex flex-col lg:flex-row justify-center items-center gap-10'>
    //         <Link href={'#'}>
    //         <div className='w-72 md:w-80 h-80 flex-none m-4 bg-gray-100 p-4 rounded-4xl dark:bg-gray-800 dark:text-white border overflow-hidden relative shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
    //             <h3 className='text-center mb-5 text-2xl'><span className="text-blue-700 font-bold">Reserver</span> Un Taxi Pour Une Course</h3>
    //             <p className='text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis facilis veniam nesciunt dicta iure? Repudiandae, at praesentium quos delectus ullam velit sapiente sunt labore magni? Ea nisi molestiae dolorem voluptatem!</p>
    //         </div>
    //         </Link>
    //         <Link href={'#'}>
    //         <div className='w-72 md:w-80 h-80 flex-none m-4 bg-gray-100 p-4 rounded-4xl dark:bg-gray-800 dark:text-white border overflow-hidden relative shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
    //             <h3 className='text-center mb-5 text-2xl'><span className="text-blue-700 font-bold">Reserver</span> Une Place Dans Un Taxi</h3>
    //             <p className='text-sm'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit laudantium quibusdam, ipsam necessitatibus earum repellat officiis delectus totam adipisci voluptatem cumque sit rem asperiores dolores ut culpa? Laudantium, laboriosam numquam.</p>
    //         </div>
    //         </Link>
    //         <Link href={'#'}>
    //         <div className='w-72 md:w-80 h-80 flex-none m-4 bg-gray-100 p-4 rounded-4xl dark:bg-gray-800 dark:text-white border overflow-hidden relative shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>

    //             <h3 className='text-center mb-5 text-2xl'><span className="text-blue-700 font-bold">Reserver</span> Chauffeur Pour Le Depot</h3>
    //             <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque!</p>
    //         </div>
    //         </Link>
    //     </div>
    // </section>
    <section id='services' className='bg-white dark:bg-[#0D1B2A] pt-10 pb-10 lg:pt-32 lg:rounded-none lg:ml-0 lg:mr-0 lg:pb-32 sm:pt-10 sm:pb-8 sm:rounded-3xl sm:ml-4 sm:mr-4 lg:mt-40 sm:mt-40 md:mt-40 mt-20 mb-0 px-4'>
  <h2 className='text-xl sm:text-4xl lg:text-5xl text-center mb-6 lg:mb-8 sm:mb-10 md:mb-10 text-blue-700 font-bold dark:text-white'>Nos Services</h2>

  <div className='flex flex-col lg:flex-row justify-center items-center gap-10 w-full max-w-6xl mx-auto'>
    <Link href={'#'} className='px-3'>
      <div className='w-full lg:max-w-xs lg:h-80 sm:flex sm:flex-col md:flex md:flex-col bg-gray-100 p-4 sm:rounded-xl md:rounded-xl lg:rounded-4xl rounded-xl dark:bg-gray-800 dark:text-white border shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
        <h3 className='text-center mb-5 text-2xl'><span className="text-blue-700 font-bold">Réserver</span> Un Taxi Pour Une Course</h3>
        <p className='text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis facilis veniam nesciunt dicta iure? Repudiandae, at praesentium quos delectus ullam velit sapiente sunt labore magni? Ea nisi molestiae dolorem voluptatem!</p>
      </div>
    </Link>

    <Link href={'#'} className='px-3'>
         <div className='w-full lg:max-w-xs lg:h-80 sm:flex sm:flex-col md:flex md:flex-col bg-gray-100 p-4 sm:rounded-xl md:rounded-xl lg:rounded-4xl rounded-xl dark:bg-gray-800 dark:text-white border shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
             <h3 className='text-center mb-5 text-2xl'><span className="text-blue-700 font-bold">Reserver</span> Une Place Dans Un Taxi</h3>
             <p className='text-sm'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit laudantium quibusdam, ipsam necessitatibus earum repellat officiis delectus totam adipisci voluptatem cumque sit rem asperiores dolores ut culpa? Laudantium, laboriosam numquam.</p>
         </div>
     </Link>
    <Link href={'#'} className='px-3'>
        <div className='w-full lg:max-w-xs lg:h-80 sm:flex sm:flex-col md:flex md:flex-col bg-gray-100 p-4 sm:rounded-xl md:rounded-xl lg:rounded-4xl rounded-xl dark:bg-gray-800 dark:text-white border shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
             <h3 className='text-center mb-5 text-2xl'><span className="text-blue-700 font-bold">Reserver</span> Chauffeur Pour Le Depot</h3>
             <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque!</p>
             </div>
     </Link>
  </div>
</section>

  )
}

export default Section2