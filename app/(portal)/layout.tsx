import Footer from '@/components/navbar/footer'
import Header from '@/components/navbar/header'
import React from 'react'

type props={
    children:React.ReactNode
}

const layout = ({children}:props) => {
  return (
    <div className='w-full min-h-screen'>
        <Header />
        {children}
        <Footer />
    </div>
  )
}

export default layout