import React, { useState, useEffect } from 'react';
import Logo from '../components/common/Logo';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../config/helper';
import { toast } from 'sonner';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
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
      <div className="flex w-full items-center overflow-hidden">
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-5 bg-[#FFFFFF] lg:w-[50%]">
          <Link to="/">
            <Logo />
          </Link>
          <p className="text-[16px] font-medium leading-[29px] text-[#3F3F46] sm:text-[24px]">
            Reset Password
          </p>
          <form
            onSubmit={handlePasswordUpdate}
            className="mt-2 w-[90%] space-y-3 sm:w-[430px]"
          >
            <div>
              <label
                htmlFor="password"
                className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
              >
                Password
              </label>
              <br />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password..."
                className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-[14px] font-medium text-[#3CC8A1] sm:text-[16px]"
              >
                Confirm Password
              </label>
              <br />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your Confirm Password..."
                className="mt-2 h-[50px] w-full rounded-[8px] border-[2px] border-black p-5 placeholder:text-[14px] md:placeholder:text-[16px]"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-green-500">{message}</p>}

            <div>
              <button
                type="submit"
                className="h-[50px] w-full rounded-[8px] bg-[#FFE9D6] text-[14px] font-medium text-[#FF9741] transition-all duration-150 hover:bg-[#e3863a] hover:text-white sm:text-[16px]"
              >
                Update
              </button>
            </div>
          </form>
        </div>
        <div className="hidden h-screen w-[50%] items-center justify-center bg-[#F4F4F5] lg:flex">
          <img src="/assets/AI_hosptial-removebg-preview.png" alt="" />
        </div>
      </div>
    );
};

export default ResetPassword;
