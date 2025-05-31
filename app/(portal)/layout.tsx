import GlobalAudio from '@/components/GlobalAudio'
import Footer from '@/components/navbar/footer'
import Header from '@/components/navbar/header'
import Script from 'next/script'
import React, { Component } from 'react'

type props={
    children:React.ReactNode
}

const layout = ({children}:props) => {
  return (
    <div className='w-full min-h-screen'>
        {/* <GlobalAudio />  */}
        <Header />
        <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyA0FzU66Ipq1sNCsehts5c7lArG5_NZ-O0`}
        strategy="beforeInteractive"
      />
        {children}
        <Footer />
    </div>
  )
}

export default layout