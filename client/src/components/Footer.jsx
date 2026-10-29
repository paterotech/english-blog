import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/10'>
      <div>

      </div>
      <img src={assets.logo} alt="logo" className='w-10 sm:w-33 pt-5'/>
      <p className='py-4 text-center text-sm md:text-base text-gray-600'>Copyright 2026 © Powered by Jose R. Peñarredonda V. <img src={assets.sena_logo} alt="SENA" className='inline-block h-6 md:h-7 w-auto ml-1 align-middle'/></p>
    </div>
  )
}

export default Footer