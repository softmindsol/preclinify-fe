import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "./common/Confirmation-OSCE";
import supabase from "../config/helper";
import { useDispatch, useSelector } from "react-redux";
import DashboardModal from "./common/DashboardModal";
import FeedbackModal from "./common/Feedback";

// Medical scenarios database
const MEDICAL_SCENARIOS = {
    diabetes: {
        symptoms: ["Increased thirst", "Frequent urination", "Fatigue"],
        patientProfile: "Rohan Sagu, a 45-year-old male, family history of diabetes",
        initialComplaint: "I've been feeling very thirsty and urinating more frequently lately."
    },
    asthma: {
        symptoms: ["Shortness of breath", "Chest tightness", "Wheezing"],
        patientProfile: "Rohan Sagu, a 30-year-old female with pollen allergy",
        initialComplaint: "I've been having trouble breathing and hear a whistling sound in my chest."
    },
    hypertension: {
        symptoms: ["Headaches", "Dizziness", "Nosebleeds"],
        patientProfile: "Rohan Sahu, a 55-year-old male with smoking habit",
        initialComplaint: "I've been getting frequent headaches and sometimes feel lightheaded."
    }
};

const AINewVersion = () => {
    const recognitionRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [voices, setVoices] = useState([]);
    const [summary, setSummary] = useState("");
    const [score, setScore] = useState(0);
    const darkModeRedux = useSelector(state => state.darkMode.isDarkMode);
    const [minutes, setMinutes] = useState(8);
    const [seconds, setSeconds] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const { selectedData, loading, error } = useSelector((state) => state.osce);
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const [loader, setLoader] = useState(false);
    const [openPanel, setOpenPanel] = useState(null);
    const { categoryName } = useParams();
    const [checkboxState, setCheckboxState] = useState([]);
    const [isMicActive, setIsMicActive] = useState(false);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showFeedBackModal, setShowFeedBackModal] = useState(false);
    const [isPatientOn, setIsPatientOn] = useState(false);
    const transcriptContainerRef = useRef(null); // Ref for the transcript container
    const [isAISpeaking, setIsAISpeaking] = useState(false);

    const scenario = MEDICAL_SCENARIOS[categoryName] || {
        symptoms: [categoryName],
        patientProfile: "Rohan Sahu, a standard patient",
        initialComplaint: "Hi Doctor"
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onstart = () => {
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                }
            };

            recognition.onresult = async (event) => {
                const transcriptText = event.results[event.results.length - 1][0].transcript;
                setTranscript((prevTranscript) => [
                    ...prevTranscript,
                    { fromAI: false, text: transcriptText },
                ]);

                setIsLoading(true);
                const aiResponse = await fetchAIResponse(transcriptText);
                setIsLoading(false);
                playAIResponse(aiResponse);
                setTranscript((prevTranscript) => [
                    ...prevTranscript,
                    { fromAI: true, text: aiResponse },
                ]);
            };
        } else {
            console.error("SpeechRecognition API is not supported in this browser.");
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        playAIResponse(scenario.initialComplaint);
        setTranscript([{ fromAI: true, text: scenario.initialComplaint }]);
    }, [categoryName]);

    const fetchAIResponse = async (userText) => {
        const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_OSCE_KEY;
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    audio: { voice: "alloy", format: "wav" },
                    messages: [
                        {
                            role: "system",
                            content: `You are Rohan Sahu, a patient with ${categoryName}. ${scenario.patientProfile}. 
                            Main symptoms: ${scenario.symptoms.join(", ")}. Respond naturally to the doctor's questions.`
                        },
                        { role: "user", content: userText }
                    ],
                }),
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return "Could you please repeat that?";
        }
    };

    const playAIResponse = (text) => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        // Stop any ongoing recognition
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const sentences = text.split('. ');
        let index = 0;

        setIsAISpeaking(true); // Set AI speaking state to true
        setIsRecording(false);

        const speakNext = () => {
            if (index < sentences.length) {
                const utterance = new SpeechSynthesisUtterance(sentences[index]);
                utterance.pitch = 1.2;
                utterance.rate = 1;
                utterance.volume = 1;

                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                utterance.onend = () => {
                    index++;
                    if (index >= sentences.length) {
                        setIsAISpeaking(false); // Reset when done speaking
                    }
                    speakNext();
                };

                window.speechSynthesis.speak(utterance);
            }
        };

        speakNext();
    };
    const handleStartRecording = () => {
        // if (!isPatientOn) return;

        // Get current recognition state
        const recognition = recognitionRef.current;
        if (!recognition) return;

        // Toggle recording state
        if (!isRecording) {
            // Ensure any existing recognition is stopped first
            recognition.stop();
            recognition.abort();
            setIsPatientOn(false)
            // Start fresh recognition
            recognition.start();
            setIsRecording(true);
            setIsMicActive(true);
        } else {
            // Stop ongoing recognition
            recognition.stop();
            setIsRecording(false);
            setIsPatientOn(true)
            setIsMicActive(false);
            setShowModal(true);
        }

        // setTimeout(() => {
        //     setIsMicActive(false);
        // }, 200);
    };

    const handleSendText = async (e) => {
        e.preventDefault();
        if (inputText.trim() === "") return;

        setTranscript((prevTranscript) => [
            ...prevTranscript,
            { fromAI: false, text: inputText },
        ]);

        setInputText("");
        setIsLoading(true);
        const aiResponse = await fetchAIResponse(inputText);
        setIsLoading(false);

        setTranscript((prevTranscript) => [
            ...prevTranscript,
            { fromAI: true, text: aiResponse },
        ]);

        playAIResponse(aiResponse);
    };


    //  useEffect(() => {
    //         const savedMinutes = localStorage.getItem('minutes');
    //         const savedSeconds = localStorage.getItem('seconds');
    //         if (savedMinutes !== null && savedSeconds !== null) {
    //             setMinutes(parseInt(savedMinutes, 10));
    //             setSeconds(parseInt(savedSeconds, 10));
    //         }
    
        
    
    //         return () => {
    //             localStorage.removeItem('minutes');
    //             localStorage.removeItem('seconds');
    //         };
    //     }, []);
    
    //     useEffect(() => {
    //         let timerInterval;
    
    //         if (timerActive) {
    //             timerInterval = setInterval(() => {
    //                 if (seconds === 0 && minutes === 0) {
    //                     clearInterval(timerInterval);
    //                     setTimerActive(false);
    //                     navigate('/dashboard');
    //                 } else {
    //                     if (seconds === 0) {
    //                         setMinutes((prev) => prev - 1);
    //                         setSeconds(59);
    //                     } else {
    //                         setSeconds((prev) => prev - 1);
    //                     }
    //                 }
    
    //                 localStorage.setItem('minutes', minutes);
    //                 localStorage.setItem('seconds', seconds);
    //             }, 1000);
    //         } else if (!timerActive && minutes === 8 && seconds === 0) {
    //             setTimerActive(true);
    //         }
    
    //         return () => clearInterval(timerInterval);
    //     }, [timerActive, minutes, seconds, navigate]);
  

    useEffect(() => {
        if (isAISpeaking && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
            setIsMicActive(false);

            // setIsPatientOn(true);
        }
    }, [isAISpeaking]);

    // Auto-scroll to the bottom of the transcript
    useEffect(() => {
        if (transcriptContainerRef.current) {
            transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
        }
    }, [transcript]);

    console.log("isPatientOn:", isPatientOn);
    

    return (
        <div className='w-full'>
            {/* Sidebar */}
            <div className="fixed hidden lg:block left-0 top-0 bg-white w-[240px] h-screen">
                <div className="h-screen flex flex-col items-center justify-between mt-5">
                    <div className="relative w-full">
                        <div className="flex items-center justify-between mt-5">
                            <div className="absolute left-1/2 transform -translate-x-1/2">
                                <Logo />
                            </div>
                        </div>

                        <div className='text-[#3F3F46] text-[12px] font-semibold px-6 mt-5 '>
                            <p>Set timer</p>
                            <div className='flex items-center justify-between p-2 border border-[#D4D4D8] rounded-[6px] w-[208px] 2xl:w-[99%] h-[32px] mt-2'>
                                <p className='text-[#A1A1AA] text-[12px] font-bold'>Minutes</p>
                                <p className='text-[#A1A1AA] text-[12px] font-bold'>8</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center mt-10">
                            <div className={`w-[90%] h-[96px] rounded-[8px] ${timerActive ? 'bg-[#3CC8A1]' : 'bg-[#FF9741]'} text-[#ffff] text-center`}>
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
                                className={`rounded-[6px] w-[90%] ${timerActive ? 'border border-[#3CC8A1] hover:bg-[#3CC8A1] text-[#3CC8A1]' : 'border border-[#FF9741] hover:bg-[#FF9741] text-[#FF9741]'} h-[32px] hover:text-white transition-all duration-200 text-[12px]`}
                            >
                                {timerActive ? "Pause Timer" : "Start Timer"}
                            </button>
                        </div>
                    </div>

                    <div className="mb-10">
                        <div className="text-center bg-[#F4F4F5] hover:bg-[#e4e4e6] mb-5 text-[16px] p-1 rounded-[6px] text-[#3F3F46]">
                            <button >Report a problem</button>
                        </div>
                        {showFeedBackModal && (
                            <FeedbackModal showFeedBackModal={showFeedBackModal} setShowFeedBackModal={setShowFeedBackModal} />
                        )}

                        <div className="flex items-center border border-[#3CC8A1] px-4 py-2 rounded-[6px]">
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[#28C3A6] font-medium text-[12px]">Patient Voice</span>
                                <button
                                disabled
                                    className={`w-10 h-5 flex items-center ${isPatientOn || !isRecording ? "bg-[#28C3A6]" : "bg-[#F4F4F5]"} rounded-full p-1 transition duration-300 ${isPatientOn || !isRecording ? "justify-end" : "justify-start"}`}
                                    // onClick={() => setIsPatientOn(!isPatientOn)}
                                >
                                    <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                                </button>
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="flex items-center font-semibold gap-x-2 text-[#D4D4D8] justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                                <p className="text-[12px]">Finish and Review</p>
                            </div>
                            <hr className='2xl:w-[200px]' />
                            <div className="flex items-center gap-x-2 mt-3 text-[#FF453A] font-semibold justify-center whitespace-nowrap hover:opacity-70 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                <p className="text-[12px]">Back to Dashboard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${darkModeRedux ? 'dark' : ''}`}>
                <main className="ml-[250px] mt-5 px-4 h-[60vh]  bg-white rounded-[8px] p-5  py-2 relative overflow-hidden ">
                    <div
                        className="transcript  overflow-y-auto pr-4 h-full "
                        ref={transcriptContainerRef}
                    >
                        {transcript.map((entry, index) => (
                            <div
                                key={index}
                                className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}
                            >
                                <div
                                    className={`flex items-center ${entry.fromAI ? "justify-start" : "flex-row-reverse mx-2"
                                        }`}
                                >
                                    {entry.fromAI ? (
                                        <div className="bg-[#F4F4F5] flex items-center justify-center h-[60px] w-[60px] rounded-full">
                                            <img src="/assets/Logo.png" alt="AI Icon" className="" />
                                        </div>
                                    ) : (
                                        <div className="bg-[#3CC8A1] flex items-center justify-center h-[60px] w-[60px] rounded-full ml-2">
                                            <img src="/assets/sethoscope.png" alt="User Icon" className="" />
                                        </div>
                                    )}
                                    <span
                                        className={`${entry.fromAI ? "text-[#3F3F46]" : "text-white"
                                            } ml-2 rounded-[8px] ${entry.fromAI ? "bg-[#EDF2F7]" : "bg-[#3CC8A1]"
                                            } px-5 py-3`}
                                    >
                                        {entry.text}
                                    </span>
                                    {isLoading && entry.fromAI && (
                                        <div className="ml-2">
                                            <span className="animate-pulse">...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <div className="h-[35vh] ml-[250px] bg-white rounded-[8px] p-5 mt-5">
                    <div className="w-full flex flex-col gap-2 items-center justify-center">
                        { (
                            <button
                                onClick={handleStartRecording}
                                className={`bg-[#3CC8A1] mt-5 w-[98px] h-[98px] flex items-center justify-center cursor-pointer rounded-[24px] hover:bg-[#34b38f] transition-all duration-300 transform ${isRecording ? "scale-110 animate-pulse" : "scale-100"}`}
                            >
                                <img
                                    src="/assets/mic.svg"
                                    width={30}
                                    height={30}
                                    className="flex items-center justify-center cursor-pointer"
                                    alt=""
                                />
                            </button>
                        )}

                        <div className={`flex flex-col mt-8 items-center justify-center gap-2 transition-all duration-500 ${isPatientOn ? "translate-y-5 opacity-100" : "translate-y-0"}`}>
                            <form onSubmit={handleSendText} className="flex items-center justify-center gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={handleInputChange}
                                    className="w-[688px] h-[56px] p-5 rounded-[8px] border border-[#3F3F46] placeholder:text-[#A1A1AA] transition-all duration-500"
                                    placeholder="What’s brought you in today? (press spacebar to speak)"
                                />
                                <button
                                    className="text-[#FF9741] border border-[#FF9741] bg-[#FFE9D6] rounded-[8px] w-[121px] h-[56px] transition-all duration-150 hover:bg-[#e8924d] hover:text-[#ffff]"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

             
            </div>
        </div>
    );
};

export default AINewVersion;