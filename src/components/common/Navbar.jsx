import React, { useState } from "react";
import Logo from "./Logo"; // Assuming this is your logo component or SVG
import { Link, NavLink } from "react-router-dom";
import { TbBaselineDensityMedium } from "react-icons/tb";
// import component 👇
import { RxCross2 } from "react-icons/rx";
import Drawer from "react-modern-drawer";
//import styles 👇
import "react-modern-drawer/dist/index.css";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const userId = localStorage.getItem("userId");
  console.log("userId:", userId);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 mx-auto mt-6 max-w-[95%] rounded-[24px] border border-[#E5E5E5] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/">
          <div>
            <Logo />
          </div>
        </Link>

        <div className="lg:hidden" onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>

        {/* Navigation Links */}

        <div className="hidden items-center gap-x-8 font-semibold lg:flex">
          <ul className="flex items-center gap-x-8 text-[16px] text-[#282F5A]">
            <NavLink to="/">
              <li className="cursor-pointer hover:text-[#28A079]">Home</li>
            </NavLink>

            <NavLink to="/pricing">
              <li className="cursor-pointer hover:text-[#28A079]">Pricing</li>
            </NavLink>
{
    userId ? 
      <NavLink to={`/dashboard`}>
        <li className="cursor-pointer hover:text-[#28A079]">Dashboard</li>
      </NavLink>: <NavLink to={"/login"}>
              <li className="cursor-pointer hover:text-[#28A079]">Log In</li>
            </NavLink>
    
}
           
          </ul>

          {/* Sign-Up Button */}
        { !userId &&  <Link to="/signup">
            <button className="rounded-[12px] bg-[#FFE6D4] px-6 py-2 font-extrabold text-[#FF7A28] transition-all hover:bg-[#FFDAC4]">
              Sign Up Now
            </button>
          </Link>}
        </div>
      </div>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        className="bla bla bla"
        lockBackgroundScroll={true}
      >
        <div className="m-5" onClick={toggleDrawer}>
          <RxCross2 />
        </div>

        <div className="mb-10 flex items-center justify-center">
          <Logo />
        </div>
        <div className=" ">
          <ul className="flex flex-col gap-y-8 p-5 text-[16px] text-[#282F5A]">
            <NavLink to="/">
              <li className="cursor-pointer font-medium hover:text-[#28A079]">
                Home
              </li>
            </NavLink>

            <NavLink to="/pricing">
              <li className="cursor-pointer font-medium hover:text-[#28A079]">
                Pricing
              </li>
            </NavLink>

            <li className="cursor-pointer font-medium hover:text-[#28A079]">
              Textbook
            </li>
            <NavLink to={"/login"}>
              <li className="cursor-pointer font-medium hover:text-[#28A079]">
                Log In
              </li>
            </NavLink>
            <Link to="/signup">
              <button className="rounded-[12px] bg-[#FFE6D4] px-6 py-2 font-bold text-[#FF7A28] transition-all hover:bg-[#FFDAC4]">
                Sign Up Now
              </button>
            </Link>
          </ul>
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
