import GlobalAudio from '@/components/GlobalAudio'
import Footer from '@/components/navbar/footer'
import Header from '@/components/navbar/header'
import Headerpro from '@/components/navbar/headerpro'
import Section1 from '@/components/sections/section1'
import Section1pro from '@/components/sections/section1pro'
import Section2 from '@/components/sections/section2'
import Section2pro from '@/components/sections/section2pro'
import Section3 from '@/components/sections/section3'
import Section4 from '@/components/sections/section4'
import Section4pro from '@/components/sections/section4pro'
import Section5 from '@/components/sections/section5'
import Section5pro from '@/components/sections/section5pro'
import Section6 from '@/components/sections/section6'
import Section7 from '@/components/sections/section7'
import Section7pro from '@/components/sections/section7pro'
import Titre from '@/components/sections/titre'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import Script from 'next/script'
import React from 'react'

const page = () => {
  return (
    <>
      {/* <Button variant={'ghost'} className='border border-black'>Mode sombre</Button> */}
      <Headerpro />
      <Titre />
      <Section1pro />
      <Section2pro />
      {/* <Section3/> */}
      <Section7pro />
      <Section4pro />
      <Section5pro/>
      {/* <Section6/> */}
      <Footer />
    </>
  )
}

export default page