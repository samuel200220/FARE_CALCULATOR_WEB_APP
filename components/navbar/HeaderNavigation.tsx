import React from 'react'

type Headerprops={
    title:string
    subtitle:string
}
const HeaderNavigation = ({title, subtitle}:Headerprops) => {
  return (
    <div className='flex flex-col space-y-1 w-full'>
        <div className='font-semibold'>
            {title}
        </div>
        <div className='text-sm'>
            {subtitle}
        </div>
    </div>
  )
}

export default HeaderNavigation