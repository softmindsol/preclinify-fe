import React, { useRef, useState, useEffect, useCallback } from "react";
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
import ChemistryBeaker from "./chemistry-beaker";
import { setActive, setAttempted } from "../redux/features/attempts/attempts.slice";
import { setAttemptedShortQuestion } from "../redux/features/SAQ/saq.slice";
import FeedbackModal from "./common/Feedback";
import { initializeVisited, markVisited } from "../redux/features/flagged/visited.slice";
import { initializeFlags, toggleFlag } from "../redux/features/flagged/flagged.slice";
import { initializeAnswers, setUserAnswers } from "../redux/features/SAQ/userAnswer.slice";


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
    const sqa = useSelector(state => state?.SQA?.organizedData || []);
    const attempted = useSelector((state) => state.attempts?.attempts);
    console.log("attempted:", attempted);
    const [showFeedBackModal, setShowFeedBackModal]=useState(false)
const [attempts, setAttempts] = useState(attempted); 
    const [isFinishEnabled, setIsFinishEnabled] = useState(false);
    const darkModeRedux = useSelector(state => state.darkMode.isDarkMode)
    const [childIndex, setChildIndex] = useState(0)
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isAccordionVisible, setIsAccordionVisible] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    // const [userAnswer, setUserAnswer] = useState("")
    const [userAnswer, setUserAnswerState] = useState("");
    const navigation = useNavigate();
    const mcqsAccuracy = useSelector(state => state.accuracy.accuracy);
    // const data = useSelector((state) => state.mcqsQuestion || []);
    const result = useSelector((state) => state.result);
    const [currentPage, setCurrentPage] = useState(0); // Track current page (each page has 20 items)
    const [isReviewEnabled, setIsReviewEnabled] = useState(false)
    const itemsPerPage = 10;
    // Get the items to show for the current page
        const active = useSelector((state) => state.attempts?.active);
    
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
    const [beakerToggle, setBeakerToggle] = useState(false);
    const [error, setError] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [isAnswered,setIsAnswered]=useState(false)
    const [parentIndex,setParentIndex]=useState(0)
    const totalQuestions = sqa.reduce((total, parent) => total + parent?.children?.length, 0);
    const [checkedAnswers, setCheckedAnswers] = useState(Array(totalQuestions).fill(false));
    // Initialize attempts with null values
    // const [attempts, setAttempts] = useState(Array(totalQuestions).fill(null));
    // const currentItems = sqa.children.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const allChildren = sqa.flatMap(parent => parent.children); // or use: const allChildren = [].concat(...sqa.map(parent => parent.children));

    // Get the current items based on the current page
    const currentItems = allChildren.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const flaggedQuestions = useSelector((state) => state?.flagged?.flaggedQuestions);
    const visited = useSelector((state) => state?.visited?.visitedQuestions);
    const userAnswers = useSelector(state => state?.userAnswers?.answers)
     

    console.log("visited:", visited);

    const beakerToggledHandler = () => {
        setBeakerToggle(!beakerToggle)
    }

    
    const handleCheckAnswer = () => {
                dispatch(setActive(false)); // Dispatch the updated attempts array to Redux
        
        if (!userAnswer.trim()) {
            setError(true);
            return;
        } else {
            setError(false);
            setIsAnswered(true)
            setTestCheckAnswer(true);

            
        }
        dispatch(setUserAnswers({ index: currentIndex, answer: userAnswer }));
        setUserAnswerState("");
        let value = false;
        dispatch(markVisited({ currentIndex, value }));
      
    };

    const nextQuestion = () => {
        if (childIndex < sqa[parentIndex]?.children.length - 1) {
            setChildIndex(prev => prev + 1);
        } else if (parentIndex < sqa.length - 1) {
            setParentIndex(prev => prev + 1);
            setChildIndex(0);
        }

        setCurrentIndex(prev => prev + 1); // Update current index
        setTestCheckAnswer(false);

        const nextIndex = currentIndex + 1;
        setUserAnswerState(userAnswers[nextIndex] || "");

        let value = true;
        if (!isAnswered) {
            dispatch(markVisited({ currentIndex, value }));
        }

        // Check if the next question has a valid answer
        const hasValidAnswer = userAnswers[nextIndex] !== null && userAnswers[nextIndex] !== "";
    

        setTestCheckAnswer(hasValidAnswer);
    };

    const prevQuestion = () => {
        if (childIndex > 0) {
            setChildIndex(prev => prev - 1);
        } else if (parentIndex > 0) {
            setParentIndex(prev => prev - 1);
            setChildIndex(sqa[parentIndex - 1]?.children.length - 1);
        }

        setCurrentIndex(prev => prev - 1); // Update current index
        setTestCheckAnswer(false);

        const prevIndex = currentIndex - 1;
        setUserAnswerState(userAnswers[prevIndex] || "");

        // Check if the previous question has a valid answer
        const hasValidAnswer = userAnswers[prevIndex] !== null && userAnswers[prevIndex] !== "";
        console.log(`hasValidAnswer for index ${prevIndex}:`, hasValidAnswer);

        setTestCheckAnswer(hasValidAnswer);
    };


    function handleShowPopup() {
        setShowPopup(true); // Close the popup
    }


    const handleBackToDashboard = () => {
        navigation('/dashboard');
    };
    const handleIncorrectClick = useCallback(() => {
        const globalIndex = sqa.slice(0, parentIndex).reduce((acc, parent) => acc + parent.children.length, 0) + childIndex;
        markQuestion(globalIndex, false);
        dispatch(setMcqsAccuracy({ accuracy }));
        setTestCheckAnswer(false);
        setUserAnswerState('');
        nextQuestion();
    }, [sqa, parentIndex, childIndex, dispatch, accuracy, nextQuestion]);

    const handlePartialClick = useCallback(() => {
        const globalIndex = sqa.slice(0, parentIndex).reduce((acc, parent) => acc + parent.children.length, 0) + childIndex;
        markQuestion(globalIndex, 'partial');
        dispatch(setMcqsAccuracy({ accuracy }));
        setTestCheckAnswer(false);
        setUserAnswerState('');
        nextQuestion();
    }, [sqa, parentIndex, childIndex, dispatch, accuracy, nextQuestion]);

    const handleCorrectClick = useCallback(() => {
        const globalIndex = sqa.slice(0, parentIndex).reduce((acc, parent) => acc + parent.children.length, 0) + childIndex;
        markQuestion(globalIndex, true);
        dispatch(setMcqsAccuracy({ accuracy }));
        setTestCheckAnswer(false);
        setUserAnswerState('');
        nextQuestion();
    }, [sqa, parentIndex, childIndex, dispatch, accuracy, nextQuestion]);


    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    

    };


    // Arrays to store indices
    const unseenIndices = [];
    const flaggedIndices = [];
    const allIndices = [];

    // Filter items based on the selected filter
    const filteredItems = currentItems?.filter((question, index) => {
        const displayNumber = currentPage * itemsPerPage + index;

        // All items
        allIndices.push(displayNumber);

        if (selectedFilter === 'All') {
            return true; // Include all items
        }

        if (selectedFilter === 'Flagged') {
            // Check if item is flagged
            const isFlagged = attempts[displayNumber] === true || attempts[displayNumber] === false || attempts[displayNumber] === 'partial';
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

    

    // Modified flag handler
    const handleFlagQuestion = () => {
        dispatch(toggleFlag(currentIndex));
    };

    const nextPage = () => {
        if ((currentPage + 1) * itemsPerPage < allChildren.length) {
            setCurrentPage(currentPage + 1);
            setCurrentIndex(prev => prev+10); 
            
        }

    }

    // Function to go to the previous page
    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setCurrentIndex(0); 
        }
    };


    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }


    const toggleMenu = (event) => {
        event.stopPropagation();
        setIsSubMenuOpen(!isSubMenuOpen); // Toggle the menu visibility
    };

const reportHandler=()=>{
    setShowFeedBackModal(!showFeedBackModal)
}

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

   
    const markQuestion = useCallback((index, status) => {
        setAttempts((prev) => {
            const updatedAttempts = [...prev];
            updatedAttempts[index] = status; // Update specific question status
            dispatch(setAttempted(updatedAttempts)); // Dispatch the updated attempts array to Redux
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
    }, [dispatch]);

    // const handleMark = (status) => {
    //     markQuestion(currentIndex, status);
    // };
  

    const getQuestionRange = (currentIndex) => {
       // Number of items to show in the sidebar
        const start = Math.floor(currentIndex / itemsPerPage) * itemsPerPage; // Calculate the start index
        const end = Math.min(start + itemsPerPage, allChildren.length); // Calculate the end index
        
        return { start, end };
    };

    // Get the range of questions to display
    const { start, end } = getQuestionRange(currentIndex);

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


  
    useEffect(() => {
        if (sqa.length > 0) {
            if (active){
                dispatch(initializeAnswers(totalQuestions)); // Initialize answers when the component mounts
            }
        }
    }, [sqa, dispatch, totalQuestions]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case '1': // Key "1" for Incorrect
                    handleIncorrectClick();
                    break;
                case '2': // Key "2" for Partial
                    handlePartialClick();
                    break;
                case '3': // Key "3" for Correct
                    handleCorrectClick();
                    break;
                default:
                    break; // Ignore other keys
            }
        };

        // Add event listener for keydown
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleIncorrectClick, handlePartialClick, handleCorrectClick]); // Add dependencies to avoid stale closures

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
            // setAccuracy(0); // Avoid division by zero
        } else {
            setAccuracy(((totalScore / maxScore) * 100).toFixed(2)); // Calculate accuracy
        }
    }, [totalScore, totalAttempts]);

    // Check if it's time to enable the Finish button
    useEffect(() => {
        setIsReviewEnabled(false);
        if (sqa[parentIndex]?.children.length === childIndex + 1) {
            setIsReviewEnabled(true); // Enable the Finish button when the condition is met 
        }
    }, [childIndex, sqa[parentIndex]?.children.length]); // Re-run whenever currentIndex changes
    useEffect(() => {
        const totalQuestions = sqa.reduce((acc, parent) => acc + parent.children.length, 0);
        const currentQuestionNumber = childIndex + 1 + sqa.slice(0, parentIndex).reduce((acc, parent) => acc + parent.children.length, 0);

        setIsReviewEnabled(currentQuestionNumber === totalQuestions);
    }, [childIndex, parentIndex, sqa]);

    useEffect(() => {
        if (active) {
            setAttempts(Array(allChildren?.length).fill(null)); // Initialize attempts as unseen
            dispatch(setAttempted(Array(allChildren?.length).fill(null))); // Dispatch the updated attempts array to Redux
            dispatch(initializeVisited(allChildren.length));
            dispatch(initializeFlags(allChildren.length));
        }

        const hasValidAnswer = userAnswers[currentIndex] !== null && userAnswers[currentIndex] !== "";
        setTestCheckAnswer(hasValidAnswer);
    }, [active]); // Ensure 'active' is the only dependency
     
  
   

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
            <div className="  h-screen  flex items-center justify-center   dark:bg-[#1E1E2A]  ">


                <div className="w-[100%] h-screen max-w-full  md:w-[80%] lg:w-[70%] xl:w-[55%]  ">

                    {/* Header Section */}


                    <div className="bg-[#3CC8A1] w-[90%] sm:w-[95%] text-white p-6 mt-5 lg:w-[720px] ml-6   rounded-md flex items-center justify-between relative">
                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#D4D4D8] rounded-md overflow-hidden">
                            <div
                                className="bg-[#60B0FA] h-full transition-all duration-300 ease-in-out"
                                style={{
                                    width: `${(
                                        (childIndex + 1 + sqa.slice(0, parentIndex).reduce((acc, parent) => acc + parent.children.length, 0)) /
                                        sqa.reduce((total, parent) => total + parent.children.length, 0)
                                    ) * 100}%`
                                }}
                            ></div>
                        </div>

                        {/* Left Icon */}
                        <div className="absolute left-4">
                            <div className="relative  ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-ellipsis lg:w-6 lg:h-6 w-4 h-4 cursor-pointer "
                                    onClick={(e) => toggleMenu(e)} // Toggle submenu on click
                                >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                </svg>

                                {/* Submenu */}
                                {isSubMenuOpen && (
                                    <div
                                        ref={menuRef} // Attach ref to the submenu container
                                        className="absolute right-0 mt-2 w-[150px] bg-white shadow-lg rounded-md border border-gray-300"
                                    >
                                        <ul>
                                            <li
                                                className="hover:bg-[#3CC8A1] text-[#3F3F46] hover:text-white cursor-pointer p-2"
                                                onClick={() => alert('Report clicked')}
                                            >
                                                Report
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Question Navigation */}
                     
                        <div className="flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2 text-[14px] lg:text-[18px]">
                            <button className={`text-white ${childIndex + 1 <= 1 && parentIndex === 0 ? 'opacity-70 cursor-not-allowed' : ''}`} onClick={prevQuestion}>
                                &larr;
                            </button>
                            <h2 className="font-semibold text-center">
                                Question {
                                    // Calculate current question number
                                    childIndex + 1 +
                                    sqa.slice(0, parentIndex).reduce((acc, parent) => acc + parent.children.length, 0)
                                } of {
                                    // Calculate total questions
                                    sqa.reduce((total, parent) => total + parent.children.length, 0)
                                }
                            </h2>
                            <button className={`text-white ${(childIndex + 1 === sqa[parentIndex]?.children?.length) &&
                                (parentIndex === sqa.length - 1) ? 'opacity-70 cursor-not-allowed' : ''
                                }`} onClick={nextQuestion}>
                                &rarr;
                            </button>
                        </div>

                        {/* Right Icons */}
                        <div className="absolute right-4 flex space-x-4">
                            <div className="relative">
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
                                    className="lucide lucide-flask-conical cursor-pointer hover:opacity-80"
                                    onClick={beakerToggledHandler}
                                >
                                    <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
                                    <path d="M6.453 15h11.094" />
                                    <path d="M8.5 2h7" />

                                </svg>
                                {
                                    beakerToggle && <div className="absolute top-3 left-24">
                                        <ChemistryBeaker beakerToggledHandler={beakerToggledHandler} />
                                    </div>
                                }

                            </div>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill={flaggedQuestions[currentIndex] ? 'white' : 'none'}
                                stroke={flaggedQuestions[currentIndex] ? 'white' : 'currentColor'}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-flag cursor-pointer hover:opacity-80"
                                onClick={handleFlagQuestion}
                            >
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                <line x1="4" x2="4" y1="22" y2="15" />
                            </svg>  
                        </div>
                    </div>

                    {/* Question Section */}
                    <div className="mt-6  p-6 ">
                        <p className="text-[#000000] text-justify w-[100%] lg:w-[720px] dark:text-white">
                            {sqa[parentIndex]?.parentQuestion}
                        </p>

                        <h3 className="mt-4 text-[14px] text-[#27272A]  w-[100%] lg:w-[720px] font-bold text-wrap dark:text-white">
                            {sqa[parentIndex]?.children[childIndex]?.questionLead}
                        </h3>

                        <div>


                        </div>
                        {
                            !testCheckAnswer ? <div>
                                <textarea
                                    className={`rounded-[6px]  lg:w-[720px] h-[180px] mt-2  p-5 text-wrap border border-[#ffff] placeholder:text-[#D4D4D8] placeholder:text-[14px] placeholder:font-normal ${error ? 'border border-red-500' : "border"}`}
                                    placeholder="Type here to answer the question..."
                                    onChange={(e) => {
                                        setError(false); // Set an error if empty
                                        setUserAnswerState(e.target.value)
                                    }}
                                    value={userAnswer}

                                />
                                {error ?

                                    <p className="text-red-500 text-[12px]">Please enter your answer</p> : <p></p>}
                            </div>
                                :
                                <div>
                                    <textarea
                                        className="rounded-[6px] bg-[#E4E4E7] w-[100%] lg:w-[720px] h-[120px] mt-2  p-5 text-wrap"
                                        placeholder="This is the user’s answer"
                                        value={userAnswer || userAnswers[currentIndex] || ""}
                                        readOnly
                                    />

                                    <textarea
                                        className="rounded-[6px] lg:w-[720px] h-[180px] mt-2 p-5 text-wrap border border-[#3CC8A1] placeholder:text-[#3F3F46] placeholder:font-semibold"
                                        placeholder="This is the user’s answer"
                                        value={sqa[parentIndex]?.children[childIndex]?.idealAnswer}
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
                                            Incorrect <span className="bg-[#F4F4F5] p-1.5 rounded-[4px] font-medium text-[#27272A] ml-2">1</span>
                                        </button>
                                        <button className="bg-[#FF9741] w-[230px] text-[#FFFF] p-2 rounded-[8px]" onClick={handlePartialClick}>
                                            Partial <span className="bg-[#F4F4F5] p-1 rounded-[4px] font-medium text-[#27272A] ml-2">2</span>
                                        </button>
                                        <button className="bg-[#3CC8A1] w-[230px] text-[#FFFF] p-2 rounded-[8px]" onClick={handleCorrectClick}>
                                            Correct <span className="bg-[#F4F4F5] p-1 rounded-[4px] font-medium text-[#27272A] ml-2">3</span>
                                        </button>
                                    </div>

                                </div> :
                                <div className="group ">
                                    <button
                                        className="mt-2 text-[14px]  w-[100%] lg:w-[720px] flex items-center justify-center gap-x-3 lg:text-[16px] bg-[#3CC8A1] text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#3CC8A1] border border-[#3CC8A1]"
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
                                className={`flex items-center w-[100%] lg:w-[720px] font-semibold gap-x-2 ${isFinishEnabled ? "text-[#3CC8A1] cursor-pointer" : "text-[#D4D4D8] cursor-not-allowed"
                                    } justify-center`}
                                onClick={handleFinishAndReview}

                            >

                                <button
                                    className="mt-6 text-[14px]  lg:text-[16px] w-full bg-[#60B0FA] text-white px-6 py-2 rounded-md font-semibold hover:bg-transparent hover:text-[#60B0FA] border border-[#60B0FA]"

                                >
                                    Finish and Review &darr;
                                </button>
                            </div>
                        )}


                        <div className="flex items-center w-[100%] lg:w-[720px] gap-x-10 justify-between mt-5">
                            <div className="flex items-center w-full  justify-between  ">
                                <p className="font-medium text-[16px] text-[#3F3F46] dark:text-white" >Notice a problem with this question?</p>
                                <button onClick={reportHandler} className="text-[14px] text-[#193154] p-3 rounded-[4px] bg-gray-200  font-semibold hover:bg-[#d9d9db] transition-all duration-300">Report</button>
                            </div>
                        </div>


                        <div>

                        </div>


                    </div>
                </div>

                {/* Sidebar Section */}

                <div className={`hidden lg:block fixed right-0 top-0 dark:border  `}>


                    <div className={`absolute right-0 top-0 bg-white w-[28%] md:w-[25%] lg:w-[240px]   h-screen dark:bg-[#1E1E2A] text-black   ${!toggleSidebar ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 dark:border-[1px] dark:border-[#3A3A48]`}>
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
                                <div className={`w-[90%] h-[96px] rounded-[8px] bg-[#3CC8A1] ${accuracy > 34 ? "bg-[#3CC8A1]" : "bg-[#FF453A]"}  text-[#ffff] text-center`}>
                                    <div>  <p className="text-[12px] mt-3">Accuracy</p>
                                            <p className="font-black text-[36px]">{accuracy}%</p>
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
                            <div className="flex items-center justify-between p-5 w-full text-[12px] dark:text-white">
                                <span
                                    className={`w-[30%] text-center cursor-pointer ${selectedFilter === 'All' ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]' : 'hover:text-[#3CC8A1]'}`}
                                    onClick={() => handleFilterChange('All')}
                                >
                                    All
                                </span>
                                <span
                                    className={`w-[36%] text-center cursor-pointer ${selectedFilter === 'Flagged' ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]' : 'hover:text-[#3CC8A1]'}`}
                                    onClick={() => handleFilterChange('Flagged')}
                                >
                                    Flagged
                                </span>
                                <span
                                    className={`w-[30%] text-center cursor-pointer ${selectedFilter === 'Unseen' ? 'text-[#3CC8A1] border-b-[1px] border-[#3CC8A1]' : 'hover:text-[#3CC8A1]'}`}
                                    onClick={() => handleFilterChange('Unseen')}
                                >
                                    Unseen
                                </span>
                            </div>
                        </div>


                        <div className="flex justify-center items-center">
                            <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: end - start }, (_, i) => start + i).map((num, i) => {
                                    // Determine the background color based on the question status
                                    const bgColor = attempted[num] === true
                                        ? "bg-[#3CC8A1]" // Correct answer
                                        : attempted[num] === false
                                            ? "bg-[#FF453A]" // Incorrect answer
                                            : attempted[num] === 'partial'   ? "bg-[#FF9741]" // No answer
                                            : "bg-gray-300"; // Unattempted

                                    // Only display questions that match the selected filter
                                    // if (
                                    //     selectedFilter === 'All' ||
                                    //     (selectedFilter === 'Flagged' && (attempted[num] === true || attempted[num] === false || attempted[num]==='partial')) ||
                                    //     (selectedFilter === 'Unseen' && attempted[num] === null)
                                    // )
                                        if (
                                            selectedFilter === 'All' ||
                                            (selectedFilter === 'Flagged' && (flaggedQuestions[num] === true)) ||
                                            (selectedFilter === 'Unseen' && visited[num] === true)
                                        )
                                    
                                        {
                                            return (
                                                <div key={i}>
                                                    {
                                                        flaggedQuestions[num] ? <div
                                                            className={`${bgColor} flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px] cursor-pointer`}
                                                            onClick={() => {
                                                                setCurrentIndex(num); // Navigate to the selected question
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill={flaggedQuestions[num] ? 'white' : 'none'}
                                                                stroke={flaggedQuestions[num] ? 'white' : 'currentColor'}
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="lucide lucide-flag cursor-pointer hover:opacity-80"

                                                            >
                                                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                                                <line x1="4" x2="4" y1="22" y2="15" />
                                                            </svg>
                                                        </div> :
                                                            <div
                                                                className={`${bgColor} flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px] cursor-pointer`}
                                                                onClick={() => {
                                                                    setCurrentIndex(num); // Navigate to the selected question
                                                                }}
                                                            >
                                                                <p>{num + 1}</p>
                                                            </div>
                                                    }

                                                </div>
                                            );
                                        } else {
                                            return null; // Skip rendering if the question doesn't match the filter
                                        }
                                })}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-x-28 mt-3 text-[#71717A]">
                            <button
                                className={`${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={currentPage > 0 ? prevPage : null}
                                disabled={currentPage === 0}
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
                                    className="lucide lucide-move-left"
                                >
                                    <path d="M6 8L2 12L6 16" />
                                    <path d="M2 12H22" />
                                </svg>
                            </button>

                            <button
                                className={`${((currentPage + 1) * itemsPerPage) >= allChildren.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={((currentPage + 1) * itemsPerPage) < allChildren.length ? nextPage : null}
                                disabled={((currentPage + 1) * itemsPerPage) >= allChildren.length}
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
                                    className="lucide lucide-move-right"
                                >
                                    <path d="M18 8L22 12L18 16" />
                                    <path d="M2 12H22" />
                                </svg>
                            </button>
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
                    <div className={`absolute right-0 top-0 bg-white w-[28%] md:w-[25%] lg:w-[50px]   h-screen ${!toggleSidebar && "translate-x-full"} transition-transform duration-300  dark:bg-[#1E1E2A] text-black  dark:border-[1px] dark:border-[#3A3A48]`}>

                        <div className="flex items-center  cursor-pointer dark:bg-[#1E1E2A]" onClick={() => {
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

{
                showFeedBackModal && <FeedbackModal showFeedBackModal={showFeedBackModal} setShowFeedBackModal={setShowFeedBackModal} />
}

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
                        <button
                            className={`${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={currentPage > 0 ? prevPage : null}
                            disabled={currentPage === 0}
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
                                className="lucide lucide-move-left"
                            >
                                <path d="M6 8L2 12L6 16" />
                                <path d="M2 12H22" />
                            </svg>
                        </button>

                        <button
                            className={`${((currentPage + 1) * itemsPerPage) >= currentItems.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={((currentPage + 1) * itemsPerPage) < currentItems.length ? nextPage : null}
                            disabled={((currentPage + 1) * itemsPerPage) >= currentItems.length}
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
                                className="lucide lucide-move-right"
                            >
                                <path d="M18 8L22 12L18 16" />
                                <path d="M2 12H22" />
                            </svg>
                        </button>
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
