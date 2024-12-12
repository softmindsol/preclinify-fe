import React from "react";
import Sidebar from "./Sidebar";

const Scenarios = () => {
    return (
        <div className="flex  min-h-screen">

            <div>
                <Sidebar />
            </div>


            <div className="px-10 mt-8 w-full">


                {/* Tabs */}
                <div className="flex justify-center w-full items-center gap-x-2  ">
                    <div className="flex justify-center  w-full items-center space-x-4 bg-[#ffff] rounded-tl-[4px] rounded-tr-[4px]">
                        <button className="px-4  flex items-center space-x-4   text-[20px]  py-2 text-[#3F3F46] font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notepad-text"><path d="M8 2v4" /><path d="M12 2v4" /><path d="M16 2v4" /><rect width="16" height="18" x="4" y="4" rx="2" /><path d="M8 10h6" /><path d="M8 14h8" /><path d="M8 18h5" /></svg>
                            <span>Static Scenarios</span>

                        </button>

                    </div>
                    <div className="flex justify-center w-full items-center space-x-4 bg-[#E4E4E7] rounded-tl-[4px] rounded-tr-[4px]">
                        <button className=" flex items-center space-x-4 text-[20px] text-[#3F3F46] px-4 py-2 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bed"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>
                            <span>AI Patient Scenarios</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white p-5">


                    {/* Categories */}
                    <div className="flex items-center justify-center ">
                        <div className="grid grid-cols-4 gap-4 mb-6 justify-items-center place-items-center">
                            {[
                                { cat: "Examination", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-stethoscope"><path d="M11 2v2" /><path d="M5 2v2" /><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" /><path d="M8 15a6 6 0 0 0 12 0v-3" /><circle cx="20" cy="10" r="2" /></svg> },
                                { cat: "History", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-clock"><path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="8" cy="16" r="6" /><path d="M9.5 17.5 8 16.25V14" /></svg> },
                                { cat: "Interpretation", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></svg> },
                                { cat: "Counselling", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg> },
                            ].map((category) => (
                                <button
                                    key={category}
                                    className=" h-[56px] w-[242px] text-white bg-[#3CC8A1] py-2 px-4 rounded-[4px] font-bold flex items-center justify-center gap-x-5 hover:bg-transparent transition-all duration-200 hover:text-[#3CC8A1] border border-[#3CC8A1]"                    >
                                    <span>   {category.icon}</span>
                                    <span>{category.cat}</span>


                                </button>
                            ))}
                        </div>
                    </div>



                    <div className=" ">
                        <div className="flex items-center justify-center gap-x-5">
                            {[

                                { cat: "Documentation", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notepad-text"><path d="M8 2v4" /><path d="M12 2v4" /><path d="M16 2v4" /><rect width="16" height="18" x="4" y="4" rx="2" /><path d="M8 10h6" /><path d="M8 14h8" /><path d="M8 18h5" /></svg> },
                                { cat: "Emergency", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ambulance"><path d="M10 10H6" /><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14" /><path d="M8 8v4" /><path d="M9 18h6" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg> },
                                { cat: "Exam Circuits", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3 2 6" /><path d="m22 6-3-3" /><path d="M6.38 18.7 4 21" /><path d="M17.64 18.67 20 21" /></svg> },
                            ].map((category) => (
                                <button
                                    key={category}
                                    className=" h-[56px] w-[242px] text-white bg-[#3CC8A1] py-2 px-4 rounded-[4px] font-bold flex items-center justify-center gap-x-5 hover:bg-transparent transition-all duration-200 hover:text-[#3CC8A1] border border-[#3CC8A1]"               >
                                    <span>   {category.icon}</span>
                                    <span>{category.cat}</span>


                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="flex items-center justify-around mt-10">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="sort" className="text-[#71717A] text-[16px]">
                                Sort By Presentation
                            </label>
                            <div
                                className={`relative inline-flex items-center h-4 w-8  cursor-pointer sm:ml-32 rounded-full transition-colors ${false ? "bg-green-500" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`absolute left-0.5 top-0.5 h-3 w-3 transform rounded-full bg-white shadow-md transition-transform ${false ? "translate-x-5" : "translate-x-0"
                                        }`}
                                ></span>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-x-5 mb-6">
                            <div className="relative ">
                                <input
                                    type="text"
                                    placeholder="Search for specialties, topics and symptoms"
                                    className=" py-2 px-4 text-[14px] text-black bg-[#F4F4F5] w-[347px] h-[45px] placeholder:text-[12px]"
                                />
                                <button className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sliders-horizontal"><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></svg>
                        </div>

                    </div>

                    {/* Filters */}
                    <div className="flex justify-around items-center mb-6 mr-32 my-10">
                        <div className="flex space-x-2">
                            {["Cardiology", "GastroIntestinal", "Child Health"].map((filter) => (
                                <div
                                    key={filter}
                                    className="group text-[#FF9741] border border-[#FF9741] hover:bg-[#FF9741] hover:text-white transition-all duration-200 py-1 px-3 rounded-full text-[16px] font-semibold flex items-center space-x-2"
                                >
                                    <span className="group-hover:text-white transition-colors duration-200">{filter}</span>
                                    <button className="text-[#FF9741] font-bold group-hover:text-white transition-colors duration-200">
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div></div>

                    </div>
                    {/* Cards */}
                    <div className="flex items-center justify-center mt-10 pb-">


                        <div className="grid grid-cols-3 2xl:grid-cols-5 gap-10">
                            {[
                                { specialty: "Cardiology", title: "Chest Pain", id: 1 },
                                { specialty: "Respiratory", title: "Cough", id: 2 },
                                { specialty: "Nephrology", title: "Loin Pain", id: 3 },
                                { specialty: "Oncology", title: "Weight Loss", id: 4 },
                                { specialty: "Psychiatry", title: "Hallucinations", id: 5 },
                                { specialty: "Cardiology", title: "Chest Pain", id: 1 },
                                { specialty: "Respiratory", title: "Cough", id: 2 },
                                { specialty: "Nephrology", title: "Loin Pain", id: 3 },
                                { specialty: "Oncology", title: "Weight Loss", id: 4 },
                                { specialty: "Psychiatry", title: "Hallucinations", id: 5 },
                            ].map((scenario) => (
                                <div
                                    key={scenario.id}
                                    className="p-4 bg-[#F4F4F5] rounded-[8px] w-[172px] shadow-md text-center"
                                >
                                    <div className="text-[20px] text-[#3F3F46] font-bold">
                                        {scenario.specialty}
                                    </div>
                                    <div className="text-[16px] text-[#A1A1AA] font-semibold ">
                                        {scenario.title}
                                    </div>
                                    <div className="text-[48px] text-[#52525B] font-bold">#{scenario.id}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>  </div>
        </div>
    );
};

export default Scenarios;
