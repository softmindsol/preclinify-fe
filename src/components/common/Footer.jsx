import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='mt-20 md:mt-40 text-[12px] sm:text-[14px] lg:text-[16px]'>
      <div className=' text-[#3F3F46] font-medium flex items-center justify-center md:justify-start gap-x-10 sm:gap-x-14 lg:gap-x-20 sm:ml-16 px-2 '>
              <div className='space-y-1.5'>
          
          <p className='cursor-pointer hover:text-[#3CC8A1]'><NavLink to='/login'>Login</NavLink> </p>
          <p className='cursor-pointer hover:text-[#3CC8A1]'>  <NavLink to='/register'> Sign-up</NavLink></p>
          <p className='cursor-pointer hover:text-[#3CC8A1]'> <NavLink to='/contact-us'>Contact Us</NavLink> </p>
          <p className='cursor-pointer hover:text-[#3CC8A1]'> <NavLink to='/about-us'> About Us</NavLink> </p>
              </div>
              <div className='space-y-1.5'>
          <p className=''> Dashboard</p>
          <p className=''>Terms and Condition</p>
          <p className=''>Privacy Policy</p>
                 
              </div>
        <div className='space-y-1.5'>
          <p className='cursor-pointer hover:text-[#3CC8A1]'><NavLink to={'/pricing'}>Pricing</NavLink> </p>
          <p className=''>Refund Policy</p>
          <p className=''>FAQs</p>
              </div>

        </div>
      
      <div className='ml-6 md:ml-0 md:text-end md:mr-20 my-5 md:my-10'>
              <p className=' text-[#3F3F46] font-medium'>© 2025 Preclinify Technologies Ltd. All rights reserved</p>
        </div>
    </div>
  )
}

export default Footer