import Link from 'next/link'
import React from 'react'
import { BiLogoTwitter, BiLogoFacebook, BiLogoInstagram } from 'react-icons/bi';

const Footer = () => {
  return (
    <footer className='w-full bg-blue-900 mt-8'>
        <h2 className='text-center text-black'>Suivez nous</h2>
        <div className='justify-center items-center flex gap-6'>
            <Link href={'#'}>
                <BiLogoTwitter className='w-10 h-10 dark:bg-white'/>
            </Link>
            <Link href={'#'}>
                <BiLogoFacebook className='w-10 h-10 dark:bg-white'/>
            </Link>
            <Link href={'#'}>
                <BiLogoInstagram className='w-10 h-10 dark:bg-white'/>
            </Link>
        </div>
    </footer>
  )
}

export default Footer