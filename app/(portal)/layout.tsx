import GlobalAudio from '@/components/GlobalAudio'
import Footer from '@/components/navbar/footer'
import Header from '@/components/navbar/header'
import React, { Component } from 'react'

type props={
    children:React.ReactNode
}

const layout = ({children}:props) => {
  return (
    <div className='w-full min-h-screen'>
        {/* <GlobalAudio />  */}
        <Header />
        {children}
        <Footer />
    </div>
  )
}

export default layout