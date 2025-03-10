import React from "react";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  const userId = localStorage.getItem("userId");


  return (
    <div className="mt-20 text-[12px] sm:text-[14px] md:mt-40 lg:text-[16px]">
      <div className="flex items-center justify-center gap-x-10 px-2 font-medium text-[#3F3F46] sm:ml-16 sm:gap-x-14 md:justify-start lg:gap-x-20">
        <div className="space-y-1.5">
          <NavLink to="/login">
            <p className="cursor-pointer hover:text-[#3CC8A1]">Login</p>
          </NavLink>

          <NavLink to="/register">
            <p className="cursor-pointer hover:text-[#3CC8A1]">Sign-up</p>
          </NavLink>

          <NavLink to="/contact-us">
            <p className="cursor-pointer hover:text-[#3CC8A1]">Contact Us</p>
          </NavLink>

          <NavLink to="/about-us">
            <p className="cursor-pointer hover:text-[#3CC8A1]">About Us</p>
          </NavLink>
        </div>
        <div className="space-y-1.5">
          {userId && (
            <Link to="/dashboard">
              {" "}
              <p className=""> Dashboard</p>
            </Link>
          )}
          <Link to="#">
            {" "}
            <p className="">Refund Policy</p>
          </Link>

          <Link to="/term-and-condition">
            <p className="">Terms and Condition</p>
          </Link>
          <NavLink to="/privacy-policy">
            {" "}
            <p className="">Privacy Policy</p>
          </NavLink>
        </div>
        <div className="space-y-1.5">
          <p className="cursor-pointer hover:text-[#3CC8A1]">
            <NavLink to={"/pricing"}>Pricing</NavLink>{" "}
          </p>
          <Link to="#">
            <p className="">FAQs</p>
          </Link>

          <NavLink to="/disclaimer">
            <p className="">Disclaimer</p>
          </NavLink>
        </div>
      </div>

      <div className="my-5 ml-6 md:my-10 md:ml-0 md:mr-20 md:text-end">
        <p className="font-medium text-[#3F3F46]">
          © 2025 Preclinify Technologies Ltd. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
