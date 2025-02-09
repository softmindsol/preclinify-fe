import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "./common/Confirmation-OSCE";
import supabase from "../config/helper";
import { useDispatch, useSelector } from "react-redux";
import DashboardModal from "./common/DashboardModal";
import FeedbackModal from "./common/Feedback";

const AINewVersion = () => {
    const recognitionRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [voices, setVoices] = useState([]);
    const [summary, setSummary] = useState(""); // State for summary
    const [score, setScore] = useState(0); // State for score
    const darkModeRedux = useSelector(state => state.darkMode.isDarkMode);
    const [minutes, setMinutes] = useState(8); // Starting minute
    const [seconds, setSeconds] = useState(0); // Starting second
    const [timerActive, setTimerActive] = useState(false); // Timer active state
    const { selectedData, loading, error } = useSelector((state) => state.osce);
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const [loader, setLoader] = useState(false);
    const [openPanel, setOpenPanel] = useState(null);
    const { id } = useParams(); // Extract 'id' from the URL
    const [checkboxState, setCheckboxState] = useState([]);
    const [isMicActive, setIsMicActive] = useState(false); // New state for mic button effect
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
    const [showFeedBackModal, setShowFeedBackModal]=useState(false)
    const togglePanel = (panel) => {
        setOpenPanel(openPanel === panel ? null : panel);
    };

    // Define categories and their associated keywords
    const categories = {
        "Acute and Emergency": ["emergency", "acute", "urgent"],
        "Cancer": ["cancer", "tumor", "malignancy"],
        "Cardiovascular": ["heart", "cardiac", "blood pressure"],
        "Child Health": ["child", "pediatric", "infant"],
        "Clinical Haematology": ["blood", "haematology", "anemia"],
        "Clinical Imaging": ["imaging", "x-ray", "MRI", "CT"],
        "Dermatology": ["skin", "rash", "dermatitis"],
        "Ear, Nose and Throat": ["ear", "nose", "throat", "ENT"],
        "Endocrine and Metabolic": ["hormone", "thyroid", "diabetes"],
        "Gastrointestinal including Liver": ["stomach", "liver", "gastro"],
        "General Practice and Primary Healthcare": ["general", "primary care"],
        "Medicine of Older Adult Mental Health": ["elderly", "mental health"],
        "Musculoskeletal": ["joint", "muscle", "bone"],
        "Neurosciences": ["neurology", "nervous", "brain"],
        "Obstetrics and Gynaecology": ["pregnancy", "gynecology"],
        "Ophthalmology": ["eye", "vision", "sight"],
        "Palliative and End of Life Care": ["palliative", "end of life"],
        "Perioperative Medicine and Anaesthesia": ["surgery", "anesthesia"],
        "Renal and Urology": ["kidney", "urinary", "urology"],
        "Respiratory": ["lung", "breathing", "respiratory"],
        "Sexual Health": ["sexual", "STD", "contraception"],
        "Surgery": ["surgery", "operation"],
        "Allergy and Immunology": ["allergy", "immune"],
        "Biomedical Sciences": ["biomedical", "science"],
        "Clinical Biochemistry": ["biochemistry", "metabolism"],
        "Clinical Pharmacology and Therapeutics": ["medication", "pharmacology"],
        "Genetics and Genomics": ["genetics", "DNA"],
        "Histopathology": ["histopathology", "tissue"],
        "Human Factors and Quality Improvement": ["quality", "improvement"],
        "Laboratory Haematology": ["laboratory", "haematology"],
        "Medical Ethics and Law": ["ethics", "law"],
        "Microbiology": ["microbiology", "bacteria"],
        "Psychological Principles": ["psychology", "mental"],
        "Social and Population Health": ["social", "population"]
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

                setIsLoading(true); // Set loading to true while fetching AI response
                const aiResponse = await fetchAIResponse(transcriptText);
                setIsLoading(false); // Set loading to false after receiving the response
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
        const initializeAI = async () => {
            const initialPrompt = "Hi Doctor!";
            playAIResponse(initialPrompt);
            setTranscript([{ fromAI: true, text: initialPrompt }]);
        };

        initializeAI();
    }, []);

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
                    messages: [
                        { role: "user", content: `As a patient, I am experiencing: ${userText}` },
                        { role: "system", content: "You are a patient describing your symptoms to a doctor." },
                    ],
                }),
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return "Sorry, I couldn't process your request.";
        }
    };

    const playAIResponse = (text) => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const sentences = text.split('. ');
        let index = 0;

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
                    speakNext();
                };

                window.speechSynthesis.speak(utterance);
            }
        };

        speakNext();
    };

    const inferCategory = (transcriptArray) => {
        const transcriptText = transcriptArray.map(entry => entry.text).join(' ').toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => transcriptText.includes(keyword))) {
                return category;
            }
        }
        return "General"; // Default category if none matched
    };

    const generateFeedbackAndScore = (transcriptArray) => {
        const totalEntries = transcriptArray.length;
        let feedback = "";
        let score = 0;

        if (totalEntries < 5) {
            feedback = "The conversation was quite brief. Consider asking more detailed questions.";
            score = 3; // Low score for brief conversation
        } else if (totalEntries < 10) {
            feedback = "Good job! You covered several important points.";
            score = 7; // Moderate score for decent conversation
        } else {
            feedback = "Excellent! You had a comprehensive discussion.";
            score = 10; // High score for comprehensive conversation
        }

        return { feedback, score };
    };

    const insertTranscriptToSupabase = async (transcriptArray) => {
        const formattedTranscript = transcriptArray
            .map(entry => `${entry.fromAI ? 'AI (Patient): ' : 'You (Doctor): '}${entry.text}`)
            .join(' ');

        const inferredCategory = inferCategory(transcriptArray); // Infer category based on transcript
        const { feedback, score } = generateFeedbackAndScore(transcriptArray); // Generate feedback and score

        const { data, error } = await supabase
            .from("AI_OSCE")
            .insert([
                {
                    transcript: formattedTranscript,
                    category: inferredCategory, // Use inferred category
                    summary: feedback, // Set feedback as summary
                    score: score, // Set score
                    created_at: new Date(),
                }
            ]);

        if (error) {
            console.error("Error inserting transcript:", error.message);
        } else {
            console.log("Transcript inserted successfully:", data);
            navigate("/chat-history");
        }
    };

    const resetToStartRecording = () => {
        setIsRecording(false);
        if (recognitionRef.current) recognitionRef.current.stop();
    };

    const handleStartRecording = () => {
        setIsRecording((prev) => !prev);
        setIsMicActive(true); // Set mic active when clicked

        if (!isRecording && recognitionRef.current) {
            recognitionRef.current.start();
        } else if (isRecording) {
            setShowModal(true);
        }

        // Reset mic active state after a short delay
        setTimeout(() => {
            setIsMicActive(false);
        }, 200); // Adjust the duration as needed
    };

    const handleConfirmEndConversation = () => {
        setShowModal(false);
        insertTranscriptToSupabase(transcript);
    };

    const handleCancelEndConversation = () => {
        setShowModal(false);
    };

    const handleShowPopup = () => {
        setShowPopup(true); // Close the popup
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleSendText = async () => {
        if (inputText.trim() === "") return;

        // Add user's input to the transcript
        setTranscript((prevTranscript) => [
            ...prevTranscript,
            { fromAI: false, text: inputText },
        ]);

        setIsLoading(true); // Set loading to true while fetching AI response
        // Fetch AI response
        const aiResponse = await fetchAIResponse(inputText);
        setIsLoading(false); // Set loading to false after receiving the response

        // Add AI's response to the transcript
        setTranscript((prevTranscript) => [
            ...prevTranscript,
            { fromAI: true, text: aiResponse },
        ]);

        // Play AI's response
        playAIResponse(aiResponse);

        // Clear the input field
        setInputText("");
    };

    useEffect(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);
                if (availableVoices.length > 0) {
                    setSelectedVoice(availableVoices[0]);
                }
            };
        }
    }, []);
    const reportHandler = () => {
        setShowFeedBackModal(!showFeedBackModal)
    }
    return (
        <div className='w-full'>
            {/* Sidebar */}
            <div className="absolute left-0 top-0 bg-white w-[240px] h-screen">
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

                   

                    <div className="text-center bg-[#F4F4F5] hover:bg-[#e4e4e6] mb-5 text-[16px] p-1 rounded-[6px] text-[#3F3F46]">
                        <button onClick={reportHandler}>Report a problem</button>
                    </div>
                    <div className="flex items-center font-semibold gap-x-2 text-[#D4D4D8] justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <p>Finish and Review</p>
                    </div>
                    <hr className=' 2xl:w-[200px]' />
                    <div onClick={handleShowPopup} className="flex items-center gap-x-2 mt-3 text-[#FF453A] font-semibold justify-center whitespace-nowrap hover:opacity-70 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        <p className="text-[12px] ">Back to Dashboard</p>
                    </div>
                </div>
            </div>

            <div className={` ${darkModeRedux ? 'dark' : ''}`}>
                <main className="ml-[250px] mt-5 px-4 min-h-[540px] bg-white rounded-[8px] p-5">
                    <div className="transcript">
                        {transcript.map((entry, index) => (
                            <div key={index} className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}>
                                <div className={`flex items-center ${entry.fromAI ? "justify-start " : "flex-row-reverse mx-2"}`}>
                                    {entry.fromAI ? (
                                        <div className="bg-[#F4F4F5] flex items-center justify-center h-[60px] w-[60px] rounded-full ">
                                            <img src="/assets/AI-logo.svg" alt="AI Icon" className=" flex items-center justify-center h-[40px] w-[40px]" />
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="bg-[#3CC8A1] flex items-center justify-center h-[60px] w-[60px] rounded-full ml-2">
                                                <img src="/assets/sethoscope.svg" alt="User  Icon" className="flex items-center justify-center h-[30px] w-[30px]" />
                                            </div>
                                        </div>
                                    )}
                                    <span className={`${entry.fromAI ? "text-[#3F3F46]" : "text-white"} ml-2 rounded-[8px] ${entry.fromAI ? "bg-[#EDF2F7]" : "bg-[#3CC8A1]"} px-5 py-3`}>
                                        {entry.text}
                                    </span>
                                    {isLoading && entry.fromAI && (
                                        <div className="ml-2">
                                            <span className="animate-pulse">...</span> {/* Loading indicator */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                <div className="h-[260px] ml-[250px] bg-white rounded-[8px] p-5 mt-5">
                    <div className="w-full flex flex-col gap-2 items-center justify-center">
                        <button
                            onClick={handleStartRecording}
                            className={`bg-[#3CC8A1] w-[98px] h-[98px] flex items-center justify-center cursor-pointer rounded-[24px] hover:bg-[#34b38f] transition-all duration-150 ${isRecording ? 'recording' : ''}`}
                        >
                            <img src="/assets/mic.svg" width={30} height={30} className="flex items-center justify-center cursor-pointer" alt="" />
                        </button>

                        <div>
                            <input
                                type="text"
                                value={inputText}
                                onChange={handleInputChange}
                                className="w-[688px] h-[56px] mr-2 rounded-[8px] border border-[#3F3F46] placeholder:text-[#A1A1AA] placeholder:p-5"
                                placeholder="What’s brought you in today? (press spacebar to speak)"
                            />
                            <button
                                onClick={handleSendText}
                                className="text-[#FF9741] border border-[#FF9741] bg-[#FFE9D6] rounded-[8px] w-[121px] h-[56px] transition-all duration-150 hover:bg-[#e8924d] hover:text-[#ffff]"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
                {showModal && (
                    <ConfirmationModal
                        onConfirm={handleConfirmEndConversation}
                        onCancel={handleCancelEndConversation}
                    />
                )}

                <style jsx>{`
                    .transcript {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                        margin-top: 16px;
                    }
                    .message {
                        display: flex;
                        align-items: center;
                    }
                    .ai-message {
                        justify-content: flex-start;
                        padding: 20px;
                        border-radius: 5px;
                        color: white;
                        width: 80%;
                    }
                    .user-message {
                        justify-content: flex-end;
                        color: black;
                        padding: 10px;
                        display: flex;
                        border-radius: 5px;
                    }
                    .active {
                        transform: scale(0.9);
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                    }
                    .recording {
                        background-color: #FF4D4D; /* Change to a red color when recording */
                        border: 2px solid #FF0000; /* Add a red border */
                    }
                `}</style>
            </div>

{
                showFeedBackModal && (<FeedbackModal showFeedBackModal={showFeedBackModal} setShowFeedBackModal={setShowFeedBackModal}/>)
}
            {showPopup && (
                <DashboardModal handleBackToDashboard={handleBackToDashboard} setShowPopup={setShowPopup} />
            )}
        </div>
    );
}

export default AINewVersion;