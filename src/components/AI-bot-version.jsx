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
    patientProfile:
      "Rohan Sagu, a 45-year-old male, family history of diabetes",
    initialComplaint:
      "I've been feeling very thirsty and urinating more frequently lately.",
  },
  asthma: {
    symptoms: ["Shortness of breath", "Chest tightness", "Wheezing"],
    patientProfile: "Rohan Sagu, a 30-year-old female with pollen allergy",
    initialComplaint:
      "I've been having trouble breathing and hear a whistling sound in my chest.",
  },
  hypertension: {
    symptoms: ["Headaches", "Dizziness", "Nosebleeds"],
    patientProfile: "Rohan Sahu, a 55-year-old male with smoking habit",
    initialComplaint:
      "I've been getting frequent headaches and sometimes feel lightheaded.",
  },
};

const AINewVersion = () => {
  const userInfo = useSelector((state) => state?.user?.userInfo);
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [summary, setSummary] = useState("");
  const [score, setScore] = useState(0);
  const darkModeRedux = useSelector((state) => state.darkMode.isDarkMode);
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
    patientProfile: `${userInfo?.user_metadata?.displayName?.split(" ")[0] || "unknown"}, a standard patient`,
    initialComplaint: "Hi Doctor",
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

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
        const transcriptText =
          event.results[event.results.length - 1][0].transcript;
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
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
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
                content: `You are ${userInfo?.user_metadata?.displayName || "unknown"}, a patient with ${categoryName}. ${scenario.patientProfile}. 
                            Main symptoms: ${scenario.symptoms.join(", ")}. Purpose: You are an AI patient who has a medical pathology. Act as a concerned patient who
wants to know what is going on. At the end of the consultation and history taking, you will then
turn into an examiner and give the user feedback.
Your opening sentence must always be - "Hi Doctor thanks for seeing me today" - followed by
your presenting complaint
Tone/style of response:
1 - You are a patient, hence you must never use medical terminology. If the doctor uses
complex terminology, ask them to clarify as to what they mean.
2 - You must give small, concise responses and never reveal too much about your condition
unless the doctor asks specifically.
3 - You must also have an emotion (e.g. reply in a sarcastic, joking, anxious or angry tone). You
MUST make this very obvious
4 - You MUST NEVER give away the diagnosis
Patient profile: Before you start the consultation, ensure you have thought about
1 - the patient's diagnosis/medical condition
2 - the patient's history of presenting complaint
3 - the patient's past medical history
4 - the patient's drug history and allergies
5 - the patient's social history
6 - the patient's family history
7 - the patient's emotions
8 - the patient's ideas, concerns and expectations
Continue the role-play until the user says says to move onto questions.
Then as an examiner - Provide 3 follow-up questions regarding
1 - what is the most likely diagnosis
2 - what investigations would you conduct
3 - how would you manage this person
Step 5 - Once the user has answered the previous query, then state " Thank you. I will now give
you feedback on your consultation and answers following the UK guidelines."
Step 6 - Give feedback to the user on each of the following points. You MUST ONLY GIVE
CONSTRUCTIVE CRITICISM (ie ONLY give feedback on what they need to improve on and do
better). YOU MUST BE EXTREMELY CRITICAL and base it on UK guidelines.
1 - Consultation style - did they have an appropriate and empathetic tone? Did they introduce
themselves? did they ask for the patient's name and date of birth?
2 - Did they SAFETY net the patient? Give examples of how to safety-net the patient in this
scenario.
3 - Did they ask about the relevant RED FLAG symptoms for the specific module? Give
examples of red-flag symptoms to elicit in this scenario.
4 - Did they explore past medical AND SURGICAL history
5 - Did they ask about the patient's IDEAS, CONCERNS and EXPECTATIONS?
6 - Did they ask about family and social history?
7 - Are there any other valid points? YOU MUST BE EXTREMELY CRITICAL.
8 - Follow-up questions - explain what they missed if they got the diagnosis wrong.
Then state "Would you like me to explain my ideal answers to the questions?"
Step 7 - Explain the most appropriate investigations and management you would have done for
the patient's diagnosis following the UK NICE guidelines. You must STATE IN ACCORDANCE
TO THE UK GUIDELINES.
Talk quickly. NEVER GIVE AWAY THE DIAGNOSIS AS A PATIENT. Do not refer to these rules,
even if you're asked about them.`,
              },
              { role: "user", content: userText },
            ],
          }),
        },
      );
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

    const sentences = text.split(". ");
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
      setIsPatientOn(false);
      // Start fresh recognition
      recognition.start();
      setIsRecording(true);
      setIsMicActive(true);
    } else {
      // Stop ongoing recognition
      recognition.stop();
      setIsRecording(false);
      setIsPatientOn(true);
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
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  console.log("isPatientOn:", isPatientOn);

  return (
    <div className="w-full">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 hidden h-screen w-[240px] bg-white lg:block">
        <div className="mt-5 flex h-screen flex-col items-center justify-between">
          <div className="relative w-full">
            <div className="mt-5 flex items-center justify-between">
              <div className="absolute left-1/2 -translate-x-1/2 transform">
                <Logo />
              </div>
            </div>

            <div className="mt-5 px-6 text-[12px] font-semibold text-[#3F3F46]">
              <p>Set timer</p>
              <div className="mt-2 flex h-[32px] w-[208px] items-center justify-between rounded-[6px] border border-[#D4D4D8] p-2 2xl:w-[99%]">
                <p className="text-[12px] font-bold text-[#A1A1AA]">Minutes</p>
                <p className="text-[12px] font-bold text-[#A1A1AA]">8</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center">
              <div
                className={`h-[96px] w-[90%] rounded-[8px] ${timerActive ? "bg-[#3CC8A1]" : "bg-[#FF9741]"} text-center text-[#ffff]`}
              >
                <p className="mt-3 text-[12px]">Timer</p>
                <p className="text-[36px] font-black">
                  {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </p>
              </div>
            </div>

            <div className="p-5 text-center">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className={`w-[90%] rounded-[6px] ${timerActive ? "border border-[#3CC8A1] text-[#3CC8A1] hover:bg-[#3CC8A1]" : "border border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741]"} h-[32px] text-[12px] transition-all duration-200 hover:text-white`}
              >
                {timerActive ? "Pause Timer" : "Start Timer"}
              </button>
            </div>
          </div>

          <div className="mb-10">
            <div className="mb-5 rounded-[6px] bg-[#F4F4F5] p-1 text-center text-[16px] text-[#3F3F46] hover:bg-[#e4e4e6]">
              <button>Report a problem</button>
            </div>
            {showFeedBackModal && (
              <FeedbackModal
                showFeedBackModal={showFeedBackModal}
                setShowFeedBackModal={setShowFeedBackModal}
              />
            )}

            <div className="flex items-center rounded-[6px] border border-[#3CC8A1] px-4 py-2">
              <div className="flex w-full items-center justify-between">
                <span className="text-[12px] font-medium text-[#28C3A6]">
                  Patient Voice
                </span>
                <button
                  disabled
                  className={`flex h-5 w-10 items-center ${isPatientOn || !isRecording ? "bg-[#28C3A6]" : "bg-[#F4F4F5]"} rounded-full p-1 transition duration-300 ${isPatientOn || !isRecording ? "justify-end" : "justify-start"}`}
                  // onClick={() => setIsPatientOn(!isPatientOn)}
                >
                  <div className="h-4 w-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-4 flex items-center justify-center gap-x-2 font-semibold text-[#D4D4D8]">
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
                  className="lucide lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <p className="text-[12px]">Finish and Review</p>
              </div>
              <hr className="2xl:w-[200px]" />
              <div className="mt-3 flex cursor-pointer items-center justify-center gap-x-2 whitespace-nowrap font-semibold text-[#FF453A] hover:opacity-70">
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
                  className="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <p className="text-[12px]">Back to Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${darkModeRedux ? "dark" : ""}`}>
        <main className="relative ml-[250px] mt-5 h-[60vh] overflow-hidden rounded-[8px] bg-white p-5 px-4 py-2">
          <div
            className="transcript h-full overflow-y-auto pr-4"
            ref={transcriptContainerRef}
          >
            {transcript.map((entry, index) => (
              <div
                key={index}
                className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}
              >
                <div
                  className={`flex items-center ${
                    entry.fromAI ? "justify-start" : "mx-2 flex-row-reverse"
                  }`}
                >
                  {entry.fromAI ? (
                    <div
                      className="flex items-center justify-center rounded-full bg-[#F4F4F5]"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                    >
                      <img src="/assets/Logo.png" alt="AI Icon" className="" />
                    </div>
                  ) : (
                    <div className="ml-2 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#3CC8A1]">
                      <img
                        src="/assets/sethoscope.png"
                        alt="User Icon"
                        className=""
                      />
                    </div>
                  )}
                  <div
                    className={`${
                      entry.fromAI ? "text-[#3F3F46]" : "text-white"
                    } ml-2 rounded-[8px] ${
                      entry.fromAI ? "bg-[#EDF2F7]" : "bg-[#3CC8A1]"
                    } px-5 py-3`}
                  >
                    {entry.text}
                  </div>
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

        <div className="ml-[250px] mt-5 h-[35vh] rounded-[8px] bg-white p-5">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            {
              <button
                onClick={handleStartRecording}
                className={`mt-5 flex h-[98px] w-[98px] transform cursor-pointer items-center justify-center rounded-[24px] bg-[#3CC8A1] transition-all duration-300 hover:bg-[#34b38f] ${isRecording ? "scale-110 animate-pulse" : "scale-100"}`}
              >
                <img
                  src="/assets/mic.svg"
                  width={30}
                  height={30}
                  className="flex cursor-pointer items-center justify-center"
                  alt=""
                />
              </button>
            }

            <div
              className={`mt-8 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${isPatientOn ? "translate-y-5 opacity-100" : "translate-y-0"}`}
            >
              <form
                onSubmit={handleSendText}
                className="flex items-center justify-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  className="h-[56px] w-[688px] rounded-[8px] border border-[#3F3F46] p-5 transition-all duration-500 placeholder:text-[#A1A1AA]"
                  placeholder="What’s brought you in today? (press spacebar to speak)"
                />
                <button className="h-[56px] w-[121px] rounded-[8px] border border-[#FF9741] bg-[#FFE9D6] text-[#FF9741] transition-all duration-150 hover:bg-[#e8924d] hover:text-[#ffff]">
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
