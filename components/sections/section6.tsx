import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const Section6 = () => {
  return (
    <section className='mt-40 mb-0 justify-center items-center flex flex-col'>
        <h2 className='text-4xl text-center mb-8 underline decoration-violet-600 decoration-2 text-violet-600 dark:text-white dark:underline dark:decoration-white'>CONTACTEZ-NOUS</h2>
        <Input 
            className='bg-white w-110 h-12 px-4 py-2 rounded border border-violet-600 shadow'
            placeholder='Message...'
            type='text'
        />
        <Button className='text-black cursor-pointer bg-violet-500 border border-violet-600 mt-2 w-110 dark:text-black shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'>Envoyer</Button>
    </section>
  )
}

export default Section6