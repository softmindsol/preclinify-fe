import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './common/Sidebar';
import { Link } from 'react-router-dom';
import Logo from './common/Logo';
import { RxCross2 } from 'react-icons/rx';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { TbBaselineDensityMedium } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchModules,
  fetchOSCEData,
} from '../redux/features/osce-static/osce-static.service';

const Scenarios = () => {
  const { data = [], loading } = useSelector(state => state.osce);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const darkModeRedux = useSelector(state => state.darkMode.isDarkMode);
  const [activeFilters, setActiveFilters] = useState([]);
  const [module, setModule] = useState([]);
  const [activeTab, setActiveTab] = useState('static');
  const categoryRef = useRef(null);

  console.log('data', data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        localStorage.removeItem('minutes');
        localStorage.removeItem('seconds');

        const osceData = await dispatch(fetchOSCEData()).unwrap();
        const moduleNames = osceData.map(item => item.module);

        dispatch(fetchModules(moduleNames))
          .unwrap()
          .then(res => {
            console.log(res);
            setModule(res);
          })
          .catch(err => {
            console.error('Fetch Modules Error:', err);
          });
      } catch (err) {
        console.log('Error:', err);
      }
    };

    fetchData();
  }, [dispatch]);

  const toggleDrawer = () => {
    setIsOpen(prevState => !prevState);
  };

  const sortDataById = data => {
    return data.slice().sort((a, b) => {
      return sortAscending ? a.id - b.id : b.id - a.id;
    });
  };

  const toggleSortOrder = () => {
    setSortAscending(prev => !prev);
  };

  const sortedData = sortDataById(data);

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newFilter = searchQuery.trim();
      if (newFilter && !activeFilters.includes(newFilter)) {
        setActiveFilters([...activeFilters, newFilter]);
        setSearchQuery('');
      }
    }
  };

  const filteredData = sortedData.filter(osce => {
    const lowerCaseCategory = osce.category.toLowerCase();
    const lowerCaseStationName = osce.stationName.toLowerCase();
    const lowerCaseId = osce.id.toString();

    const matchedCategory = module.find(mod => mod.categoryId === osce.module);
    const categoryName = matchedCategory ? matchedCategory.categoryName : '';
    const lowerCaseCategoryName = categoryName.toLowerCase();

    const matchesCategory = selectedCategory
      ? lowerCaseCategory === selectedCategory.toLowerCase()
      : true;

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some(filter => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
          lowerCaseCategory.includes(lowerCaseFilter) ||
          lowerCaseStationName.includes(lowerCaseFilter) ||
          lowerCaseId.includes(lowerCaseFilter) ||
          lowerCaseCategoryName.includes(lowerCaseFilter)
        );
      });

    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const matchesSearchQuery =
      lowerCaseCategory.includes(lowerCaseSearchQuery) ||
      lowerCaseStationName.includes(lowerCaseSearchQuery) ||
      lowerCaseId.includes(lowerCaseSearchQuery) ||
      lowerCaseCategoryName.includes(lowerCaseSearchQuery);

    return matchesCategory && matchesFilters && matchesSearchQuery;
  });

  return (
    <div className={`md:flex min-h-screen ${darkModeRedux ? 'dark' : ''}`}>
      <div className='hidden md:block fixed h-full'>
        <Sidebar />
      </div>
      <div className='flex items-center justify-between p-5 bg-white md:hidden w-full'>
        <div className=''>
          <img src='/assets/small-logo.png' alt='' />
        </div>
        <div className='' onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>
      <div className='dark:bg-[#1E1E2A] md:ml-[250px] w-full px-10'>
        <div className='mt-8'>
          <div className='flex justify-center w-full items-center gap-x-2 text-[14px] lg:text-[16px] xl:text-[20px]'>
            {/* Static Scenarios Tab */}
            <div
              className={`flex justify-center w-full items-center space-x-4 rounded-tl-[4px] ${
                activeTab === 'static' ? 'bg-[#FAFAFA]' : 'bg-[#E4E4E7]'
              } dark:border dark:bg-[#1E1E2A] dark:border-[#3A3A48]`}
            >
              <button
                className='px-4 flex items-center space-x-4 py-2 text-[#3F3F46] font-semibold dark:text-white'
                onClick={() => setActiveTab('static')}
              >
                <span>Static Scenarios</span>
              </button>
            </div>

            {/* AI Patient Scenarios Tab */}
            <div
              className={`flex justify-center w-full items-center rounded-tr-[4px] ${
                activeTab === 'ai' ? 'bg-[#FAFAFA]' : 'bg-[#E4E4E7]'
              } dark:border dark:bg-[#1E1E2A] dark:border-[#3A3A48]`}
            >
              <button
                className='flex items-center space-x-4 text-[#3F3F46] px-4 py-2 font-medium dark:text-white'
                onClick={() => setActiveTab('ai')}
              >
                <span>AI Patient Scenarios</span>
              </button>
            </div>
          </div>

          {activeTab === 'static' ? (
            <div className='bg-white p-5 rounded-[8px] dark:bg-[#1E1E2A] dark:border dark:border-[#3A3A48]'>
              <div className='flex items-center justify-center'>
                <div className='grid sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-6 justify-items-center'>
                  {[
                    {
                      cat: 'Examination',
                      icon: (
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
                          className='lucide lucide-stethoscope'
                        >
                          <path d='M11 2v2' />
                          <path d='M5 2v2' />
                          <path d='M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1' />
                          <path d='M8 15a6 6 0 0 0 12 0v-3' />
                          <circle cx='20' cy='10' r='2' />
                        </svg>
                      ),
                    },
                    {
                      cat: 'History',
                      icon: (
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
                          className='lucide lucide-file-clock'
                        >
                          <path d='M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3' />
                          <path d='M14 2v4a2 2 0 0 0 2 2h4' />
                          <circle cx='8' cy='16' r='6' />
                          <path d='M9.5 17.5 8 16.25V14' />
                        </svg>
                      ),
                    },
                    {
                      cat: 'Interpretation',
                      icon: (
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
                          className='lucide lucide-heart-pulse'
                        >
                          <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
                          <path d='M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27' />
                        </svg>
                      ),
                    },
                    {
                      cat: 'Counselling',
                      icon: (
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
                          className='lucide lucide-message-circle'
                        >
                          <path d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z' />
                        </svg>
                      ),
                    },
                  ].map(category => (
                    <button
                      key={category.cat}
                      onClick={() => {
                        // Toggle the selected category
                        setSelectedCategory(prev =>
                          prev === category.cat ? null : category.cat
                        );
                      }}
                      className={`h-[45px] lg:h-[56px] w-[200px] lg:w-[242px] py-2 px-4 rounded-[4px] font-bold flex items-center justify-center 
                                            ${
                                              selectedCategory === category.cat
                                                ? 'bg-transparent text-[#3CC8A1]'
                                                : 'bg-[#3CC8A1] text-white'
                                            } 
                                            transition-all duration-200 border border-[#3CC8A1] text-[14px] lg:text-[18px]`}
                    >
                      <span>{category.icon}</span>
                      <span className='text-[20px]'>{category.cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className='flex flex-col xl:flex-row items-center gap-5 justify-around mt-10'>
                <div className='flex items-center justify-end gap-x-5 w-full'>
                  <div className='bg-[#F4F4F5] text-black flex gap-2 items-center px-5 w-full max-w-[347px]  h-[45px]'>
                    <button className='text-gray-400'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-5 h-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z'
                        />
                      </svg>
                    </button>
                    <input
                      type='text'
                      placeholder='Search for specialties, topics and symptoms'
                      className='sm:text-sm text-[9px] font-semibold bg-transparent focus:outline-none w-full'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
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
                    className='lucide lucide-sliders-horizontal dark:text-white'
                  >
                    <line x1='21' x2='14' y1='4' y2='4' />
                    <line x1='10' x2='3' y1='4' y2='4' />
                    <line x1='21' x2='12' y1='12' y2='12' />
                    <line x1='8' x2='3' y1='12' y2='12' />
                    <line x1='21' x2='16' y1='20' y2='20' />
                    <line x1='12' x2='3' y1='20' y2='20' />
                    <line x1='14' x2='14' y1='2' y2='6' />
                    <line x1='8' x2='8' y1='10' y2='14' />
                    <line x1='16' x2='16' y1='18' y2='22' />
                  </svg>
                </div>
              </div>

              <div className='flex flex-wrap items-center justify-evenly'>
                <div className='flex flex-wrap items-center w-[68%] justify-start space-x-4 p-4'>
                  {activeFilters.map((filter, index) => (
                    <div
                      key={index}
                      className='flex items-center border-2 border-[#FF9741] rounded-full px-4 py-2 text-[#FF9741] mb-2'
                    >
                      <span>{filter}</span>
                      <button
                        onClick={() => {
                          setActiveFilters(activeFilters.filter((_, i) => i !== index));
                        }}
                        className='ml-2'
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
                          className='lucide lucide-x'
                        >
                          <path d='M18 6 6 18' />
                          <path d='m6 6 12 12' />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex flex-col items-center justify-center mt-10 w-full '>
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-10 w-full'>
                  {loading ? (
                    [...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className='p-4 bg-[#F4F4F5] rounded-[8px] shadow-md text-center dark:bg-[#1E1E2A] border w-full dark:border-[#3A3A48] animate-pulse'
                      >
                        <div className='h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-3 mx-auto'></div>
                        <div className='h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2'></div>
                        <div className='h-5 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-4'></div>
                        <div className='h-10 w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto'></div>
                      </div>
                    ))
                  ) : filteredData.length > 0 ? (
                    filteredData.map(osce => {
                      const matchedCategory = module.find(
                        mod => mod.categoryId === osce.module
                      );
                      const categoryName = matchedCategory
                        ? matchedCategory.categoryName
                        : 'Fetching...';

                      return (
                        <div
                          key={osce.id}
                          className='p-4 bg-[#F4F4F5] hover:opacity-75 cursor-pointer relative rounded-[8px] shadow-md text-center dark:bg-[#1E1E2A] border dark:border-[#3A3A48]'
                        >
                          <Link
                            to={
                              activeTab === 'static'
                                ? `/static-scenerios-detail/${osce.id}`
                                : `/osce-ai-bot/${categoryName.replace(/\s+/g, '-')}`
                            }
                          >
                            <div className='flex flex-col h-full justify-between'>
                              <div>
                                <p className='absolute top-1 right-2 text-[12px] font-semibold text-[#A1A1AA] lg:text-[14px] dark:text-white'>
                                  {osce.category}
                                </p>
                                <div className='text-[20px] text-[#3F3F46] mt-3 font-bold dark:text-white'>
                                  {categoryName}
                                </div>
                                <div className='text-[16px] text-[#A1A1AA] font-semibold dark:text-white'>
                                  {osce.stationName}
                                </div>
                              </div>
                              <div className='text-[48px] text-[#52525B] font-bold dark:text-white'>
                                #{osce.id}
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <div className='col-span-full text-center text-gray-500 dark:text-gray-300'>
                      No records found
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            activeTab === 'ai' && (
              <div className='bg-white p-5 rounded-[8px] dark:bg-[#1E1E2A] dark:border dark:border-[#3A3A48]'>
                <div className='flex items-center justify-center'>
                  <div className='grid sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-6 justify-items-center'>
                    {[
                      {
                        cat: 'Examination',
                        icon: (
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
                            className='lucide lucide-stethoscope'
                          >
                            <path d='M11 2v2' />
                            <path d='M5 2v2' />
                            <path d='M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1' />
                            <path d='M8 15a6 6 0 0 0 12 0v-3' />
                            <circle cx='20' cy='10' r='2' />
                          </svg>
                        ),
                      },
                      {
                        cat: 'History',
                        icon: (
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
                            className='lucide lucide-file-clock'
                          >
                            <path d='M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3' />
                            <path d='M14 2v4a2 2 0 0 0 2 2h4' />
                            <circle cx='8' cy='16' r='6' />
                            <path d='M9.5 17.5 8 16.25V14' />
                          </svg>
                        ),
                      },
                      {
                        cat: 'Interpretation',
                        icon: (
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
                            className='lucide lucide-heart-pulse'
                          >
                            <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
                            <path d='M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27' />
                          </svg>
                        ),
                      },
                      {
                        cat: 'Counselling',
                        icon: (
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
                            className='lucide lucide-message-circle'
                          >
                            <path d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z' />
                          </svg>
                        ),
                      },
                    ].map(category => (
                      <button
                        key={category.cat}
                        onClick={() => {
                          // Toggle the selected category
                          setSelectedCategory(prev =>
                            prev === category.cat ? null : category.cat
                          );
                        }}
                        className={`h-[45px] lg:h-[56px] w-[200px] lg:w-[242px] py-2 px-4 rounded-[4px] font-bold flex items-center justify-center 
                                            ${
                                              selectedCategory === category.cat
                                                ? 'bg-transparent text-[#3CC8A1]'
                                                : 'bg-[#3CC8A1] text-white'
                                            } 
                                            transition-all duration-200 border border-[#3CC8A1] text-[14px] lg:text-[18px]`}
                      >
                        <span>{category.icon}</span>
                        <span className='text-[20px]'>{category.cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className='flex flex-col xl:flex-row items-center gap-5 justify-around mt-10'>
                  <div className='flex items-center justify-end gap-x-5 w-full'>
                    <div className='bg-[#F4F4F5] text-black flex gap-2 items-center px-5 w-full max-w-[347px]  h-[45px]'>
                      <button className='text-gray-400'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-5 h-5'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z'
                          />
                        </svg>
                      </button>
                      <input
                        type='text'
                        placeholder='Search for specialties, topics and symptoms'
                        className='sm:text-sm text-[9px] font-semibold bg-transparent focus:outline-none w-full'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
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
                      className='lucide lucide-sliders-horizontal dark:text-white'
                    >
                      <line x1='21' x2='14' y1='4' y2='4' />
                      <line x1='10' x2='3' y1='4' y2='4' />
                      <line x1='21' x2='12' y1='12' y2='12' />
                      <line x1='8' x2='3' y1='12' y2='12' />
                      <line x1='21' x2='16' y1='20' y2='20' />
                      <line x1='12' x2='3' y1='20' y2='20' />
                      <line x1='14' x2='14' y1='2' y2='6' />
                      <line x1='8' x2='8' y1='10' y2='14' />
                      <line x1='16' x2='16' y1='18' y2='22' />
                    </svg>
                  </div>
                </div>

                <div className='flex flex-wrap items-center justify-evenly'>
                  <div className='flex flex-wrap items-center w-[68%] justify-start space-x-4 p-4'>
                    {activeFilters.map((filter, index) => (
                      <div
                        key={index}
                        className='flex items-center border-2 border-[#FF9741] rounded-full px-4 py-2 text-[#FF9741] mb-2'
                      >
                        <span>{filter}</span>
                        <button
                          onClick={() => {
                            setActiveFilters(activeFilters.filter((_, i) => i !== index));
                          }}
                          className='ml-2'
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
                            className='lucide lucide-x'
                          >
                            <path d='M18 6 6 18' />
                            <path d='m6 6 12 12' />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='flex flex-col items-center justify-center mt-10'>
                  <div className='grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-10 w-full'>
                    {loading ? (
                      [...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className='p-4 bg-[#F4F4F5] rounded-[8px] shadow-md text-center dark:bg-[#1E1E2A] border w-full dark:border-[#3A3A48] animate-pulse'
                        >
                          <div className='h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-3 mx-auto'></div>
                          <div className='h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2'></div>
                          <div className='h-5 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-4'></div>
                          <div className='h-10 w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto'></div>
                        </div>
                      ))
                    ) : filteredData.length > 0 ? (
                      filteredData.map(osce => {
                        const matchedCategory = module.find(
                          mod => mod.categoryId === osce.module
                        );
                        const categoryName = matchedCategory
                          ? matchedCategory.categoryName
                          : 'Fetching...';

                        return (
                          <div
                            key={osce.id}
                            className='p-4 bg-[#F4F4F5] hover:opacity-75 cursor-pointer relative rounded-[8px] shadow-md text-center dark:bg-[#1E1E2A] border dark:border-[#3A3A48]'
                          >
                            <Link
                              to={
                                activeTab === 'static'
                                  ? `/static-scenerios-detail/${osce.id}`
                                  : `/osce-ai-bot/${categoryName.replace(/\s+/g, '-')}`
                              }
                            >
                              <div className='flex flex-col h-full justify-between'>
                                <div>
                                  <p className='absolute top-1 right-2 text-[12px] font-semibold text-[#A1A1AA] lg:text-[14px] dark:text-white'>
                                    {osce.category}
                                  </p>
                                  <div className='text-[20px] text-[#3F3F46] mt-3 font-bold dark:text-white'>
                                    {categoryName}
                                  </div>
                                  <div className='text-[16px] text-[#A1A1AA] font-semibold dark:text-white'>
                                    {osce.stationName}
                                  </div>
                                </div>
                                <div className='text-[48px] text-[#52525B] font-bold dark:text-white'>
                                  #{osce.id}
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <div className='col-span-full text-center text-gray-500 dark:text-gray-300'>
                        No records found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
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
        <div className='flex min-h-screen overflow-y-auto flex-col justify-between'>
          <nav className='space-y-5 w-full text-[#3F3F46]'>
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
                      <path
                        d='M3 18a1 1 0 0 1-1-1V4a1 ```javascript
1 0 0 1 1-1h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H3z'
                      />
                    </>
                  )}
                  {item.icon === 'bed' && (
                    <>
                      <path d='M3 12h18v6H3z' />
                      <path d='M3 6h18v6H3z' />
                      <path d='M3 6v6' />
                      <path d='M21 6v6' />
                    </>
                  )}
                </svg>
                <span className='text-[16px]'>{item.name}</span>
              </div>
            ))}
          </nav>
        </div>
      </Drawer>
    </div>
  );
};

export default Scenarios;
