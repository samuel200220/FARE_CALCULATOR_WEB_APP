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
                <p className='text-sm dark:text-white'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis facilis veniam nesciunt dicta iure? Repudiandae, at praesentium quos delectus ullam velit sapiente sunt labore magni? Ea nisi molestiae dolorem voluptatem!</p>
            </div>
            <div className='w-72 h-80 flex-none m-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-4xl border overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
            <h3 className='text-violet-500 text-center mb-5 text-2xl'>Vision</h3>
                <hr className='bg-black'/>
                <p className='text-sm dark:text-white'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit laudantium quibusdam, ipsam necessitatibus earum repellat officiis delectus totam adipisci voluptatem cumque sit rem asperiores dolores ut culpa? Laudantium, laboriosam numquam.</p>
            </div>
            <div className='w-73 h-80 flex-none m-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-4xl border overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
            <h3 className='text-violet-500 text-center mb-5 text-2xl'>Objectif</h3>
                <hr className='bg-black'/>
                <p className='text-sm dark:text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque!</p>
            </div>
        </div>
    </section>
  )
}

export default Section4