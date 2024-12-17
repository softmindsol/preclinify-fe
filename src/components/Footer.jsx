import React from 'react'

const Footer = () => {
  return (
    <div className='mt-20 md:mt-40 text-[14px] lg:text-[16px]'>
      <div className=' text-[#3F3F46] font-medium flex items-center justify-center md:justify-end gap-x-14 lg:gap-x-20 mr-20 '>
              <div className='space-y-3'>
                  <p>Login</p>
                  <p>Sign-up</p>
                  <p>Contact Us</p>
                  <p>About Us</p>
              </div>
              <div className='space-y-3'>
                  <p>Dashboard</p>
                  <p>Terms and Condition</p>
                  <p>Privacy Policy</p>
                  <p>Textbook</p>
              </div>
        <div className='space-y-3'>
                  <p>Pricing</p>
                  <p>Refund Policy</p>
                  <p>FAQs</p>
              </div>

        </div>
      
      <div className='ml-6 md:ml-0 md:text-end md:mr-20 my-5 md:my-10'>
              <p className=' text-[#3F3F46] font-medium'>© 2025 Preclinify Technologies Ltd. All rights reserved</p>
        </div>
    </div>
  )
}

export default Footer