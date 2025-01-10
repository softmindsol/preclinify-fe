import React from 'react'
import Navbar from '../components/common/Navbar'
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const Pricing = () => {
    return (
        <div className=''>
            <Navbar />

            <div className='flex flex-col items-center justify-center h-screen mt-[500px] lg:mt-16  overflow-hidden'>
                <div className='font-semibold text-[24px] lg:text-[36px]  text-[#52525B] text-center'>
                    <p>So confident </p>
                    <p>we can even guarantee you pass.</p>
                </div>
                <div className="flex w-[224px] font-extrabold h-[50px] items-center justify-center bg-[#3CC8A1] rounded-[8px] text-white gap-x-8">
                    <p className="hover:bg-white/20 px-4 py-2 cursor-pointer rounded">Termly</p>
                    <p className="hover:bg-white/20 px-4 py-2 cursor-pointer rounded">Annual</p>
                </div>
                <div className='text-[16px] text-[#71717A] mt-2'><p>past.. save at least <span className='text-[#FF9741]'>35%</span>  with an annual plan</p></div>
                <div>
                    <div className='flex flex-col lg:flex-row items-center justify-center gap-x-5'>
                        <div className='mt-5 relative  transition hover:shadow-greenBlur rounded-[16px]'>
                            <div className='h-[500px] lg:h-[556px]  w-[270px] lg:w-[310px] border-[1px] border-[#3CC8A1] rounded-[16px]'>
                                <div className='h-[100px] lg:h-[140px] w-full bg-[#3CC8A1] text-center rounded-tr-[14px] rounded-tl-[14px] p-5'>
                                    <p className='text-white font-bold text-[16px] lg:text-[20px]'>The OSCE plan</p>
                                    <p className='text-white font-extrabold text-[26px] lg:text-[40px]'>£84</p>
                                </div>
                                <div className='p-8 space-y-2'>
                                    <div className='flex items-center gap-x-5 text-[16px] lg:text-[18px]'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46] w-[60%]'>
                                            Station specific
                                            OSCE scenarios
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46]  w-[65%]'>
                                            60 hours of OSCE
                                            bot access
                                        </p>
                                    </div>
                                </div>

                                <div className='absolute bottom-5 left-1/2 transform -translate-x-1/2'>
                                    <button className='text-[16px] rounded-[8px] font-semibold text-[#3CC8A1] bg-transparent border-[1px] border-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white w-[232px] h-[40px] transition-all duration-200'>
                                        Get Access
                                    </button>
                                </div>
                            </div>

                        </div>
                        <div className='mt-5 relative  transition hover:shadow-greenBlur rounded-[16px]'>
                            <div className='h-[500px] lg:h-[556px] w-[270px] lg:w-[310px] border-[1px] border-[#3CC8A1] rounded-[16px]'>
                                <div className='h-[100px] lg:h-[140px] w-full bg-[#3CC8A1] text-center rounded-tr-[14px] rounded-tl-[14px] p-5'>
                                    <p className='text-white font-bold text-[16px] lg:text-[20px]'>The Full Package</p>
                                    <p className='text-white font-extrabold text-[26px] lg:text-[40px]'>£120</p>
                                </div>
                                <div className='p-8 space-y-2 text-[14px] lg:text-[16px]'>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46] '>
                                            The Full Package
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46] '>
                                            Everything in OSCE
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46] '>
                                            MLA  + Clinical Bank 
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46] '>
                                            SAQ question bank
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46] '>
                                            Pre-clinical 
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46]  '>
                                            Data interpretation
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46] '>
                                            Question generation
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46] '>
                                            Tutor Bot

                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46]'>
                                            Data interpretation
                                        </p>
                                    </div>
                                </div>

                                <div className='absolute bottom-5 left-1/2 transform -translate-x-1/2'>
                                    <button className='text-[16px] rounded-[8px] font-semibold text-[#3CC8A1] bg-transparent border-[1px] border-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white w-[232px] h-[40px] transition-all duration-200'>
                                        Get Access
                                    </button>
                                </div>
                            </div>

                        </div>
                        <div className='mt-5 relative  transition hover:shadow-greenBlur rounded-[16px]'>
                            <div className='h-[500px] lg:h-[556px] w-[270px] lg:w-[310px] border-[1px] border-[#3CC8A1] rounded-[16px]'>
                                <div className='h-[100px] lg:h-[140px] w-full bg-[#3CC8A1] text-center rounded-tr-[14px] rounded-tl-[14px] p-5'>
                                    <p className='text-white font-bold text-[16px] lg:text-[20px]'>The Pass Guarentee</p>
                                    <p className='text-white font-extrabold  text-[26px] lg:text-[40px]'>£1,280</p>
                                </div>
                                <div className='p-8 space-y-2 text-[14px] lg:text-[18px] '>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46]  w-[60%]'>
                                            Everything in The
                                            Full Package
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46]  w-[65%]'>
                                            Guaranteed pass
                                            of this academic year
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-5'>
                                        <IoMdCheckmarkCircleOutline color='#FF9741' size={20} />
                                        <p className='font-medium text-[#3F3F46]  w-[65%]'>
                                            1-1 Tutoring from a
                                            top decile student
                                        </p>
                                    </div>
                                </div>

                                <div className='absolute bottom-5 left-1/2 transform -translate-x-1/2'>
                                    <button className='text-[16px] rounded-[8px] font-semibold text-[#3CC8A1] bg-transparent border-[1px] border-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white w-[232px] h-[40px] transition-all duration-200'>
                                        Get Access
                                    </button>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>
               
            </div>
        </div>
    )
}

export default Pricing