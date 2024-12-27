import React, { useEffect, useState, useCallback, useRef } from "react";
import { setQuestionLimit } from "../redux/features/limit/limit.slice";
import { useDispatch } from "react-redux";
import { debounce } from "../utils/GlobalApiHandler";
import { Link } from "react-router-dom";
import { changeMode } from "../redux/features/mode/mode.slice";

const SetupSessionModal = ({ isOpenSetUpSessionModal, setIsOpenSetUpSessionModal }) => {
    const dispatch = useDispatch();
    const modalRef = useRef(null); // Reference for modal container

    const [numQuestions, setNumQuestions] = useState();
    const [timer,setTimer]=useState(5)
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
            dispatch(setQuestionLimit(value));
        }, 1000), // 1000ms delay
        [dispatch]
    );

    // Update state and call debounced handler
    const handleNumQuestionsChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0; // Ensure it's a number
        if (value <= 200) {
            setNumQuestions(value);
            debouncedDispatch(value); // Call debounced function
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
        <div className="flex items-center justify-center bg-white rounded-[4px]">
            {/* Modal */}
            {isOpenSetUpSessionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div
                        ref={modalRef} // Attach ref to modal container
                        className="relative bg-white rounded-[4px] p-6 shadow-lg h-[646px] w-[451px]"
                    >
                        <h2 className="text-[20px] text-[#3F3F46] font-bold mb-4">
                            Set up session
                        </h2>

                        {/* Number of Questions */}
                        <div className="mb-4 mt-8">
                            <label className="block text-[20px] text-[#52525B] font-semibold mb-1">
                                Number of Questions
                            </label>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={numQuestions}
                                    onChange={handleNumQuestionsChange}
                                
                                    className="w-full px-3 py-2 border rounded placeholder-transparent text-end"
                                />
                                <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#A1A1AA] text-[14px] font-medium pointer-events-none">
                                    Maximum: 200
                                </span>
                            </div>
                        </div>

                        {/* Mode Type */}
                        <div className="flex items-center justify-between mt-8 mb-4">
                            <label className="block text-[#52525B] text-[20px] font-semibold mb-1">
                                Mode Type
                            </label>
                            <div className="relative w-[145px]">
                                <select
                                    value={modeType}
                                    onChange={(e) => setModeType(e.target.value)}
                                    className="w-full h-[42px] px-3 py-2 pr-8 border border-[#A1A1AA] rounded text-[14px] appearance-none"
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


                        {
                            modeType === "Exam" && <div className="relative w-full">
                                <label className="block text-[#A1A1AA]  text-[20px] font-semibold mb-1">
                                Amount of time
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        value={timer}
                                        onChange={handleTimerChange}

                                        className="w-full px-3 py-2 border rounded placeholder-transparent text-end"
                                    />
                                    <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#A1A1AA] text-[14px] font-medium pointer-events-none">
                                       In  Minutes
                                    </span>
                                </div>
                            </div>
                        }

                        {/* Question Type */}
                        <div className="mb-6 mt-8">
                            <p className="block text-[#52525B] font-semibold text-[20px] mb-2">Question Type</p>
                            {["notAnswered", "incorrect", "correct"].map((type) => (
                                <div className="space-y-20" key={type}>
                                    <div className="flex items-center justify-between mb-10 mt-5">
                                        <label className="text-gray-600 capitalize">
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
                                            className="mr-2 w-6 h-6 appearance-none border-2 border-gray-400 rounded-md checked:bg-teal-500 checked:border-teal-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <Link to="/question-card">
                        <div className="absolute left-5 right-5 bottom-5">
                            <button
                                className="py-2 bg-[#3CC8A1] w-[100%] text-[16px] font-semibold text-white rounded-[8px] hover:bg-[#2e9e7e]"
                            >
                                Start Questions
                            </button>
                        </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetupSessionModal;
