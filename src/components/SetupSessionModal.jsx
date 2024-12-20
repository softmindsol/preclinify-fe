import React, { useState } from "react";

const SetupSessionModal = ({ isOpenSetUpSessionModal, setIsOpenSetUpSessionModal }) => {
    const [numQuestions, setNumQuestions] = useState(20);
    const [modeType, setModeType] = useState("Endless");
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

    return (
        <div className="flex items-center justify-center  bg-white rounded-[4px]">
           

            {/* Modal */}
            {isOpenSetUpSessionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center">
                    <div className="relative bg-white rounded-[4px] p-6 shadow-lg h-[646px] w-[451px]">
                        <h2 className="text-[20px] text-[#3F3F46] font-bold  mb-4">
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
                                    onChange={(e) => setNumQuestions(e.target.value)}
                                    max={200}
                                    className="w-full px-3 py-2 border rounded placeholder-transparent text-end"
                                />
                                <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#A1A1AA] text-[14px] font-medium pointer-events-none">
                                    Maximum: 200
                                </span>
                            </div>
                        </div>


                        {/* Mode Type */}
                        <div className=" flex items-center justify-between mt-8 mb-4">
                            <label className="block text-[#52525B] text-[20px] font-semibold mb-1">
                                Mode Type
                            </label>
                            <select
                                value={modeType}
                                onChange={(e) => setModeType(e.target.value)}
                                className="w-[145px] h-[42px] px-3 py-2 border border-[#A1A1AA] rounded text-[14px]"
                            >
                                <option value="Endless">Endless</option>
                                <option value="Fixed">Fixed</option>
                            </select>
                        </div>

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
                        <div className="absolute left-5 right-5 bottom-5    ">
                            <button
                                onClick={() => alert("Session Started!")}
                                className="py-2 bg-[#3CC8A1] w-[100%] text-[16px] font-semibold text-white rounded-[8px] hover:bg-[#2e9e7e]"
                            >
                                Start Questions
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default SetupSessionModal;
