import React from 'react'

const Section4 = () => {
  return (
    <section id='propos' className='mt-40 mb-0 justify-center items-center flex flex-col'>
        <h2 className='text-4xl text-center mb-8 text-blue-600 font-bold dark:text-white'>A Propos De Nous</h2>
        <div className='flex justify-center items-center gap-6'>
            <div className='w-72 h-80 flex-none m-6 bg-white p-4 rounded-4xl border overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
                <h3 className='text-violet-700 text-center mb-5 text-2xl'>Pourquoi</h3>
                <hr className='bg-black'/>
                <p className='text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis facilis veniam nesciunt dicta iure? Repudiandae, at praesentium quos delectus ullam velit sapiente sunt labore magni? Ea nisi molestiae dolorem voluptatem!</p>
            </div>
            <div className='w-72 h-80 flex-none m-2 bg-white p-4 rounded-4xl border overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
            <h3 className='text-violet-700 text-center mb-5 text-2xl'>Vision</h3>
                <hr className='bg-black'/>
                <p className='text-sm'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit laudantium quibusdam, ipsam necessitatibus earum repellat officiis delectus totam adipisci voluptatem cumque sit rem asperiores dolores ut culpa? Laudantium, laboriosam numquam.</p>
            </div>
            <div className='w-73 h-80 flex-none m-6 bg-white p-4 rounded-4xl border overflow-hidden relative shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl hover:cursor-pointer'>
            <h3 className='text-violet-700 text-center mb-5 text-2xl'>Objectif</h3>
                <hr className='bg-black'/>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque! Quisquam, voluptatibus. Quod, cumque!</p>
            </div>
        </div>
    </section>
  )
}

export default Section4