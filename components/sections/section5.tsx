import React from 'react'

const Section5 = () => {
  return (
    <section id='mobile' className='mt-40 w-full h-full bg-white dark:bg-[#0D1B2A] pt-20 sm:mb-24 md:mb-20 justify-center items-center flex flex-col'>
        <h2 className='text-5xl sm:text-4xl md:text-2xl lg:text-5xl text-center mb-8 text-blue-600 font-bold  dark:text-white'>Disponible Sur Mobile</h2>
        <div className='flex justify-center relative items-center gap-10'>
            {/* <div className='w-full h-full relative'>
                <img src="/telephone.jpg" className='w-full h-full relative object-cover' />
            </div>
            <div className='w-full h-full relative'>
                <img src="/tablette.jpg" className='w-full h-full relative object-cover' />
            </div> */}
            <div className='w-full h-full'>
                <img src="/mobile_img1.png" className='w-full h-full object-cover' />
            </div>
        </div>
    </section>
  )
}

export default Section5