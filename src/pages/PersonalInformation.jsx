import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after successful registration
import supabase from '../config/helper';
import Logo from '../components/common/Logo';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const PersonalInformation = () => {
    // State variables for input fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [university, setUniversity] = useState('');
    const [yearGroup, setYearGroup] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handlers for input changes
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleUniversityChange = (e) => {
        setUniversity(e.target.value);
    };

    const handleYearGroupChange = (e) => {
        setYearGroup(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ firstName, lastName, university, yearGroup });
    };

    return (
        <div className='flex items-center w-full overflow-hidden'>
            <div className='bg-[#FFFFFF] min-h-screen py-5 flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%]'>
                <Logo />
                <p className='text-[16px] sm:text-[24px] leading-[29px] font-medium text-[#3F3F46] mb-5'>Almost there</p>
                <form onSubmit={handleSubmit} className='mt-2 space-y-4 w-[90%] sm:w-[430px]'>
                    <div>
                        <label htmlFor='firstName' className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'>First Name</label>
                        <br />
                        <input
                            type='text'
                            placeholder='Enter your First Name...'
                            value={firstName}
                            onChange={handleFirstNameChange}
                            required
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                        />
                    </div>

                    <div>
                        <label htmlFor='lastName' className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'>Last Name</label>
                        <br />
                        <input
                            type='text'
                            placeholder='Enter your Last Name...'
                            value={lastName}
                            onChange={handleLastNameChange}
                            required
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor='university' className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'>University</label>
                        <br />
                        <select
                            id='university'
                            value={university}
                            onChange={handleUniversityChange}
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px] appearance-none pr-10'
                        >
                            <option value="">--Select University--</option>
                            <option value="Goverment College University">Goverment College University</option>
                            {/* Add more options as needed */}
                        </select>
                        <div className="absolute top-12 right-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06-.02L10 10.586l3.71-3.4a.75.75 0 111.06 1.06l-4.24 4.242a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor='yearGroup' className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'>Year Group</label>
                        <br />
                        <select
                            id='yearGroup'
                            value={yearGroup}
                            onChange={handleYearGroupChange}
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px] appearance-none pr-10'
                        >
                            <option value="">--Select Year--</option>
                            <option value="2015">2015</option>
                            <option value="2016">2016</option>
                            <option value="2017">2017</option>
                            <option value="2018">2018</option>
                            <option value="2019">2019</option>
                        </select>
                        <div className="absolute top-12 right-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06-.02L10 10.586l3.71-3.4a.75.75 0 111.06 1.06l-4.24 4.242a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {error && <div className='text-red-500'>{error}</div>}

                    <div>
                        <button
                            type='submit'
                            className='w-full h-[50px] text-[14px] sm:text-[16px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150'
                        >
                            {isLoading ? "Loading..." : "Continue"}
                        </button>
                    </div>
                </form>
            </div>

            <div className='bg-[#F4F4F5] hidden lg:flex h-screen items-center justify-center w-[50%]'>
                <img src='/assets/AI_hosptial-removebg-preview.png' alt='' />
            </div>
        </div>
    );
};

export default PersonalInformation;