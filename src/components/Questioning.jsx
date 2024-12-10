import React from "react";
import Sidebar from "./Sidebar";

const ProgressTable = () => {
    const data = [
        { topic: "Anaesthetics + Intensive Care", correct: 60, incorrect: 20, unanswered: 20 },
        { topic: "Breast", correct: 40, incorrect: 30, unanswered: 30 },
        { topic: "Cardiology", correct: 50, incorrect: 30, unanswered: 20 },
        { topic: "Clinical Chemistry", correct: 70, incorrect: 20, unanswered: 10 },
        { topic: "Dermatology", correct: 50, incorrect: 20, unanswered: 30 },
        { topic: "ENT", correct: 40, incorrect: 30, unanswered: 30 },
        { topic: "Emergency Medicine", correct: 80, incorrect: 10, unanswered: 10 },
    ];

    return (
        <div className=" flex ">
            <div className="">
                <Sidebar />
            </div>
            {/* Table Header */}
            <div className="flex flex-col w-full m-10 space-y-10">


            <div className=" h-[137px] p-4 ">
                {/* Tab Section */}
                <div className="flex items-center justify-between ">
                    <button className="px-4 py-2 text-gray-800 bg-white w-[33%] font-semibold  rounded-[8px]">
                        Pre-clinical
                    </button>
                    <button className="px-4 py-2 text-gray-500 bg-[#E4E4E7] hover:text-gray-800 w-[33%]  rounded-[8px]">
                        Clinical
                    </button>
                    <button className="px-4 py-2 text-gray-500 hover:text-gray-800 w-[33%] bg-[#E4E4E7]  rounded-[8px]">
                        Data Interpretation
                    </button>
                </div>

                {/* Search and Button Section */}
                <div className="flex justify-between items-center h-[100px] bg-white">
                    {/* Search Bar */}
                    <div className="flex items-center p-8 gap-x-10  ">


                    <p className="text-[20px] font-semibold  text-[#52525B]">Pre clinical</p>
                    <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        <input
                            type="text"
                            placeholder="Search for anything"
                            className="ml-2 w-[280px] focus:outline-none"
                        />
                        </div>                    </div>
                    <div className="space-x-5 p-8">
                        {/* Dropdown */}
                        <select className="border border-[#A1A1AA] rounded-md px-3 py-2 text-[#3F3F46] text-[14px] font-medium">
                            <option>SBA</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                        </select>

                        {/* Continue Button */}
                        <button className="bg-[#3CC8A1] text-white font-semibold rounded-md px-6 py-2 hover:bg-transparent hover:text-[#3CC8A1] transition-all border-[1px] border-[#3CC8A1]">
                            Continue &gt;
                        </button>
                    </div>

                </div>
            </div>
            <div className="bg-white flex items-center h-[212px]  p-5 m-4 ">
                <div className="w-[35%] flex items-center justify-between mr-10">
    <p className="font-bold text-[18px] text-[#3F3F46] text-center  w-full">
        Recent Sessions
    </p>
    <div className="h-[212px] w-[1px] bg-red-300 " />
</div>


                <div className="w-[65%] space-y-3">


                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[16px] font-medium text-[#3F3F46]">Geriatrics</p>
                        <p className="text-[14px] font-semibold text-[#D4D4D8]">1 day ago</p>
                    </div>
                    <div>
                        <button className='border-[1px] border-[#FF9741] p-2 text-[#FF9741] font-semibold rounded-[4px]'>Continue &gt;</button>
                    </div>
                    
                </div>
                <div className="flex items-center justify-between ">
                    <div>
                        <p className="text-[16px] font-medium text-[#3F3F46]">Geriatrics</p>
                        <p className="text-[14px] font-semibold text-[#D4D4D8]">1 day ago</p>
                    </div>
                    <div>
                        <button className='border-[1px] border-[#FF9741] p-2 text-[#FF9741] font-semibold rounded-[4px]'>Continue &gt;</button>
                    </div>

                </div>
                </div>
            </div>
            <div className="w-full p-5 ">
                <div className="flex justify-between items-center font-medium text-gray-700 border-b border-gray-200 pb-2 w-full">
                    <div className="text-left">
                        <input type="checkbox" className="mr-2" />
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

                {data.map((row, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-2      items-center py-3 "
                    >
                        <div className="text-left">
                            <input type="checkbox" className="mr-2" />
                            {row.topic}
                        </div>

                        <div className="hidden sm:flex items-center justify-center space-x-1">
                            <div
                                className="h-[27px] bg-[#3CC8A1] rounded-l-md"
                                style={{ width: `${row.correct}%` }}
                            ></div>
                            <div
                                className="h-[27px] bg-[#FF453A]"
                                style={{ width: `${row.incorrect}%` }}
                            ></div>
                            <div
                                className="h-[27px] bg-[#E4E4E7] rounded-r-md"
                                style={{ width: `${row.unanswered}%` }}
                            ></div>
                        </div>


                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default ProgressTable;
