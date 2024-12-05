import React from 'react'

const Footer = () => {
  return (
    <div className='mt-40'>
      <div className='text-[16px] text-[#3F3F46] font-medium flex items-center justify-end gap-x-20 mr-20 '>
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
      
      <div className='text-end mr-20 my-10'>
              <p className='text-[16px] text-[#3F3F46] font-medium'>© 2025 Preclinify Technologies Ltd. All rights reserved</p>
        </div>
    </div>
  )
}

export default Footer