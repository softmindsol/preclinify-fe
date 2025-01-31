import React, { useEffect, useState } from 'react'
import Logo from './common/Logo'
import { useDispatch, useSelector } from 'react-redux';
import { fetchOSCEDataById } from '../redux/features/osce-static/osce-static.service';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from './common/Loader';
import DashboardModal from './common/DashboardModal';
import { FaStar } from "react-icons/fa";

const SceneriosDetail = () => {
    const [minutes, setMinutes] = useState(8); // Starting minute
    const [seconds, setSeconds] = useState(0); // Starting second
    const [timerActive, setTimerActive] = useState(false); // Timer active state
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { selectedData, loading, error } = useSelector((state) => state.osce);
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);

    const [openPanel, setOpenPanel] = useState(null);
    const { id } = useParams(); // Extract 'id' from the URL
    const [checkboxState, setCheckboxState] = useState([]);
    const [score, setScore] = useState(0);

    const togglePanel = (panel) => {
        setOpenPanel(openPanel === panel ? null : panel);
    };

    console.log("id:",id);
    

    const extractHeadings = (markdown) => {
        const headingRegex = /^(#{1,6})\s(.+)$/gm;  // Match all headings (# to ######)
        const listItemRegex = /^\s*[-*+]\s(.+)$/gm;  // Match list items under headings (bullets: -, *, +)

        const headings = [];
        let matches;
        let currentHeading = null;
        let currentList = [];
        let listMatches;

        while ((matches = headingRegex.exec(markdown)) !== null) {
            if (currentHeading) {
                if (currentList.length > 0) {
                    headings.push({ heading: currentHeading, listItems: currentList });
                }
                currentList = [];
            }
            currentHeading = matches[2];

            listMatches = [];
            let listMatch;
            while ((listMatch = listItemRegex.exec(markdown.slice(matches.index))) !== null) {
                listMatches.push(listMatch[1]);
            }

            currentList = listMatches;
        }

        if (currentHeading && currentList.length > 0) {
            headings.push({ heading: currentHeading, listItems: currentList });
        }

        return headings;
    };

    const headings = selectedData && selectedData.markscheme ? extractHeadings(selectedData.markscheme) : [];

    console.log("selectedData:", selectedData);
    
    // Function to update the checkbox state
    const handleCheckboxChange = (index, itemIndex) => {
        const updatedState = [...checkboxState];
        updatedState[index] = updatedState[index] || [];
        updatedState[index][itemIndex] = !updatedState[index][itemIndex];
        setCheckboxState(updatedState);

        // Update score based on selected checkboxes
        const newScore = updatedState.reduce((score, itemList) => {
            return score + (itemList?.filter(Boolean).length || 0);
        }, 0);
        setScore(newScore);
    };

    // Function to calculate progress
    const calculateProgress = () => {
        const totalItems = headings.reduce((total, item) => total + item.listItems.length, 0);
        const completedItems = checkboxState.reduce((total, itemList) => total + (itemList?.filter(Boolean).length || 0), 0);
        return (completedItems / totalItems) * 100;
    };

    const handleShowPopup = () => {
        setShowPopup(true); // Close the popup
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        const savedMinutes = localStorage.getItem('minutes');
        const savedSeconds = localStorage.getItem('seconds');
        if (savedMinutes !== null && savedSeconds !== null) {
            setMinutes(parseInt(savedMinutes, 10));
            setSeconds(parseInt(savedSeconds, 10));
        }

        dispatch(fetchOSCEDataById(id));

        return () => {
            localStorage.removeItem('minutes');
            localStorage.removeItem('seconds');
        };
    }, [dispatch, id]);

    useEffect(() => {
        let timerInterval;

        if (timerActive) {
            timerInterval = setInterval(() => {
                if (seconds === 0 && minutes === 0) {
                    clearInterval(timerInterval);
                    setTimerActive(false);
                    navigate('/dashboard');
                } else {
                    if (seconds === 0) {
                        setMinutes((prev) => prev - 1);
                        setSeconds(59);
                    } else {
                        setSeconds((prev) => prev - 1);
                    }
                }

                localStorage.setItem('minutes', minutes);
                localStorage.setItem('seconds', seconds);
            }, 1000);
        } else if (!timerActive && minutes === 8 && seconds === 0) {
            setTimerActive(true);
        }

        return () => clearInterval(timerInterval);
    }, [timerActive, minutes, seconds, navigate]);

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


                <div className="flex flex-col items-center justify-center mt-10">
                    <div className="w-[90%] h-[96px] rounded-[8px] bg-[#3CC8A1] text-[#ffff] text-center">
                        <p className="text-[12px] mt-3">Timer</p>
                        <p className="font-black text-[36px]">
                            {minutes < 10 ? `0${minutes}` : minutes}:
                            {seconds < 10 ? `0${seconds}` : seconds}
                        </p>
                    </div>
                </div>

                <div className="p-5 text-center">
                    <button
                        onClick={() => setTimerActive(!timerActive)}
                        className='rounded-[6px] w-[90%] text-[#3CC8A1] border border-[#3CC8A1] h-[32px] hover:bg-[#3CC8A1] hover:text-white transition-all duration-200 text-[12px]'
                    >
                        {timerActive ? "Pause Timer" : "Start Timer"}
                    </button>
                </div>





                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="flex items-center font-semibold gap-x-2 text-[#D4D4D8] justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <p>Finish and Review</p>
                    </div>
                    <hr className=' 2xl:w-[300px]' />
                    <div onClick={handleShowPopup} className="flex items-center gap-x-2 mt-3 text-[#FF453A] font-semibold justify-center  whitespace-nowrap hover:opacity-70 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        <p className="text-[12px] ">Back to Dashboard</p>
                    </div>
                </div>


            </div>
            {/* Content */}

            {
                loading ? <div className='ml-40 mt-20'><Loader /> </div> :

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
                                    content: (
                                        <div className="space-y-4">
                                            <div className="rounded-[1px]">
                                                <table className="w-full text-left">
                                                    <tbody>
                                                        {headings.map((item, index) => (
                                                            <React.Fragment key={index}>
                                                                {item.heading && (
                                                                    <tr className="bg-gray-100">
                                                                        <th colSpan={2} className="p-3 text-[#52525B] font-bold text-[16px] border border-gray-300">
                                                                            {item.heading}
                                                                        </th>
                                                                    </tr>
                                                                )}

                                                                {item.listItems.map((listItem, itemIndex) => (
                                                                    <tr key={itemIndex} className="border border-gray-300">
                                                                        <td className="p-3 text-[#52525B] font-normal">{listItem}</td>
                                                                        <td className="p-3 text-center border-l border-gray-300">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox h-5 w-5 text-[#3CC8A1] border-gray-400"
                                                                                checked={checkboxState[index] && checkboxState[index][itemIndex]}
                                                                                onChange={() => handleCheckboxChange(index, itemIndex)}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                ))}

                                                                {/* Extra Gap Row After Each Section */}
                                                                <tr>
                                                                    <td colSpan={2} className="h-4"></td>
                                                                </tr>
                                                            </React.Fragment>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="text-[#52525B] text-[48px] font-bold">{score}/{headings.reduce((total, item) => total + item.listItems.length, 0)}</div>
                                            <div className="relative pt-1">
                                                <div className="overflow-hidden h-[50px] text-xs flex rounded-[18px]">
                                                    <div
                                                        style={{ width: `${calculateProgress()}%` }}
                                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#3CC8A1]"
                                                    ></div>
                                                    <div
                                                        style={{ width: `${100 - calculateProgress()}%` }}
                                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#E4E4E7]"
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                    ),
                                },
                                {
                                    id: 5,
                                    title: (<p className='flex items-center gap-x-5 -ml-9'> <span className='text-[#3CC8A1]'>
                                        <FaStar className='' /> </span> Score</p>),
                                    content: (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[#52525B] text-[16px] font-semibold mb-2">Candidate Score</label>
                                                <div className="flex items-center text-[12px] border border-[#A1A1AA] w-[312px] h-[36px] px-3 py-2 rounded-[4px]">
                                                    <svg className='' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock text-[#D4D4D8]"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                                    <span className="ml-auto text-[#A1A1AA] text-[16px]">{score}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-2">Global Score</label>
                                                <div className="flex text-[12px] items-center border border-[#A1A1AA] w-[312px] h-[36px] px-3 py-2 rounded-[4px]">
                                                    <span className="text-[#A1A1AA] ">Maximum: 5</span>
                                                    <span className="ml-auto text-gray-700 font-bold text-[16px]">4</span>
                                                </div>
                                            </div>
                                        </div>
                                    ),  
                                }
                            ].map((panel) => (
                                <div key={panel.id} className="border-b last:border-b-0 mb-2 bg-white ">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => togglePanel(panel.id)}
                                        className="w-full text-left p-4 bg-white flex justify-between items-center"
                                    >
                                        <span className="font-bold ml-10 text-[16px] text-[#52525B] ">{panel.title}</span>
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
                                        <hr />
                                        <div className="p-4 bg-white ">
                                            <p className="text-[#52525B] text-[20px] transition-all duration-200 h-full">
                                                {panel.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>}

            {showPopup && (
                <DashboardModal handleBackToDashboard={handleBackToDashboard} setShowPopup={setShowPopup} />
            )}
        </div>
    )
}

export default SceneriosDetail