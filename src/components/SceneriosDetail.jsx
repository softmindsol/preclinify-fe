import React, { useEffect, useState } from 'react'
import Logo from './common/Logo'
import { useDispatch, useSelector } from 'react-redux';
import { fetchOSCEDataById } from '../redux/features/osce-static/osce-static.service';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from './common/Loader';
import ReactMarkdown from "react-markdown";
import DashboardModal from './common/DashboardModal';

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
    // Function to toggle panels
    const togglePanel = (panel) => {
        setOpenPanel(openPanel === panel ? null : panel);
    };
    const markschemeContent = selectedData["markscheme"]; // Assuming selectedData is the data object
   
    const extractHeadings = (markdown) => {
        const headingRegex = /^(#{1,6})\s(.+)$/gm;  // Match all headings (# to ######)
        const listItemRegex = /^\s*[-*+]\s(.+)$/gm;  // Match list items under headings (bullets: -, *, +)

        const headings = [];
        let matches;
        let currentHeading = null;
        let currentList = [];
        let listMatches;

        // Process each heading in the markdown
        while ((matches = headingRegex.exec(markdown)) !== null) {
            // If there was a previous heading, store it along with its list items if any
            if (currentHeading) {
                // Only add heading with list items if list has content
                if (currentList.length > 0) {
                    headings.push({ heading: currentHeading, listItems: currentList });
                }
                currentList = []; // Reset list items for the new heading
            }
            currentHeading = matches[2]; // Extract heading text

            // Find list items under this heading
            listMatches = [];
            let listMatch;
            while ((listMatch = listItemRegex.exec(markdown.slice(matches.index))) !== null) {
                listMatches.push(listMatch[1]);
            }

            currentList = listMatches;
        }

        // Push the last heading and its list items (if any)
        if (currentHeading && currentList.length > 0) {
            headings.push({ heading: currentHeading, listItems: currentList });
        }

        return headings;
    };

    // Example markdown content
    const markschemeContents = `
# Consultation Structure
- Greets patient and introduces self
- Confirms patient’s name and purpose of visit
- Asks about medical history
- Checks current medications
- Advises on possible side effects
- Schedules follow-up appointment

## Explaining COCP Efficacy & Usage
- Effectiveness >99% if used correctly
- Timing and regimen for pill usage
- How to deal with missed pills
- Special considerations for starting the pill

### Lifestyle & Medical History Considerations
- Checks smoking habits
- Advises on how social smoking might increase cardiovascular risk

### Heading with no list item
`;

    const headings = extractHeadings(markschemeContent);
    console.log(headings);



    function handleShowPopup() {
        setShowPopup(true); // Close the popup
    }
    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        // Check if there's saved timer data in localStorage
        const savedMinutes = localStorage.getItem('minutes');
        const savedSeconds = localStorage.getItem('seconds');
        if (savedMinutes !== null && savedSeconds !== null) {
            setMinutes(parseInt(savedMinutes, 10));
            setSeconds(parseInt(savedSeconds, 10));
        }

        dispatch(fetchOSCEDataById(id));

        // Cleanup localStorage when the component unmounts
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
                    setTimerActive(false); // Stop the timer when it reaches 0
                    navigate('/dashboard'); // Redirect to /dashboard page
                } else {
                    if (seconds === 0) {
                        setMinutes((prev) => prev - 1);
                        setSeconds(59);
                    } else {
                        setSeconds((prev) => prev - 1);
                    }
                }

                // Save the timer state to localStorage
                localStorage.setItem('minutes', minutes);
                localStorage.setItem('seconds', seconds);
            }, 1000); // Update the timer every second
        } else if (!timerActive && minutes === 8 && seconds === 0) {
            setTimerActive(true); // Start the timer when needed
        }

        return () => clearInterval(timerInterval); // Clean up the interval on component unmount
    }, [timerActive, minutes, seconds, navigate]); // Added navigate as dependency

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
                    <hr className=' 2xl:w-[300px]'  />
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
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-[24px] font-bold text-[#2F2F2F]" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-[#3CC8A1] text-[20px] font-semibold" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-[#52525B] text-[18px] font-medium" {...props} />,
                                                    p: ({ node, ...props }) => <p className="text-[#52525B] text-[16px] mb-4" {...props} />,
                                                    li: ({ node, ...props }) => <li className=" list-none pl-5 text-[#52525B] text-[16px]" {...props} />,
                                                    hr: () => <hr className="border-[#E4E4E7] my-4" />
                                                }}
                                            >
                                                {markschemeContent}
                                            </ReactMarkdown>
                                            <div className="border border-[#71717A] rounded-[1px]">
                                               
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr>
                                                            <th className="p-2 border-b border-[#71717A] text-[16px] font-bold">Blood Test Monitoring</th>
                                                            <th className="p-2 border-b border-[#71717A] border-l"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="p-2 text-[16px] border-b border-[#71717A] text-[#52525B]">
                                                                Agranulocytosis/neutropenia risk means weekly blood tests for the first 18 weeks, then every 2 weeks until 1 year, then monthly if stable.
                                                            </td>
                                                            <td className="p-2 border-b text-center border-l border-[#71717A]">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-checkbox h-5 w-5 text-[#3CC8A1] bg-[#3CC8A1] border-[#3CC8A1] checked:bg-[#3CC8A1]"
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="text-[#52525B]  text-[48px] font-bold">3/8</div>
                                            <div className="relative pt-1">
                                                <div className="overflow-hidden h-[50px] text-xs flex rounded-[18px]">
                                                    {/* Completed part */}
                                                    <div
                                                        style={{ width: "37.5%" }}
                                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#3CC8A1]"
                                                    ></div>
                                                    {/* Uncompleted part */}
                                                    <div
                                                        style={{ width: "62.5%" }}  
                                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#E4E4E7]"
                                                    ></div>
                                                </div>
                                            </div>

                                        </div>
                                    ),
                                },
                            ].map((panel) => (
                                <div key={panel.id} className="border-b last:border-b-0 mb-2 bg-white ">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => togglePanel(panel.id)}
                                        className="w-full text-left p-4 bg-white flex justify-between items-center"
                                    >
                                        <span className="font-bold text-[16px] text-[#52525B] ">{panel.title}</span>
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