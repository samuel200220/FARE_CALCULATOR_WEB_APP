import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const Section6 = () => {
  return (
    <section className='hidden lg:flex mt-40 justify-center items-center flex-col mb-10'>
        <h2 className='text-4xl text-center mb-8 text-blue-600 font-bold dark:text-white'>Contactez-Nous</h2>
        <Input 
            className='bg-white w-110 h-12 px-4 py-2 rounded dark:text-white dark:bg-[#0D1B2A] border border-blue-600 shadow'
            placeholder='Message...'
            type='text'
        />
        <Button className='text-white cursor-pointer bg-blue-500 border mt-2 w-110 dark:bg-[#0D1B2A] dark:text-white dark:hover:bg-[#0D1B2A] shadow-lg hover:bg-blue-500
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'>Envoyer</Button>
    </section>
  )
}

export default Section6