import React, { useCallback, useEffect, useState } from "react";
import Logo from "./Logo";
import DiscussionBoard from "./Discussion";
import { TbBaselineDensityMedium } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'
import { setLoading } from "../redux/features/loader/loader.slice";
import { fetchMcqsByCategory, fetchMcqsQuestion } from "../redux/features/mcqQuestions/mcqQuestion.service";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "./Accordion";

const QuestionCard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAccordionVisible, setIsAccordionVisible] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [attempts, setAttempts] = useState([]); // Array to track question status: null = unseen, true = correct, false = incorrect
    const [accuracy, setAccuracy] = useState(0); // Calculated accuracy    const data = useSelector((state) => state.mcqsQuestion || []);
    const dispatch = useDispatch();
    const [correctCount, setCorrectCount] = useState(0); // State for correct answers
    const [incorrectCount, setIncorrectCount] = useState(0); // State for incorrect answers
    const [unseenCount, setUnseenCount] = useState(0); // State for unseen questions
    const [border, setBorder] = useState(true);
        const {limit} = useSelector((state) => state.limit);
    console.log("limit:", limit);
    const data = useSelector((state) => state.mcqsQuestion || []);
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

    console.log("data:", data.data)

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        setIsAnswered(true);
    };

    const handleCheckAnswer = () => {
        if (selectedAnswer) {
            setIsButtonClicked(true);
            setIsAccordionVisible(true);
            setBorder(false)

            const isCorrect =
                selectedAnswer === data.data[currentIndex].explanationList[data.data[currentIndex].correctAnswerId];

            // Update attempts
            setAttempts((prev) => {
                const updatedAttempts = [...prev];
                updatedAttempts[currentIndex] = isCorrect; // Mark as correct/incorrect
                return updatedAttempts;
            });

            // Expand accordion for the correct answer
            setIsAccordionOpen((prev) => {
                const newAccordionState = [...prev];
                newAccordionState[data?.data[currentIndex]?.correctAnswerId] = true;
                return newAccordionState;
            });
        }
    };
    // Function to navigate to the next question
    const nextQuestion = () => {
        if (currentIndex < data?.data.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(false)
            setIsAnswered(false)
            setIsAccordionVisible(false)

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

    useEffect(() => {
        if (data?.data?.length) {
            setIsAccordionOpen(Array(data.data.length).fill(false));
            setAttempts(Array(data.data.length).fill(null)); // Initialize attempts as unseen
        }
    }, [data]);

    useEffect(() => {
        const correct = attempts.filter((attempt) => attempt === true).length;
        const totalAttempted = attempts.filter((attempt) => attempt !== null).length;
        setAccuracy(totalAttempted > 0 ? ((correct / totalAttempted) * 100).toFixed(1) : 0);
    }, [attempts]);


    // console.log("correctCount:", correctCount, "incorrectCount:", incorrectCount, "unseenCount:", unseenCount)
    return (
        <div className=" min-h-screen " >
            <div className='flex items-center justify-between p-5 bg-white md:hidden w-full'>
                <div className=''>
                    <img src="/assets/small-logo.png" alt="" />
                </div>

                <div className='' onClick={toggleDrawer}>
                    <TbBaselineDensityMedium />
                </div>
            </div>
            <div className=" mx-auto flex items-center justify-center p-6">


                <div className="max-w-full w-[100%] md:w-[70%] xl:w-[55%] 2xl:w-[40%]  md:mr-[200px]">

                    {/* Header Section */}
                    <div className="bg-[#3CC8A1] text-white p-6 rounded-md flex items-center justify-between relative">
                        <div className="absolute left-4" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-ellipsis lg:w-6 lg:h-6  w-4 h-4 "
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                            </svg>

                        </div>

                        <div className="flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2 text-[14px] lg:text-[18px]">
                            <button className="text-white " onClick={prevQuestion}>&larr;</button>
                            <h2 className="font-semibold text-center">Question {currentIndex + 1}A</h2>
                            <button className="text-white " onClick={nextQuestion}>&rarr;</button>
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
                    {/* Question start */}
                    {data?.data.length > 0 && (
                        <div className="mt-6 p-6">
                            <p className="text-[#000000] text-[14px] text-justify lg:text-[16px]">
                                {data.data[currentIndex].questionStem}
                            </p>

                            <h3 className="mt-4 text-[12px] lg:text-[14px] text-[#3F3F46] font-bold">
                                {data.data[currentIndex].leadQuestion}
                            </h3>

                            {/* Options Section */}
                            <div className="mt-4 space-y-4 " >
                                {data.data[currentIndex].explanationList.map((explanation, index) => {
                                    const isSelected = selectedAnswer === explanation;
                                    const isCorrectAnswer = index === data.data[currentIndex].correctAnswerId;

                                    // Determine the border color based on whether the button has been clicked
                                    const borderColor = isButtonClicked
                                        ? isCorrectAnswer
                                            ? "border-[#22C55E]"
                                            : "border-[#EF4444]"
                                        : "";
                                    const bgColor = isButtonClicked
                                        ? isCorrectAnswer
                                            ? "bg-[#DCFCE7]"
                                            : "bg-[#FEE2E2]"
                                        : "";


                                    return (
                                        <div>
                                            {!isAccordionVisible ? (
                                                <label
                                                    key={index}
                                                    className={`flex bg-white items-center space-x-3 p-4 rounded-md cursor-pointer hover:bg-gray-200 text-[14px] lg:text-[16px] border-2 ${ 'border-[#F4F4F5]'}`}
                                                    onClick={() => handleAnswerSelect(explanation, index)}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="answer"
                                                        className="form-radio h-5 w-5 text-green-500"
                                                        checked={isSelected}
                                                        readOnly
                                                    />
                                                    <span className="text-gray-700 flex-1">{explanation.split(" -")[0]}</span>
                                                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md">
                                                        {["A", "B", "C", "D", "E"][index]}
                                                    </span>
                                                </label>
                                            ) : (
                                                <div

                                                    className={`border-[1px] ${borderColor}    ${bgColor} rounded-[6px] `}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent propagation
                                                        toggleAccordion(index)
                                                    }}
                                                >
                                                    <label
                                                        key={index}
                                                        className={`flex items-center space-x-3 p-4 rounded-md cursor-pointer  text-[14px] lg:text-[16px]`}
                                                        onClick={() => handleAnswerSelect(explanation, index)}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="answer"
                                                            className="form-radio h-5 w-5 text-green-500"
                                                            checked={isSelected}
                                                            readOnly
                                                        />
                                                        <span className="text-gray-700 flex-1">{explanation.split(" -")[0]}</span>
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
                                                                {explanation}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            )}





                                        </div>

                                    );
                                })}
                            </div>

                            {/* Submit Button */}
                            {
                                isAccordionVisible ? <button
                                    className="mt-6 text-[14px] lg:text-[16px] w-full bg-[#3CC8A1] text-white px-6 py-2 rounded-md font-semibold hover:bg-transparent hover:text-[#3CC8A1] border border-[#3CC8A1]"
                                    onClick={nextQuestion}
                                >
                                    Next Question &darr;
                                </button> : <button
                                    className="mt-6 text-[14px] lg:text-[16px] w-full bg-[#3CC8A1] text-white px-6 py-2 rounded-md font-semibold hover:bg-transparent hover:text-[#3CC8A1] border border-[#3CC8A1]"
                                    onClick={handleCheckAnswer}
                                >
                                    Check Answer &darr;
                                </button>
                            }

                        </div>
                    )}

                </div>

                {/* Sidebar Section */}

                <div className="hidden md:block">


                    <div className="absolute right-0 top-0 bg-white w-[28%] md:w-[25%] lg:w-[20%]   h-screen ">
                        <div className="flex items-center justify-between mt-5">
                            <div className="flex items-center">
                            </div>

                            <div className="absolute left-1/2 transform -translate-x-1/2">
                                <Logo />
                            </div>

                            <div className="flex items-center mr-5">
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
                                    className="lucide lucide-chevrons-right"
                                >
                                    <path d="m6 17 5-5-5-5" />
                                    <path d="m13 17 5-5-5-5" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center mt-10">
                            <div className="w-[90%] h-[96px] rounded-[8px] bg-[#3CC8A1] text-[#ffff] text-center">
                                <p className="text-[12px] mt-3">Accuracy</p>
                                <p className="font-black text-[36px]">{accuracy}%</p>
                            </div>
                        </div>

                        <div className="">
                            <div className="flex items-center justify-between p-5 w-full text-[12px] xl:text-[16px]">
                                <span className="w-[33%] text-left hover:text-[#3CC8A1] cursor-pointer ">All</span>
                                <span className="w-[33%] bg-red-00 text-center hover:text-[#3CC8A1] cursor-pointer">Flagged</span>
                                <span className="w-[33%] bg-red300 text-right hover:text-[#3CC8A1] cursor-pointer">Unseen</span>
                                </div>
                        </div>

                        <div className="flex justify-center items-center">
                            <div className="grid grid-cols-5 gap-2">
                                {data.data.map((question, index) => {
                                    // Determine background color based on the question's status
                                    const bgColor =
                                        attempts[index] === true
                                            ? "bg-[#3CC8A1]" // Correct: Green
                                            : attempts[index] === false
                                                ? "bg-[#FF453A]" // Incorrect: Red
                                                : "bg-gray-300"; // Unseen: Gray

                                    return (
                                        <div
                                            key={index}
                                            className={`${bgColor} flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]`}
                                            onClick={() => markQuestion(index, true)} // Example: Mark as correct on click
                                        >
                                            <p>{index + 1}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-x-28 mt-3 text-[#71717A]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-left"><path d="M6 8L2 12L6 16" /><path d="M2 12H22" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right"><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg>
                        </div>
                        <div className="py-5 px-10 text-[#D4D4D8]">
                            <hr />
                        </div>

                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[12px]">
                            <div className="flex items-center font-semibold gap-x-2 text-[#D4D4D8] justify-center ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                                <p>Finish and Review</p>
                            </div>
                            <hr className="w-[200px] my-2" />
                            <div className="flex items-center gap-x-2 text-[#FF453A] font-semibold justify-center  whitespace-nowrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                <p className="">Back to Dashboard</p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>


            {/* <DiscussionBoard /> */}


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

                        {/* <div className="flex items-center mr-5">
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
                                className="lucide lucide-chevrons-right"
                            >
                                <path d="m6 17 5-5-5-5" />
                                <path d="m13 17 5-5-5-5" />
                            </svg>
                        </div> */}
                    </div>

                    <div className="flex flex-col  items-center justify-center mt-10">

                        <div className="w-[90%] 2xl:w-[308px] h-[96px] rounded-[8px] bg-[#3CC8A1] text-[#ffff] text-center">
                            <p className="text-[12px] mt-3">Accuracy</p>
                            <p className="font-black text-[36px]">88.3%</p>
                        </div>
                    </div>

                    <div className="">
                        <div className="flex items-center justify-between p-5 w-full text-[12px] xl:text-[16px]">
                            <span className="w-[33%] text-left hover:text-[#3CC8A1] cursor-pointer ">All</span>
                            <span className="w-[33%] bg-red-00 text-center hover:text-[#3CC8A1] cursor-pointer">Flagged</span>
                            <span className="w-[33%] bg-red300 text-right hover:text-[#3CC8A1] cursor-pointer">Unseen</span></div>
                    </div>

                    <div className="flex justify-center items-center ">
                        <div className="grid grid-cols-5 gap-2">
                            <div className="bg-[#3CC8A1] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#FF453A] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#3CC8A1] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#FF9741] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#3CC8A1] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#3CC8A1] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#FF453A] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#3CC8A1] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#FF9741] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#3CC8A1] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#3CC8A1] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#FF453A] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#3CC8A1] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#FF9741] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>
                            <div className="bg-[#3CC8A1] flex items-center justify-center text-[14px] font-bold text-white w-[26px] h-[26px] rounded-[2px]">
                                <p>1A</p>
                            </div>

                        </div>

                    </div>
                    <div className="flex items-center justify-center gap-x-28 mt-3 text-[#71717A]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-left"><path d="M6 8L2 12L6 16" /><path d="M2 12H22" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right"><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg>
                    </div>
                    <div className="py-5 px-10 text-[#D4D4D8]">
                        <hr />
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[12px]">
                        <div className="flex items-center font-semibold gap-x-2 text-[#D4D4D8] justify-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <p>Finish and Review</p>
                        </div>
                        <hr className="w-[200px] my-2" />
                        <div className="flex items-center gap-x-2 text-[#FF453A] font-semibold justify-center  whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            <p className="">Back to Dashboard</p>
                        </div>
                    </div>


                </div>
            </Drawer>
        </div>
    );
};

export default QuestionCard;
