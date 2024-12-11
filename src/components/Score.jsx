import React from 'react'
import Sidebar from './Sidebar'

const Score = () => {
    return (
        <div className='flex w-full'>
            <div>
                <Sidebar />
            </div>
            <div className='w-full'>


                <div className='flex items-center justify-center flex-col'>
                    <div>
                        <img src="/assets/score.png" alt="" />
                    </div>

                    <div className='text-center  '>
                        <p className='text-[#3F3F46] font-bold text-[30px] '>Final Score:</p>
                        <p className='text-[#3CC8A1] font-extrabold text-[128px]'>96%</p>
                        <p className='text-[#A1A1AA] font-extrabold text-[24px] mb-5'>Sure you weren’t cheating?</p>
                    </div>
                    <div>
                        <button className='text-[#FF9741] font-semibold border-[1px] border-[#FF9741] bg-[#FFE9D6] p-2 rounded-[8px] w-[321px] h-[47px] hover:bg-[#FF9741] hover:text-white duration-200 transition-all'>REVIEW QUESTIONS</button>
                    </div>
                </div>


                <div className='space-y-3'>
                    <div className='text-center mr-[280px] mt-5'>
                        <p className='font-semibold text-[24px] text-[#3F3F46]'>Total Attempted: 258</p>
                    </div>
                    <div className='text-[#3F3F46] font-medium text-[24px] flex items-center justify-center gap-x-16'>
                        <p>Correct: 248</p>
                        <p>Incorrect: 10</p>
                        <p>Not Attempted: 37</p>
                    </div>
                </div>

                <div className='flex justify-center mt-5 items-center gap-x-1'>
                    <div className='w-[470px] p-1.5 rounded-[6px] bg-[#3CC8A1]'>
                        <span className='text-[24px] font-extrabold text-white flex items-center'>248</span>
                    </div>

                    <div className='w-[144px] bg-[#FF453A] text-right p-1.5'>
                        <span className=' text-[24px] font-extrabold text-white'>10</span>
                    </div>
                </div>
              

            </div>
        </div>
    )
}

export default Score