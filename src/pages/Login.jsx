import React from 'react'
import Logo from '../components/Logo'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='flex items-center  w-full'>
          <div className='bg-[#FFFFFF] h-screen flex items-center justify-center gap-y-5 flex-col w-[50%]'>
            <Logo/>
              <p className='text-[24px] leading-[29px] font-medium text-[#3F3F46]'>Log into Preclinify</p>
              <form action="" className='mt-2 space-y-3'>
                <div>
                      <label htmlFor="" className='text-[#3CC8A1] text-[16px] '>Email Address</label> <br />
                      <input type="text" placeholder='Enter your Email...' className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-[430px] h-[50px]' />
                </div>
                <div>
                      <label htmlFor="" className='text-[#3CC8A1] text-[16px]'>Password</label> <br />
                      <input type="text" placeholder='Enter your Password...' className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-[430px] h-[50px]' />
                </div>
               
                  <div className="flex items-center justify-between h-[50px] w-[300px] lg:w-[360px] xl:w-[412px]">
                      <div className="flex items-center ">
                          <input
                              id="rememberMe"
                              name="rememberMe"
                              type="checkbox"
                              className="h-4 w-4  rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                          />
                          <label htmlFor="rememberMe" className="mx-3 text-[16px] font-medium text-[#3F3F46]">
                              Keep me logged in
                          </label>
                      </div>
                      <p>
                          <span className="relative z-10 cursor-pointer underline text-[16px] font-medium text-[#3F3F46] hover:text-[#3F3F46]">
                              Forgot password?
                          </span>
                      </p>
                  </div>
                  <div>
                      <button className='w-[430px] h-[50px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150'>Log in</button>
                  </div>
                  <div className='text-center'>
                      <p className='text-[#3F3F46] text-[16px] font-medium'>Don’t have an account? <Link to='/signup'> <span className='text-[#3CC8A1]'>Sign up</span></Link>  </p>
                  </div>
              </form>
        </div>
          <div className='bg-[#F4F4F5] flex h-screen items-center justify-center w-[50%]'>
              <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
          </div> 
    </div>
  )
}

export default Login