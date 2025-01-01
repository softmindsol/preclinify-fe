import React, { useState } from 'react';
import Logo from './Logo'; // Assuming this is your logo component or SVG
import { Link, NavLink } from 'react-router-dom';
import { TbBaselineDensityMedium } from "react-icons/tb";
// import component 👇
import { RxCross2 } from "react-icons/rx";
import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }

    return (

        <div className="fixed top-0 left-0 right-0 mt-6 z-50 bg-white rounded-[24px] mx-auto p-5 max-w-[95%] shadow-[0px_4px_10px_rgba(0,0,0,0.1)] border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
                {/* Logo Section */}
                <Link to='/'>
                    <div>
                        <Logo />
                    </div>
                </Link>

            

                <div className=' lg:hidden' onClick={toggleDrawer}>
                        <TbBaselineDensityMedium />
                    </div>
              

                {/* Navigation Links */}

                <div className="hidden lg:flex items-center gap-x-8">
                    <ul className="flex items-center gap-x-8 text-[#282F5A] text-[16px]">
                        <NavLink to='/'>
                            <li className="hover:text-[#28A079] font-medium cursor-pointer">
                                Home
                            </li>
                        </NavLink>

                        <NavLink to='/pricing'>
                            <li className="hover:text-[#28A079] font-medium cursor-pointer">
                                Pricing
                            </li>
                        </NavLink>

                        <li className="hover:text-[#28A079] font-medium cursor-pointer">
                            Textbook
                        </li>
                        <NavLink to={'/login'}>
                            <li className="hover:text-[#28A079] font-medium cursor-pointer">
                                Log In
                            </li>
                        </NavLink>

                    </ul>

                    {/* Sign-Up Button */}
                    <Link to="/signup">
                        <button className="px-6 py-2 bg-[#FFE6D4] text-[#FF7A28] font-bold rounded-[12px] hover:bg-[#FFDAC4] transition-all">
                            Sign Up Now
                        </button>
                    </Link>

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
                <div className=" ">
                    <ul className="flex p-5 flex-col gap-y-8 text-[#282F5A] text-[16px]">
                        <NavLink to='/'>
                            <li className="hover:text-[#28A079] font-medium cursor-pointer">
                                Home
                            </li>
                        </NavLink>

                        <NavLink to='/pricing'>
                            <li className="hover:text-[#28A079] font-medium cursor-pointer">
                                Pricing
                            </li>
                        </NavLink>

                        <li className="hover:text-[#28A079] font-medium cursor-pointer">
                            Textbook
                        </li>
                        <NavLink to={'/login'}>
                            <li className="hover:text-[#28A079] font-medium cursor-pointer">
                                Log In
                            </li>
                        </NavLink>
                        <Link to="/signup">
                            <button className="px-6 py-2 bg-[#FFE6D4] text-[#FF7A28] font-bold rounded-[12px] hover:bg-[#FFDAC4] transition-all">
                                Sign Up Now
                            </button>
                        </Link>

                    </ul>

                    {/* Sign-Up Button */}
                   

                </div>

            </Drawer>
        </div>
    );
};

export default Navbar;
