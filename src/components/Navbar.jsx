import React from 'react';
import Logo from './Logo'; // Assuming this is your logo component or SVG
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (

        <div className="fixed top-0 left-0 right-0 mt-6 z-50 bg-white rounded-[24px] mx-auto p-5 max-w-[95%] shadow-[0px_4px_10px_rgba(0,0,0,0.1)] border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
                {/* Logo Section */}
                <div>
                    <Logo />
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-x-8">
                    <ul className="flex items-center gap-x-8 text-[#282F5A]">
                        <Link to='/'> 
                        <li className="hover:text-[#28A079] font-medium cursor-pointer">
                            Home
                        </li>
                        </Link>

                        <Link to='/pricing'>
                            <li className="hover:text-[#28A079] font-medium cursor-pointer">
                                Pricing
                            </li>
                        </Link>

                        <li className="hover:text-[#28A079] font-medium cursor-pointer">
                            Textbook
                        </li>
                        <Link to={'/login'}>
                            <li className="hover:text-[#28A079] font-medium cursor-pointer">
                                Log In
                            </li>
                        </Link>

                    </ul>

                    {/* Sign-Up Button */}
                    <Link to="/signup">
                        <button className="px-6 py-2 bg-[#FFE6D4] text-[#FF7A28] font-bold rounded-[12px] hover:bg-[#FFDAC4] transition-all">
                            Sign Up Now
                        </button>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default Navbar;
