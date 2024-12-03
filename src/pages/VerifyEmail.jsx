import React from 'react'
import Logo from '../components/Logo'
import { Link } from 'react-router-dom'

const VerifyEmail = () => {
  return (
    <div className='flex items-center  w-full'>
          <div className='bg-[#FFFFFF] h-screen flex items-center justify-center gap-y-5 flex-col w-[50%]'>
            <Logo/>
              <p className='text-[24px] leading-[29px] font-medium text-[#3F3F46]'>We’ve sent you an email! </p>
              <p className='text-center text-[16px] font-medium text-[#3F3F46]'>Open the verification email to confirm your <br /> email address, and you’re in!</p>
              <div>
                  <button className='w-[430px] h-[50px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150'>I’ve confirmed my email</button>
              </div>   
              <div className='text-center'>
                  <p className='text-[#3F3F46] text-[16px] font-medium'>Already have an account? <Link to='/login'><span className='text-[#3CC8A1] underline'>Log in</span> </Link>  </p>
              </div>     
              </div>
          <div className='bg-[#F4F4F5] flex h-screen items-center justify-center w-[50%]'>
              <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
          </div> 
    </div>
  )
}

export default VerifyEmail