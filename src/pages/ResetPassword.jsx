import React, { useState, useEffect } from 'react';
import Logo from '../components/common/Logo';
import { useSearchParams, useNavigate } from 'react-router-dom';
import supabase from '../helper';
import { toast } from 'sonner';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Extracting the access_token from the URL fragment (hash)
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace('#', '?'));  // Convert hash to query string format
        const accessToken = params.get('access_token');

        if (accessToken) {
            setToken(accessToken);
            localStorage.setItem('forget_token', accessToken); // Store token in localStorage
        } else {
            console.error('Access token is missing or invalid.');
        }
    }, []);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!token) {
            setError('Token is missing or expired.');
            return;
        }

        const { error } = await supabase.auth.updateUser(
            { password },
            { accessToken: token } // Use token from state/localStorage
        );

        if (error) {
            setError(error.message);
        } else {
            setMessage('Password updated successfully! Redirecting to login...');
            toast.success("Password updated successfully")
            localStorage.removeItem('forget_token'); // Remove token after success
            setTimeout(() => navigate('/login'), 3000);
        }
    };

    return (
        <div className='flex items-center w-full'>
            <div className='bg-[#FFFFFF] h-screen flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%]'>
                <Logo />
                <p className='text-[16px] sm:text-[24px] leading-[29px] font-medium text-[#3F3F46]'>Reset Password</p>
                <form
                    onSubmit={handlePasswordUpdate}
                    className='mt-2 space-y-3 w-[90%] sm:w-[430px]'
                >
                    <div>
                        <label htmlFor="password" className='text-[#3CC8A1] text-[14px] sm:text-[16px]'>
                            Password
                        </label>
                        <br />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your Password...'
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className='text-[#3CC8A1] text-[14px] sm:text-[16px]'>
                            Confirm Password
                        </label>
                        <br />
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Enter your Confirm Password...'
                            className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
                            required
                        />
                    </div>

                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                    {message && <p className='text-green-500 text-sm'>{message}</p>}

                    <div>
                        <button
                            type='submit'
                            className='w-full h-[50px] rounded-[8px] text-[14px] sm:text-[16px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150'
                        >
                            Update
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

export default ResetPassword;
