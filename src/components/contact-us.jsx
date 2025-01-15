import React from 'react'
import Navbar from './common/Navbar'
import SvgIcon from './common/logo-contact'
const ContactPage = () => {
    return (
        <div>
            <Navbar />

            <div className='flex flex-col justify-center items-center h-[150px] mt-40 '>
                <h2 className='font-extrabold text-[64px]'><span className='text-[#3F3F46]'>Contact </span><span className='text-[#3CC8A1]'>Us</span></h2>
                <p className='text-[#3F3F46] font-medium my-5 text-[16px]'>Tell us why we’re good, why we’re bad, or that you want to join us, we actually listen.</p>
            </div>

            <div className="flex justify-center items-center  mt-7">

                <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[952px] h-[547px]">
                    <div className="flex flex-col md:flex-row p-4">
                        <div className='flex items-center rounded-[8px]  flex-col md:w-1/3 h-[520px] bg-[#3CC8A1]'>
                            <div className=" text-white flex flex-col text-center p-8 rounded-[8px] ">
                                <h2 className="text-[24px]  font-extrabold ">Contact Details</h2>
                                <p className="mb-4">Reach out to us directly</p>
                                <div className="flex items-center mb-4 gap-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    <a href="mailto:support@preclinify.com" className="text-white">support@preclinify.com</a>
                                </div>

                            </div>
                            <div className="flex justify-center mt-auto mb-8">
                                <SvgIcon />
                            
                            </div>
                        </div>
                        
                        <div className="p-8 md:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[16px] font-medium text-[#3CC8A1]">First Name</label>
                                    <input type="text" placeholder="sample text.." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 placeholder:text-[16px] placeholder:font-medium placeholder:text-[#3F3F46]" />
                                </div>
                                <div>
                                    <label className="block text-[16px] font-medium text-[#3CC8A1]">Last Name</label>
                                    <input type="text" placeholder="sample text.." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 placeholder:text-[16px] placeholder:font-medium placeholder:text-[#3F3F46]" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-[16px] font-medium text-[#3CC8A1]">Email Address</label>
                                <input type="email" placeholder="sample text.." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 placeholder:text-[16px] placeholder:font-medium placeholder:text-[#3F3F46]" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[16px] font-medium text-[#3CC8A1]">Message</label>
                                <textarea placeholder="What would you like to say 👋" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32 placeholder:text-[16px] placeholder:font-medium placeholder:text-[#3F3F46]"></textarea>
                            </div>
                            <div className="flex justify-center">
                                <button className="bg-[#FFE9D6] w-full text-[#FF9741] font-bold border-[#FF9741] hover:bg-[#FF9741] hover:text-[#ffff] transition-all duration-300 rounded-[8px] py-2 px-4 ">Send Message!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ContactPage