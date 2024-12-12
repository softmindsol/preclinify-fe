import React, { useState } from 'react'
import Sidebar from './Sidebar'
// import component 👇
import Drawer from 'react-modern-drawer'
import { RxCross2 } from "react-icons/rx";

//import styles 👇
import 'react-modern-drawer/dist/index.css'
import { TbBaselineDensityMedium } from 'react-icons/tb';
import Logo from './Logo';
import { Link } from 'react-router-dom';
const Score = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }
    return (
        <div className='lg:flex  min-h-screen w-full'>
            <div className='hidden lg:block'>
                <Sidebar />
            </div>

            <div className='flex items-center justify-between p-5 bg-white lg:hidden w-full'>
                <div className=''>
                    <img src="/assets/small-logo.png" alt="" />
                </div>

                <div className='' onClick={toggleDrawer}>
                    <TbBaselineDensityMedium />
                </div>
            </div>
            <div className='w-full'>


                <div className='flex items-center justify-center flex-col mt-5'>
                    <div>
                        <img src="/assets/score.png" alt="" className='w-[350px]' />
                    </div>

                    <div className='text-center  '>
                        <p className='text-[#3F3F46] font-bold text-[18px] md:text-[24px] lg:text-[30px] '>Final Score:</p>
                        <p className='text-[#3CC8A1] font-black text-[72px] md:text-[96px] lg:text-[128px]'>96%</p>
                        <p className='text-[#A1A1AA] font-bold text-[14px] md:text-[20px] lg:text-[24px] mb-5'>Sure you weren’t cheating?</p>
                    </div>
                    <div>
                        <button className='text-[#FF9741] text-[12px] md:text-[14px] font-semibold border-[1px] border-[#FF9741] bg-[#FFE9D6] p-2 rounded-[8px] w-[250px] md:w-[321px] h-[38px] md:h-[47px] hover:bg-[#FF9741] hover:text-white duration-200 transition-all'>REVIEW QUESTIONS</button>
                    </div>
                </div>

                <div className='flex flex-col-reverse md:flex-col '>

                    <div className='space-y-3'>
                        <div className='text-center md:mr-[380px] mt-5'>
                            <p className='font-semibold text-[20px] lg:text-[24px] text-[#3F3F46]'>Total Attempted: 258</p>
                        </div>
                        <div className='text-[#3F3F46] font-medium text-[20px] lg:text-[24px] flex  flex-col md:flex-row items-center justify-center gap-x-16'>
                            <p>Correct: 248</p>
                            <p>Incorrect: 10</p>
                            <p>Not Attempted: 37</p>
                        </div>
                    </div>

                    <div className='flex justify-center mt-5 items-center gap-x-1'>
                        <div className='w-[470px] p-1.5 rounded-[6px] bg-[#3CC8A1]'>
                            <span className='text-[20px] lg:text-[24px] font-extrabold text-white flex items-center md:block hidden'>248</span>
                        </div>

                        <div className='w-[144px] bg-[#FF453A] text-right p-1.5'>
                            <span className=' text-[20px] lg:text-[24px] font-extrabold text-white md:block hidden'>10</span>
                        </div>
                    </div>
                </div>


            </div>
            <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction='right'
                className='bla bla bla'
                lockBackgroundScroll={true}
            >
                <div className='m-5' onClick={toggleDrawer}>
                    <RxCross2 />
                </div>

                <div className="mb-10 flex items-center justify-center">
                    <Logo />
                </div>
                <div className='flex min-h-screen overflow-y-auto  flex-col  justify-between'>


                    <nav className="space-y-5 w-full  text-[#3F3F46]">
                        {[
                            { name: "Dashboard", icon: "house" },
                            { name: "Practice", icon: "dumbbell" },
                            { name: "Performance", icon: "chart-line" },
                            { name: "Friends", icon: "git-merge" },
                            { name: "Textbook", icon: "book-open" },
                            { name: "OSCE", icon: "bed" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 px-6 group cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`lucide lucide-${item.icon} group-hover:text-[#3CC8A1]`}
                                >
                                    {/* Define paths for the icons */}
                                    {item.icon === "house" && (
                                        <>
                                            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        </>
                                    )}
                                    {item.icon === "dumbbell" && (
                                        <>
                                            <path d="M14.4 14.4 9.6 9.6" />
                                            <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
                                            <path d="m21.5 21.5-1.4-1.4" />
                                            <path d="M3.9 3.9 2.5 2.5" />
                                            <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
                                        </>
                                    )}
                                    {item.icon === "chart-line" && (
                                        <>
                                            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                                            <path d="m19 9-5 5-4-4-3 3" />
                                        </>
                                    )}
                                    {item.icon === "git-merge" && (
                                        <>
                                            <circle cx="18" cy="18" r="3" />
                                            <circle cx="6" cy="6" r="3" />
                                            <path d="M6 21V9a9 9 0 0 0 9 9" />
                                        </>
                                    )}
                                    {item.icon === "book-open" && (
                                        <>
                                            <path d="M12 7v14" />
                                            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                                        </>
                                    )}
                                    {item.icon === "bed" && (
                                        <>
                                            <path d="M2 4v16" />
                                            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                                            <path d="M2 17h20" />
                                            <path d="M6 8v9" />
                                        </>
                                    )}
                                </svg>
                                <span className="text-[14px] font-medium group-hover:text-[#3CC8A1]">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Settings */}
                    <div className="mt-auto w-full mb-40 px-6">
                        <Link to={'/setting'}>
                            <div className="flex items-center space-x-3 text-[#3F3F46] group cursor-pointer">
                                <i className="fa fa-cog text-xl group-hover:text-[#3CC8A1]"></i>
                                <span className="text-[14px] font-medium group-hover:text-[#3CC8A1]">
                                    Settings
                                </span>
                            </div>
                        </Link>

                    </div>

                </div>

            </Drawer>
        </div>
    )
}

export default Score