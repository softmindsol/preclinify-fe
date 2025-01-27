import React, { useEffect, useState } from 'react'
import Logo from './common/Logo'
import { useDispatch, useSelector } from 'react-redux';
import { fetchOSCEData, fetchOSCEDataById } from '../redux/features/osce-static/osce-static.service';
import { useParams } from 'react-router-dom';
import Loader from './common/Loader';

const SceneriosDetail = () => {
    const { selectedData, loading, error } = useSelector((state) => state.osce);
        const dispatch = useDispatch();
    const [openPanel, setOpenPanel] = useState(null);
    const { id } = useParams(); // Extract 'id' from the URL
    // Function to toggle panels
    const togglePanel = (panel) => {
        setOpenPanel(openPanel === panel ? null : panel);
    };
    console.log(id);
    console.log("loading:", loading);
    console.log("selectedData:", selectedData);

    
  useEffect(() => {
      dispatch(fetchOSCEDataById(id));
  }, [dispatch]);
    return (
        <div className='w-full'>
{/* Sidebar */}
            <div className="absolute left-0 top-0 bg-white w-[240px]   h-screen">
                <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center">
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Logo />
                    </div>


                </div>

                <div className='text-[#3F3F46] text-[12px] font-semibold px-6 mt-5 '>
                    <p>Set timer</p>
                    <div className='flex items-center justify-between p-2 border border-[#D4D4D8] rounded-[6px]  w-[208px] 2xl:w-[99%] h-[32px] mt-2'>
                        <p className='text-[#A1A1AA] text-[12px] font-bold'>Minutes</p>
                        <p className='text-[#A1A1AA] text-[12px] font-bold'>8</p>
                    </div>
                </div>


                <div className="flex flex-col  items-center justify-center mt-10">

                    <div className="w-[90%] h-[96px] rounded-[8px] bg-[#3CC8A1] text-[#ffff] text-center">
                        <p className="text-[12px] mt-3">Timer</p>
                        <p className="font-black text-[36px]">7:59</p>
                    </div>
                </div>

                <div className="p-5 text-center ">
                    <button className='rounded-[6px] w-[90%] text-[#3CC8A1] border border-[#3CC8A1]  h-[32px] hover:bg-[#3CC8A1] hover:text-white transition-all duration-200 text-[12px]'>Start Timer</button>
                </div>





                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="flex items-center font-semibold gap-x-2 text-[#D4D4D8] justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <p>Finish and Review</p>
                    </div>
                    <hr className=' 2xl:w-[300px]' />
                    <div className="flex items-center gap-x-2 mt-3 text-[#FF453A] font-semibold justify-center  whitespace-nowrap">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        <p className="">Back to Dashboard</p>
                    </div>
                </div>


            </div>
            {/* Content */}

            {
                loading ? <div className='ml-40 mt-20'><Loader /> </div>:
           
        <div className='flex items-center justify-center  ml-60'>
            <div className="w-[991px] mt-20   rounded-tl-[4px] rounded-tr-[4px] ">
                {/* Header */}
                <div className="bg-[#3CC8A1] text-white p-4 rounded-t-lg mb-5">
                                <h1 className="text-[24px] font-bold">{selectedData?.category} # {selectedData?.id}</h1>

                    <div className="flex justify-between items-center font-medium text-[16px] mt-2">
                        <div className='space-x-5'>
                            <span>By Rahul Sagu</span>
                            <span>04.10.24</span>
                        </div>
                        
                        <button className="bg-transparent px-2 py-1 rounded text-xs border border-white">
                            Report a problem
                        </button>
                    </div>

                </div>

                {/* Panels */}
                            {[
                                {
                                    id: 1,
                                    title: "Candidate Brief",
                                    content: selectedData["candidateBrief"],
                                },
                                {
                                    id: 2,
                                    title: "Actor Brief",
                                    content: selectedData["actorBrief"],
                                },
                                {
                                    id: 3,
                                    title: "Examiner Brief",
                                    content: selectedData["examinerBrief"],
                                },
                                {
                                    id: 4,
                                    title: "Mark Scheme",
                                    content: selectedData["markscheme"],
                                },
                            ].map((panel) => (
                                <div key={panel.id} className="border-b last:border-b-0 mb-2">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => togglePanel(panel.id)}
                                        className="w-full text-left p-4 bg-white flex justify-between items-center"
                                    >
                                        <span className="font-bold text-[16px] text-[#52525B]">{panel.title}</span>
                                        <span>
                                            {openPanel === panel.id ? (
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
                                        </span>
                                    </button>

                                    {/* Accordion Content with Smooth Transition */}
                                    <div
                                        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${openPanel === panel.id ? "max-h-full" : "max-h-0"
                                            }`}
                                    >
                                        <div className="p-4 bg-gray-50">
                                            <p className="text-[#52525B] text-[20px] transition-all duration-200">
                                                {panel.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}


                {/* Score */}
                {/* <div className="p-4  text-center">
                    <button className="bg-teal-500 text-white px-4 py-2 rounded">
                        Score
                    </button>
                </div> */}
            </div>
                    </div>}
        </div>
    )
}

export default SceneriosDetail