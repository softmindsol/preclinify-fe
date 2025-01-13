import React, { useState } from 'react'
import Siderbar from '../components/common/Sidebar'
import { FaClock, FaRobot } from "react-icons/fa";
import { PiCircleHalfFill } from "react-icons/pi";
import { MdOutlinePayments } from 'react-icons/md';
import Logo from '../components/common/Logo';
import { TbBaselineDensityMedium } from "react-icons/tb";
// import component 👇
import { RxCross2 } from "react-icons/rx";

import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import { Link } from 'react-router-dom';
import  supabase  from '../helper'; // Import the Supabase client

const Setting = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }
    // Logout function
    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            console.log("User logged out successfully");
            // Optionally, redirect the user to the login page
            window.location.href = '/login'; // You can replace this with a routing library like react-router if you prefer
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };


    return (
        <div className=' lg:flex  min-h-screen w-full'>

            <div className="h-full hidden lg:block fixed">
                <Siderbar />
            </div>
            <div className='flex items-center justify-between p-5 bg-white lg:hidden w-full'>
                <div className=''>
                    <img src="/assets/small-logo.png" alt="" />
                </div>

                <div className='' onClick={toggleDrawer}>
                    <TbBaselineDensityMedium/>
                </div>
            </div>
           

            <div className="min-h-screen bg-gray-100 text-[#3F3F46] lg:p-6 mt-5 lg:mt-0 w-full ml-[250px] overflow-y-auto">
                <h1 className="text-[24px] font-bold mb-6 hidden lg:block">Settings</h1>

                {/* General Section */}
                <div className="bg-white shadow-md lg:rounded-md mb-6 p-4">
                    <h2 className="text-[14px] sm:text-[16px] font-semibold mb-4 text-[#000000]">General</h2>
                    <div className="flex items-center gap-x-40 mb-4">
                        <div>
                            <p className="font-medium text-[#3F3F46] text-[12px] sm:text-[14px] flex items-center gap-x-2 "> <FaClock /> Exam Date Countdown</p>

                        </div>

                        <div
                            className={`relative inline-flex items-center h-4 w-8 cursor-pointer sm:ml-32 rounded-full transition-colors ${false ? "bg-green-500" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`absolute left-0.5 top-0.5 h-3 w-3 transform rounded-full bg-white shadow-md transition-transform ${false ? "translate-x-5" : "translate-x-0"
                                    }`}
                            ></span>
                        </div>
                    </div>
                    <p className="text-[12px] sm:text-[14px] text-[#71717A] ">
                        Tracks the time remaining until your exam day.
                    </p>

                </div>

                <div className='bg-white shadow-md lg:rounded-md mb-6 p-4 space-y-3'>
                    <p className="font-semibold text-[#000000] text-[14px] sm:text-[16px]">Appearance</p>
                    <div className="flex items-center gap-x-56 sm:gap-x-60">

                        <div>

                            <div className='flex items-center gap-x-2 '>
                                <PiCircleHalfFill />

                                <p className="text-[12px] sm:text-[14px] text-[#3F3F46] whitespace-nowrap font-medium">Dark Mode</p>
                            </div>


                        </div>
                        <div
                            className={`relative inline-flex items-center h-4 w-8  cursor-pointer sm:ml-32 rounded-full transition-colors ${false ? "bg-green-500" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`absolute left-0.5 top-0.5 h-3 w-3 transform rounded-full bg-white shadow-md transition-transform ${false ? "translate-x-5" : "translate-x-0"
                                    }`}
                            ></span>
                        </div>
                    </div>

                </div>

                {/* Billing Section */}
                <div className="bg-white shadow-md lg:rounded-md mb-6 p-4 text-[#000000]">
                    <div>
                        <h2 className= "text-[14px] sm:text-[16px]  font-semibold mb-4">Billing</h2>
                        <div className='flex items-center gap-x-20 sm:gap-x-40'>
                            <div className="sm:mb-4">
                                <div className='flex items-center gap-x-2'>
                                    <MdOutlinePayments />
                                    <p className="font-medium text-[14px] sm:text-[16px] text-[#000000]">Subscription</p>
                                </div>

                                <p className="text-[12px] sm:text-[14px] text-[#71717A] whitespace-nowrap">
                                    Your current subscription package.
                                </p>
                                <div className="flex justify-between items-center mt-2"> 
                                    <span className=" text-[12px] sm:text-[14px] font-medium">Platinum</span>
                                </div>
                            </div>
                            <button className="border-[1px] border-[#3CC8A1] font-medium text-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-2 py-1">Change Plan</button>
                        </div>

                    </div>

                    <div>
                        <div className='flex items-center gap-x-20 mt-5 sm:mt-0 sm:gap-x-40'>
                            <div className="mb-4">
                                <div className='flex items-center gap-x-2'>
                                    <FaRobot />
                                    <p className="font-medium text-[#000000] text-[14px] sm:text-[16px]">OSCE Credits</p>
                                </div>

                                <p className="text-[12px] sm:text-[14px] text-[#71717A] whitespace-nowrap">
                                    Your remaining credit for OSCE
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-semibold text-[12px] sm:text-[14px]">6969</span>
                                </div>
                            </div>
                            <button className="border-[1px] border-[#3CC8A1] text-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-2 py-1">Purchase Credit</button>
                        </div>

                    </div>

                </div>

                {/* Subscriptions Section */}
                <div className="bg-white shadow-md lg:rounded-md mb-6 p-4">
                    <h2 className="text-[16px] sm:text-[18px] font-semibold mb-4">Subscriptions</h2>
                    <div className="flex items-center justify-between mb-4 ">
                        <div>
                            <div className='flex items-center  gap-x-2'>
                                <MdOutlinePayments />
                                <p className="font-medium text-[14px] sm:text-[16px]">Platinum Tier Subscription</p>
                            </div>
                            <p className="text-[14px] sm:text-[16px] text-[#71717A] font-bold">£3499 / Year</p>
                        </div>

                        <button className="border-[1px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1">Change plan</button>

                    </div>
                    <div className="flex space-x-4 mt-4">
                        <button className="border-[1px] font-semibold border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-3 py-2">
                            Purchase OSCE Credit
                        </button>
                        <button className="border-[1px] font-semibold border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-3 py-2">
                            Update Billing Information
                        </button>
                    </div>
                </div>

                {/* Account Section */}
                <div className="bg-white shadow-md lg:rounded-md p-4">
                    <h2 className="text-[16px] sm:text-[18px] font-semibold mb-4 text-[#3F3F46]">Account</h2>
                    <div className="mb-4 flex flex-col   sm:flex-row sm:items-center sm:justify-between  ">
                        <label className="block font-medium mb-1 text-[14px] sm:text-[16px]">Display Name</label>
                        <input
                            type="text"
                            className="w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px]"
                            placeholder="Sainavi Mahajan"
                        />
                    </div>
                    <div className="mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between">
                        <label className="block font-medium mb-1 text-[14px] sm:text-[16px]">First Name</label>
                        <input
                            type="text"
                            className="w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px]"
                            placeholder="Sainavi"
                        />
                    </div>
                    <div className="mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between">
                        <label className="block font-medium mb-1">Last Name</label>
                        <input
                            type="text"
                            className="w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px]"
                            placeholder="Mahajan"
                        />
                    </div>
                    <div className="mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between">
                        <label className="block font-medium mb-1">University</label>
                        <input
                            type="text"
                            className="w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px]"
                            placeholder="University of Leicester"
                        />
                    </div>

                    <div className="mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between">
                        <label className="block font-medium mb-1">Year of Study</label>
                        <select name="" id="" className='w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px]'>
                            <option value="" disabled>Select Year of Study</option>
                            <option value="">Year 1</option>
                            <option value="">Year 2</option>
                            <option value="">Year 3</option>
                            <option value="">Year 4</option>

                        </select>
                    </div>
                    <div className='flex justify-end'>
                        <button className='bg-[#3CC8A1] px-2 py-1 text-white rounded-[8px] font-semibold' >Save</button>

                    </div>

                    <div className='flex flex-col gap-y-5 mt-10'>
                        <button className="border-[1px] w-[91px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1 font-semibold" onClick={handleLogout}>Log out</button>
                        <button className="border-[1px] w-[156px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1 font-semibold">Reset Password</button>

                        <button className="border-[1px] w-[152px] border-[#FF453A] text-[#ffff] bg-[#FF453A] hover:text-[#FF453A] hover:bg-transparent text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1 font-semibold">Delete Account</button>
                    </div>



                </div>

                <div className='bg-white shadow-md lg:rounded-md p-4 mt-6'>
                        <p className='text-[#3F3F46] text-[18px] font-semibold'>Advanced</p>
                    <div className='flex flex-col gap-y-5 mt-10'>
                        <button className="border-[1px] w-[156px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1 font-semibold">Clear Cache</button>

                        <button className="border-[1px] w-[190px] border-[#FF453A] text-[#ffff] bg-[#FF453A] hover:text-[#FF453A] hover:bg-transparent text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1.5 font-semibold">Reset Progress Data</button>
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

export default Setting