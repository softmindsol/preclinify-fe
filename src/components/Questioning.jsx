import React, { useEffect, useState } from "react";
import Sidebar from "./common/Sidebar";
import { TbBaselineDensityMedium } from "react-icons/tb";

import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import { Link } from 'react-router-dom';
import Logo from "./common/Logo";
import { RxCross2 } from "react-icons/rx";
import SetupSessionModal from "./SetupSessionModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchModules } from "../redux/features/categoryModules/module.service";
import { setLoading } from "../redux/features/loader/loader.slice";
import { fetchMcqsByModules } from "../redux/features/SBA/sba.service";
import { clearResult } from "../redux/features/result/result.slice";
import { setResetLimit } from "../redux/features/limit/limit.slice";
import Loader from "./common/Loader";
import { resetQuestionReviewValue } from "../redux/features/question-review/question-review.slice";
import { fetchShortQuestionByModules, fetchShortQuestionByModulesById, fetchSqaChild } from "../redux/features/SAQ/saq.service";

import { setPreclinicalType } from "../redux/features/mode/mode.slice";
import { clearRecentSessions, updateRecentSessions } from "../redux/features/recent-session/recent-session.slice";
import { clearMcqsAccuracy } from "../redux/features/accuracy/accuracy.slice";
import FileUpload from "./Upload";
import { setModeType } from "../redux/features/question-gen/question-gen.slice";
import supabase from "../config/helper";
import { resetAttempts, setActive } from "../redux/features/attempts/attempts.slice";
import { fetchQuesGenModules,fetchQuesGenModuleById } from "../redux/features/question-gen/question-gen.service";
import { fetchModulesById, fetchMockTest, fetchMockTestById } from "../redux/features/mock-test/mock.service";
 

const Questioning = () => {
        const sqa = useSelector(state => state?.SQA || [])
    console.log("SQA:",sqa);
    
    const darkModeRedux=useSelector(state=>state.darkMode.isDarkMode)
    const recentSession = useSelector(state => state.recentSession.recentSessions);
    const type = useSelector((state) => state.mode?.questionMode?.selectedOption)
    const questionGenModule = useSelector(state => state?.quesGen);
    const { mockTestIds, modules, loading, error } = useSelector((state) => state.mockModules);
    const data = useSelector((state) => state.module);
    const { limit } = useSelector((state) => state.limit);
    const [isOpenSetUpSessionModal, setIsOpenSetUpSessionModal] = useState(false);
    const [storedSession, setStoredSession] = useState([])
    const [selectedModules, setSelectedModules] = useState([]);
    const [checkedItems, setCheckedItems] = useState({}); // State for checkboxes
    const [moduleId, setModuleId] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState('SBA');
    const [selectedPreClinicalOption, setSelectedPreClinicalOption] = useState('QuesGen');
    const [recentSessions, setRecentSessions] = useState([]);
    const [isSession, setIsSession] = useState(false)
    const [sessionId, setSessionId] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isToggled, setIsToggled] = useState(false);
    const [localRecentSession, setLocalRecentSession] = useState([]);
    const [isSortedByPresentation, setIsSortedByPresentation] = useState(false);
    const [saqModule,setSAQModule]=useState([]);
    const filteredModules = data.data.filter(module =>
        module.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const [totals, setTotals] = useState({ totalCorrect: 0, totalIncorrect: 0, totalUnanswered: 0 });
    const [moduleTotals, setModuleTotals] = useState({});
    const [selectedTab, setSelectedTab] = useState('Clinical');
    const handleToggle = () => {
        setIsSortedByPresentation(prev => !prev);
    };
   
    const handleTabChange = (tab) => {
        setSelectedTab(tab); // Update the selected tab
    };

    // Handler to update the selected option
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value); // Update state with the selected value
    };
    const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
    }    

    const handleCheckboxChange = (categoryId) => {
        const selectedModule = data.data.find((module) => module.categoryId === categoryId); // Find the selected module
        const moduleName = selectedModule ? selectedModule.categoryName : ''; // Get the module name


        // Toggle the selected module
        setSelectedModules((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // Remove if already selected
                : [...prev, categoryId] // Add if not selected
        );

        setRecentSessions((prev) => {
            // Find all currently selected modules
            const selectedModuleNames = data.data
                .filter((module) => selectedModules.includes(module.categoryId) || module.categoryId === categoryId)
                .map((module) => module.categoryId);
            const selectedModuleName = data.data
                .filter((module) => selectedModules.includes(module.categoryId) || module.categoryId === categoryId)
                .map((module) => module.categoryName);
            // Combine module names into a single string
            const combinedSession = selectedModuleNames.join(', ');

            // Update recent sessions: keep only the last entry if a new combination is made
            return combinedSession ? [combinedSession] : [];
        });
    };

    const preClinicalHandler =()=>{
       setSelectedPreClinicalOption('QuesGen')
   }
  
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            // Select all module IDs
            const allModuleIds = data?.data?.map((row) => row.categoryId) || [];
            setSelectedModules(allModuleIds);
        } else {
            // Deselect all module IDs
            setSelectedModules([]);
        }
    };

    function handleContinue() {
        setIsOpenSetUpSessionModal(true); // Set to true to open the modal

    }

    // it can be use later

    // function handleSessionContinue(sessionId) {
    //     // Open the setup session modal
    //     setIsOpenSetUpSessionModal(true); // Set to true to open the modal

    //     // Find the selected modules based on the sessionId

    //     // No need to split, just trim the sessionId if necessary
    //     const flatModuleIds = sessionId.split(',').map(id => parseInt(id.trim(), 10)); // Split and convert to numbers

    //     // Make an API call based on the selected module IDs
    //     if (flatModuleIds.length > 0 && !isLoading) { // Check if not already loading
    //         setIsLoading(true); // Set loading state to true
    //         dispatch(setLoading({ key: 'modules/fetchMcqsByModule', value: true }));
    //         dispatch(fetchMcqsByModules({ moduleIds: flatModuleIds, totalLimit: limit }))
    //             .unwrap()
    //             .then(() => {
    //                 console.log("Limit:", limit);

    //                 dispatch(setLoading({ key: 'modules/fetchMcqsByModule', value: false }));
    //                 console.log("Fetched questions for modules:", flatModuleIds);
    //             })
    //             .catch((err) => {
    //                 dispatch(setLoading({ key: 'modules/fetchMcqsByModule', value: false }));
    //                 console.error("Error fetching questions:", err);
    //             })
    //             .finally(() => {
    //                 setIsLoading(false); // Reset loading state after API call
    //             });
    //     } else {
    //         console.log("No modules selected for this session or already loading.");
    //     }
    // }



    // fetch Modules

    useEffect(() => {
        const handleSessionContinue = async (sessionId) => {
            // Open the setup session modal
            setIsOpenSetUpSessionModal(true); // Set to true to open the modal
            // Find the selected modules based on the sessionId

            // No need to split, just trim the sessionId if necessary
            const flatModuleIds = sessionId.split(',').map(id => parseInt(id.trim(), 10)); // Split and convert to numbers

            // Make an API call based on the selected module IDs

            dispatch(fetchMcqsByModules({ moduleIds: flatModuleIds, totalLimit: limit }))
                .unwrap()
                .then((res) => {
                })
                .catch((err) => {
                    console.error("Error fetching questions:", err);
                })
                .finally(() => {
                    setIsLoading(false); // Reset loading state after API call
                });

        }
        if (isSession === true) {
            handleSessionContinue(sessionId)
        }

    }, [limit, isSession])

    useEffect(() => {
        if(type==='SBA' || type==='SAQ'){
            dispatch(setLoading({ key: 'modules/fetchModules', value: true }));
            setIsLoading(true)
            dispatch(fetchModules())
                .unwrap()
                .then(() => {
                    setIsLoading(false)
                    dispatch(setLoading({ key: 'modules/fetchModules', value: false }));
                }).catch(err => {
                    dispatch(setLoading({ key: 'modules/fetchModules', value: false }));
                    setIsLoading(false)
                })
        }

        else if (type === 'QuesGen'){
            dispatch(setLoading({ key: 'modules/fetchQuesGenModules', value: true }));
            setIsLoading(true)
            dispatch(fetchQuesGenModules())
                .unwrap()
                .then(() => {
                    setIsLoading(false)
                    dispatch(setLoading({ key: 'modules/fetchQuesGenModules', value: false }));
                }).catch(err => {
                    dispatch(setLoading({ key: 'modules/fetchQuesGenModules', value: false }));
                    setIsLoading(false)
                })
        }

       else if (type === 'Mock') {
            dispatch(setLoading({ key: 'modules/fetchModulesByMock', value: true }));
            setIsLoading(true)
            dispatch(fetchModules())
                .unwrap()
                .then(() => {
                    setIsLoading(false)
                    dispatch(setLoading({ key: 'modules/fetchModulesByMock', value: false }));
                }).catch(err => {
                    dispatch(setLoading({ key: 'modules/fetchModulesByMock', value: false }));
                    setIsLoading(false)
                })
        }



        sessionStorage.removeItem('persist:result');
        // Dispatch Redux action to clear 'result' from Redux store
        dispatch(clearResult());
        dispatch(clearMcqsAccuracy())
        dispatch(resetAttempts([]))
        dispatch(setResetLimit())
        dispatch(resetQuestionReviewValue());
        dispatch(setActive(true));
    }, []);



    useEffect(() => {
        dispatch(setPreclinicalType({ selectedOption }));

        // if (selectedModules.length > 0) {
            if (selectedOption === 'SBA') {
                
                dispatch(setLoading({ key: 'modules/fetchMcqsByModules', value: true }));
                dispatch(fetchMcqsByModules({ moduleIds: selectedModules, totalLimit: limit }))
                    .unwrap()
                    .then(() => {
                        dispatch(setLoading({ key: 'modules/fetchMcqsByModules', value: false }));
                    })
                    .catch((err) => {
                        dispatch(setLoading({ key: 'modules/fetchMcqsByModules', value: false }));
                    });
            } 
            else if (selectedOption === 'SAQ') {
                dispatch(setLoading({ key: 'modules/fetchShortQuestionByModules', value: true }));
                
                dispatch(fetchShortQuestionByModules({ moduleIds: selectedModules, totalLimit: limit }))
                    .unwrap()
                    .then((res) => {
                        dispatch(setLoading({ key: 'modules/fetchShortQuestionByModules', value: false }));

                        dispatch(fetchModulesById({ ids: res.ids }))
                            .unwrap()
                            .then((res) => {
                                setIsLoading(false);
                                dispatch(setLoading({ key: 'modules/fetchModulesByMock', value: false }));
                              
                                setSAQModule(res)
                            })
                            .catch((err) => {
                                setIsLoading(false);
                                dispatch(setLoading({ key: 'modules/fetchModulesByMock', value: false }));
                            })

                    })
                    .catch((err) => {
                        dispatch(setLoading({ key: 'modules/fetchShortQuestionByModules', value: false }));
                    });



                    // Fetch Question By ID
                dispatch(fetchShortQuestionByModulesById({ moduleIds: selectedModules }))
                    .unwrap()
                    .then((res) => {
                        dispatch(setLoading({ key: 'modules/fetchShortQuestionByModuleById', value: false }));

                        if (res && res.length > 0) {
                            // Extracting all parentIds
                            const parentIds = res.map(item => item.id);

                            // Dispatch fetchSqaChild with all parentIds
                            dispatch(fetchSqaChild({ parentIds, limit }))
                                .unwrap()
                                .then(childRes => {
                                    console.log("SQA Child Response", childRes);

                                    // Organizing Data
                                    const organizedData = res.map(parent => ({
                                        ...parent,
                                        children: childRes.filter(child => child.parentQuestionId === parent.id)
                                    }));

                                    console.log("Organized Data", organizedData);
                                })
                                .catch(err => {
                                    console.log("Error fetching SQA Child:", err);
                                });
                        }
                    })
                    .catch((err) => {
                        dispatch(setLoading({ key: 'modules/fetchShortQuestionByModules', value: false }));
                    });





            }
           else if (selectedOption === 'QuesGen') {
                dispatch(setLoading({ key: 'modules/fetchQuesGenModuleById', value: true }));
                dispatch(fetchQuesGenModuleById({ moduleIds: selectedModules, totalLimit: limit }))
                    .unwrap()
                    .then((res) => {
                        console.log("response:",res);
                        
                        dispatch(setLoading({ key: 'modules/fetchQuesGenModuleById', value: false }));
                    })
                    .catch((err) => {
                        dispatch(setLoading({ key: 'modules/fetchQuesGenModuleById', value: false }));
                    });
            } 
            else if (selectedOption === 'Mock') {
               

                
                dispatch(setLoading({ key: 'modules/fetchMockTest', value: true }));
                // Fetch IDs from mockTable
                dispatch(fetchMockTest())
                    .unwrap()
                    .then((ids) => {
                     
                        // Pass the fetched IDs to fetchModules
                        dispatch(fetchModulesById({ ids }))
                            .unwrap()
                            .then((res) => {
                                setIsLoading(false);
                                dispatch(setLoading({ key: 'modules/fetchModulesByMock', value: false }));
                                
                            })
                            .catch((err) => {
                                setIsLoading(false);
                                dispatch(setLoading({ key: 'modules/fetchModulesByMock', value: false }));
                            });
                    })
                    .catch((err) => {
                        setIsLoading(false);
                        dispatch(setLoading({ key: 'modules/fetchModulesByMock', value: false }));
                    });


                dispatch(setLoading({ key: 'modules/fetchMockTestById', value: true }));
                dispatch(fetchMockTestById({ moduleIds: selectedModules, totalLimit: limit }))
                    .unwrap()
                    .then((res) => {
                     

                        dispatch(setLoading({ key: 'modules/fetchMockTestById', value: false }));
                    })
                    .catch((err) => {
                        dispatch(setLoading({ key: 'modules/fetchMockTestById', value: false }));
                    });




            } 

         

        // }
    }, [selectedModules, limit, selectedOption, selectedPreClinicalOption]);
    console.log("selectedPreClinicalOption:", selectedPreClinicalOption);

    useEffect(() => {
        localStorage.removeItem('examTimer'); // Clear storage when timer ends
        // Check if recentSessions are available in localStorage
        const storedSessions = localStorage.getItem('recentSessions');
        if (storedSessions) {
            setLocalRecentSession(JSON.parse(storedSessions)); // Parse and set to state
        }
        dispatch(clearRecentSessions())
    }, []);

    useEffect(() => {
        if (recentSessions.length > 0) {
            // Dispatch to update the Redux store
            dispatch(updateRecentSessions(recentSessions));
        }
    }, [recentSessions]);
    // Effect to retrieve recent sessions from localStorage




    const sortedModules = isSortedByPresentation
        ? [
            ...filteredModules.filter(module => selectedModules.includes(module.categoryId)).sort((a, b) => a.categoryName.localeCompare(b.categoryName)), // Sort selected modules alphabetically
            ...filteredModules.filter(module => !selectedModules.includes(module.categoryId)).sort((a, b) => a.categoryName.localeCompare(b.categoryName)) // Sort unselected modules alphabetically
        ]
        : filteredModules;

    useEffect(() => {
        const fetchDailyWork = async () => {
            try {
                const { data, error } = await supabase
                    .from('resultsHistory')
                    .select('*')
                    .eq('userId', '123456543');

                if (error) throw error;
                // Process the data to calculate totals for each moduleId
                const totalsByModule = data.reduce((acc, curr) => {
                    const { moduleId, correct, incorrect, unanswered } = curr;

                    // Initialize the accumulator for the moduleId if it doesn't exist
                    if (!acc[moduleId]) {
                        acc[moduleId] = { totalCorrect: 0, totalIncorrect: 0, totalUnanswered: 0 };
                    }

                    // Sum up the values
                    acc[moduleId].totalCorrect += correct;
                    acc[moduleId].totalIncorrect += incorrect;
                    acc[moduleId].totalUnanswered += unanswered;

                    return acc;
                }, {});

                // Update state with the new totals
                setModuleTotals(totalsByModule);

            } catch (err) {
                console.error("Error fetching daily work:", err);
            }
        };
        // const module = selectedModules[0] || null
        // localStorage.setItem('module', JSON.stringify(module))
        fetchDailyWork();
    }, [selectedModules]);



    console.log("selectedModules:", selectedModules);
    
    console.log("selectedOption:", selectedOption);

    return (
        <div className={` lg:flex w-full  ${darkModeRedux ? 'dark' : ''}`}>
            <div className=" hidden lg:block fixed h-full">
                <Sidebar />
            </div>
 
            <div className="flex-grow lg:ml-[260px] xl:ml-[250px]  overflow-y-auto overflow-x-hidden dark:bg-[#1E1E2A]">


                <div className='flex items-center justify-between p-5 bg-white lg:hidden '>
                    <div className=''>
                        <img src="/assets/small-logo.png" alt="" />
                    </div>

                    <div className='' onClick={toggleDrawer}>
                        <TbBaselineDensityMedium />
                    </div>
                </div>

                {/* Table Header */}
                <div className="flex flex-col min-h-screen   sm:m-10 space-y-4 py-4 px-16 ">

                    <div className="flex flex-col space-y-10">
                        <div className=" h-[137px] p-4 ">
                            {/* Tab Section */}
                            <div className="flex items-center text-[#3F3F46] justify-between space-x-2 text-[12px] md:text-[16px] font-medium">
                                <button
                                    className={`w-[50%] px-4 py-2 ${selectedTab === 'Clinical' ? 'bg-white text-black' : 'bg-[#E4E4E7] text-gray-500'} rounded-[8px]`}
                                    onClick={() => handleTabChange('Clinical')}
                                >
                                    Clinical
                                </button>
                                <button
                                    className={`w-[50%] px-4 py-2 ${selectedTab === 'Pre-clinical' ? 'bg-white text-black' : 'bg-[#E4E4E7] text-gray-500'} rounded-[8px]`}
                                    onClick={() => handleTabChange('Pre-clinical')}
                                >
                                    Pre-clinical
                                </button>
                            </div>
                            {/* Search and Button Section */}
                            <div className="flex justify-between items-center rounded-[8px] h-[110px] bg-white dark:bg-[#1E1E2A] text-black dark:text-white dark:border-[1px] dark:border-[#3A3A48] ">
                                {/* Search Bar */}
                                <div className="flex items-center p-8 gap-x-10  ">


                                    <p className="text-[11px] sm:text-[16px] md:text-[18px] 2xl:text-[20px] font-semibold  text-[#52525B] whitespace-nowrap dark:text-white">Clinical</p>
                                    <div className="xl:flex items-center bg-white border border-gray-300 dark:border-[2px] dark:border-[#3A3A48] rounded-md px-3 py-2  hidden dark:bg-[#1E1E2A]">
                                        <div className="group">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-search text-gray-500 group-hover:text-teal-500 transition-colors duration-200"
                                            >
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.3-4.3" />
                                            </svg>
                                        </div>                                        
                                        <input
                                            type="text"
                                            placeholder="Search for modules"
                                            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                                            className="ml-2 w-[200px] 2xl:w-[280px] focus:outline-none dark:bg-[#1E1E2A] placeholder:text-[#D4D4D8] placeholder:text-[12px] "
                                        />

                                    </div>
                                </div>
                                <div className="space-y-3 xl:space-y-0 xl:space-x-5 p-8 flex flex-col xl:flex-row items-center">
                                    <div className="relative w-[105px]">
                                        {
                                            selectedTab === 'Clinical' ? <select
                                                className="w-full h-[40px] px-3 py-2 pr-1 border border-[#A1A1AA] rounded text-[14px] appearance-none dark:bg-[#1E1E2A]"
                                                value={selectedOption} // Bind the selected value to state
                                                onChange={handleSelectChange} // Trigger the handler on change
                                            >
                                                <option>SBA</option>
                                                <option>SAQ</option>
                                                <option>Mock</option>
                                          
                                            </select> :
                                                <select
                                                    className="w-full h-[40px] px-3 py-2 pr-1 border border-[#A1A1AA] rounded text-[14px] appearance-none dark:bg-[#1E1E2A]"
                                                    value={selectedPreClinicalOption} // Bind the selected value to state
                                                    onChange={preClinicalHandler} // Trigger the handler on change
                                                >
                                                 
                                                    <option>QuesGen</option>
                                                </select>
                                        }
                                      
                                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                            <svg
                                                className="w-4 h-4 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Dropdown */}


                                    {/* Continue Button */}
                                    <button
                                        onClick={handleContinue}
                                        disabled={selectedModules.length === 0 } // Disable the button if no modules are selected
                                        className={`bg-[#3CC8A1] ${selectedModules.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-transparent hover:text-[#3CC8A1]'} text-[12px] md:text-[14px] 2xl:text-[16px] text-white font-semibold rounded-md px-6 py-2 transition-all border-[1px] border-[#3CC8A1]`}>
                                        Continue &gt;
                                    </button>
                                </div>

                            </div>
                        </div>
                        {
                            selectedTab === "Pre-clinical" &&  <FileUpload />
                              
                        }

                        {
                         selectedTab ==="Clinical" && (<div className="bg-white flex rounded-[8px] items-center h-[212px]  p-5 m-4 dark:bg-[#1E1E2A] text-black dark:text-white dark:border-[1px] dark:border-[#3A3A48]">
                                <div className="w-[35%] flex items-center justify-between mr-10">
                                    <p className="font-bold text-[12px] sm:text-[16px] 2xl:text-[18px] text-[#3F3F46] text-center dark:text-white  w-full">
                                        Recent Sessions
                                    </p>
                                    <div className="h-[212px] w-[1px] bg-[#A1A1AA] dark:bg-[#3A3A48] " />
                                </div>


                                <div className="w-[65%] space-y-3">
                                    {localRecentSession.length > 0 ? (
                                        localRecentSession.map((sessionId, index) => {
                                            const categoryIds = sessionId.split(',').map(id => id.trim()); // Convert to array of strings

                                            // Find category names corresponding to the category IDs
                                            const categoryNames = categoryIds.map(id => {
                                                const category = data.data.find(item => item.categoryId === parseInt(id)); // Find the category by ID
                                                return category ? category.categoryName : null; // Return the category name or null if not found
                                            }).filter(name => name !== null); // Filter out any null values

                                            // Return the JSX for each session
                                            return (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[14px] 2xl:text-[16px] font-medium text-[#3F3F46] dark:text-white">
                                                            {categoryNames.join(', ')} {/* Join category names into a single string */}
                                                        </p>
                                                        <p className="text-[12px] 2xl:text-[14px] font-semibold text-[#D4D4D8]">Recent Session</p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => {
                                                                setSessionId(sessionId);
                                                                setIsSession(true);
                                                                handleContinue()
                                                            }
                                                            }
                                                            className="border-[1px] border-[#FF9741] 
                                                                text-[12px] md:text-[16px] 
                                                                p-2 font-semibold rounded-[4px] 
                                                                text-[#FF9741] 
                                                                hover:bg-gradient-to-r hover:from-[#FF9741] hover:to-[#FF5722] hover:text-white 
                                                                transition-all duration-200 ease-in-out 
                                                                dark:text-white 
                                                                dark:border-white 
                                                                dark:hover:bg-gradient-to-r dark:hover:from-[#1E1E2A] dark:hover:to-[#3E3E55] 
                                                                dark:hover:text-[#FF9741] 
                                                                dark:hover:shadow-lg dark:hover:shadow-[#FF9741]/60">
                                                            Continue &gt;
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <p>No Session</p>
                                        </div>
                                    )}

                                </div>
                            </div>)
                        }


                    </div>
{
                        isLoading? <Loader/>:

                            <div className=" bg-white rounded-[8px] px-10 py-8 ml-4 mr-4 text-[14px] md:text-[16px] dark:bg-[#1E1E2A] text-black dark:text-white dark:border-[1px] dark:border-[#3A3A48]">

                        <div className="flex flex-col lg:flex-row justify-between lg:items-center font-medium text-[#3F3F46]  pb-2 w-full">
                            <div className="flex items-center gap-x-10 dark:text-white">
                                <div className="text-left flex items-center text-[14px] 3xl:text-[16px]">
                                    <input
                                        type="checkbox"
                                        className="mr-2 custom-checkbox"
                                        checked={data?.data?.every((row) => selectedModules.includes(row.categoryId))} // Parent checkbox state
                                        onChange={(e) => handleSelectAll(e.target.checked)} // Parent checkbox change handler
                                    />
                                    Select All
                                </div>

                                <div className="flex items-center space-x-2 p-4">
                                    <span className="text-[#3F3F46] flex items-center font-medium dark:text-white text-[14px] 3xl:text-[16px]">Sort By Presentation</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer " onChange={handleToggle} />
                                        <div className="w-10 h-6 2xl:w-11 2xl:h-6 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3CC8A1]"></div>
                                    </label>
                                </div>
                            </div>


                            <div className="text-right flex items-center gap-x-5 dark:text-white text-[14px] 3xl:text-[16px]">
                                <div className="hidden sm:block text-center">Progress</div>

                                <div className="flex items-center gap-x-3">
                                    <div className="h-4 w-4 bg-[#3CC8A1]"></div>
                                    <p>Correct</p>

                                </div>
                                <div className="flex items-center gap-x-3">
                                    <div className="h-4 w-4 bg-[#FF453A]"></div>
                                    <p>Incorrect</p>

                                </div>
                                <div className="flex items-center gap-x-3">
                                    <div className="h-4 w-4 bg-[#E4E4E7]"></div>
                                    <p>Unanswered</p>

                                </div>


                            </div>


                        </div>
                        <div className="h-[1px] bg-[#A1A1AA] mb-5 mt-2 " />

                        <div>
                                    {
                                        selectedTab ==='Pre-clinical' &&
                                     (
                                        questionGenModule?.modules?.length > 0 ? (
                                            questionGenModule.modules
                                                .filter((row, index, arr) => (
                                                    // Keep only first occurrence of each module
                                                    arr.findIndex(r => r.module === row.module) === index
                                                )
                                                   
                                                
                                            )
                                                .map((row, id) => (
                                                    <div key={id} className="grid md:grid-cols-2 items-center py-3">
                                                        <div className="text-left text-[14px] 2xl:text-[16px] cursor-pointer font-medium text-[#3F3F46] dark:text-white">
                                                            <label className="flex items-center cursor-pointer hover:opacity-85">
                                                                <input
                                                                    type="checkbox"
                                                                    className="mr-2 custom-checkbox hover:opacity-70"
                                                                    checked={selectedModules.includes(row.module)}
                                                                    onChange={() => handleCheckboxChange(row.module)}
                                                                />
                                                                {row.module}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="text-center py-3 text-gray-500">
                                                No modules available.
                                            </div>
                                        )
                                    )
                                    
                                    }


{
                                        selectedTab === 'Clinical' &&   (  (type === 'SBA' ) && sortedModules?.map((row) => {
                                            const totals = moduleTotals[row.categoryId] || { totalCorrect: 0, totalIncorrect: 0, totalUnanswered: 0 };
                                            const totalQuestions = totals.totalCorrect + totals.totalIncorrect + totals.totalUnanswered;

                                            // Calculate widths based on total counts
                                            const correctWidth = totalQuestions > 0 ? (totals.totalCorrect / totalQuestions) * 100 : 0;
                                            const incorrectWidth = totalQuestions > 0 ? (totals.totalIncorrect / totalQuestions) * 100 : 0;
                                            const unansweredWidth = totalQuestions > 0 ? (totals.totalUnanswered / totalQuestions) * 100 : 0;

                                            return (
                                                <div key={row.categoryId} className="grid md:grid-cols-2 items-center py-3">
                                                    <div
                                                        className="text-left text-[14px] 2xl:text-[16px] cursor-pointer font-medium text-[#3F3F46] dark:text-white"
                                                    >
                                                        <label className="flex items-center cursor-pointer hover:opacity-85">
                                                            <input
                                                                type="checkbox"
                                                                className="mr-2 custom-checkbox hover:opacity-70"
                                                                checked={selectedModules.includes(row.categoryId)}
                                                                onChange={() => handleCheckboxChange(row.categoryId)}
                                                            />
                                                            {row.categoryName}
                                                        </label>
                                                    </div>


                                                    <div className="flex items-center justify-center space-x-1">
                                                        {/* Green */}
                                                        <div
                                                            className="h-[19px] sm:h-[27px] bg-[#3CC8A1] rounded-l-md"
                                                            style={{ width: `${correctWidth}%` }}
                                                        ></div>
                                                        {/* Red */}
                                                        <div
                                                            className="h-[19px] sm:h-[27px] bg-[#FF453A]"
                                                            style={{ width: `${incorrectWidth}%` }}
                                                        ></div>
                                                        {/* Gray */}
                                                        <div
                                                            className="h-[19px] sm:h-[27px] bg-[#E4E4E7] rounded-r-md"
                                                            style={{ width: `${unansweredWidth}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        }))
}
                                    {
                                        selectedTab === 'Clinical' &&  (  (type === 'SAQ') && saqModule?.map((row) => {
                                            // const totals = moduleTotals[row.categoryId] || { totalCorrect: 0, totalIncorrect: 0, totalUnanswered: 0 };
                                            // const totalQuestions = totals.totalCorrect + totals.totalIncorrect + totals.totalUnanswered;

                                            // // Calculate widths based on total counts
                                            // const correctWidth = totalQuestions > 0 ? (totals.totalCorrect / totalQuestions) * 100 : 0;
                                            // const incorrectWidth = totalQuestions > 0 ? (totals.totalIncorrect / totalQuestions) * 100 : 0;
                                            // const unansweredWidth = totalQuestions > 0 ? (totals.totalUnanswered / totalQuestions) * 100 : 0;

                                            return (
                                                <div key={row.categoryId} className="grid md:grid-cols-2 items-center py-3">
                                                    <div
                                                        className="text-left text-[14px] 2xl:text-[16px] cursor-pointer font-medium text-[#3F3F46] dark:text-white"
                                                    >
                                                        <label className="flex items-center cursor-pointer hover:opacity-85">
                                                            <input
                                                                type="checkbox"
                                                                className="mr-2 custom-checkbox hover:opacity-70"
                                                                checked={selectedModules.includes(row.categoryId)}
                                                                onChange={() => handleCheckboxChange(row.categoryId)}
                                                            />
                                                            {row.categoryName}
                                                        </label>
                                                    </div>


                                                    {/* <div className="flex items-center justify-center space-x-1">
                                                      
                                                        <div
                                                            className="h-[19px] sm:h-[27px] bg-[#3CC8A1] rounded-l-md"
                                                            style={{ width: `${correctWidth}%` }}
                                                        ></div>
                                                     
                                                        <div
                                                            className="h-[19px] sm:h-[27px] bg-[#FF453A]"
                                                            style={{ width: `${incorrectWidth}%` }}
                                                        ></div>
                                                    
                                                        <div
                                                            className="h-[19px] sm:h-[27px] bg-[#E4E4E7] rounded-r-md"
                                                            style={{ width: `${unansweredWidth}%` }}
                                                        ></div>
                                                    </div> */}
                                                </div>
                                            );
                                        }))
                                    }
                                    {
                                    (
                                            selectedTab === 'Clinical' &&   (type === 'Mock' ) && modules?.map((row) => {
                                            // const totals = moduleTotals[row.categoryId] || { totalCorrect: 0, totalIncorrect: 0, totalUnanswered: 0 };
                                            // const totalQuestions = totals.totalCorrect + totals.totalIncorrect + totals.totalUnanswered;

                                            // // Calculate widths based on total counts
                                            // const correctWidth = totalQuestions > 0 ? (totals.totalCorrect / totalQuestions) * 100 : 0;
                                            // const incorrectWidth = totalQuestions > 0 ? (totals.totalIncorrect / totalQuestions) * 100 : 0;
                                            // const unansweredWidth = totalQuestions > 0 ? (totals.totalUnanswered / totalQuestions) * 100 : 0;

                                            return (
                                                <div key={row.categoryId} className="grid md:grid-cols-2 items-center py-3">
                                                    <div
                                                        className="text-left text-[14px] 2xl:text-[16px] cursor-pointer font-medium text-[#3F3F46] dark:text-white"
                                                    >
                                                        <label className="flex items-center cursor-pointer hover:opacity-85">
                                                            <input
                                                                type="checkbox"
                                                                className="mr-2 custom-checkbox hover:opacity-70"
                                                                checked={selectedModules.includes(row.categoryId)}
                                                                onChange={() => handleCheckboxChange(row.categoryId)}
                                                            />
                                                            {row.categoryName}
                                                        </label>
                                                    </div>


                                                    {/* <div className="flex items-center justify-center space-x-1">
                                                       
                                                        <div
                                                            className="h-[19px] sm:h-[27px] bg-[#3CC8A1] rounded-l-md"
                                                            style={{ width: `${correctWidth}%` }}
                                                        ></div>
                                                      
                                                        <div
                                                            className="h-[19px] sm:h-[27px] bg-[#FF453A]"
                                                            style={{ width: `${incorrectWidth}%` }}
                                                        ></div>
                                                        
                                                        <div
                                                            className="h-[19px] sm:h-[27px] bg-[#E4E4E7] rounded-r-md"
                                                            style={{ width: `${unansweredWidth}%` }}
                                                        ></div>
                                                    </div> */}
                                                </div>
                                            );
                                        }))
                                    }
                              
                        </div>

                    </div>
                    }
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

                <div className="mb-10 flex items-center justify-center">
                    <Logo />
                </div>
                <div className='flex min-h-screen overflow-y-auto  flex-col  justify-between'>


                    <nav className="space-y-5 w-full  text-[#3F3F46]">
                        {[
                            { name: "Dashboard", icon: "house" },
                            { name: "Practice", icon: "dumbbell" },
                            { name: "Performance", icon: "chart-line" },
                           
                            { name: "OSCE", icon: "bed" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 px-6 group cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`lucide lucide-${item.icon} group-hover:text-[#3CC8A1]`}
                                >
                                    {/* Define paths for the icons */}
                                    {item.icon === "house" && (
                                        <>
                                            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        </>
                                    )}
                                    {item.icon === "dumbbell" && (
                                        <>
                                            <path d="M14.4 14.4 9.6 9.6" />
                                            <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
                                            <path d="m21.5 21.5-1.4-1.4" />
                                            <path d="M3.9 3.9 2.5 2.5" />
                                            <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
                                        </>
                                    )}
                                    {item.icon === "chart-line" && (
                                        <>
                                            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                                            <path d="m19 9-5 5-4-4-3 3" />
                                        </>
                                    )}
                                    {item.icon === "git-merge" && (
                                        <>
                                            <circle cx="18" cy="18" r="3" />
                                            <circle cx="6" cy="6" r="3" />
                                            <path d="M6 21V9a9 9 0 0 0 9 9" />
                                        </>
                                    )}
                                    {item.icon === "book-open" && (
                                        <>
                                            <path d="M12 7v14" />
                                            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                                        </>
                                    )}
                                    {item.icon === "bed" && (
                                        <>
                                            <path d="M2 4v16" />
                                            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                                            <path d="M2 17h20" />
                                            <path d="M6 8v9" />
                                        </>
                                    )}
                                </svg>
                                <span className="text-[14px] font-medium group-hover:text-[#3CC8A1]">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Settings */}
                    <div className="mt-auto w-full mb-40 px-6">
                        <Link to={'/setting'}>
                            <div className="flex items-center space-x-3 text-[#3F3F46] group cursor-pointer">
                                <i className="fa fa-cog text-xl group-hover:text-[#3CC8A1]"></i>
                                <span className="text-[14px] font-medium group-hover:text-[#3CC8A1]">
                                    Settings
                                </span>
                            </div>
                        </Link>

                    </div>

                </div>

            </Drawer>

            {isOpenSetUpSessionModal && <SetupSessionModal isOpenSetUpSessionModal={isOpenSetUpSessionModal} setIsOpenSetUpSessionModal={setIsOpenSetUpSessionModal} />}

        </div>
    );
};

export default Questioning;


