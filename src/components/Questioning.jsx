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
import { setRemoveQuestionLimit } from "../redux/features/limit/limit.slice";
import Loader from "./common/Loader";
import { resetQuestionReviewValue } from "../redux/features/question-review/question-review.slice";
import { fetchShortQuestionByModules, fetchSqaChild } from "../redux/features/SAQ/saq.service";

import { setPreclinicalType } from "../redux/features/mode/mode.slice";
import { updateRecentSessions } from "../redux/features/recent-session/recent-session.slice";


const Questioning = () => {
    const [isOpenSetUpSessionModal, setIsOpenSetUpSessionModal] = useState(false);
    const isLoading = useSelector(
        (state) => state?.loading?.[fetchModules.typePrefix]
    );
    
    const [selectedModules, setSelectedModules] = useState([]);
    const [checkedItems, setCheckedItems] = useState({}); // State for checkboxes
    const [moduleId, setModuleId] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.categoryModule);
    const { limit } = useSelector((state) => state.limit);
    const [selectedOption, setSelectedOption] = useState('SBA');
    const [recentSessions, setRecentSessions] = useState([]);
    const session = useSelector(state => state?.recentSession?.recentSessions || [])
    const   isCompleted  = useSelector((state) => state.recentSession?.isSessionCompleted); // Access Redux state

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
                .map((module) => module.categoryName);

            // Combine module names into a single string
            const combinedSession = selectedModuleNames.join(', ');

            // Update recent sessions: keep only the last entry if a new combination is made
            return combinedSession ? [combinedSession] : [];
        });
    };



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
        setIsOpenSetUpSessionModal((prev) => ({
            ...prev

        }));
    }


    useEffect(() => {
        dispatch(setLoading({ key: 'modules/fetchModules', value: true }));
        dispatch(fetchModules())
            .unwrap()
            .then(() => {
                dispatch(setLoading({ key: 'modules/fetchModules', value: false }));
            }).catch(err => {
                dispatch(setLoading({ key: 'modules/fetchModules', value: false }));
            })

        sessionStorage.removeItem('persist:result');
        // Dispatch Redux action to clear 'result' from Redux store
        dispatch(clearResult());
        dispatch(setRemoveQuestionLimit())
        dispatch(resetQuestionReviewValue());
    }, []);

    useEffect(() => {
        dispatch(setPreclinicalType({ selectedOption}));
        
        if (selectedModules.length > 0) {
            if (selectedOption==='SBA'){
                dispatch(setLoading({ key: 'modules/fetchMcqsByModule', value: true }));
                dispatch(fetchMcqsByModules({ moduleIds: selectedModules, totalLimit: limit }))
                    .unwrap()
                    .then(() => {
                        dispatch(setLoading({ key: 'modules/fetchMcqsByModule', value: false }));
                    })
                    .catch((err) => {
                        dispatch(setLoading({ key: 'modules/fetchMcqsByModule', value: false }));
                    });
            }
            else if (selectedOption === 'SQA'){
                dispatch(setLoading({ key: 'modules/fetchShortQuestionByModules', value: true }));
                dispatch(fetchShortQuestionByModules({ moduleIds: selectedModules, totalLimit: 2 }))
                    .unwrap()
                    .then((res) => {
                        dispatch(setLoading({ key: 'modules/fetchShortQuestionByModules', value: false }));
                        console.log("SQA Parent Response:",res);
                        // if (res.id !== null && res.id !== undefined){
                            dispatch(fetchSqaChild({ parentIds: res[0].id, limit: 10}))
                            .unwrap()
                            .then(res=>{
                                console.log("SQA Child Response", res);
                                
                            })
                            .catch()

                        // }
                        
                    })
                    .catch((err) => {
                        dispatch(setLoading({ key: 'modules/fetchShortQuestionByModules', value: false }));
                    });
            }

        }
    }, [selectedModules, limit]);

    console.log("selectedModules:", selectedModules);

    useEffect(()=>{
        dispatch(updateRecentSessions(recentSessions));
    },[recentSessions])
    console.log('session:', session);
    console.log("isSessionCompleted:", isCompleted);

    

    return (
        <div className=" lg:flex w-full">
            <div className="h-full hidden lg:block">
                <Sidebar />
            </div>

            <div className='flex items-center justify-between p-5 bg-white lg:hidden w-full'>
                <div className=''>
                    <img src="/assets/small-logo.png" alt="" />
                </div>

                <div className='' onClick={toggleDrawer}>
                    <TbBaselineDensityMedium />
                </div>
            </div>

            {/* Table Header */}
            <div className="flex flex-col lg:w-full  sm:m-10 space-y-10">

                <div className=" h-[137px] p-4 ">
                    {/* Tab Section */}
                    <div className="flex items-center justify-between space-x-2 text-[12px] md:text-[14px]">
                        <button className="px-4 py-2 text-gray-800 bg-white w-[50%] sm:w-[33%] font-semibold  rounded-[8px]">
                            Pre-clinical
                        </button>
                        <button className="px-4 py-2 text-gray-500 bg-[#E4E4E7] hover:text-gray-800 w-[50%] sm:w-[33%]  rounded-[8px]">
                            Clinical
                        </button>
                        <button className="px-4 py-2 flex items-center justify-center  text-gray-500 hover:text-gray-800 w-[50%] sm:w-[33%] bg-[#E4E4E7]  rounded-[8px]">
                            Data <span className="md:block hidden ml-2 ">Interpretation</span>
                        </button>

                    </div>

                    {/* Search and Button Section */}
                    <div className="flex justify-between items-center rounded-[8px] h-[110px] bg-white">
                        {/* Search Bar */}
                        <div className="flex items-center p-8 gap-x-10  ">


                            <p className="text-[11px] sm:text-[16px] md:text-[20px] font-semibold  text-[#52525B] whitespace-nowrap">Pre clinical</p>
                            <div className="xl:flex items-center bg-white border border-gray-300 rounded-md px-3 py-2  hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                <input
                                    type="text"
                                    placeholder="Search for anything"
                                    className="ml-2 w-[280px] focus:outline-none "
                                />
                            </div>                    </div>
                        <div className="space-y-3 xl:space-y-0 xl:space-x-5 p-8 flex flex-col xl:flex-row items-center">
                            <div className="relative w-[105px]">
                                <select
                                    className="w-full h-[37px] px-3 py-2 pr-8 border border-[#A1A1AA] rounded text-[14px] appearance-none"
                                    value={selectedOption} // Bind the selected value to state
                                    onChange={handleSelectChange} // Trigger the handler on change
                                >
                                    <option>SBA</option>
                                    <option>SQA</option>
                                    <option>Mock</option>
                                    <option>QuesGen</option>
                                </select>
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
                                className="bg-[#3CC8A1] text-[12px] md:text-[14px] text-white font-semibold rounded-md px-6 py-2 hover:bg-transparent hover:text-[#3CC8A1] transition-all border-[1px] border-[#3CC8A1]">
                                Continue &gt;
                            </button>
                        </div>

                    </div>
                </div>
                <div className="bg-white flex rounded-[8px] items-center h-[212px]  p-5 m-4 ">
                    <div className="w-[35%] flex items-center justify-between mr-10">
                        <p className="font-bold text-[12px] sm:text-[16px] md:text-[18px] text-[#3F3F46] text-center  w-full">
                            Recent Sessions
                        </p>
                        <div className="h-[212px] w-[1px] bg-[#A1A1AA] " />
                    </div>


                    <div className="w-[65%] space-y-3">
                        {isCompleted && session.length > 0 ? (
                            session.map((sessionId, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[14px] md:text-[16px] font-medium text-[#3F3F46]">{sessionId}</p>
                                        <p className="text-[12px] md:text-[14px] font-semibold text-[#D4D4D8]">Recent Session</p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={handleContinue} 
                                         className="border-[1px] border-[#FF9741] hover:bg-[#FF9741] transition-all duration-150 hover:text-white text-[12px] md:text-[14px] p-2 text-[#FF9741] font-semibold rounded-[4px]">
                                            Continue &gt;
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center">
                                <p>No Session</p>
                            </div>
                        )}

                    </div>
                </div>
                <div className=" bg-white rounded-[8px] px-10 py-8 ml-4 mr-4 text-[14px] md:text-[16px] ">
                    <div className="flex flex-col md:flex-row justify-between md:items-center font-medium text-gray-700  pb-2 w-full">
                        <div className="text-left ">
                            <input
                                type="checkbox"
                                className="mr-2 custom-checkbox"
                                checked={data?.data?.every((row) => selectedModules.includes(row.categoryId))} // Parent checkbox state
                                onChange={(e) => handleSelectAll(e.target.checked)} // Parent checkbox change handler
                            />
                            Topics
                        </div>
                        <div className="text-right flex items-center gap-x-5">
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
                        {isLoading ? (
                            <Loader />
                        ) : (
                            data?.data?.map((row) => (
                                <div key={row.categoryId} className="grid md:grid-cols-2 items-center py-3">
                                    <div
                                        className="text-left text-[14px] md:text-[16px] cursor-pointer"
                                        onClick={() => handleCheckboxChange(row.categoryId)}
                                    >
                                        <input
                                            type="checkbox"
                                            className="mr-2 custom-checkbox"
                                            checked={selectedModules.includes(row.categoryId)}
                                            onChange={() => handleCheckboxChange(row.categoryId)}
                                        />

                                        {row.categoryName}
                                    </div>

                                    <div className="flex items-center justify-center space-x-1">
                                        <div
                                            className="h-[19px] sm:h-[27px] bg-[#3CC8A1] rounded-l-md"
                                            style={{ width: `50%` }}
                                        ></div>
                                        <div
                                            className="h-[19px] sm:h-[27px] bg-[#FF453A]"
                                            style={{ width: `30%` }}
                                        ></div>
                                        <div
                                            className="h-[19px] sm:h-[27px] bg-[#E4E4E7] rounded-r-md"
                                            style={{ width: `20%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
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

                <div className="mb-10 flex items-center justify-center">
                    <Logo />
                </div>
                <div className='flex min-h-screen overflow-y-auto  flex-col  justify-between'>


                    <nav className="space-y-5 w-full  text-[#3F3F46]">
                        {[
                            { name: "Dashboard", icon: "house" },
                            { name: "Practice", icon: "dumbbell" },
                            { name: "Performance", icon: "chart-line" },
                            { name: "Friends", icon: "git-merge" },
                            { name: "Textbook", icon: "book-open" },
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
