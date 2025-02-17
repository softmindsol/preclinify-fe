import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import supabase from '../config/helper';
import Logo from '../components/common/Logo';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      displayName: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
      phone: Yup.string().required('Required'),
      displayName: Yup.string().required('Name is Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Supabase auth register
        const { user, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              displayName: values.displayName,
              phone: values.phone,
            },
          },
        });

        if (error) {
          // Show error toast
          console.log('error in register:', error);
          toast.error('Error occurred while registering');
        } else {
          // Show success toast
          navigate('/login');
          toast.success('Registration Successful! Check your email and verify it.');
        }
      } catch (error) {
        // Handle any unexpected error
        console.log('error:', error);
        toast.error('An error occurred. Please try again!');
      } finally {
        setSubmitting(false); // Stop the loader once API call is done
      }
    },
  });

  return (
    <div className='flex items-center w-full overflow-hidden'>
      <div className='bg-[#FFFFFF] min-h-screen py-5 flex items-center justify-center gap-y-5 flex-col w-screen lg:w-[50%]'>
        <Logo />
        <p className='text-[16px] sm:text-[24px] leading-[29px] font-medium text-[#3F3F46] mb-5'>
          Sign up into Preclinify
        </p>
        <form
          onSubmit={formik.handleSubmit}
          className='mt-2 space-y-4 w-[90%] sm:w-[430px]'
        >
          <div>
            <label
              htmlFor='email'
              className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'
            >
              Full Name
            </label>
            <br />
            <input
              type='text'
              id='displayName'
              placeholder='Enter your full name...'
              value={formik.values.displayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
            />
            {formik.touched.displayName && formik.errors.displayName ? (
              <div className='text-red-500'>{formik.errors.displayName}</div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor='email'
              className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'
            >
              Email Address
            </label>
            <br />
            <input
              type='email'
              id='email'
              placeholder='Enter your Email...'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
            />
            {formik.touched.email && formik.errors.email ? (
              <div className='text-red-500'>{formik.errors.email}</div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor='password'
              className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'
            >
              Password
            </label>
            <br />
            <input
              type='password'
              id='password'
              placeholder='Enter your Password...'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
            />
            {formik.touched.password && formik.errors.password ? (
              <div className='text-red-500'>{formik.errors.password}</div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'
            >
              Confirm Password
            </label>
            <br />
            <input
              type='password'
              id='confirmPassword'
              placeholder='Enter your Confirm Password...'
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className='text-red-500'>{formik.errors.confirmPassword}</div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor='phone'
              className='text-[#3CC8A1] text-[14px] sm:text-[16px] font-medium'
            >
              Phone
            </label>
            <br />
            <input
              type='text'
              id='phone'
              placeholder='Enter your Phone Number...'
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='rounded-[8px] mt-2 border-[2px] border-black p-5 w-full h-[50px] placeholder:text-[14px] md:placeholder:text-[16px]'
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className='text-red-500'>{formik.errors.phone}</div>
            ) : null}
          </div>

          <div className='text-[#3F3F46] font-medium w-full space-y-3'>
            <div className='flex items-center'>
              <input
                id='rememberMe'
                name='rememberMe'
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]'
              />
              <label
                htmlFor='rememberMe'
                className='mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46]'
              >
                I agree to <span className='underline'>Terms and conditions</span> and{' '}
                <span className='underline'>Privacy Policy</span>
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='emailUpdates'
                name='emailUpdates'
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]'
              />
              <label
                htmlFor='emailUpdates'
                className='mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46]'
              >
                Send me tips, updates and promotions via email
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='smsUpdates'
                name='smsUpdates'
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#282F5A] focus:ring-1 focus:ring-[#282F5A]'
              />
              <label
                htmlFor='smsUpdates'
                className='mx-3 text-[14px] sm:text-[16px] font-medium text-[#3F3F46]'
              >
                Send me tips, updates and promotions via SMS
              </label>
            </div>

            <div>
              <button
                type='submit'
                disabled={formik.isSubmitting}
                className='w-full h-[50px] text-[14px] sm:text-[16px] rounded-[8px] bg-[#FFE9D6] text-[#FF9741] font-medium hover:bg-[#e3863a] hover:text-white transition-all duration-150'
              >
                {formik.isSubmitting ? 'Loading...' : 'Sign Up'}
              </button>
            </div>
          </div>

          <div className='text-center'>
            <p className='text-[#3F3F46] text-[14px] sm:text-[16px] font-medium'>
              Don’t have an account?{' '}
              <Link to='/login'>
                <span className='text-[#3CC8A1]'>Log in</span>
              </Link>
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
