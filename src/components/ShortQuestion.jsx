import React, { useRef, useState, useEffect } from "react";
import Logo from "./common/Logo";
import DiscussionBoard from "./Discussion";
import DeepChatAI from "./DeepChat";
import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import { Link, useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { TbBaselineDensityMedium } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setResult } from "../redux/features/result/result.slice";
import { setMcqsAccuracy } from "../redux/features/accuracy/accuracy.slice";
import { fetchConditionNameById } from "../redux/features/SBA/sba.service";
import DashboardModal from "./common/DashboardModal";



// Function to format the time in MM:SS format
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Function to calculate total time based on number of questions
const calculateTimeForQuestions = (numQuestions) => {
    const timePerQuestionInSeconds = 60; // 1 minute per question
    const totalTimeInSeconds = numQuestions * timePerQuestionInSeconds; // Calculate total time
    return totalTimeInSeconds; // Return total time in seconds
};
const ShortQuestion = () => {
    const sqa = useSelector(state => state?.sqa || [])
    const [isFinishEnabled, setIsFinishEnabled] = useState(false);
    const darkModeRedux=useSelector(state=>state.darkMode.isDarkMode)

    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isAccordionVisible, setIsAccordionVisible] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState([]);
    const [totalScore, setTotalScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("")
    const [attempts, setAttempts] = useState(Array(sqa?.sqaChildData.length).fill(null)); // Initialize with null    const [isFinishEnabled, setIsFinishEnabled] = useState(false);

    const navigation = useNavigate();
    const mcqsAccuracy = useSelector(state => state.accuracy.accuracy);
    const data = useSelector((state) => state.mcqsQuestion || []);
    const result = useSelector((state) => state.result);
    const [currentPage, setCurrentPage] = useState(0); // Track current page (each page has 20 items)
    const [isReviewEnabled, setIsReviewEnabled] = useState(false)
    const itemsPerPage = 20;
    // Get the items to show for the current page
    const currentItems = data.data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const [selectedFilter, setSelectedFilter] = useState('All'); // Default is 'All'
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State to toggle submenu visibility
    const isTimerMode = useSelector((state) => state.mode);
    const [timer, setTimer] = useState(calculateTimeForQuestions(isTimerMode.time));
    const review = useSelector(state => state.questionReview.value)
    const [accuracy, setAccuracy] = useState(mcqsAccuracy); // Calculated accuracy    
    const menuRef = useRef(null);
    const [testCheckAnswer, setTestCheckAnswer] = useState(false)
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [partialCount, setPartialCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    const [showPopup, setShowPopup] = useState(false);


    function handleCheckAnswer() {
        setTestCheckAnswer(true)
    }

    function handleShowPopup() {
        setShowPopup(true); // Close the popup
    }


    const handleBackToDashboard = () => {
        navigation('/dashboard');
    };

    const handleIncorrectClick = () => {
        markQuestion(currentIndex, false); // Mark as incorrect
        setCurrentIndex((prev) => prev + 1); // Move to the next question
        setTestCheckAnswer(false); // Reset testCheckAnswer
    };

    const handlePartialClick = () => {
        markQuestion(currentIndex, 'partial'); // Mark as partial
        setCurrentIndex((prev) => prev + 1); // Move to the next question
        setTestCheckAnswer(false); // Reset testCheckAnswer
    };

    const handleCorrectClick = () => {
        markQuestion(currentIndex, true); // Mark as correct
        setCurrentIndex((prev) => prev + 1); // Move to the next question
        setTestCheckAnswer(false);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        nextQuestion()

    };

    // Arrays to store indices
    const unseenIndices = [];
    const flaggedIndices = [];
    const allIndices = [];

    // Filter items based on the selected filter
    const filteredItems = sqa?.sqaChildData.filter((question, index) => {
        const displayNumber = currentPage * itemsPerPage + index;

        // All items
        allIndices.push(displayNumber);

        if (selectedFilter === 'All') {
            return true; // Include all items
        }

        if (selectedFilter === 'Flagged') {
            // Check if item is flagged
            const isFlagged = attempts[displayNumber] === true || attempts[displayNumber] === false;
            if (isFlagged) {
                flaggedIndices.push(displayNumber); // Store index for flagged items
                return true;
            }
        }

        if (selectedFilter === 'Unseen') {
            // Check if item is unseen
            const isUnseen = attempts[displayNumber] === null;
            if (isUnseen) {
                unseenIndices.push(displayNumber); // Store index for unseen items
                return true;
            }
        }

        return false; // Hide items that don't match the filter
    });




    // Function to navigate to the next question
    const nextQuestion = () => {
        if (currentIndex < sqa?.sqaChildData.length - 1) {
            setCurrentIndex((prev) => prev + 1);

        }

    };


    // Function to navigate to the previous question
    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }

    };


    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }


    const toggleMenu = (event) => {
        event.stopPropagation();
        setIsSubMenuOpen(!isSubMenuOpen); // Toggle the menu visibility
    };



    const indicesToDisplay =
        selectedFilter === 'All' ? allIndices
            : selectedFilter === 'Flagged' ? flaggedIndices
                : selectedFilter === 'Unseen' ? unseenIndices
                    : []; // Default to an empty array if no filter is selected


    const handleClickOutside = (event) => {

        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsSubMenuOpen(false); // Close the menu if the click is outside
        }
    };


    const nextPage = () => {
        if ((currentPage + 1) * itemsPerPage < sqa?.sqaChildData.length) {
            setCurrentPage(currentPage + 1);
        }

    }

    // Function to go to the previous page
    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const markQuestion = (index, status) => {
        setAttempts((prev) => {
            const updatedAttempts = [...prev];
            updatedAttempts[index] = status; // Update specific question status
            return updatedAttempts;
        });

        // Update scores based on the status
        if (status === true) {
            setCorrectCount(prev => prev + 1);
            setTotalScore(prev => prev + 2); // Increment score by 2 for correct answers
        } else if (status === false) {
            setIncorrectCount(prev => prev + 1);
            // No score increment for incorrect answers
        } else if (status === 'partial') {
            setPartialCount(prev => prev + 1);
            setTotalScore(prev => prev + 1); // Increment score by 1 for partial answers
        }

        // Increment total attempts
        setTotalAttempts(prev => prev + 1);
    };


    const handleFinishAndReview = () => {
        if (isReviewEnabled) {
            dispatch(setMcqsAccuracy({ accuracy }))

            // handleAnswerSelect()
            //    Add a delay (for example, 2 seconds)
            setTimeout(() => {
                navigation('/score');
            }, 3000); // 2000 ms = 2 seconds
        }

    };

    // Attach the click event listener to the document when the menu is open
    useEffect(() => {
        if (isSubMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSubMenuOpen]);


    useEffect(() => {
        const maxScore = totalAttempts * 2; // Maximum score if all answers are correct
        if (maxScore === 0) {
            setAccuracy(0); // Avoid division by zero
        } else {
            setAccuracy(((totalScore / maxScore) * 100).toFixed(2)); // Calculate accuracy
        }
    }, [totalScore, totalAttempts]);

    // Check if it's time to enable the Finish button
    useEffect(() => {
        if (sqa?.sqaChildData.length === currentIndex + 1) {
            setIsReviewEnabled(true); // Enable the Finish button when the condition is met 
        }
    }, [currentIndex, sqa?.sqaChildData.length]); // Re-run whenever currentIndex changes



    return (
        <div className={`min-h-screen  ${darkModeRedux ? 'dark' : ''} `}>

            <div className='flex items-center justify-between p-5 bg-white lg:hidden w-full '>
                <div className=''>
                    <img src="/assets/small-logo.png" alt="" />
                </div>

                <div className='' onClick={toggleDrawer}>
                    <TbBaselineDensityMedium />
                </div>
            </div>
            <div className="  h-screen flex items-center justify-center   dark:bg-black  ">


                <div className="w-[100%] h-screen lg:w-[92%] xl:w-[65%] 2xl:w-[41.5%]  ">

                    {/* Header Section */}
                    <div className="bg-[#3CC8A1] w-[90%] sm:w-[95%] text-white p-6 mt-5 lg:w-[720px] ml-6   rounded-md flex items-center justify-between relative">
                        <div className="absolute left-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-ellipsis"
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                            </svg>
                        </div>

                        <div className="flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2">
                            <button className="text-white" onClick={prevQuestion}>
                                &larr;
                            </button>
                            <h2 className="font-semibold text-center">
                                Question {currentIndex + 1} of {sqa?.sqaChildData.length}
                            </h2>
                            <button className="text-white" onClick={nextQuestion}>
                                &rarr;
                            </button>
                        </div>

                        <div className="absolute right-4 flex space-x-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-flask-conical"
                            >
                                <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
                                <path d="M6.453 15h11.094" />
                                <path d="M8.5 2h7" />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-flag"
                            >
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                <line x1="4" x2="4" y1="22" y2="15" />
                            </svg>
                        </div>
                    </div>

                    {/* Question Section */}
                    <div className="mt-6  p-6 ">
                        <p className="text-[#000000] text-justify w-[100%] lg:w-[720px] dark:text-white">
                            {sqa?.shortQuestions[0].parentQuestion}
                        </p>

                        <h3 className="mt-4 text-[14px] text-[#27272A] font-bold text-wrap dark:text-white">
                            {sqa?.sqaChildData[currentIndex]?.questionLead}
                        </h3>

                        {/* Options Section */}
                        <div>


                        </div>
                        {
                            !testCheckAnswer ? <textarea
                                className="rounded-[6px]  lg:w-[720px] h-[180px] mt-2  p-5 text-wrap border border-[#ffff] placeholder:text-[#D4D4D8] placeholder:text-[14px] placeholder:font-normal "
                                placeholder="Type here to answer the question..."
                                onChange={(e) => {
                                    setUserAnswer(e.target.value)
                                }}
                                value={userAnswer}

                            /> :
                                <div>
                                    <textarea
                                        className="rounded-[6px] bg-[#E4E4E7] w-[100%] lg:w-[720px] h-[120px] mt-2  p-5 text-wrap"
                                        placeholder="This is the user’s answer"
                                        value={userAnswer}
                                        readOnly
                                    />
                                    <textarea
                                        className="rounded-[6px]  lg:w-[720px] h-[180px] mt-2  p-5 text-wrap border border-[#3CC8A1] placeholder:text-[#3F3F46] placeholder:font-semibold"
                                        placeholder="This is the user’s answer"
                                        value={sqa.sqaChildData[1].idealAnswer}
                                    />
                                </div>
                        }
                        <div>


                        </div>
                        {
                            testCheckAnswer ?
                                <div className="sm:space-x-5 flex-wrap md:space-x-10 lg:space-x-3  flex items-center  ">
                                    <div className="sm:space-x-5 flex-wrap md:space-x-10 lg:space-x-3 flex items-center">
                                        <button className="bg-[#EF4444] w-[230px] text-[#FFFF] p-2 rounded-[8px]" onClick={handleIncorrectClick}>
                                            Incorrect <span className="bg-[#F4F4F5] p-1.5 rounded-[4px] font-medium text-[#27272A] ml-2">{incorrectCount}</span>
                                        </button>
                                        <button className="bg-[#FF9741] w-[230px] text-[#FFFF] p-2 rounded-[8px]" onClick={handlePartialClick}>
                                            Partial <span className="bg-[#F4F4F5] p-1 rounded-[4px] font-medium text-[#27272A] ml-2">{partialCount}</span>
                                        </button>
                                        <button className="bg-[#3CC8A1] w-[230px] text-[#FFFF] p-2 rounded-[8px]" onClick={handleCorrectClick}>
                                            Correct <span className="bg-[#F4F4F5] p-1 rounded-[4px] font-medium text-[#27272A] ml-2">{correctCount}</span>
                                        </button>
                                    </div>

                                </div> :
                                <div className="group">
                                    <button
                                        className="mt-2 text-[14px] w-[100%] flex items-center justify-center gap-x-3 lg:text-[16px] bg-[#3CC8A1] text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#3CC8A1] border border-[#3CC8A1]"
                                        onClick={handleCheckAnswer}
                                    >
                                        Check Answer
                                        <span className="bg-white rounded-[4px] px-[2px] group-hover:bg-[#3CC8A1] transition-all duration-300 ease-in-out">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-space text-black group-hover:text-white transition-all duration-300 ease-in-out"
                                            >
                                                <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>



                        }

                        {isReviewEnabled && (
                            <div
                                className={`flex items-center font-semibold gap-x-2 ${isFinishEnabled ? "text-[#3CC8A1] cursor-pointer" : "text-[#D4D4D8] cursor-not-allowed"
                                    } justify-center`}
                                onClick={handleFinishAndReview}

                            >

                                <button
                                    className="mt-6 text-[14px] lg:text-[16px] w-full bg-[#60B0FA] text-white px-6 py-2 rounded-md font-semibold hover:bg-transparent hover:text-[#60B0FA] border border-[#60B0FA]"

                                >
                                    Finish and Review &darr;
                                </button>
                            </div>
                        )}


                        <div className="flex items-center gap-x-10 justify-center mt-5">
                            <div >
                                <p className="text-[16px] text-[#000000] font-medium  dark:text-white">How did you find this question?</p>
                            </div>
                            <div className="flex items-center gap-x-3" >
                                <button className="flex items-center text-gray-500  rounded-[4px] bg-[#E4E4E7]  py-3 px-8 hover:text-gray-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-thumbs-up"
                                    >
                                        <path d="M7 10v12" />
                                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                                    </svg>
                                </button>
                                <button className="flex items-center text-gray-500 rounded-[4px] bg-[#E4E4E7] py-3 px-8 hover:text-gray-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-thumbs-down"
                                    >
                                        <path d="M17 14V2" />
                                        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>


                        <div>

                        </div>


                    </div>
                </div>

                {/* Sidebar Section */}

                <div className={`hidden lg:block fixed right-0 top-0 dark:border  `}>


                    <div className={`absolute right-0 top-0 bg-white w-[28%] md:w-[25%] lg:w-[240px]   h-screen dark:bg-black text-black   ${!toggleSidebar ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}>
                        <div className="flex items-center justify-between mt-5">
                            <div className="flex items-center">
                            </div>

                            <div className="absolute left-1/2 transform -translate-x-1/2">
                                <Logo />
                            </div>

                            <div className="flex items-center mr-5 cursor-pointer" onClick={() => {
                                setToggleSidebar(!toggleSidebar)
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevrons-left dark:text-white"><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></svg>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center mt-10">
                            {
                                isTimerMode["mode"] === "Endless" &&
                                <div className={`w-[90%] h-[96px] rounded-[8px] bg-[#3CC8A1] ${mcqsAccuracy > 34 ? "bg-[#3CC8A1]" : "bg-[#FF453A]"}  text-[#ffff] text-center`}>
                                    <div>  <p className="text-[12px] mt-3">Accuracy</p>
                                        <p className="font-black text-[36px]">{mcqsAccuracy}%</p>
                                    </div>



                                </div>}

                            {
                                isTimerMode["mode"] === "Exam" && (
                                    <div
                                        className={`w-[90%] h-[96px] rounded-[8px] ${timer <= 60 ? "bg-[#FF453A]" : "bg-[#3CC8A1]"
                                            } text-[#ffff] text-center`}
                                    >
                                        <div>
                                            <p className="text-[12px] mt-3">Time:</p>

                                            {
                                                review === true ? <p className="font-black text-[36px]">{'00:00'}</p> : <p className="font-black text-[36px]">{formatTime(timer)}</p>
                                            }
                                        </div>
                                    </div>
                                )
                            }



                        </div>

                        <div className="">
                            <div className="flex items-center justify-between p-5 w-full text-[12px] dark:text-white ">
                                <span
                                    className={`w-[30%] text-center cursor-pointer ${selectedFilter === 'All' ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]' : 'hover:text-[#3CC8A1]'
                                        }`}
                                    onClick={() => handleFilterChange('All')}
                                >
                                    All
                                </span>
                                <span
                                    className={`w-[36%] text-center cursor-pointer ${selectedFilter === 'Flagged' ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]' : 'hover:text-[#3CC8A1]'
                                        }`}
                                    onClick={() => handleFilterChange('Flagged')}
                                >
                                    Flagged
                                </span>
                                <span
                                    className={`w-[30%] text-center cursor-pointer ${selectedFilter === 'Unseen' ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]' : 'hover:text-[#3CC8A1]'
                                        }`}
                                    onClick={() => handleFilterChange('Unseen')}
                                >
                                    Unseen
                                </span>
                            </div>

                        </div>

                        <div className="flex justify-center items-center">
                            <div className="grid grid-cols-5 gap-2">
                                {
                                    indicesToDisplay.map((num, i) => {
                                        const bgColor =
                                            result.result[num] === true
                                                ? "bg-[#3CC8A1]" // Correct
                                                : result.result[num] === false
                                                    ? "bg-[#FF453A]" // Incorrect (Flagged)
                                                    : "bg-gray-300"; // Unseen (null)

                                        return (
                                            <div key={i}>
                                                <div
                                                    className={`${bgColor} flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px] dark:bg-black   dark:border`}
                                                    onClick={() => markQuestion(num)} // Use `num` for marking
                                                >
                                                    <p>{num + 1}</p>
                                                </div>
                                            </div>
                                        );
                                    })

                                }
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-x-28 mt-3 text-[#71717A]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-left cursor-pointer" onClick={prevPage} ><path d="M6 8L2 12L6 16" /><path d="M2 12H22" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-right cursor-pointer" onClick={nextPage} ><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg>
                        </div>
                        <div className="py-5 px-10 text-[#D4D4D8]">
                            <hr />
                        </div>

                        <div>
                            <DeepChatAI W='200px' />
                            <hr className='mx-5' />
                        </div>

                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[12px]">

                            <div
                                className={`flex items-center font-semibold gap-x-2 ${isFinishEnabled ? "text-[#3CC8A1] cursor-pointer" : "text-[#D4D4D8] cursor-not-allowed"
                                    } justify-center`}
                                onClick={handleFinishAndReview}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-check"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                                <p>Finish and Review</p>
                            </div>
                            <hr className="w-[200px] my-2" />

                            <div className="flex items-center cursor-pointer gap-x-2 text-[#FF453A] font-semibold justify-center whitespace-nowrap"
                                onClick={handleShowPopup}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-chevron-left"
                                >
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                <p>Back to Dashboard</p>
                            </div>
                        </div>


                    </div>
                    <div className={`absolute right-0 top-0 bg-white w-[28%] md:w-[25%] lg:w-[50px]   h-screen ${!toggleSidebar && "translate-x-full"} transition-transform duration-300  dark:bg-black text-black  `}>

                        <div className="flex items-center  cursor-pointer dark:bg-black" onClick={() => {
                            setToggleSidebar(!toggleSidebar)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-right mt-5 ml-3 dark:text-white"><path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" /></svg>                        </div>

                    </div>
                </div>

            </div>


            {
                isAccordionVisible && <div className="flex items-center gap-x-96 justify-center  w-[100%] md:w-[70%] xl:w-[55%] 2xl:w-[90%] ">
                    <p className="font-medium text-[16px] text-[#3F3F46]">How did you find this question?</p>
                    <button className="text-[14px] text-[#71717A] p-3 bg-gray-200">Report</button>
                </div>
            }
            {

                isAccordionVisible && <DiscussionBoard />
            }

            {showPopup && (
                <DashboardModal handleBackToDashboard={handleBackToDashboard} setShowPopup={setShowPopup} />
            )}



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

                <div className=" bg-white    h-screen ">
                    <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center">
                        </div>

                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <Logo />
                        </div>

                       
                    </div>

                    <div className="flex flex-col  items-center justify-center mt-10">

                        <div className="w-[90%] 2xl:w-[308px] h-[96px] rounded-[8px] bg-[#3CC8A1] text-[#ffff] text-center">

                            {
                                isTimerMode === "Endless" ? <div>  <p className="text-[12px] mt-3">Accuracy</p>
                                    <p className="font-black text-[36px]">{accuracy}%</p></div> : <div><p className="text-[12px] mt-3">Time:</p>

                                    <p className="font-black text-[36px]">{<p>{formatTime(timer)}</p>}</p></div>
                            }
                        </div>
                    </div>

                    <div className="">
                        <div className="flex items-center justify-between p-5 w-full text-[12px]">
                            <span
                                className={`w-[30%] text-center cursor-pointer ${selectedFilter === 'All' ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]' : 'hover:text-[#3CC8A1]'
                                    }`}
                                onClick={() => handleFilterChange('All')}
                            >
                                All
                            </span>
                            <span
                                className={`w-[36%] text-center cursor-pointer ${selectedFilter === 'Flagged' ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]' : 'hover:text-[#3CC8A1]'
                                    }`}
                                onClick={() => handleFilterChange('Flagged')}
                            >
                                Flagged
                            </span>
                            <span
                                className={`w-[30%] text-center cursor-pointer ${selectedFilter === 'Unseen' ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]' : 'hover:text-[#3CC8A1]'
                                    }`}
                                onClick={() => handleFilterChange('Unseen')}
                            >
                                Unseen
                            </span>
                        </div>

                    </div>

                    <div className="flex justify-center items-center">
                        <div className="grid grid-cols-5 gap-2">
                            {
                                indicesToDisplay.map((num, i) => {
                                    const bgColor =
                                        result.result[num] === true
                                            ? "bg-[#3CC8A1]" // Correct
                                            : result.result[num] === false
                                                ? "bg-[#FF453A]" // Incorrect (Flagged)
                                                : "bg-gray-300"; // Unseen (null)

                                    return (
                                        <div key={i}>
                                            <div
                                                className={`${bgColor} flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]`}
                                            // onClick={() => markQuestion(num)} // Use `num` for marking
                                            >
                                                <p>{num + 1}</p>
                                            </div>
                                        </div>
                                    );
                                })

                            }
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-x-28 mt-3 text-[#71717A]">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-left cursor-pointer" onClick={prevPage} ><path d="M6 8L2 12L6 16" /><path d="M2 12H22" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-right cursor-pointer" onClick={nextPage} ><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg> */}
                    </div>
                    <div className="py-5 px-10 text-[#D4D4D8]">
                        <hr />
                    </div>

                    <div>
                        <DeepChatAI W='250px' />
                        <hr className='mx-5' />
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[12px]">
                        {/* Finish and Review Button */}
                        <div
                            className={`flex items-center font-semibold gap-x-2 ${isFinishEnabled ? "text-[#3CC8A1] cursor-pointer" : "text-[#D4D4D8] cursor-not-allowed"
                                } justify-center`}
                        // onClick={handleFinishAndReview}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-check"
                            >
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <p>Finish and Review</p>
                        </div>
                        <hr className="w-[200px] my-2" />
                        {/* Back to Dashboard Button */}
                        <div className="flex items-center gap-x-2 text-[#FF453A] font-semibold justify-center whitespace-nowrap">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-chevron-left"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            <p>Back to Dashboard</p>
                        </div>
                    </div>



                </div>
            </Drawer>
        </div>
    );
};

export default ShortQuestion;
