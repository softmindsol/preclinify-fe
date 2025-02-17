import React, { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import Drawer from 'react-modern-drawer';
//import styles 👇
import 'react-modern-drawer/dist/index.css';
import StackedBar from '../components/charts/stacked-bar';
import { useDispatch, useSelector } from 'react-redux';
import { clearResult } from '../redux/features/result/result.slice';
import { resetQuestionReviewValue } from '../redux/features/question-review/question-review.slice';
import { NavLink, useNavigate } from 'react-router-dom';
import { RxCross2 } from 'react-icons/rx';
import Logo from '../components/common/Logo';
import { TbBaselineDensityMedium } from 'react-icons/tb';
import { clearRecentSessions } from '../redux/features/recent-session/recent-session.slice';
import { fetchMcqsByModules } from '../redux/features/SBA/sba.service';
import SetupSessionModal from '../components/SetupSessionModal';
import { setResetLimit } from '../redux/features/limit/limit.slice';
import supabase from '../config/helper';
// import { fetchExamDate } from '../redux/features/exam-countdown/service';
import { fetchUserId } from '../redux/features/user-id/userId.service';
import { fetchDaysUntilExam } from '../redux/features/examDate/service';
import { fetchUserInformation } from '../redux/features/personal-info/personal-info.service';
import { fetchUserStreak } from '../redux/features/streak/streak.service';

const Dashboard = () => {
  const navigate = useNavigate();
  const [workEntries, setWorkEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formattedMonth, setFormattedMonth] = useState('');
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [localRecentSession, setLocalRecentSession] = useState([]);
  const data = useSelector(state => state.module);
  const [isOpenSetUpSessionModal, setIsOpenSetUpSessionModal] = useState(false);
  const { limit } = useSelector(state => state.limit);
  const [isLoading, setIsLoading] = useState(false);
  const [isSession, setIsSession] = useState(false);
  const [sessionId, setSessionId] = useState([]);
  const darkModeRedux = useSelector(state => state.darkMode.isDarkMode);
  const examDuration = useSelector(state => state?.examDates?.examDate);
const profile=useSelector(state=>state.personalInfo.userInfo[0])
  const userId = useSelector(state => state.user.userId)  
  const streak=useSelector(state=>state.streak.streak)
  const userInfo = useSelector(state => state?.user?.userInfo);

  console.log("streak:", streak);






  const toggleDrawer = () => {
    setIsOpen(prevState => !prevState);
  };

  useEffect(() => {
    const fetchDailyWork = async () => {
      try {
        const { data, error } = await supabase
          .from('resultsHistory')
          .select('*')
          .eq('userId', '123456543');

        if (error) throw error;

        const formattedData = data.map(entry => {
          const date = new Date(entry.timeStamp).toISOString().split('T')[0];
          return { ...entry, date };
        });

        setWorkEntries(formattedData);
        setLoading(false);
      } catch (err) {
        setError('Error fetching daily work');
        setLoading(false);
      }
    };

    fetchDailyWork();
  }, []);

  useEffect(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);

    // Create an object to hold aggregated results
    const aggregatedResults = {};

    // Iterate through workEntries to aggregate results by date
    workEntries.forEach(entry => {
      const date = entry.date; // Assuming entry.date is already formatted as "yyyy-MM-dd"

      // Initialize the date entry if it doesn't exist
      if (!aggregatedResults[date]) {
        aggregatedResults[date] = {
          workCount: 0,
          correct: 0,
          incorrect: 0,
          totalResult: 0, // To accumulate the result values
        };
      }

      // Increment the work count
      aggregatedResults[date].workCount += 1;

      // Increment correct and incorrect counts based on entry values
      aggregatedResults[date].correct += entry.correct || 0; // Ensure to handle undefined
      aggregatedResults[date].incorrect += entry.incorrect || 0; // Ensure to handle undefined
      aggregatedResults[date].totalResult += entry.result || 0; // Ensure to handle undefined
    });

    // Create an array of days with aggregated results
    const allDays = eachDayOfInterval({ start, end }).map(day => {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const workEntry = aggregatedResults[formattedDate] || {
        workCount: 0,
        correct: 0,
        incorrect: 0,
        totalResult: 0,
      };

      return {
        date: formattedDate,
        workCount: workEntry.workCount,
        correct: workEntry.correct,
        incorrect: workEntry.incorrect,
        totalResult: workEntry.totalResult,
      };
    });

    setFormattedMonth(format(selectedDate, 'MMMM'));
    setDays(allDays);
  }, [selectedDate, workEntries]);

  const getColorClass = workCount => {
    if (workCount > 99) return 'bg-[#047857]'; // > 99
    if (workCount > 75) return 'bg-[#059669]'; // > 75
    if (workCount > 50) return 'bg-[#34D399]'; // > 50
    if (workCount > 25) return 'bg-[#6EE7B7]'; // > 25
    if (workCount > 0) return 'bg-[#A7F3D0]'; // > 0
    return 'bg-[#E4E4E7]'; // Default background for days with no workCount
  };

  function handleContinue() {
    setIsOpenSetUpSessionModal(true); // Set to true to open the modal
  }

  useEffect(() => {
    const handleSessionContinue = async sessionId => {
      // Open the setup session modal
      setIsOpenSetUpSessionModal(true); // Set to true to open the modal
      // Find the selected modules based on the sessionId

      // No need to split, just trim the sessionId if necessary
      const flatModuleIds = sessionId.split(',').map(id => parseInt(id.trim(), 10)); // Split and convert to numbers

      // Make an API call based on the selected module IDs

      dispatch(fetchMcqsByModules({ moduleIds: flatModuleIds, totalLimit: limit }))
        .unwrap()
        .then(res => {})
        .catch(err => {
          console.error('Error fetching questions:', err);
        })
        .finally(() => {
          setIsLoading(false); // Reset loading state after API call
        });
    };
    if (isSession === true) {
      handleSessionContinue(sessionId);
    }
  }, [limit, isSession]);
  useEffect(() => {
    // Check if recentSessions are available in localStorage
    const storedSessions = localStorage.getItem('recentSessions');
    if (storedSessions) {
      setLocalRecentSession(JSON.parse(storedSessions));
    }
    localStorage.removeItem('minutes');
    localStorage.removeItem('seconds');
    dispatch(setResetLimit());

    dispatch(clearRecentSessions());
  }, []);
  useEffect(() => {
    localStorage.removeItem('examTimer');
    dispatch(clearResult());
    dispatch(resetQuestionReviewValue());
  }, []);

  useEffect(() => {
    
    dispatch(fetchUserId());
    dispatch(fetchDaysUntilExam(userId));
    dispatch(fetchUserInformation({userId}))
    dispatch(fetchUserStreak({userId}))
    .unwrap()
    .then(res=>{
      console.log("response",res);
      
    })
  }, []);

  return (
    <div className={`lg:flex w-full ${darkModeRedux ? 'dark' : ''}`}>
      <div className='fixed h-full hidden lg:block dark:bg-[#1E1E2A] text-black dark:text-white'>
        <Sidebar />
      </div>
      <div className='flex items-center justify-between p-5 bg-white lg:hidden '>
        <div className=''>
          <img src='/assets/small-logo.png' alt='' />
        </div>

        <div className='' onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>

      <div className='flex-grow  lg:ml-[250px] py-2 md:py-10 overflow-y-auto   dark:bg-[#1E1E2A] text-black '>
        <div className='flex flex-row   items-center  h-[150px] justify-center  sm:justify-evenly w-full gap-x-3 xs:gap-x-16 sm:gap-x-36 xl:gap-x-36 2xl:gap-x-20 py-5'>
          <p className='text-[18px] sm:text-[24px] xl:text-[32px] text-[#52525B] font-extrabold dark:text-white'>
            Hello, {userInfo?.user_metadata?.displayName?.split(' ')[0] || 'unknown'}
          </p>
          <div className='flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:gap-x-5 '>
            <div className='bg-[#FFFFFF] rounded-[6px] flex items-center flex-col justify-center w-[160px] xl:w-[250px] h-[85px] dark:bg-[#1E1E2A] dark:border-[1px] dark:border-[#3A3A48]'>
              <p className='text-[#FF9741] text-[18px] sm:text-[24px] xl:text-[32px] font-black dark:text-white '>
                {examDuration || 'N/A'} Days
              </p>
              <p className='text-[10px] xl:text-[14px] text-[#52525B] font-medium dark:text-white'>
                Until your exam
              </p>
            </div>
            <div className='bg-[#FFFFFF] rounded-[6px] text-center w-[200px] xl:w-[250px] h-[85px] dark:bg-[#1E1E2A] text-black   dark:border-[1px] dark:border-[#3A3A48]'>
              <div className='flex items-center justify-center gap-x-5 h-full '>
                <img
                  src='https://images.unsplash.com/photo-1719937051124-91c677bc58fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D'
                  alt='aaaa'
                  className='rounded-full w-10 h-10 xl:w-14 xl:h-14'
                />
                <div className=''>
                  <p className='text-[14px] xl:text-[18px] text-[#52525B] font-semibold dark:text-white'>
                    {userInfo?.user_metadata?.displayName || 'unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-5 mt-8 md:mt-0 '>
          <div className='flex justify-center flex-col md:flex-row gap-x-5 items-center w-full'>
            <div className='p-6 w-[95%] xs:w-[420px] xl:w-[610px] 2xl:w-[745px] h-[430px] md:h-[520px] bg-white rounded-lg shadow-md dark:bg-[#1E1E2A] text-black   dark:border-[1px] dark:border-[#3A3A48]'>
              <div className='flex items-end justify-end'>
                <div className='mb-5 relative w-[180px]'>
                  <DatePicker
                    selected={selectedDate}
                    onChange={date => setSelectedDate(date)}
                    onCalendarOpen={() => setIsCalendarOpen(true)}
                    onCalendarClose={() => setIsCalendarOpen(false)}
                    dateFormat='MMMM yyyy'
                    showMonthYearPicker
                    className='relative border rounded w-[150px] sm:w-[180px] p-2 text-[12px] sm:text-[14px] cursor-pointer dark:bg-[#1E1E2A] dark:text-white' // Added cursor-pointer class
                  />
                  <span
                    className={`absolute right-10 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-200  dark:text-white ${
                      isCalendarOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-chevron-down'
                    >
                      <path d='m6 9 6 6 6-6' />
                    </svg>
                  </span>
                </div>
              </div>

              <div className='text-center'>
                <p className='text-[12px] sm:text-[14px] font-semibold text-[#52525B] dark:text-white'>
                  Current Streak
                </p>
                <p className='font-black text-[18px]  sm:text-[24px] xl:text-[32px] text-[#FF9741] dark:text-white'>
                  4 Days
                </p>
              </div>

              <div className='flex justify-between gap-x-10'>
                <div className='grid grid-cols-7 gap-[4px] xl:gap-2 mt-4'>
                  {days?.map((day, index) => {
                    const target = day.workCount * 100;
                    const workPercentage = Math.floor(
                      Math.min((day.totalResult / target) * 100, 100)
                    );
                    const bgColorClass = getColorClass(workPercentage);

                    // Compare current day with streak date
                    const currentDate = new Date().toISOString().split("T")[0]; // Format as yyyy-mm-dd
                    const isStreakDay = currentDate === streak.streakDate; // Check if this day matches streak date

                    // Ensure that day.date is in the same format as streak.streakDate
                    const dayDateFormatted = new Date(day.date).toISOString().split("T")[0];

                    // Check if the current day matches streak day
                    const isCurrentDayStreak = dayDateFormatted === streak.streakDate;

                    return (
                      <div
                        key={index}
                        className={`w-6 h-6 xs:w-8 xs:h-8 xl:h-12 xl:w-12 rounded-md flex items-center justify-center text-white relative ${day.workCount > 0 ? bgColorClass : 'bg-[#E4E4E7]'}
        ${isCurrentDayStreak ? 'border-2 border-yellow-500' : ''}`} // Highlight streak day
                      >
                        {/* Render streak icon only for the streak day */}
                        {isCurrentDayStreak && streak.streak === 1 && (
                          <img
                            src='/assets/heat-icon.svg'
                            alt='heat icon'
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-fit'
                          />
                        )}
                      </div>
                    );
                  })}
                </div>



                <div className='flex flex-col mt-4 space-y-2 dark:text-white'>
                  <div className='flex items-center'>
                    <div className='w-6 h-6 xs:w-8 xs:h-8 xl:h-12 xl:w-12 bg-[#047857] rounded-md'></div>
                    <span className='text-[12px] sm:text-[16px] ml-2'> &gt; 99</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-6 h-6 xs:w-8 xs:h-8 xl:h-12 xl:w-12 bg-[#059669] rounded-md'></div>
                    <span className='ml-2 text-[12px] sm:text-[16px]'> &gt; 75</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-6 h-6 xs:w-8 xs:h-8 xl:h-12 xl:w-12 bg-[#34D399] rounded-md'></div>
                    <span className='ml-2 text-[12px] sm:text-[16px]'> &gt; 50</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-6 h-6 xs:w-8 xs:h-8 xl:h-12 xl:w-12 bg-[#6EE7B7] rounded-md'></div>
                    <span className='ml-2 text-[12px] sm:text-[16px]'> &gt; 25</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-6 h-6 xs:w-8 xs:h-8 xl:h-12 xl:w-12 bg-[#A7F3D0] rounded-md'></div>
                    <span className='ml-2 text-[12px] sm:text-[16px]'> &lt; 25</span>
                  </div>
                </div>
              </div>

              <div className=' w-[200px] sm:w-[400px]  mt-6'>
                <p className=' text-center text-[#71717A] text-[14px] sm:text-[16px] dark:text-white'>
                  {formattedMonth}
                </p>
              </div>
            </div>
            <div className='w-[95%] xs:w-[420px] mt-2 md:mt-0 md:w-[280px] xl:w-[320px]  h-[430px] md:h-[520px]   bg-white rounded-lg shadow-md dark:bg-[#1E1E2A] text-black dark:border-[1px] dark:border-[#3A3A48] '>
              <div className='font-bold text-[14px] xl:text-[18px] text-center text-[#52525B] mt-2 p-5'>
                <p className='dark:text-white'>Quick Start</p>
              </div>
              <hr />
              <div className='flex flex-col items-center gap-y-8 justify-between p-5 mt-4'>
                {localRecentSession.length > 0 ? (
                  localRecentSession.map((sessionId, index) => {
                    const categoryIds = sessionId.split(',').map(id => id.trim()); // Convert to array of strings

                    // Find category names corresponding to the category IDs
                    const categoryNames = categoryIds
                      .map(id => {
                        const category = data.data.find(
                          item => item.categoryId === parseInt(id)
                        ); // Find the category by ID
                        return category ? category.categoryName : null; // Return the category name or null if not found
                      })
                      .filter(name => name !== null); // Filter out any null values
                    const truncateCategoryNames = names => {
                      const joinedNames = names.join(', ');
                      return joinedNames.length > 15
                        ? `${joinedNames.slice(0, 15)}+...`
                        : joinedNames;
                    };
                    // Return the JSX for each session
                    return (
                      <div
                        key={index}
                        className='flex items-center justify-between w-full'
                      >
                        <div>
                          <p className='text-[14px] md:text-[16px] font-medium text-[#3F3F46] dark:text-white'>
                            {truncateCategoryNames(categoryNames)}
                          </p>
                          <p className='text-[12px] md:text-[14px] font-semibold text-[#D4D4D8] dark:text-white'>
                            Recent Session
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setSessionId(sessionId);
                              setIsSession(true);
                              handleContinue();
                            }}
                            className='border-[1px] border-[#FF9741] 
             text-[12px] md:text-[16px] 
             p-2 font-semibold rounded-[4px] 
             text-[#FF9741] 
             hover:bg-gradient-to-r hover:from-[#FF9741] hover:to-[#FF5722] hover:text-white 
             transition-all duration-200 ease-in-out 
             dark:text-white 
             dark:border-white 
             dark:hover:bg-gradient-to-r dark:hover:from-[#1E1E2A] dark:hover:to-[#3E3E55] 
             dark:hover:text-[#FF9741] 
             dark:hover:shadow-lg dark:hover:shadow-[#FF9741]/60'
                          >
                            Continue &gt;
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className='flex items-center justify-center'>
                    <p>No Session.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row-reverse justify-center gap-x-5 items-center w-full '>
            <div className=' p-6 w-[95%] xs:w-[420px] md:w-[435px] xl:w-[665px] 2xl:w-[800px] h-[430px] md:h-[500px]  bg-white rounded-lg shadow-md dark:bg-[#1E1E2A] text-black dark:border-[1px] dark:border-[#3A3A48]'>
              <h2 className='font-bold text-[20px] text-center py-3 dark:text-white'>
                Monthly Progress
              </h2>
              <StackedBar days={days} />

              <div className='flex items-center justify-center gap-x-[75px] mt-7  md:mt-5'>
                <p className='text-[#52525B] font-medium dark:text-white'>
                  Correct Questions
                </p>
                <div className='w-[16px] h-[16px] rounded-[2px] bg-[#3CC8A1]' />
              </div>
              <div className='flex items-center justify-center gap-x-16 mb-3 md:mb-0'>
                <p className='text-[#52525B] font-medium dark:text-white'>
                  Incorrect Questions
                </p>
                <div className='w-[16px] h-[16px] rounded-[2px] bg-[#FF9741]' />
              </div>
            </div>

            <div className=' w-[95%] xs:w-[420px] mt-2 md:mt-0 md:w-[261px] h-[400px] md:h-[500px] bg-white rounded-lg shadow-md dark:bg-[#1E1E2A] text-black dark:border-[1px] dark:border-[#3A3A48]'>
              <div className='flex items-center justify-between cursor-pointer text-[18px] text-center text-[#52525B] p-5 font-semibold'>
                <p className=' text-[#3F3F46] dark:text-white'>Questions</p>
                <p className='text-[16px] flex items-center  justify-center dark:text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    class='lucide lucide-chevron-down text-[#FF9741] dark:text-white'
                  >
                    <path d='m6 9 6 6 6-6' />
                  </svg>{' '}
                </p>
              </div>
              <hr />
              <div className='flex items-center flex-col justify-center'>
                <div
                  onClick={() => navigate('/questioning', { state: 'SAQ' })}
                  className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] dark:text-white cursor-pointer'
                >
                  <div className='w-[20%]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='lucide lucide-pencil dark:text-white'
                    >
                      <path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' />
                      <path d='m15 5 4 4' />
                    </svg>
                  </div>
                  <div className='w-[80%]'>
                    <p className='font-semibold text-[14px] text-[#3F3F46] dark:text-white'>
                      Short Answer
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/questioning', { state: 'SBA' })}
                  className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] cursor-pointer'
                >
                  <div className='w-[20%]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='lucide lucide-circle-check dark:text-white'
                    >
                      <circle cx='12' cy='12' r='10' />
                      <path d='m9 12 2 2 4-4' />
                    </svg>
                  </div>
                  <div className='w-[80%]'>
                    <p className='font-semibold text-[14px] text-[#3F3F46] dark:text-white'>
                      Single Best <br /> Answer
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/questioning', { state: 'Mock' })}
                  className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] cursor-pointer'
                >
                  <div className='w-[20%]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='lucide lucide-bone dark:text-white'
                    >
                      <path d='M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z' />
                    </svg>
                  </div>
                  <div className='w-[80%]'>
                    <p className='font-semibold text-[14px] text-[#3F3F46] dark:text-white'>
                      Mock Paper
                    </p>
                  </div>
                </div>

                {/* <div className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] '>
                  <div className='w-[20%]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='lucide lucide-pencil dark:text-white'
                    >
                      <path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' />
                      <path d='m15 5 4 4' />
                    </svg>
                  </div>
                  <div className='w-[80%]'>
                    <p className='font-semibold text-[14px] text-[#3F3F46] dark:text-white'>
                      Anatomy Quiz
                    </p>
                  </div>
                </div> */}

                <div
                  onClick={() => navigate('/questioning', { state: 'QuesGen' })}
                  className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] cursor-pointer'
                >
                  <div className='w-[20%]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='lucide lucide-chart-no-axes-combined dark:text-white'
                    >
                      <path d='M12 16v5' />
                      <path d='M16 14v7' />
                      <path d='M20 10v11' />
                      <path d='m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15' />
                      <path d='M4 18v3' />
                      <path d='M8 14v7' />
                    </svg>
                  </div>
                  <div className='w-[80%]'>
                    <p className='font-semibold text-[14px] text-[#3F3F46] dark:text-white'>
                      Question <br />
                      Generation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='right'
        className='bla bla bla'
        lockBackgroundScroll={true}
      >
        <div className='m-5' onClick={toggleDrawer}>
          <RxCross2 />
        </div>

        <div className='mb-10 flex items-center justify-center'>
          <Logo />
        </div>
        <div className='flex min-h-screen overflow-y-auto  flex-col  justify-between'>
          <nav className='space-y-5 w-full  text-[#3F3F46]'>
            {[
              { name: 'Dashboard', icon: 'house' },
              { name: 'Practice', icon: 'dumbbell' },
              { name: 'Performance', icon: 'chart-line' },
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
                  {item.icon === 'dumbbell' && (
                    <>
                      <path d='M14.4 14.4 9.6 9.6' />
                      <path d='M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z' />
                      <path d='m21.5 21.5-1.4-1.4' />
                      <path d='M3.9 3.9 2.5 2.5' />
                      <path d='M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z' />
                    </>
                  )}
                  {item.icon === 'chart-line' && (
                    <>
                      <path d='M3 3v16a2 2 0 0 0 2 2h16' />
                      <path d='m19 9-5 5-4-4-3 3' />
                    </>
                  )}
                  {item.icon === 'git-merge' && (
                    <>
                      <circle cx='18' cy='18' r='3' />
                      <circle cx='6' cy='6' r='3' />
                      <path d='M6 21V9a9 9 0 0 0 9 9' />
                    </>
                  )}
                  {item.icon === 'book-open' && (
                    <>
                      <path d='M12 7v14' />
                      <path d='M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z' />
                    </>
                  )}
                  {item.icon === 'bed' && (
                    <>
                      <path d='M2 4v16' />
                      <path d='M2 8h18a2 2 0 0 1 2 2v10' />
                      <path d='M2 17h20' />
                      <path d='M6 8v9' />
                    </>
                  )}
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
              <div className='flex items-center space-x-3 text-[#3F3F46] group cursor-pointer'>
                <i className='fa fa-cog text-xl group-hover:text-[#3CC8A1]'></i>
                <span className='text-[14px] font-medium group-hover:text-[#3CC8A1]'>
                  Settings
                </span>
              </div>
            </NavLink>
          </div>
        </div>
      </Drawer>

      {isOpenSetUpSessionModal && (
        <SetupSessionModal
          isOpenSetUpSessionModal={isOpenSetUpSessionModal}
          setIsOpenSetUpSessionModal={setIsOpenSetUpSessionModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
