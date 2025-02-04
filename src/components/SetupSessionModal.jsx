import React, { useEffect, useState, useCallback, useRef } from "react";
import { setLimit } from "../redux/features/limit/limit.slice";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../utils/GlobalApiHandler";
import { Link, useNavigate } from "react-router-dom";
import { changeMode } from "../redux/features/mode/mode.slice";
import { fetchMcqsByModules } from "../redux/features/SBA/sba.service";
import { fetchQuesGenModules } from "../redux/features/question-gen/question-gen.service";
import { fetchMockTest, fetchMockTestById } from "../redux/features/mock-test/mock.service";

const SetupSessionModal = ({ isOpenSetUpSessionModal, setIsOpenSetUpSessionModal }) => {
    const dispatch = useDispatch();
    const type = useSelector((state) => state.mode?.questionMode?.selectedOption);
    const darkModeRedux = useSelector(state => state?.darkMode?.isDarkMode);
    const isLoading = useSelector(state => state?.loading?.[fetchMcqsByModules.typePrefix]);
    const isQuesGenLoading = useSelector(state => state?.loading?.[fetchQuesGenModules.typePrefix]);
    const isMockLoading = useSelector(state => state?.loading?.[fetchMockTestById.typePrefix]);
    const modalRef = useRef(null); // Reference for modal container
    const navigation = useNavigate();
    const [numQuestions, setNumQuestions] = useState();
    const [timer, setTimer] = useState(5);
    const [modeType, setModeType] = useState('Endless');
    const [questionTypes, setQuestionTypes] = useState({
        notAnswered: true,
        incorrect: true,
        correct: true,
    });

    const toggleQuestionType = (type) => {
        setQuestionTypes((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    // Debounced dispatch handler
    const debouncedDispatch = useCallback(
        debounce((value) => {
            dispatch(setLimit(value));
        }, 0), // 0ms delay
        [dispatch]
    );

    // Update state and call debounced handler
    const handleNumQuestionsChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0; // Ensure it's a number
        if (value <= 200) {
            setNumQuestions(value);
            debouncedDispatch(value); // Call debounced function
            dispatch(setLimit(value));
        }
    };

    // Update state and call debounced handler
    const handleTimerChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0; // Ensure it's a number
        if (value <= 200) {
            setTimer(value);
            debouncedDispatch(value); // Call debounced function
        }
    };

    // Close modal when clicking outside
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsOpenSetUpSessionModal(false);
        }
    };

    const handleQuestion = () => {
        if (type === 'SAQ' && !isLoading) {
            navigation('/short-question');
        } else if (type === 'SBA' && !isLoading) {
            navigation("/question-card");
        } else if (type === 'QuesGen' && !isQuesGenLoading) {
            navigation("/question-generator");
        } else if (type === 'Mock' && !isMockLoading) {
            navigation("/mock-test");
        }
    };

    useEffect(() => {
        if (isOpenSetUpSessionModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpenSetUpSessionModal]);

    useEffect(() => {
        dispatch(changeMode({ mode: modeType, timer }));
    }, [modeType, timer, dispatch]);

    return (
        <div className={`flex items-center justify-center bg-white rounded-[4px] ${darkModeRedux ? 'dark' : ''}`}>
            {/* Modal */}
            {isOpenSetUpSessionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto ">
                    <div
                        ref={modalRef} // Attach ref to modal container
                        className="relative bg-white rounded-[4px] p-6 shadow-lg min-h-[670px] w-[451px] dark:bg-[#1E1E2A] text-black dark:border-[1px] dark:border-[#3A3A48]"
                    >
                        <h2 className="text-[20px] text-[#3F3F46] font-bold mb-4 dark:text-white">
                            Set up session
                        </h2>

                        {/* Number of Questions */}
                        <div className="mb-4 mt-8">
                            <label className="block text-[20px] text-[#52525B] font-semibold mb-1 dark:text-white">
                                Number of Questions
                            </label>
                            <div className="relative w-full ">
                                <input
                                    type="text"
                                    value={numQuestions}
                                    onChange={handleNumQuestionsChange}
                                    className="w-full py-[10px] border dark:border-[1px] dark:border-[#3A3A48] rounded placeholder-transparent text-end px-[20px] dark:bg-[#1E1E2A] dark:text-white"
                                />
                                <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#A1A1AA] text-[14px] font-medium pointer-events-none dark:text-white">
                                    Maximum: 200
                                </span>
                            </div>
                        </div>

                        {/* Pick The Module To Save In */}
                        {type === 'QuesGen' && (
                            <div className="mb-4 mt-8">
                                <label className="block text-[20px] text-[#52525B] font-semibold mb-1 dark:text-white">
                                    Pick The Module To Save In
                                </label>
                                <div className="relative w-full ">
                                    <input
                                        type="text"
                                        className="w-full py-[10px] border dark:border-[1px] dark:border-[#3A3A48] rounded placeholder-transparent text-end px-[20px] dark:bg-[#1E1E2A] dark:text-white"
                                    />
                                    <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#A1A1AA] text-[14px] font-medium pointer-events-none dark:text-white">
                                        Start Typing
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Mode Type */}
                        <div className="flex items-center justify-between mt-8 mb-4">
                            <label className="block text-[#52525B] text-[20px] font-semibold mb-1 dark:text-white">
                                Mode Type
                            </label>
                            <div className="relative w-[145px]">
                                <select
                                    value={modeType}
                                    onChange={(e) => setModeType(e.target.value)}
                                    className="w-full h-[42px] px-3 py-2 pr-8 border border-[#A1A1AA] dark:border-[1px] dark:border-[#3A3A48] rounded text-[14px] appearance-none dark:bg-[#1E1E2A] dark:text-white"
                                >
                                    <option value="Endless">Endless</option>
                                    <option value="Exam">Exam</option>
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
                        </div>

                        {modeType === "Exam" && (
                            <div className="relative w-full">
                                <label className="block text-[#A1A1AA] text-[20px] font-semibold mb-1 dark:text-white">
                                    Amount of time
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        value={timer}
                                        onChange={handleTimerChange}
                                        className="w-full px-3 py-2 border dark:border-[1px] dark:border-[#3A3A48] rounded placeholder-transparent text-end dark:bg-[#1E1E2A] dark:text-white"
                                    />
                                    <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#A1A1AA] text-[14px] font-medium pointer-events-none dark:text-white">
                                        In Minutes
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Question Type */}
                        <div className="mb-6 mt-8">
                            <p className="block text-[#52525B] font-medium text-[20px] mb-2 dark:text-white">Question Type</p>
                            {["notAnswered", "incorrect", "correct"].map((type) => (
                                <div className="space-y-20" key={type}>
                                    <div className="flex items-center justify-between mb-10 mt-5">
                                        <label className="text-gray-600 capitalize dark:text-white">
                                            {type === "notAnswered"
                                                ? "Not Answered Questions"
                                                : type === "incorrect"
                                                    ? "Previously Incorrect Questions"
                                                    : "Previously Correct Questions"}
                                        </label>
                                        <input
                                            type="checkbox"
                                            checked={questionTypes[type]}
                                            onChange={() => toggleQuestionType(type)}
                                            className={`mr-2 w-6 h-6 appearance-none border-2 rounded-md 
                    ${type === "notAnswered"
                                                    ? "border-gray-400 checked:bg-gray-300 checked:border-gray-300"
                                                    : type === "incorrect"
                                                        ? "border-red-400 checked:bg-[#EF4444] checked:border-red-500"
                                                        : "border-[#3CC8A1] checked:bg-[#3CC8A1] checked:border-[#3CC8A1]"
                                                }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute left-5 right-5 bottom-3 ">
                            <button
                                onClick={handleQuestion}
                                className={`py-2 ${isLoading || isQuesGenLoading || isMockLoading ? "bg-[#82c7b4]" : "bg-[#3CC8A1]"} ${isLoading || isQuesGenLoading || isMockLoading && 'disabled:cursor-not-allowed'} w-[100%] text-[16px] font-semibold text-white rounded-[8px] hover:bg-[#2e9e7e] dark:text-white`}
                                disabled={isLoading || isQuesGenLoading || isMockLoading}
                            >
                                {
                                    isLoading || isQuesGenLoading || isMockLoading ? 'Loading...' : 'Start Questions'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetupSessionModal;
