import React from 'react'
import Logo from '../components/Logo'
import { Link } from 'react-router-dom'

const Register = () => {
    return (
        <div className='flex items-center  w-full'>
            <div className='bg-[#FFFFFF] h-screen flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%] '>
                <Logo />
                <p className='text-[16px] sm:text-[24px] leading-[29px] font-medium text-[#3F3F46]'>Sign up into Preclinify</p>
                <form action="" className="mt-2 space-y-3 w-[90%] sm:w-[430px]">
                    <div>
                        <label htmlFor="" className="text-[#3CC8A1] text-[14px] sm:text-[16px]">
                            Email Address
                        </label>{" "}
                        <br />
                        <input
                            type="text"
                            placeholder="Enter your Email..."
                            className="rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px]  md:placeholder:text-[16px]"
                        />
                    </div>
                    <div>
                        <label htmlFor="" className="text-[#3CC8A1] text-[14px] sm:text-[16px]">
                            Password
                        </label>{" "}
                        <br />
                        <input
                            type="text"
                            placeholder="Enter your Password..."
                            className="rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px]  md:placeholder:text-[16px]"
                        />
                    </div>
                    <div>
                        <label htmlFor="" className="text-[#3CC8A1] text-[14px] sm:text-[16px]">
                            Confirm Password
                        </label>{" "}
                        <br />
                        <input
                            type="text"
                            placeholder="Enter your Confirm Password..."
                            className="rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px]  md:placeholder:text-[16px]"
                        />
                    </div>
                    <div>
                        <label htmlFor="" className="text-[#3CC8A1] text-[14px] sm:text-[16px]">
                            Phone
                        </label>{" "}
                        <br />
                        <input
                            type="text"
                            placeholder="Enter your Phone Number..."
                            className="rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px]  md:placeholder:text-[16px]"
                        />
                    </div>
                    <div className="text-[#3F3F46] font-medium w-full space-y-3">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46]"
                            >
                                I agree to <span className="underline">Terms and conditions</span> and{" "}
                                <span className="underline">Privacy Policy</span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="emailUpdates"
                                name="emailUpdates"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                            />
                            <label
                                htmlFor="emailUpdates"
                                className="mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46]"
                            >
                                Send me tips, updates and promotions via email
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="smsUpdates"
                                name="smsUpdates"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                            />
                            <label
                                htmlFor="smsUpdates"
                                className="mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46]"
                            >
                                Send me tips, updates and promotions via SMS
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="w-full h-[50px] text-[14px] sm:text-[16px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150">
                            Sign Up
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-[#3F3F46] text-[14px] sm:text-[16px] font-medium">
                            Don’t have an account?{" "}
                            <Link to="/login">
                                <span className="text-[#3CC8A1]">Log in</span>
                            </Link>
                        </p>
                    </div>
                </form>

            </div>
            <div className='bg-[#F4F4F5] hidden lg:flex h-screen items-center justify-center w-[50%]'>
                <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
            </div>
        </div>
    )
}

export default Register