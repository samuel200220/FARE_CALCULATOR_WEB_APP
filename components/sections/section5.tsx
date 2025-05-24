import React from 'react'

const Section5 = () => {
  return (
    <section id='mobile' className='mt-40 mb-0 justify-center items-center flex flex-col'>
        <h2 className='text-4xl text-center mb-8 underline decoration-black decoration-2 text-black  dark:text-white dark:underline dark:decoration-white'>DISPONIBLE SUR MOBILE</h2>
        <div className='flex justify-center items-center gap-10'>
            <div className='w-full h-full relative'>
                <img src="/mobile_img.jpeg" className='w-full h-full object-cover' />
            </div>
            <div>
                <p className='text-sm dark:text-white'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque, nisi adipisci architecto ipsum mollitia quisquam fugiat tempora? Ipsam ut magnam delectus excepturi ipsa error aperiam porro, neque, veniam dolore quasi reiciendis totam! Numquam accusantium neque eveniet reiciendis, magnam assumenda alias quos error laudantium impedit accusamus molestiae officia vero totam illo?</p>
            </div>
        </div>
    </section>
  )
}

export default Section5