import React, { useState } from 'react';
import  supabase  from '../helper'; // Import the supabase instance
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import {toast} from 'sonner'; // Import the toast module
import Loader from '../components/common/Loader';
import { resendVerificationEmail } from '../utils/authUtils';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // State for loading button
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true); // Set loading to true when the login attempt starts

        try {
            // Use Supabase auth to log in
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message)
                await resendVerificationEmail(email)
                setLoading(false); // Set loading to false if there is an error
            } else {
                // On success, store the session (if needed)
                localStorage.setItem('authToken', data.session.access_token); // Store token if needed
                toast.success('Logged in successfully!'); // Show success toast
                navigate('/dashboard'); // Redirect to the dashboard or another page
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
            setLoading(false); // Set loading to false if there is an exception
        }
    };

    return (
        <div className="flex items-center w-full overflow-hidden">
            <div className="bg-[#FFFFFF] h-screen flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%]">
                <Logo />
                <p className="text-[16px] sm:text-[24px] leading-[29px] font-medium text-[#3F3F46]">
                    Log into Preclinify
                </p>
                <form onSubmit={handleLogin} className="mt-2 space-y-3 h-[400px]">
                    <div>
                        <label htmlFor="email" className="text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium">
                            Email Address
                        </label>
                        <br />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your Email..."
                            className="rounded-[8px] mt-2 border-[2px] border-black p-5 w-[100%] sm:w-[430px] h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium">
                            Password
                        </label>
                        <br />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password..."
                            className="rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px] mt-2 border-[2px] border-black p-5 w-[100%] sm:w-[430px] h-[50px]"
                            required
                        />
                    </div>

                    <div className="flex items-center flex-col space-y-2 sm:flex-row sm:justify-between h-[50px] mt-10">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                            />
                            <label htmlFor="rememberMe" className="mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46] ">
                                Keep me logged in
                            </label>
                        </div>
                        <Link to="/forget-password">
                            <span className="relative z-10 cursor-pointer underline text-[14px] sm:text-[16px] font-medium text-[#3F3F46] hover:text-[#3F3F46]">
                                Forgot password?
                            </span>
                        </Link>
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-[14px] sm:text-[16px]">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-[100%] sm:w-[430px] h-[50px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150"
                            disabled={loading} // Disable the button while loading
                        >
                            {loading ? (
                               <Loader/>
                            ) : (
                                'Log in'
                            )}
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-[#3F3F46] text-[12px] sm:text-[16px] font-medium">
                            Don’t have an account? <Link to="/signup"><span className="text-[#3CC8A1]">Sign up</span></Link>
                        </p>
                    </div>
                </form>
            </div>
            <div className="bg-[#F4F4F5] hidden lg:flex h-screen items-center justify-center w-[50%]">
                <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
            </div>
        </div>
    );
};

export default Login;
