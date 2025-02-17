import React, { useEffect, useState } from 'react';
import supabase from '../config/helper';
import Logo from '../components/common/Logo';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { insertUserInformation } from '../redux/features/personal-info/personal-info.service';
import { useNavigate } from 'react-router-dom';
import { fetchUserId } from '../redux/features/user-id/userId.service';

const PersonalInformation = () => {
    const dispatch=useDispatch()
    const userId = useSelector(state => state.user);
const navigate=useNavigate()
    const [formData, setFormData] = useState({
        // ✅ Add userId in the initial state
        firstName: '',
        lastName: '',
        university: '',
        year: '',
    });

    console.log("userId:",userId);

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First Name is required.";
        } else if (!/^[A-Za-z]{2,}$/.test(formData.firstName)) {
            newErrors.firstName = "First Name must be at least 2 letters.";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last Name is required.";
        } else if (!/^[A-Za-z]{2,}$/.test(formData.lastName)) {
            newErrors.lastName = "Last Name must be at least 2 letters.";
        }

        if (!formData.university) {
            newErrors.university = "Please select a university.";
        }

        if (!formData.year) {
            newErrors.year = "Please select a year group.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            user_id: userId, 
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        setIsLoading(true);

        dispatch(insertUserInformation(formData))
        .unwrap()
        .then(res=>{
            navigate('/login')
        })
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Personal information successfully!");
        }, 2000);
    };
useEffect(()=>{
    dispatch(fetchUserId())
    .then((res)=>{
        console.log("res:",res);
    })
    .catch((err)=>{{}})
console.log("hello");

},[])
    return (
        <div className='flex items-center w-full overflow-hidden'>
            <div className='bg-[#FFFFFF] min-h-screen py-5 flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%]'>
                <Logo />
                <p className='text-[16px] sm:text-[24px] leading-[29px] font-medium text-[#3F3F46] mb-5'>Almost there</p>
                <form onSubmit={handleSubmit} className='mt-2 space-y-4 w-[90%] sm:w-[430px]'>

                    {/* First Name */}
                    <div>
                        <label htmlFor='firstName' className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'>First Name</label>
                        <input
                            type='text'
                            name='firstName'
                            placeholder='Enter your First Name...'
                            value={formData.firstName}
                            onChange={handleChange}
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor='lastName' className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'>Last Name</label>
                        <input
                            type='text'
                            name='lastName'
                            placeholder='Enter your Last Name...'
                            value={formData.lastName}
                            onChange={handleChange}
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    </div>

                    {/* University */}
                    <div className="relative">
                        <label htmlFor='university' className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'>University</label>
                        <select
                            name='university'
                            value={formData.university}
                            onChange={handleChange}
                            className='rounded-[8px] mt-2 border-[2px] border-black px-5 py-2 w-full h-[50px] appearance-none pr-10'
                        >
                            <option value="">--Select University--</option>
                            <option value="Government College University">Government College University</option>
                        </select>
                        {errors.university && <p className="text-red-500 text-sm">{errors.university}</p>}
                    </div>

                    {/* Year Group */}
                    <div className="relative">
                        <label htmlFor='year' className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'>Year Group</label>
                        <select
                            name='year'
                            value={formData.year}
                            onChange={handleChange}
                            className='rounded-[8px] mt-2 border-[2px] border-black px-5 py-2 w-full h-[50px] appearance-none pr-10'
                        >
                            <option value="">--Select Year--</option>
                            <option value="Year 1">Year 1</option>
                            <option value="Year 2">Year 2</option>
                            <option value="Year 3">Year 3</option>
                            <option value="Year 4">Year 4</option>
                        </select>
                        {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type='submit'
                            className={`w-full h-[50px] text-[14px] sm:text-[16px] rounded-[8px] font-medium transition-all duration-150 
                                ${isLoading ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-[#FFE9D6] text-[#FF9741] hover:bg-[#e3863a] hover:text-white"}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Submitting..." : "Continue"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Side Image */}
            <div className='bg-[#F4F4F5] hidden lg:flex h-screen items-center justify-center w-[50%]'>
                <img src='/assets/AI_hosptial-removebg-preview.png' alt='Side Illustration' />
            </div>
        </div>
    );
};

export default PersonalInformation;
