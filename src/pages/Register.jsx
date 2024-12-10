import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after successful registration
import supabase from '../supabase'; // Import the Supabase client
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Loader from '../components/Loader';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Start the loader

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            // Supabase auth register
            const { user, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                // Show error toast
                toast.error(error.message);
            } else {
                // Show success toast
                navigate('/login')
                toast.success('Registration Successful!, Check your email and verify it.');
            }
        } catch (error) {
            // Handle any unexpected error
            toast.error('An error occurred. Please try again!');
        } finally {
            setIsLoading(false);  // Stop the loader once API call is done
        }
    };


    return (
        <div className='flex items-center w-full'>
            <div className='bg-[#FFFFFF] min-h-screen py-5 flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%]'>
                <Logo />
                <p className='text-[16px] sm:text-[24px] leading-[29px] font-medium text-[#3F3F46]'>Sign up into Preclinify</p>
                <form onSubmit={handleSubmit} className='mt-2 space-y-3 w-[90%] sm:w-[430px]'>
                    <div>
                        <label htmlFor='' className='text-[#3CC8A1] text-[14px] sm:text-[16px]'>Email Address</label>
                        <br />
                        <input
                            type='email'
                            placeholder='Enter your Email...'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                        />
                    </div>

                    <div>
                        <label htmlFor='' className='text-[#3CC8A1] text-[14px] sm:text-[16px]'>Password</label>
                        <br />
                        <input
                            type='password'
                            placeholder='Enter your Password...'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                        />
                    </div>

                    <div>
                        <label htmlFor='' className='text-[#3CC8A1] text-[14px] sm:text-[16px]'>Confirm Password</label>
                        <br />
                        <input
                            type='password'
                            placeholder='Enter your Confirm Password...'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                        />
                    </div>

                    <div>
                        <label htmlFor='' className='text-[#3CC8A1] text-[14px] sm:text-[16px]'>Phone</label>
                        <br />
                        <input
                            type='text'
                            placeholder='Enter your Phone Number...'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                        />
                    </div>

                    {error && <div className='text-red-500'>{error}</div>}

                    <div className='text-[#3F3F46] font-medium w-full space-y-3'>
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46]"
                            >
                                I agree to <span className="underline">Terms and conditions</span> and{" "}
                                <span className="underline">Privacy Policy</span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="emailUpdates"
                                name="emailUpdates"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                            />
                            <label
                                htmlFor="emailUpdates"
                                className="mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46]"
                            >
                                Send me tips, updates and promotions via email
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="smsUpdates"
                                name="smsUpdates"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                            />
                            <label
                                htmlFor="smsUpdates"
                                className="mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46]"
                            >
                                Send me tips, updates and promotions via SMS
                            </label>
                        </div>

                        <div>
                            <button
                                type='submit'
                                className='w-full h-[50px] text-[14px] sm:text-[16px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150'
                            >
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                       <Loader/>
                                    </div>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        </div>
                    </div>

                    <div className='text-center'>
                        <p className='text-[#3F3F46] text-[14px] sm:text-[16px] font-medium'>
                            Don’t have an account? <Link to='/login'><span className='text-[#3CC8A1]'>Log in</span></Link>
                        </p>
                    </div>
                </form>
            </div>

            <div className='bg-[#F4F4F5] hidden lg:flex h-screen items-center justify-center w-[50%]'>
                <img src='/assets/AI_hosptial-removebg-preview.png' alt='' />
            </div>
        </div>
    );
};

export default Register;
