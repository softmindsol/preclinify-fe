import React, { useState } from 'react';
import Siderbar from '../components/common/Sidebar';
import { FaClock, FaRobot } from 'react-icons/fa';
import { PiCircleHalfFill } from 'react-icons/pi';
import { MdOutlinePayments } from 'react-icons/md';
import Logo from '../components/common/Logo';
import { TbBaselineDensityMedium } from 'react-icons/tb';
// import component 👇
import { RxCross2 } from 'react-icons/rx';
import Drawer from 'react-modern-drawer';
//import styles 👇
import 'react-modern-drawer/dist/index.css';
import { NavLink } from 'react-router-dom';
import supabase from '../config/helper';
import { setDarkMode } from '../redux/features/dark-mode/dark-mode.slice';
import { useDispatch, useSelector } from 'react-redux';
import ExamCountdown from '../components/settings/ExamCountdown';
import { toast } from 'sonner';
import { clearUserId } from '../redux/features/user-id/userId.slice';

const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const darkModeRedux = useSelector(state => state.darkMode.isDarkMode);
  const [darkMode, setMode] = useState(false);
  const dispatch = useDispatch();
  const toggleDrawer = () => {
    setIsOpen(prevState => !prevState);
  };
  const profile = useSelector(state => state.personalInfo.userInfo[0]);
  console.log('profile::', profile);
  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(clearUserId());
      toast.success('User logged out successfully');
      window.location.href = '/login';
    } catch (error) {
      toast.error('Something went wrong while Logout!');
    }
  };

  const toggleDarkMode = () => {
    setMode(prevMode => !prevMode);
    dispatch(setDarkMode(!darkMode));
  };

  return (
    <div className={`lg:flex min-h-screen w-full ${darkModeRedux ? 'dark' : ''} `}>
      <div className='h-full hidden lg:block fixed'>
        <Siderbar />
      </div>
      <div className='flex items-center justify-between p-5 bg-white shadow-sm lg:hidden w-full dark:bg-[#1E1E2A] text-black dark:text-white'>
        <div className=''>
          <img src='/assets/small-logo.png' alt='' />
        </div>

        <div className='' onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>

      <div className='min-h-screen bg-gray-100 text-[#3F3F46] lg:p-6 mt-5 lg:mt-0 w-full lg:ml-[250px] overflow-y-auto dark:bg-[#1E1E2A]  dark:text-white'>
        <h1 className='text-[24px] font-bold mb-6 hidden lg:block text-[#27272A]   dark:text-white'>
          Settings
        </h1>

        {/* General Section */}
        <ExamCountdown />

        <div className='bg-white shadow-md lg:rounded-md mb-6 p-4 space-y-3 dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] text-black dark:text-white'>
          <p className='font-semibold text-[#000000] dark:text-white text-[14px] sm:text-[16px]'>
            Appearance
          </p>
          <div className='flex items-center gap-x-56 sm:gap-x-60'>
            <div>
              <div className='flex items-center gap-x-2 '>
                <PiCircleHalfFill />

                <p className='text-[12px] sm:text-[14px] text-[#3F3F46] dark:text-white whitespace-nowrap font-medium'>
                  Dark Mode
                </p>
              </div>
            </div>
            <div
              onClick={toggleDarkMode}
              className={`relative inline-flex items-center h-4 w-8 cursor-pointer rounded-full transition-colors ${
                darkModeRedux ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-3 w-3 transform rounded-full bg-white shadow-md transition-transform ${
                  darkModeRedux ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className='bg-white shadow-md lg:rounded-md mb-6 p-4 text-[#000000]  dark:border-[1px] dark:border-[#3A3A48]  dark:bg-[#1E1E2A]  dark:text-white'>
          <div>
            <h2 className='text-[14px] sm:text-[16px]  font-semibold mb-4 dark:text-white'>
              Billing
            </h2>
            <div className='flex items-center gap-x-20 sm:gap-x-40'>
              <div className='sm:mb-4'>
                <div className='flex items-center gap-x-2'>
                  <MdOutlinePayments />
                  <p className='font-medium text-[14px] sm:text-[16px] text-[#000000] dark:text-white'>
                    Subscription
                  </p>
                </div>

                <p className='text-[12px] sm:text-[14px] text-[#71717A] whitespace-nowrap dark:text-white'>
                  Your current subscription package.
                </p>
                <div className='flex justify-between items-center mt-2'>
                  <span className=' text-[12px] sm:text-[14px] font-medium dark:text-white'>
                    Platinum
                  </span>
                </div>
              </div>
              <button className='border-[1px] border-[#3CC8A1] font-medium text-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-2 py-1 '>
                Change Plan
              </button>
            </div>
          </div>

          <div>
            <div className='flex items-center gap-x-20 mt-5 sm:mt-0 sm:gap-x-40'>
              <div className='mb-4'>
                <div className='flex items-center gap-x-2'>
                  <FaRobot />
                  <p className='font-medium text-[#000000] text-[14px] sm:text-[16px] dark:text-white'>
                    OSCE Credits
                  </p>
                </div>

                <p className='text-[12px] sm:text-[14px] text-[#71717A] whitespace-nowrap dark:text-white'>
                  Your remaining credit for OSCE
                </p>
                <div className='flex justify-between items-center mt-2'>
                  <span className='font-semibold text-[12px] sm:text-[14px] dark:text-white'>
                    6969
                  </span>
                </div>
              </div>
              <button className='border-[1px] border-[#3CC8A1] text-[#3CC8A1] hover:bg-[#3CC8A1] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-2 py-1'>
                Purchase Credit
              </button>
            </div>
          </div>
        </div>

        {/* Subscriptions Section */}
        <div className='bg-white shadow-md lg:rounded-md mb-6 p-4 dark:border-[1px] dark:border-[#3A3A48]  dark:bg-[#1E1E2A]  dark:text-white'>
          <h2 className='text-[16px] sm:text-[18px] font-semibold mb-4'>Subscriptions</h2>
          <div className='flex items-center justify-between mb-4 '>
            <div>
              <div className='flex items-center  gap-x-2'>
                <MdOutlinePayments />
                <p className='font-medium text-[14px] sm:text-[16px]'>
                  Platinum Tier Subscription
                </p>
              </div>
              <p className='text-[14px] sm:text-[16px] text-[#71717A] font-bold dark:text-white'>
                £3499 / Year
              </p>
            </div>

            <button className='border-[1px] border-[#FF9741] dark:text-white dark:border-[1px] dark:border-white dark:hover:border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1'>
              Change plan
            </button>
          </div>
          <div className='flex space-x-4 mt-4'>
            <button className='border-[1px] font-semibold border-[#FF9741] dark:border-[1px] dark:border-white dark:hover:border-[#FF9741] text-[#FF9741] dark:text-white hover:bg-[#FF9741] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-3 py-2'>
              Purchase OSCE Credit
            </button>
            <button className='border-[1px] font-semibold border-[#FF9741] dark:border-[1px] dark:border-white dark:hover:border-[#FF9741] dark:text-white text-[#FF9741]  hover:bg-[#FF9741] hover:text-white text-[12px] sm:text-[14px] rounded-[6px] transition-all duration-200 px-3 py-2'>
              Update Billing Information
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div className='bg-white shadow-md lg:rounded-md p-4 dark:border-[1px] dark:border-[#3A3A48]  dark:bg-[#1E1E2A]  dark:text-white'>
          <h2 className='text-[16px] sm:text-[18px] font-semibold mb-4 text-[#3F3F46] dark:text-white'>
            Account
          </h2>
          <div className='mb-4 flex flex-col   sm:flex-row sm:items-center sm:justify-between  '>
            <label className='block font-medium mb-1 text-[14px] sm:text-[16px]'>
              Display Name
            </label>
            <input
              type='text'
              className='w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px] dark:bg-[#1E1E2A]'
              placeholder='Sainavi Mahajan'
              value={profile?.firstName + ' ' + profile?.lastName}
            />
          </div>
          <div className='mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between'>
            <label className='block font-medium mb-1 text-[14px] sm:text-[16px]'>
              First Name
            </label>
            <input
              type='text'
              className='w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px] dark:bg-[#1E1E2A]'
              placeholder='Sainavi'
              value={profile?.firstName}
            />
          </div>
          <div className='mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between'>
            <label className='block font-medium mb-1'>Last Name</label>
            <input
              type='text'
              className='w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px] dark:bg-[#1E1E2A]'
              placeholder='Mahajan'
              value={profile?.lastName}
            />
          </div>
          <div className='mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between'>
            <label className='block font-medium mb-1'>University</label>
            <input
              type='text'
              className='w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px] dark:bg-[#1E1E2A]'
              placeholder='University of Leicester'
              value={profile?.university}
            />
          </div>

          <div className='mb-4 flex flex-col  sm:flex-row sm:items-center sm:justify-between'>
            <label className='block font-medium mb-1'>Year of Study</label>
            <select
              name='year'
              id='year'
              className='w-[320px] p-2 border rounded-[8px] placeholder:text-[14px] md:placeholder:text-[16px] dark:bg-[#1E1E2A]'
              value={profile?.year || ''}
              onChange={e => console.log(e.target.value)} // Debugging ke liye
            >
              <option value='' disabled>
                Select Year of Study
              </option>
              <option value='Year 1'>Year 1</option>
              <option value='Year 2'>Year 2</option>
              <option value='Year 3'>Year 3</option>
              <option value='Year 4'>Year 4</option>
            </select>
          </div>
          <div className='flex justify-end'>
            <button className='bg-[#3CC8A1] px-2 py-1 text-white rounded-[8px] font-semibold'>
              Save
            </button>
          </div>

          <div className='flex flex-col gap-y-5 mt-10'>
            <button
              className='border-[1px] w-[91px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1 font-semibold ark:border-[1px] dark:border-white dark:hover:border-[#FF9741] dark:text-white'
              onClick={handleLogout}
            >
              Log out
            </button>
            <button className='border-[1px] w-[156px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1 font-semibold ark:border-[1px] dark:border-white dark:hover:border-[#FF9741] dark:text-white'>
              Reset Password
            </button>

            <button className='border-[1px] w-[152px] border-[#FF453A] text-[#ffff] bg-[#FF453A] hover:text-[#FF453A] hover:bg-transparent text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1 font-semibold'>
              Delete Account
            </button>
          </div>
        </div>

        <div className='bg-white shadow-md lg:rounded-md p-4 mt-6 dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A]  dark:text-white'>
          <p className='text-[#3F3F46] text-[18px] font-semibold dark:text-white'>
            Advanced
          </p>
          <div className='flex flex-col gap-y-5 mt-10'>
            <button className='border-[1px] w-[156px] border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741] hover:text-white text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1 font-semibold  dark:border-[1px] dark:border-white dark:hover:border-[#FF9741] dark:text-white'>
              Clear Cache
            </button>

            <button className='border-[1px] w-[190px] border-[#FF453A] text-[#ffff] bg-[#FF453A] hover:text-[#FF453A] hover:bg-transparent text-[14px] rounded-[6px] transition-all duration-200 px-2.5 py-1.5 font-semibold '>
              Reset Progress Data
            </button>
          </div>
        </div>
      </div>
      <div className='dark:bg-[#1E1E2A] text-black dark:text-white'>
        <Drawer
          open={isOpen}
          onClose={toggleDrawer}
          direction='right'
          className=''
          lockBackgroundScroll={true}
        >
          <div className='m-5' onClick={toggleDrawer}>
            <RxCross2 />
          </div>

          <div className='mb-10 flex items-center justify-center'>
            <Logo />
          </div>

          <div className='flex min-h-screen overflow-y-auto flex-col justify-between'>
            <nav className='space-y-5 w-full'>
              {[
                { name: 'Dashboard', icon: 'house' },
                { name: 'Practice', icon: 'dumbbell' },
                { name: 'Performance', icon: 'chart-line' },
                { name: 'Friends', icon: 'git-merge' },
                { name: 'Textbook', icon: 'book-open' },
                { name: 'OSCE', icon: 'bed' },
              ].map((item, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-3 px-6 group cursor-pointer'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className={`lucide lucide-${item.icon} group-hover:text-[#3CC8A1]`}
                  >
                    {/* Define paths for the icons */}
                    {item.icon === 'house' && (
                      <>
                        <path d='M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' />
                        <path d='M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                      </>
                    )}
                    {/* Other Icons */}
                  </svg>
                  <span className='text-[14px] font-medium group-hover:text-[#3CC8A1]'>
                    {item.name}
                  </span>
                </div>
              ))}
            </nav>

            {/* Bottom Settings */}
            <div className='mt-auto w-full mb-40 px-6'>
              <NavLink to={'/setting'}>
                <div className='flex items-center space-x-3 group cursor-pointer'>
                  <i className='fa fa-cog text-xl group-hover:text-[#3CC8A1]'></i>
                  <span className='text-[14px] font-medium group-hover:text-[#3CC8A1]'>
                    Settings
                  </span>
                </div>
              </NavLink>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Setting;
