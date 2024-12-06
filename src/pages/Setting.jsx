import React from 'react'
import Siderbar from '../components/Siderbar'
import { FaClock, FaRobot } from "react-icons/fa";
import { PiCircleHalfFill } from "react-icons/pi";
import { MdOutlinePayments } from 'react-icons/md';
import Logo from '../components/Logo';
import { TbBaselineDensityMedium } from "react-icons/tb";

const Setting = () => {
    return (
        <div className=' lg:flex  min-h-screen w-full'>

            <div className="h-full hidden lg:block ">
                <Siderbar />
            </div>
            <div className='flex items-center justify-between p-5 bg-white lg:hidden w-full'>
                <div className=''>
                    <img src="/assets/small-logo.png" alt="" />
                </div>

                <div>
                    <TbBaselineDensityMedium/>
                </div>
            </div>
           

            <div className="min-h-screen bg-gray-100 text-[#3F3F46] lg:p-6 mt-5 lg:mt-0 w-full">
                <h1 className="text-[24px] font-bold mb-6 hidden lg:block">Settings</h1>

                {/* General Section */}
                <div className="bg-white shadow-md lg:rounded-md mb-6 p-4">
                    <h2 className="text-[14px] sm:text-[16px] font-semibold mb-4 text-[#000000]">General</h2>
                    <div className="flex items-center gap-x-40 mb-4">
                        <div>
                            <p className="font-medium text-[12px] sm:text-[14px] flex items-center gap-x-2 "> <FaClock /> Exam Date Countdown</p>

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
                    <p className="text-[12px] sm:text-[14px] ">
                        Tracks the time remaining until your exam day.
                    </p>

                </div>

                <div className='bg-white shadow-md lg:rounded-md mb-6 p-4 space-y-3'>
                    <p className="font-semibold text-[#000000] text-[14px] sm:text-[16px]">Appearance</p>
                    <div className="flex items-center gap-x-56 sm:gap-x-60">

                        <div>

                            <div className='flex items-center gap-x-2 '>
                                <PiCircleHalfFill />

                                <p className="text-[12px] sm:text-[14px] text-[#3F3F46] whitespace-nowrap ">Dark Mode</p>
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
                                    <span className="font-semibold text-[12px] sm:text-[14px]">Platinum</span>
                                </div>
                            </div>
                            <button className="border-[1px] border-[#3CC8A1] text-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-2 py-1">Change Plan</button>
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
                            <p className="text-[14px] sm:text-[16px] text-[#71717A]">£3499 / Year</p>
                        </div>

                        <button className="border-[1px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1">Change plan</button>

                    </div>
                    <div className="flex space-x-4 mt-4">
                        <button className="border-[1px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-3 py-2">
                            Purchase OSCE Credit
                        </button>
                        <button className="border-[1px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-3 py-2">
                            Update Billing Information
                        </button>
                    </div>
                </div>

                {/* Account Section */}
                <div className="bg-white shadow-md lg:rounded-md p-4">
                    <h2 className="text-[16px] sm:text-[18px] font-semibold mb-4 text-[#3F3F46]">Account</h2>
                    <div className="mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between  ">
                        <label className="block font-medium mb-1 text-[14px] sm:text-[16px]">Display Name</label>
                        <input
                            type="text"
                            className="w-[320px] p-2 border rounded-[8px]"
                            placeholder="Sainavi Mahajan"
                        />
                    </div>
                    <div className="mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between">
                        <label className="block font-medium mb-1 text-[14px] sm:text-[16px]">First Name</label>
                        <input
                            type="text"
                            className="w-[320px] p-2 border rounded-[8px]"
                            placeholder="Sainavi"
                        />
                    </div>
                    <div className="mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between">
                        <label className="block font-medium mb-1">Last Name</label>
                        <input
                            type="text"
                            className="w-[320px] p-2 border rounded-[8px]"
                            placeholder="Mahajan"
                        />
                    </div>
                    <div className="mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between">
                        <label className="block font-medium mb-1">University</label>
                        <input
                            type="text"
                            className="w-[320px] p-2 border rounded-[8px]"
                            placeholder="University of Leicester"
                        />
                    </div>

                    <div className="mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between">
                        <label className="block font-medium mb-1">Year of Study</label>
                        <select name="" id="" className='w-[320px] p-2 border rounded-[8px]'>
                            <option value="" disabled>Select Year of Study</option>
                            <option value="">Year 1</option>
                            <option value="">Year 2</option>
                            <option value="">Year 3</option>
                            <option value="">Year 4</option>

                        </select>
                    </div>
                    <div className='flex justify-end'>
                        <button className='bg-[#3CC8A1] px-2 py-1 text-white rounded-[8px] ' >Save</button>

                    </div>

                    <div className='flex flex-col gap-y-5 mt-10'>
                        <button className="border-[1px] w-[91px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1">Log out</button>
                        <button className="border-[1px] w-[156px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1">Reset Password</button>

                        <button className="border-[1px] w-[152px] border-[#FF453A] text-[#ffff] bg-[#FF453A] hover:text-[#FF453A] hover:bg-transparent text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1">Delete Account</button>
                    </div>



                </div>

                <div className='bg-white shadow-md lg:rounded-md p-4 mt-6'>
                        <p className='text-[#3F3F46] text-[18px] font-semibold'>Advanced</p>
                    <div className='flex flex-col gap-y-5 mt-10'>
                        <button className="border-[1px] w-[156px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1">Clear Cache</button>

                        <button className="border-[1px] w-[190px] border-[#FF453A] text-[#ffff] bg-[#FF453A] hover:text-[#FF453A] hover:bg-transparent text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1.5">Reset Progress Data</button>
                    </div>
                </div>



            </div>
        </div>
      

    )
}

export default Setting