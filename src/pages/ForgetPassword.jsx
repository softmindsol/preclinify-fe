import React from 'react'
import Logo from '../components/Logo'
import { Link } from 'react-router-dom'

const ForgetPassword = () => {
    return (
        <div className='flex items-center  w-full'>
            <div className='bg-[#FFFFFF] h-screen flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%]'>
                <Logo />
                <p className='text-[16px] sm:text-[24px]  leading-[29px] font-medium text-[#3F3F46]'>Forget Password</p>
                <form action="" className='mt-2 space-y-3  w-[90%] sm:w-[430px]'>
                    <div>
                        <label htmlFor="" className='text-[#3CC8A1] text-[14px] sm:text-[16px] '>Email Address</label> <br />
                        <input type="text" placeholder='Enter your Email...' className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px]  md:placeholder:text-[16px]' />
                    </div>

                   
                    <div>
                        <button className='w-full h-[50px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] text-[14px] sm:text-[16px] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150'>Continue</button>
                    </div>
                    
                </form>
            </div>
            <div className='bg-[#F4F4F5] hidden lg:flex h-screen items-center justify-center w-[50%]'>
                <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
            </div>
        </div>
    )
}

export default ForgetPassword