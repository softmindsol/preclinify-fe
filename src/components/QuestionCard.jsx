import React from "react";
import Logo from "./Logo";

const QuestionCard = () => {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className=" mx-auto ">


                <div className="w-[70%] ">

                    {/* Header Section */}
                    <div className="bg-[#3CC8A1] text-white p-4 rounded-md flex items-center justify-between">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-white text-lg">&larr;</button>
                            <h2 className="font-semibold text-center">Question 1A</h2>
                            <button className="text-white text-lg">&rarr;</button>
                        </div>
                        <div className="flex space-x-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-conical"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" /><path d="M6.453 15h11.094" /><path d="M8.5 2h7" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></svg>
                        </div>
                    </div>

                    {/* Question Section */}
                    <div className="mt-6 bg-white p-6 rounded-md shadow-md">
                        <p className="text-[#000000]">
                            Eric, a 30-year-old software developer with chronic fatigue syndrome,
                            reports significant improvement in his symptoms after following a
                            self-management strategy focusing on energy management. He credits
                            the approach for helping him balance his activities and manage his
                            energy limits. Eric is now inquiring about how to sustainably
                            integrate physical activity into his routine.
                        </p>

                        <h3 className="mt-4 text-[14px] text-[#3F3F46] font-bold">
                            Which of the following conditions might Eric's job be a risk factor
                            for?
                        </h3>

                        {/* Options Section */}
                        <div className="mt-4 space-y-4">
                            {[
                                "Carpal Tunnel Syndrome",
                                "Rotator Cuff Tear",
                                "Inguinal Hernia",
                                "Acute Glaucoma",
                                "Chronic Glaucoma",
                            ].map((option, index) => (
                                <label
                                    key={index}
                                    className="flex items-center space-x-3  bg-gray-100 p-4 rounded-md cursor-pointer hover:bg-gray-200"
                                >
                                    <input
                                        type="radio"
                                        name="answer"
                                        className="form-radio h-5 w-5 text-green-500"
                                    />
                                    <span className="text-gray-700 flex-1">{option}</span>
                                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md">
                                        {["Q", "W", "E", "R", "T"][index]}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button className="mt-6 w-full bg-[#3CC8A1] text-white px-6 py-2 rounded-md font-semibold hover:bg-transparent hover:text-[#3CC8A1] border border-[#3CC8A1]">
                            Check Answer &darr;
                        </button>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="absolute right-0 top-0 bg-white h-full w-[20%]">
                    <div className="flex items-center justify-center mt-5">

                        <Logo />
                    </div>
                    <div className="flex items-center justify-center mt-5">

                        <div className="w-[208px] h-[96px] rounded-[8px] bg-[#3CC8A1] text-[#ffff] text-center">
                            <p className="text-[12px]">Accuracy</p>
                            <p className="font-black text-[36px]">88.3%</p>
                        </div>
                    </div>

                    <div className="">
                        <div className="flex items-center justify-between p-5 w-full"> 
                            <span className="w-[33%] text-left">All</span>
                            <span className="w-[33%] bg-red-00 text-center">Flagged</span>
                            <span className="w-[33%] bg-red300 text-right">Unseen</span></div>
                    </div>
                   
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
