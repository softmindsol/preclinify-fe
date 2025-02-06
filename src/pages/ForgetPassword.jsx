import React, { useState } from 'react';
import Logo from '../components/common/Logo';
import supabase from '../config/helper';
import { toast } from 'sonner';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);  // Stop the loader once API call is done

        if (!email) {
            setError('Email address is required.');
            setIsLoading(false);  // Stop the loader once API call is done

            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/reset-password', // Replace with your actual reset URL
        });

        if (error) {
            setError(error.message);
            toast.error("Invalid email");

            setIsLoading(false);  // Stop the loader once API call is done

        }
        else{
            toast.success("Reset Link send to your email, Check your email");
        }
        setIsLoading(false);  // Stop the loader once API call is done

    };

    return (
        <div className='flex items-center w-full overflow-hidden'>
            <div className='bg-[#FFFFFF] h-screen flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%]'>
                <Logo />
                <p className='text-[16px] sm:text-[24px] leading-[29px] font-medium text-[#3F3F46]'>Forget Password</p>
                <form
                    onSubmit={handlePasswordReset}
                    className='mt-2 space-y-3 w-[90%] sm:w-[430px]'
                >
                    <div>
                        <label htmlFor="email" className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'>
                            Email Address
                        </label>
                        <br />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your Email...'
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                            required
                        />
                    </div>

                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                    {message && <p className='text-green-500 text-sm'>{message}</p>}

                    <div>
                                                   <button
                                                       type='submit'
                                                       className='w-full h-[50px] text-[14px] sm:text-[16px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150'
                                                   >
                                                       {isLoading ? (
                                                           
                                                              'Loading...'
                                                         
                                                       ) : (
                                                           "Continue"
                                                       )}
                                                   </button>
                    </div>
                </form>
            </div>
            <div className='bg-[#F4F4F5] hidden lg:flex h-screen items-center justify-center w-[50%]'>
                <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
            </div>
        </div>
    );
};

export default ForgetPassword;
