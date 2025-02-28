import React from "react";
import Navbar from "./common/Navbar";
import SvgIcon from "./common/logo-contact";
const ContactPage = () => {
  return (
    <div>
      <Navbar />

      <div className="mt-40 flex h-[150px] flex-col items-center justify-center">
        <h2 className="text-[64px] font-extrabold">
          <span className="text-[#3F3F46]">Contact </span>
          <span className="text-[#3CC8A1]">Us</span>
        </h2>
        <p className="my-5 text-[16px] font-medium text-[#3F3F46]">
          Tell us why we’re good, why we’re bad, or that you want to join us, we
          actually listen.
        </p>
      </div>

      <div className="mt-7 flex items-center justify-center">
        <div className="h-[547px] w-[952px] overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="flex flex-col p-4 md:flex-row">
            <div className="flex h-[520px] flex-col items-center rounded-[8px] bg-[#3CC8A1] md:w-1/3">
              <div className="flex flex-col rounded-[8px] p-8 text-center text-white">
                <h2 className="text-[24px] font-extrabold">Contact Details</h2>
                <p className="mb-4">Reach out to us directly</p>
                <div className="mb-4 flex items-center gap-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-mail"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a
                    href="mailto:support@preclinify.com"
                    className="text-white"
                  >
                    support@preclinify.com
                  </a>
                </div>
              </div>
              <div className="mb-8 mt-auto flex justify-center">
                <SvgIcon />
              </div>
            </div>

            <div className="p-8 md:w-2/3">
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[16px] font-medium text-[#3CC8A1]">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first Name"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm placeholder:text-[16px] placeholder:font-normal placeholder:text-[#A1A1AA]"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-medium text-[#3CC8A1]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last Name"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm placeholder:text-[16px] placeholder:font-normal placeholder:text-[#A1A1AA]"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[16px] font-medium text-[#3CC8A1]">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm placeholder:text-[16px] placeholder:font-normal placeholder:text-[#A1A1AA]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[16px] font-medium text-[#3CC8A1]">
                  Message
                </label>
                <textarea
                  placeholder="What would you like to say 👋"
                  className="mt-1 block h-32 w-full rounded-md border border-gray-300 p-2 shadow-sm placeholder:text-[16px] placeholder:font-normal placeholder:text-[#A1A1AA]"
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button className="w-full rounded-[8px] border-[#FF9741] bg-[#FFE9D6] px-4 py-2 font-bold text-[#FF9741] transition-all duration-300 hover:bg-[#FF9741] hover:text-[#ffff]">
                  Send Message!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
