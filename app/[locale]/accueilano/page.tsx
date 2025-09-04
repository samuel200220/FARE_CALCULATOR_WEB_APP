import InscriptionSection from '@/components/direction'
import GlobalAudio from '@/components/GlobalAudio'
import Footer from '@/components/navbar/footer'
import Header from '@/components/navbar/header'
import Headerano from '@/components/navbar/headerano'
import Section1 from '@/components/sections/section1'
import Section1ano from '@/components/sections/section1ano'
import Section2 from '@/components/sections/section2'
import Section3 from '@/components/sections/section3'
import Section4 from '@/components/sections/section4'
import Section5 from '@/components/sections/section5'
import Section6 from '@/components/sections/section6'
import Section7 from '@/components/sections/section7'
import Titre from '@/components/sections/titre'
import Titreano from '@/components/sections/titreano'
import StatsSection from '@/components/statsection'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import Script from 'next/script'
import React from 'react'
import { useTranslations } from 'next-intl';

const Page = () => {
  const t = useTranslations('Section4');
  return (
    <>
      {/* <Button variant={'ghost'} className='border border-black'>Mode sombre</Button> */}
      <Headerano />
      <Titreano />
      {/* <InscriptionSection/> */}
      <Section1ano />
      <Section2/>
      {/* <Section3/> */}
      <Section7 />
      <Section4 />
      <Section5/>
      <StatsSection/>
      <InscriptionSection/>
      {/* <Section6/> */}
      <Footer />
    </>
  )
}
export default Page;
