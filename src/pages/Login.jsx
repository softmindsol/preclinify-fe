import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // For validation schema
import supabase from '../config/helper';
import Logo from '../components/common/Logo';
import { toast } from 'sonner'; // Import the toast module
import { resendVerificationEmail } from '../utils/authUtils';

const Login = () => {
    const navigate = useNavigate();

    // Formik setup
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .required('Required'),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                // Use Supabase auth to log in
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: values.email,
                    password: values.password,
                });

                localStorage.setItem('authToken', data.session.access_token); // Store token if needed
                    
                if (data?.session) {
                    // console.log("Navigating to Dashboard...");
                    navigate('/dashboard');
                    toast.success('Logged in successfully!'); // Show success toast
                }

                // navigate('/dashboard'); // Redirect to the dashboard or another page
                // if (error) {
                //     toast.error(error.message);
                //     await resendVerificationEmail(values.email);
                //     setErrors({ email: error.message }); // Set error message for email field
                // } else {
                //     // On success, store the session (if needed)
                //     localStorage.setItem('authToken', data.session.access_token); // Store token if needed
                //     toast.success('Logged in successfully!'); // Show success toast
                //     navigate('/dashboard'); // Redirect to the dashboard or another page
                // }
            } catch (error) {
                setErrors({ email: 'An error occurred. Please try again.' });
            } finally {
                setSubmitting(false); // Stop the loader once API call is done
            }
        },
    });

    return (
        <div className="flex items-center w-full overflow-hidden">
            <div className="bg-[#FFFFFF] h-screen flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%]">
                <Logo />
                <p className="text-[16px] sm:text-[24px] leading-[29px] font-medium text-[#3F3F46]">
                    Log into Preclinify
                </p>
                <form onSubmit={formik.handleSubmit} className="mt-2 space-y-3 h-[400px]">
                    <div>
                        <label htmlFor="email" className="text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium">
                            Email Address
                        </label>
                        <br />
                        <input
                            type="email"
                            id="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your Email..."
                            className="rounded-[8px] mt-2 border-[2px] border-black p-5 w-[100%] sm:w-[430px] h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]"
                            required
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-[14px] sm:text-[16px]">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password" className="text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium">
                            Password
                        </label>
                        <br />
                        <input
                            type="password"
                            id="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your Password..."
                            className="rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px] mt-2 border-[2px] border-black p-5 w-[100%] sm:w-[430px] h-[50px]"
                            required
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-[14px] sm:text-[16px]">{formik.errors.password}</div>
                        ) : null}
                    </div>

                    <div className="flex items-center flex-col space-y-2 sm:flex-row sm:justify-between h-[50px] mt-10">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]"
                                checked={formik.values.rememberMe}
                                onChange={formik.handleChange}
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

                    <div>
                        <button
                            type="submit"
                            className="w-[100%] sm:w-[430px] h-[50px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150"
                            disabled={formik.isSubmitting} // Disable the button while loading
                        >
                            {formik.isSubmitting ? 'Loading...' : 'Log in'}
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