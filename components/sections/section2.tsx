import React from 'react'

const Section2 = () => {
  return (
    <section id='services' className='mt-96 mb-0 m-8 rounded-4xl bg-gray-500 dark:bg-gradient-to-r dark:from-orange-800 dark:to-orange-700 dark:mt-96'>
        <h2 className='text-4xl text-center mb-8 text-black underline decoration-blue-500 decoration-2 dark:text-white dark:underline dark:decoration-white'>NOS SERVICES</h2>
        <div className='flex justify-center items-center gap-10'>
            <div className='w-72 h-80 flex-none m-6 bg-white p-4 rounded-4xl border border-blue-500 overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
                <h3 className='text-center mb-5 text-2xl'><span className="text-blue-600">RESERVER</span> UN TAXI POUR UNE COURSE</h3>
                <p className='text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis facilis veniam nesciunt dicta iure? Repudiandae, at praesentium quos delectus ullam velit sapiente sunt labore magni? Ea nisi molestiae dolorem voluptatem!</p>
            </div>
            <div className='w-72 h-80 flex-none m-2 bg-white p-4 rounded-4xl border border-blue-500 overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
                <h3 className='text-center mb-5 text-2xl'><span className="text-blue-600">RESERVER</span> UNE PLACE DANS UN TAXI</h3>
                <p className='text-sm'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit laudantium quibusdam, ipsam necessitatibus earum repellat officiis delectus totam adipisci voluptatem cumque sit rem asperiores dolores ut culpa? Laudantium, laboriosam numquam.</p>
            </div>
            <div className='w-73 h-80 flex-none m-6 bg-white p-4 rounded-4xl border border-blue-500 overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
                <h3 className='text-center mb-5 text-2xl'><span className="text-blue-600">RESERVER</span> CHAUFFEUR POUR LE DEPOT</h3>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque!</p>
            </div>
        </div>
    </section>
  )
}

export default Section2