import React from 'react'
import Logo from '../components/Logo'
import { Link } from 'react-router-dom'

const ResetPassword = () => {
    return (
        <div className='flex items-center  w-full'>
            <div className='bg-[#FFFFFF] h-screen flex items-center justify-center gap-y-5 flex-col w-[50%]'>
                <Logo />
                <p className='text-[24px] leading-[29px] font-medium text-[#3F3F46]'>Reset Password</p>
                <form action="" className='mt-2 space-y-3'>
                    <div>
                        <label htmlFor="" className='text-[#3CC8A1] text-[16px]'>Password</label> <br />
                        <input type="text" placeholder='Enter your Password...' className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-[430px] h-[50px]' />
                    </div>
                    <div>
                        <label htmlFor="" className='text-[#3CC8A1] text-[16px]'>Confirm Password</label> <br />
                        <input type="text" placeholder='Enter your Confirm Password...' className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-[430px] h-[50px]' />
                    </div>


                    <div>
                        <button className='w-[430px] h-[50px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150'>Update</button>
                    </div>

                </form>
            </div>
            <div className='bg-[#F4F4F5] flex h-screen items-center justify-center w-[50%]'>
                <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
            </div>
        </div>
    )
}

export default ResetPassword