import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";
import DiscussionBoard from "./Discussion";
import { TbBaselineDensityMedium } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'

import { useDispatch, useSelector } from "react-redux";
import { clearResult, setResult } from "../redux/features/result/result.slice";
import { useNavigate } from "react-router-dom";
import { setRemoveQuestionLimit } from "../redux/features/limit/limit.slice";
import { fetchConditionNameById } from "../redux/features/SBA/sba.service";
import DeepChatAI from "./DeepChat";
import { setMcqsAccuracy } from "../redux/features/accuracy/accuracy.slice";
import { sessionCompleted } from "../redux/features/recent-session/recent-session.slice";
import ChemistryBeaker from "./chemistry-beaker";
import DashboardModal from "./common/DashboardModal";
import Article from "./Article";
import { setAttemptedData } from "../redux/features/SBA/sba.slice";
import { setActive, setAttempted } from "../redux/features/attempts/attempts.slice";
import FeedbackModal from "./common/Feedback";
import { initializeFlags, toggleFlag } from "../redux/features/flagged/flagged.slice";
import { initializeVisited, markVisited } from "../redux/features/flagged/visited.slice";



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
const QuestionCard = () => {
    const darkModeRedux = useSelector(state => state.darkMode.isDarkMode)
    const dispatch = useDispatch();
    const attempted = useSelector((state) => state.attempts?.attempts);
    const [isOpen, setIsOpen] = useState(false);
    const [attempts, setAttempts] = useState(attempted); // Array to track question status: null = unseen, true = correct, false = incorrect
    const [isAccordionVisible, setIsAccordionVisible] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [showFeedBackModal, setShowFeedBackModal]=useState(false)
    const beakerRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinishEnabled, setIsFinishEnabled] = useState(false);
    const navigation = useNavigate();
    const [border, setBorder] = useState(true);
    const mcqsAccuracy = useSelector(state => state.accuracy.accuracy);
    const [showPopup, setShowPopup] = useState(false);
    const data = useSelector((state) => state.mcqsQuestion || []);
    const result = useSelector((state) => state.result);
    const [currentPage, setCurrentPage] = useState(0); // Track current page (each page has 20 items)
    const [isReviewEnabled, setIsReviewEnabled] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const itemsPerPage = 10;
    const [article, setArticle] = useState({})
    const isQuestionReview = useSelector(state => state.questionReview.value)
    // Get the items to show for the current page
    const currentItems = data.data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const [selectedFilter, setSelectedFilter] = useState('All'); // Default is 'All'
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State to toggle submenu visibility
    const isTimerMode = useSelector((state) => state.mode);
    const [timer, setTimer] = useState(() => {
        // Calculate the initial timer value based on the number of questions
        const initialTime = calculateTimeForQuestions(isTimerMode.time);
        const savedTime = localStorage.getItem('examTimer');
        return savedTime ? parseInt(savedTime, 10) : initialTime; // Use saved time if available
    });
    
      const flaggedQuestions = useSelector((state) => state.flagged.flaggedQuestions);
        const visited = useSelector((state) => state.visited.visitedQuestions);
    
    const review = useSelector(state => state.questionReview.value)
    const [accuracy, setAccuracy] = useState(mcqsAccuracy); // Calculated accuracy    
    // const data = useSelector((state) => state.mcqsQuestion || []);
    const [beakerToggle, setBeakerToggle] = useState(false);
    const menuRef = useRef(null);
    const active = useSelector((state) => state.attempts?.active);
 

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    // Arrays to store indices
    const unseenIndices = [];
    const flaggedIndices = [];
    const allIndices = [];

   

 
  
    // Update getQuestionRange to use currentPage correctly
    const getQuestionRange = (currentPage) => {
        const start = currentPage * itemsPerPage;
        const end = Math.min(start + itemsPerPage, data.data.length);
        return { start, end };
    };

    // Use currentPage to determine the start and end indices
    const { start, end } = getQuestionRange(currentPage);
    // Filtered items to display based on the selected filter
    const filteredItems = data.data.slice(start, end).filter((question, index) => {
        const displayNumber = start + index;

        // All items
        allIndices.push(displayNumber);

        if (selectedFilter === 'All') {
            return true; // Include all items
        }

        if (selectedFilter === 'Flagged') {
            // Check if item is flagged (attempted)
            const isFlagged = attempted[displayNumber] === true || attempted[displayNumber] === false;
            if (isFlagged) {
                flaggedIndices.push(displayNumber); // Store index for flagged items
                return true;
            }
        }

        if (selectedFilter === 'Unseen') {
            // Check if item is unseen (unattempted)
            const isUnseen = attempted[displayNumber] === null;
            if (isUnseen) {
                unseenIndices.push(displayNumber); // Store index for unseen items
                return true;
            }
        }

        return false; // Hide items that don't match the filter
    });

 


    const toggleAccordion = (index) => {
        setIsAccordionOpen((prev) => {
            if (Array.isArray(prev)) {
                const newAccordionState = [...prev]; // Create a copy to avoid mutation
                newAccordionState[index] = !newAccordionState[index]; // Toggle the state at the given index
                return newAccordionState; // Return the updated array
            } else {
                // If prev is not an array, initialize it with a new array based on data length
                return new Array(data.data.length).fill(false);
            }
        });
    };

    const beakerToggledHandler = () => {
        setBeakerToggle(!beakerToggle)
    }


    function handleToggleSidebar() {
        setToggleSidebar(true)
    }

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        setIsAnswered(true);
    };

    // const handleCheckAnswer = () => {
    //     dispatch(setActive(false)); // Dispatch the updated attempts array to Redux

    //     if (selectedAnswer) {
    //         setIsButtonClicked(true);
    //         setIsAccordionVisible(true);
    //         setBorder(false);

    //         // Get the correct answer from answersArray using correctAnswerId
    //         const correctAnswer = data.data[currentIndex].answersArray[data.data[currentIndex].correctAnswerId];

    //         // Check if the selected answer matches the correct answer
    //         const isCorrect = selectedAnswer === correctAnswer;


    //         // Update attempts
    //         setAttempts((prev) => {
    //             const updatedAttempts = [...prev];
    //             updatedAttempts[currentIndex] = isCorrect; // Mark as correct (true) or incorrect (false)
    //             dispatch(setAttempted(updatedAttempts)); // Dispatch the updated attempts array to Redux
    //             dispatch(fetchConditionNameById({ id: data?.data[currentIndex]?.conditionName }))
    //             dispatch(setResult({ updatedAttempts }));
    //             return updatedAttempts;
    //         });


    //         // Expand accordion for the correct answer
    //         setIsAccordionOpen((prev) => {
    //             const newAccordionState = [...prev];
    //             newAccordionState[data.data[currentIndex].correctAnswerId] = true; // Expand the correct answer's explanation
    //             return newAccordionState;
    //         });
    //     }
    // };

    const handleCheckAnswer = () => {
        dispatch(setActive(false));

        if (selectedAnswer) {
            setIsButtonClicked(true);
            setIsAccordionVisible(true);
            setBorder(false);

            const correctAnswer = data.data[currentIndex].answersArray[data.data[currentIndex].correctAnswerId];
            const isCorrect = selectedAnswer === correctAnswer;

            setAttempts((prev) => {
                const updatedAttempts = [...prev];
                updatedAttempts[currentIndex] = isCorrect;
                dispatch(setAttempted(updatedAttempts));
                if (data?.data[currentIndex]?.conditionName!==null){
                    dispatch(fetchConditionNameById({ id: data?.data[currentIndex]?.conditionName }))
                        .unwrap()
                        .then(res => {
                            setArticle(res)
                        })
                }
               
                dispatch(setResult({ updatedAttempts }));
                return updatedAttempts;
            });

            // Open the correct answer's accordion and selected if incorrect
            setIsAccordionOpen((prev) => {
                const newAccordionState = [...prev].fill(false); // Close all first
                const selectedIndex = data.data[currentIndex].answersArray.indexOf(selectedAnswer);
                const correctIndex = data.data[currentIndex].correctAnswerId;

                newAccordionState[correctIndex] = true; // Always open correct answer
                if (!isCorrect) {
                    newAccordionState[selectedIndex] = true; // Open selected if incorrect
                }
                return newAccordionState;
            });

              let value = false;
                        dispatch(markVisited({ currentIndex, value }));
        }
    };

     // Modified flag handler
        const handleFlagQuestion = () => {
            dispatch(toggleFlag(currentIndex));
        };
    
    // const nextQuestion = () => {
    //     if (currentIndex < data?.data.length - 1) {
    //         setCurrentIndex((prev) => prev + 1);

    //         // Check if the next question has been attempted
    //         if (attempted[currentIndex + 1] !== null) {
    //             setIsAnswered(true);
    //             setIsAccordionVisible(true);
    //         } else {
    //             setIsAnswered(false);
    //             setIsAccordionVisible(false);
    //         }
    //         if (isQuestionReview) {
    //             setIsAnswered(true);
    //             setIsAccordionVisible(true);
    //         }
    //          let value=true
    //                     if (isAnswered === false){
    //                         dispatch(markVisited({ currentIndex, value }));
    //                     }
    //     }
        
    // };

      const nextQuestion = () => {
          if (currentIndex < data?.data.length - 1) {
                // Mark the current question as unseen if skipped
                if (attempted[currentIndex] === null) {
                    setAttempts((prev) => {
                        const updatedAttempts = [...prev];
                        updatedAttempts[currentIndex] = null; // Mark as unseen
                        return updatedAttempts;
                    });
                }
                if (attempted[currentIndex + 1] !== null) {
                    setIsAnswered(true);
                    setIsAccordionVisible(true);
                } else {
                    setIsAnswered(false);
                    setIsAccordionVisible(false);
                }
    
                if (isQuestionReview) {
                    setIsAnswered(true);
                    setIsAccordionVisible(true);
                    if (data?.data[currentIndex]?.conditionName !== null) {
                        dispatch(fetchConditionNameById({ id: data?.data[currentIndex]?.conditionName }))
                            .unwrap()
                            .then(res => {
                                setArticle(res)
                            })
                    }
                } 
    
                let value=true
                if (isAnswered === false){
                    dispatch(markVisited({ currentIndex, value }));
                }
                setCurrentIndex((prev) => prev + 1);
            }
        };
 const getAttemptedQuestions = () => {
        return data.data.filter((_, index) => attempted[index] !== null);
    };

    const attemptedQuestions = getAttemptedQuestions();
    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);

            // Check if the previous question has been attempted
            if (attempted[currentIndex - 1] !== null) {
                setIsAnswered(true);
                setIsAccordionVisible(true);
            } else {
                setIsAnswered(false);
                setIsAccordionVisible(false);
            }
            if (isQuestionReview) {
                setIsAnswered(true);
                setIsAccordionVisible(true);
            }
        }
    };



    // Correct the nextPage function
    const nextPage = () => {
        const newPage = currentPage + 1;
        if (newPage * itemsPerPage < data.data.length) {
            setCurrentPage(newPage);
            setCurrentIndex(newPage * itemsPerPage); // Set to the first question of the new page
        }
    };

    // Correct the prevPage function
    const prevPage = () => {
        const newPage = currentPage - 1;
        if (newPage >= 0) {
            setCurrentPage(newPage);
            setCurrentIndex(newPage * itemsPerPage); // Set to the first question of the previous page
        }
    };


    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }
    data.data[currentIndex].explanationList.map((explanation, index) => {
        let isSelected = selectedAnswer === explanation;
        const isCorrectAnswer = index === data.data[currentIndex].correctAnswerId;
    })

    // Update attempts based on user actions
    const markQuestion = (index, status) => {


        setAttempts((prev) => {
            const updatedAttempts = [...prev];
            updatedAttempts[index] = status; // Update specific question as correct (true) or incorrect (false)
            return updatedAttempts;
        });
    };


    const toggleMenu = (event) => {
        event.stopPropagation();
        setIsSubMenuOpen(!isSubMenuOpen); // Toggle the menu visibility
    };





    const handleFinishAndReview = () => {
        if (true) {
            handleCheckAnswer();
            // dispatch(setMcqsAccuracy({ accuracy }))

            // handleAnswerSelect()
            //    Add a delay (for example, 2 seconds)
            setTimeout(() => {
                navigation('/score');
            }, 3000); // 2000 ms = 2 seconds
        }

    };

    function handleShowPopup() {
        setShowPopup(true); // Close the popup
    }

    const handleBackToDashboard = () => {
        navigation('/dashboard');
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


    useEffect(() => {
        if (data?.data?.length) {
            const initialAccordionState = data.data[currentIndex].answersArray.map(() => false);
            setIsAccordionOpen(initialAccordionState);
        }
    }, [data.data]);

    useEffect(() => {
        // Reset accordion state when the current question changes
        if (data.data[currentIndex]?.answersArray) {
            const numAnswers = data.data[currentIndex].answersArray.length;
            setIsAccordionOpen(Array(numAnswers).fill(false));
        }
    }, [currentIndex, data.data]);

    useEffect(() => {

        if (active) {
            setAttempts(Array(data.data.length).fill(null)); // Initialize attempts as unseen
            dispatch(setAttempted(Array(data.data.length).fill(null))); // Dispatch the updated attempts array to Redux
        }

    }, [data.data]);


    useEffect(() => {
    
        if (data?.data?.length > 0) {
                if (active) {
                    dispatch(initializeFlags(data?.data?.length));
                    dispatch(initializeVisited(data?.data?.length));
                }
            }
    }, [data?.data]);
    

    useEffect(() => {
        const correct = attempts.filter((attempt) => attempt === true).length;
        const incorrect = attempts.filter((attempt) => attempt === false).length;
        const totalAttempted = attempts.filter((attempt) => attempt !== null).length;
        setAccuracy(totalAttempted > 0 ? ((correct / totalAttempted) * 100).toFixed(1) : 0);

        const hasAnswer = attempts.some(value => value === true || value === false);

        setIsFinishEnabled(hasAnswer);

    }, [attempts]);

    useEffect(() => {
        if (review === false) {

            dispatch(setMcqsAccuracy({ accuracy }))
        }

    }, [accuracy])


    useEffect(() => {
        if (isTimerMode['mode'] === 'Exam') {
            // Save the timer value in localStorage on every update
            localStorage.setItem('examTimer', timer);

            if (timer === 0) {
                handleFinishAndReview();
                localStorage.removeItem('examTimer'); // Clear storage when timer ends
                return;
            }

            const interval = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timer, isTimerMode, handleFinishAndReview]);



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



    // Check if it's time to enable the Finish button
    useEffect(() => {
        setIsReviewEnabled(false);
        if (data.data.length === currentIndex + 1) {
            setIsReviewEnabled(true); // Enable the Finish button when the condition is met 
        }

    }, [currentIndex, data.data.length]); // Re-run whenever currentIndex changes

    const reportHandler = () => {
        setShowFeedBackModal(!showFeedBackModal)
    }


    // Add this useEffect hook to handle keyboard events
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (attempted[currentIndex] !== null) return;

            const key = e.key.toUpperCase();
            const validKeys = ["Q", "W", "E", "R", "T"];
            const keyIndex = validKeys.indexOf(key);

            if (keyIndex !== -1 && keyIndex < data.data[currentIndex]?.answersArray.length) {
                const answer = data.data[currentIndex].answersArray[keyIndex];
                handleAnswerSelect(answer);
                dispatch(setResult({ attempted }));

            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex, attempted, data.data]);

    useEffect(() => {

        if (review) {
            setAccuracy(100)
            setIsButtonClicked(true);
            setIsAccordionVisible(true);
            setBorder(false)
            setSelectedAnswer(true)
            setIsAnswered(true)
            // setIsAccordionVisible(true)
        }
    }, [review])

    
 useEffect(() => {
        function handleClickOutside(event) {
            if (beakerRef.current && !beakerRef.current.contains(event.target)) {
                setBeakerToggle(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <div className={` min-h-screen  ${darkModeRedux ? 'dark' : ''}   `} >
            <div className="dark:bg-[#1E1E2A] min-h-screen">


                <div className='flex items-center  justify-between p-5 bg-white lg:hidden w-full '>
                    <div className=''>
                        <img src="/assets/small-logo.png" alt="" />
                    </div>

                    <div className='' onClick={toggleDrawer}>
                        <TbBaselineDensityMedium />
                    </div>
                </div>
                <div className=" mx-auto  flex items-center justify-center p-6  text-black   ">


                    <div className={`max-w-full  transition-all duration-150  w-[100%] md:w-[80%] lg:w-[70%] xl:w-[55%] ${toggleSidebar ? "2xl:w-[55%] " : '2xl:w-[40%] '} ${toggleSidebar ? "lg:mr-[130px] " : 'lg:mr-[200px] '}  `}>

                        {/* Header Section */}
                        <div className="bg-[#3CC8A1]   text-white p-6 rounded-md flex items-center justify-between relative">
                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 w-full h-[4px]  bg-[#D4D4D8] rounded-md overflow-hidden">
                                <div
                                    className="bg-[#60B0FA] h-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${((currentIndex + 1) / data.data.length) * 100}%` }}
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
                                                    onClick={reportHandler}
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
                                <button className={`text-white ${currentIndex + 1 <= 1 ? 'opacity-70 cursor-not-allowed' : ''}`} onClick={prevQuestion}>
                                    &larr;
                                </button>
                                <h2 className="font-semibold text-center">
                                    Question {currentIndex + 1} of {data.data.length}
                                </h2>
                                <button className={`text-white ${currentIndex + 1 === data.data.length ? 'opacity-70 cursor-not-allowed' : ''}`} onClick={nextQuestion}>
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

                        {/* Question start */}
                        {data?.data.length > 0 && (
                            <div className="mt-6 p-6" key={currentIndex}>
                                <p className="text-[#000000] text-[14px] text-justify lg:text-[16px] dark:text-white">
                                    {data.data[currentIndex].questionStem}
                                </p>

                                <h3 className="mt-4 text-[12px] lg:text-[14px] text-[#3F3F46] font-bold dark:text-white">
                                    {data.data[currentIndex].leadQuestion}
                                </h3>
                                    <div className="mt-4 space-y-4">
                                            {
                                            data.data[currentIndex]?.answersArray.map((answer, index) => {
                                                const isSelected = selectedAnswer === answer;
                                                const isCorrectAnswer = index === data?.data[currentIndex]?.correctAnswerId;

                                                // Determine the border color based on whether the button has been clicked
                                                const borderColor = isButtonClicked || attempted[currentIndex] !== null
                                                    ? isCorrectAnswer
                                                        ? "border-[#22C55E]"
                                                        : "border-[#EF4444]"
                                                    : "";
                                                const bgColor = isButtonClicked || attempted[currentIndex] !== null
                                                    ? isCorrectAnswer
                                                        ? "bg-[#DCFCE7]"
                                                        : "bg-[#FEE2E2]"
                                                    : "";

                                                return (
                                                    <div key={index}>
                                                        {!isAccordionVisible && attempted[currentIndex] === null ? (
                                                            <label
                                                                className={`flex bg-white items-center space-x-3 py-[12px] p-4 rounded-md cursor-pointer hover:bg-gray-200 text-[14px] lg:text-[16px] border-2 ${'border-[#F4F4F5]'} dark:bg-[#1E1E2A] dark:border`}
                                                                onClick={() => handleAnswerSelect(answer, index)}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="answer"
                                                                    className="form-radio h-5 w-5 text-green-500 focus:ring-green-500"
                                                                    checked={isSelected}
                                                                    readOnly
                                                                />
                                                                <span className="font-medium text-[#3F3F46] flex-1 dark:text-white">{answer}</span>
                                                                <span className="bg-gray-200 text-[#27272A] px-2 py-1 rounded-md">
                                                                    {["Q", "W", "E", "R", "T"][index]}
                                                                </span>
                                                            </label>
                                                        ) : (
                                                            <div
                                                                className={`border-[1px] ${borderColor} ${bgColor} rounded-[6px]`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent propagation
                                                                    toggleAccordion(index);
                                                                }}
                                                            >
                                                                <label
                                                                    className={`flex items-center space-x-3 p-4 rounded-md cursor-pointer text-[14px] lg:text-[16px]`}
                                                                    onClick={() => handleAnswerSelect(answer, index)}
                                                                >
                                                                    <div
                                                                        className={`h-6 w-6 flex items-center justify-center rounded-full ${isButtonClicked || attempted[currentIndex] !== null
                                                                            ? isCorrectAnswer
                                                                                ? "bg-green-100 border border-green-500"
                                                                                : "bg-red-100 border border-red-500"
                                                                            : "bg-gray-100 border border-gray-300"
                                                                            }`}
                                                                    >
                                                                        {(isButtonClicked || attempted[currentIndex] !== null) && (
                                                                            isCorrectAnswer ? (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="2"
                                                                                    stroke="green"
                                                                                    className="w-4 h-4"
                                                                                >
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            ) : (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="2"
                                                                                    stroke="red"
                                                                                    className="w-4 h-4"
                                                                                >
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                                </svg>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    <span className="text-[#27272A] flex-1">{answer}</span>
                                                                    {isAccordionOpen[index] ? (
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
                                                                            className="lucide lucide-chevron-up"
                                                                        >
                                                                            <path d="m18 15-6-6-6 6" />
                                                                        </svg>
                                                                    ) : (
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
                                                                            className="lucide lucide-chevron-down"
                                                                        >
                                                                            <path d="m6 9 6 6 6-6" />
                                                                        </svg>
                                                                    )}
                                                                </label>

                                                                {/* Conditionally render the hr and p tags */}
                                                                {isAccordionOpen[index] && (
                                                                    <>
                                                                        <hr className={`mx-5 ${borderColor}`} />
                                                                        <p className="py-2 px-5 text-[12px] text-[#3F3F46]">
                                                                            {data.data[currentIndex].explanationList[index]}
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                            }
                                    </div>
                                  
                                
                                {/* Submit Button */}
                                {
                                    !isReviewEnabled && (
                                        isAccordionVisible ? (
                                            <div className="group">
                                                <button
                                                    className="mt-2 text-[14px] flex items-center justify-center gap-x-3 w-full lg:text-[16px] bg-[#3CC8A1] text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#3CC8A1] border border-[#3CC8A1]"
                                                    onClick={nextQuestion}
                                                >
                                                    Next Question
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
                                        ) : (
                                            <div className="group">
                                                <button
                                                        className={` mt-2 text-[14px] flex items-center justify-center gap-x-3 w-full lg:text-[16px] bg-[#3CC8A1] text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out  ${isAnswered && 'hover:bg-transparent'}  ${isAnswered && 'hover:text-[#3CC8A1]'}  border border-[#3CC8A1] ${!isAnswered && 'cursor-not-allowed'}`}
                                                    onClick={handleCheckAnswer}
                                                        disabled={isAnswered===false}
                                                >
                                                    Check Answer
                                                        <span className={`bg-white rounded-[4px] px-[2px]  ${isAnswered && 'group-hover:bg-[#3CC8A1]'}  transition-all duration-300 ease-in-out`}>
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
                                                                className={`lucide lucide-space text-black  ${isAnswered && 'group-hover:text-white'} transition-all duration-300 ease-in-out`}
                                                        >
                                                            <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </div>
                                        )
                                    )
                                }
                                {isReviewEnabled && (
                                    <div
                                        className={`flex items-center font-semibold gap-x-2 ${isFinishEnabled ? "text-[#3CC8A1] cursor-pointer" : "text-[#D4D4D8] cursor-not-allowed"
                                            } justify-center`}
                                        onClick={handleFinishAndReview}
                                    >
                                        {
                                            review === false
                                            &&
                                            <div className="group w-full">
                                                <button
                                                    className="mt-2  text-[14px] flex items-center justify-center gap-x-3 w-full lg:text-[16px] bg-[#60B0FA] text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#60B0FA] border border-[#60B0FA]"

                                                >
                                                    Finish and Review
                                                    <span className="bg-white rounded-[4px] px-[2px] group-hover:bg-[#60B0FA] transition-all duration-300 ease-in-out">
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
                                    </div>
                                )}

                                {
                                    review === true
                                    &&
                                    <div className="group w-full">
                                        <button
                                            className="mt-2  text-[14px] flex items-center justify-center gap-x-3 w-full lg:text-[16px] bg-[#60B0FA] text-white px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#60B0FA] border border-[#60B0FA]"
                                            onClick={() => {
                                                navigation('/dashboard')
                                            }}
                                        >
                                            Back to Dashboard
                                            <span className="bg-white rounded-[4px] px-[2px] group-hover:bg-[#60B0FA] transition-all duration-300 ease-in-out">
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
                            </div>
                        )}

                        {
                            isAccordionVisible && <div className="flex items-center mx-7  justify-between  ">
                                <p className="font-medium text-[16px] text-[#3F3F46] dark:text-white" >Notice a problem with this question?</p>
                                <button onClick={reportHandler} className="text-[14px] text-[#193154] p-3 rounded-[4px] bg-gray-200  font-semibold hover:bg-[#d9d9db] transition-all duration-300">Report</button>
                            </div>
                        }
                        {

                            isAccordionVisible && <DiscussionBoard />
                        }
                        {

                            isAccordionVisible && <Article article={article} id={data?.data[currentIndex]?.conditionName} />
                        }

                    </div>



                    {/* Sidebar Section */}
                    <div className={`hidden lg:block fixed right-0 top-0`}>
                        <div className={` bg-white w-[28%] md:w-[25%] lg:w-[240px] dark:border-[1px] dark:border-[#3A3A48] flex flex-col items-center justify-between  h-screen dark:bg-[#1E1E2A] text-black ${!toggleSidebar ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}>
                            <div className="w-full">

                        
                                <div className="flex items-center justify-between mt-5 ">
                                    <div className="flex items-center">
                                    </div>

                                    <div className="absolute left-1/2 transform -translate-x-1/2">
                                        <Logo />
                                    </div>
 
                                    <div className="flex items-center cursor-pointer" onClick={() => {
                                        setToggleSidebar(!toggleSidebar)
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevrons-left dark:text-white mr-4"><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></svg>
                                    </div>
                                </div>

                            <div className="flex flex-col items-center justify-center mt-10">
                                {isTimerMode["mode"] === "Endless" && (
                                    <div className={`w-[90%] h-[96px] rounded-[8px] bg-[#3CC8A1] ${mcqsAccuracy > 34 ? "bg-[#3CC8A1]" : "bg-[#FF453A]"} text-[#ffff] text-center`}>
                                        <div>
                                            <p className="text-[12px] mt-3">Accuracy</p>
                                            <p className="font-black text-[36px]">{mcqsAccuracy}%</p>
                                        </div>
                                    </div>
                                )}

                                {isTimerMode["mode"] === "Exam" && (
                                    <div className={`w-[90%] h-[96px] rounded-[8px] ${timer <= 60 ? "bg-[#FF453A]" : "bg-[#3CC8A1]"} text-[#ffff] text-center`}>
                                        <div>
                                            <p className="text-[12px] mt-3">Time:</p>
                                            {review === true ? (
                                                <p className="font-black text-[36px]">{'00:00'}</p>
                                            ) : (
                                                <p className="font-black text-[36px]">{formatTime(timer)}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                                        const bgColor = attempted[num] === true
                                            ? "bg-[#3CC8A1]" // Correct answer
                                            : attempted[num] === false
                                                ? "bg-[#FF453A]" // Incorrect answer
                                                : "bg-gray-300"; // Unattempted
                                        if (
                                            selectedFilter === 'All' &&( attemptedQuestions[num] || flaggedQuestions[num] === true || visited[num] === true) ||
                                            (selectedFilter === 'Flagged' && (flaggedQuestions[num] === true)) ||
                                            (selectedFilter === 'Unseen' && visited[num] === true)
                                        ) {
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
                                    className={`${((currentPage + 1) * itemsPerPage) >= data.data.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={((currentPage + 1) * itemsPerPage) < data.data.length ? nextPage : null}
                                    disabled={((currentPage + 1) * itemsPerPage) >= data.data.length}
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
                            </div>
                            <div>
                                <DeepChatAI W='200px' />
                                <hr className='mx-5' />
                            </div>

                            <div className="text-[12px] mb-5">
                                <div
                                    className={`flex items-center font-semibold gap-x-2 ${isFinishEnabled ? "text-[#3CC8A1] cursor-pointer" : "text-[#D4D4D8] cursor-not-allowed"} justify-center`}
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

                                <div className="flex items-center cursor-pointer gap-x-2 text-[#FF453A] font-semibold justify-center whitespace-nowrap" onClick={handleShowPopup}>
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

                        <div className={`absolute right-0 top-0 bg-white w-[28%] md:w-[25%] lg:w-[50px] 3A3A48 dark:border-[1px] dark:border-[#3A3A48] h-screen ${!toggleSidebar && "translate-x-full"} transition-transform duration-300 dark:bg-[#1E1E2A] text-black`}>
                            <div className="flex items-center cursor-pointer dark:bg-[#1E1E2A]" onClick={() => setToggleSidebar(!toggleSidebar)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-right mt-5 ml-3 dark:text-white">
                                    <path d="m6 17 5-5-5-5" />
                                    <path d="m13 17 5-5-5-5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {showPopup && (
                <DashboardModal handleBackToDashboard={handleBackToDashboard} setShowPopup={setShowPopup} />
            )}

            {
                showFeedBackModal && <FeedbackModal showFeedBackModal={showFeedBackModal} setShowFeedBackModal={setShowFeedBackModal} />
            }

            <div
                ref={beakerRef}
                className={`absolute top-0 right-0 transition-all duration-500 ${beakerToggle ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                    }`}
            >
                <ChemistryBeaker beakerToggledHandler={beakerToggledHandler} />
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

                <div className=" bg-white    h-screen ">
                    <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center">
                        </div>

                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <Logo />
                        </div>


                    </div>

                    <div className="flex flex-col  items-center justify-center mt-10">

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
                           {Array.from({ length: end - start }, (_, i) => start + i).map((num, i) => {
                                        const bgColor = attempted[num] === true
                                            ? "bg-[#3CC8A1]" // Correct answer
                                            : attempted[num] === false
                                                ? "bg-[#FF453A]" // Incorrect answer
                                                : "bg-gray-300"; // Unattempted


                                        return (
                                            <div key={i}>
                                                <div
                                                    className={`${bgColor} flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px] cursor-pointer`}
                                                    onClick={() => {
                                                        setCurrentIndex(num); // Navigate to the selected question
                                                    }}
                                                >
                                                    <p>{num + 1}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
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
                        <DeepChatAI W='250px' />
                        <hr className='mx-5' />
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[12px]">
                        {/* Finish and Review Button */}
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

export default QuestionCard;
