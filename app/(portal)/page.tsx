import GlobalAudio from '@/components/GlobalAudio'
import Section1 from '@/components/sections/section1'
import Section2 from '@/components/sections/section2'
import Section3 from '@/components/sections/section3'
import Section4 from '@/components/sections/section4'
import Section5 from '@/components/sections/section5'
import Section6 from '@/components/sections/section6'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import React from 'react'

const page = () => {
  return (
    <>
      {/* <Button variant={'ghost'} className='border border-black'>Mode sombre</Button> */}
      <ModeToggle />
      <Section1 />
      <Section2/>
      <Section3/>
      <Section4/>
      <Section5/>
      <Section6/>
    </>
  )
}

export default page