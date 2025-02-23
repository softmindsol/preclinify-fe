import React from "react";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-20 text-[12px] sm:text-[14px] md:mt-40 lg:text-[16px]">
      <div className="flex items-center justify-center gap-x-10 px-2 font-medium text-[#3F3F46] sm:ml-16 sm:gap-x-14 md:justify-start lg:gap-x-20">
        <div className="space-y-1.5">
          <p className="cursor-pointer hover:text-[#3CC8A1]">
            <NavLink to="/login">Login</NavLink>{" "}
          </p>
          <p className="cursor-pointer hover:text-[#3CC8A1]">
            {" "}
            <NavLink to="/register"> Sign-up</NavLink>
          </p>
          <p className="cursor-pointer hover:text-[#3CC8A1]">
            {" "}
            <NavLink to="/contact-us">Contact Us</NavLink>{" "}
          </p>
          <p className="cursor-pointer hover:text-[#3CC8A1]">
            {" "}
            <NavLink to="/about-us"> About Us</NavLink>{" "}
          </p>
        </div>
        <div className="space-y-1.5">
          <Link to="#">
            {" "}
            <p className=""> Dashboard</p>
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
          <p className="">Refund Policy</p>
          <p className="">FAQs</p>
          <NavLink to="/disclaimer">
            {" "}
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
