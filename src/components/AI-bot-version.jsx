import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "./common/Confirmation-OSCE";
import supabase from "../config/helper";
import { useDispatch, useSelector } from "react-redux";
import DashboardModal from "./common/DashboardModal";
import FeedbackModal from "./common/Feedback";
import { insertOSCEBotData } from "../redux/features/osce-bot/osce-bot.service";

// Medical scenarios database
// const MEDICAL_SCENARIOS = {
//   diabetes: {
//     symptoms: ["Increased thirst", "Frequent urination", "Fatigue"],
//     patientProfile:
//       "Rohan Sagu, a 45-year-old male, family history of diabetes",
//     initialComplaint:
//       "I've been feeling very thirsty and urinating more frequently lately.",
//   },
//   asthma: {
//     symptoms: ["Shortness of breath", "Chest tightness", "Wheezing"],
//     patientProfile: "Rohan Sagu, a 30-year-old female with pollen allergy",
//     initialComplaint:
//       "I've been having trouble breathing and hear a whistling sound in my chest.",
//   },
//   hypertension: {
//     symptoms: ["Headaches", "Dizziness", "Nosebleeds"],
//     patientProfile: "Rohan Sahu, a 55-year-old male with smoking habit",
//     initialComplaint:
//       "I've been getting frequent headaches and sometimes feel lightheaded.",
//   },
// };

const AINewVersion = () => {
  const audioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const [transcript, setTranscript] = useState([]); // State to hold the conversation
  const recognitionRef = useRef(null);
  const { categoryName } = useParams();

  const userInfo = useSelector((state) => state?.user?.userInfo);
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);

  const [isDashboard, setIsDashboard] = useState(false);
  const darkModeRedux = useSelector((state) => state.darkMode.isDarkMode);
  const [minutes, setMinutes] = useState(8);
  const [timerInput, setTimerInput] = useState(8); // Default to 8 minutes
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const { selectedData, loading, error } = useSelector((state) => state.osce);
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [checkboxState, setCheckboxState] = useState([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedBackModal, setShowFeedBackModal] = useState(false);
  const [isPatientOn, setIsPatientOn] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [summary, setSummary] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  //   const [chatFeedBack, setChatFeedBack] = useState({
  //     feedback: "",
  //     summary: "",
  //     category: categoryName,
  //     score: 0,
  //     user_id: userId,
  //   });

  //   const scenario = MEDICAL_SCENARIOS[categoryName] || {
  //     symptoms: [categoryName],
  //     patientProfile: `${userInfo?.user_metadata?.displayName?.split(" ")[0] || "unknown"}, a standard patient`,
  //     initialComplaint: "Hi Doctor",
  //   };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFeedBack = () => {
    setShowFeedBackModal(true);
  };

  //   const generateSummaryAndFeedback = async () => {
  //     const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_OSCE_KEY;

  //     try {
  //       const response = await fetch(
  //         "https://api.openai.com/v1/chat/completions",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${OPENAI_API_KEY}`,
  //           },
  //           body: JSON.stringify({
  //             model: "gpt-4o-audio-preview",
  //             messages: [
  //               {
  //                 role: "system",
  //                 content: `You are a medical examiner. Analyze the following consultation transcript and return a structured JSON response with the following format:

  //             {
  //               "summary": "Concise summary of the conversation",
  //               "feedback": "Detailed constructive feedback",
  //               "score": 7
  //             }

  //             Follow UK consultation guidelines and focus on:
  //             - Introduction and empathy
  //             - Safety-netting
  //             - Red flag symptoms
  //             - Past medical and surgical history
  //             - Ideas, concerns, and expectations
  //             - Family and social history
  //             - Overall consultation style.

  //             Ensure the response is strictly formatted as JSON without additional text.`,
  //               },
  //               {
  //                 role: "user",
  //                 content: `Transcript:\n${transcript
  //                   .map(
  //                     (entry) =>
  //                       `${entry.fromAI ? "Patient" : "Doctor"}: ${entry.text}`,
  //                   )
  //                   .join("\n")}`,
  //               },
  //             ],
  //           }),
  //         },
  //       );

  //       const data = await response.json();

  //       // Parse the JSON content from OpenAI response
  //       const result = JSON.parse(data.choices[0].message.content);
  //       setChatFeedBack((prevState) => ({
  //         ...prevState,
  //         feedback: result.feedback,
  //         summary: result.summary,
  //         score: result.score,
  //       }));

  //       return result;
  //     } catch (error) {
  //       console.error("Error generating summary and feedback:", error);
  //       return null;
  //     }
  //   };

  //   useEffect(() => {
  //     if (transcript.length > 0) {
  //       generateSummaryAndFeedback();
  //     }
  //   }, [transcript]); // Trigger whenever the transcript updates

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
  //   const handleStartRecording = () => {
  //     // if (!isPatientOn) return;

  //     // Get current recognition state
  //     const recognition = recognitionRef.current;
  //     if (!recognition) return;

  //     // Toggle recording state
  //     if (!isRecording) {
  //       // Ensure any existing recognition is stopped first
  //       recognition.stop();
  //       recognition.abort();
  //       setIsPatientOn(false);
  //       // Start fresh recognition
  //       recognition.start();
  //       setIsRecording(true);
  //       setIsMicActive(true);
  //     } else {
  //       // Stop ongoing recognition
  //       recognition.stop();
  //       setIsRecording(false);
  //       setIsPatientOn(true);
  //       setIsMicActive(false);
  //       setShowModal(true);
  //     }

  //     // setTimeout(() => {
  //     //     setIsMicActive(false);
  //     // }, 200);
  //   };

  const handlerOpenDashboardModal = () => {
    setIsDashboardModalOpen(!isDashboardModalOpen);
  };
  const handleBackToDashboard = () => {
    if (isDashboardModalOpen) {
      navigate("/dashboard");
    }
  };

  //   const finishReviewHandler = () => {
  //     dispatch(insertOSCEBotData({ chatFeedBack }))
  //       .unwrap()
  //       .then(() => {
  //         navigate("/chat-history");
  //       })
  //       .catch(() => {});
  //   };

  // const finishReview = () => {
  //   generateSummaryAndFeedback(); // Generate final summary and feedback
  //   setIsDashboardModalOpen(true); // Open the dashboard modal
  // };
  // //   console.log("chatFeedBack:", chatFeedBack);

  useEffect(() => {
    const savedMinutes = localStorage.getItem("minutes");
    const savedSeconds = localStorage.getItem("seconds");
    if (savedMinutes !== null && savedSeconds !== null) {
      setMinutes(parseInt(savedMinutes, 10));
      setSeconds(parseInt(savedSeconds, 10));
    }

    return () => {
      localStorage.removeItem("minutes");
      localStorage.removeItem("seconds");
    };
  }, []);

  useEffect(() => {
    let timerInterval;

    if (timerActive) {
      timerInterval = setInterval(() => {
        if (seconds === 0 && minutes === 0) {
          clearInterval(timerInterval);
          setTimerActive(false);
          navigate("/dashboard");
        } else {
          if (seconds === 0) {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          } else {
            setSeconds((prev) => prev - 1);
          }
        }

        localStorage.setItem("minutes", minutes);
        localStorage.setItem("seconds", seconds);
      }, 1000);
    } else if (!timerActive && minutes === 8 && seconds === 0) {
      setTimerActive(true);
    }

    return () => clearInterval(timerInterval);
  }, [timerActive, minutes, seconds, navigate]);

  useEffect(() => {
    if (isAISpeaking && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsMicActive(false);

      // setIsPatientOn(true);
    }
  }, [isAISpeaking]);

  //   useEffect(() => {
  //     if (transcriptContainerRef.current) {
  //       transcriptContainerRef.current.scrollTop =
  //         transcriptContainerRef.current.scrollHeight;
  //     }
  //   }, [transcript]);

  useEffect(() => {
    const initWebRTC = async () => {
      const tokenResponse = await fetch(
        `http://localhost:8001/session/${categoryName}`,
      );
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;
      const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";

      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      const audioElement = audioRef.current;
      peerConnection.ontrack = (event) => {
        audioElement.srcObject = event.streams[0];
      };

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      peerConnection.addTrack(localStream.getTracks()[0]);

      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;

      dataChannel.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message && message.transcript) {
          setTranscript((prevTranscript) => [
            ...prevTranscript,
            { fromAI: true, text: message.transcript },
          ]);
        }
      });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      const answer = { type: "answer", sdp: await sdpResponse.text() };
      await peerConnection.setRemoteDescription(answer);
    };

    initWebRTC();

    // Initialize Speech Recognition
    const initSpeechRecognition = () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true; // Continuous listening
        recognition.interimResults = false; // Only final results
        recognition.lang = "en-US"; // Set language (change as needed)

        recognition.onresult = (event) => {
          const transcriptText =
            event.results[event.results.length - 1][0].transcript;
          setTranscript((prevTranscript) => [
            ...prevTranscript,
            { fromAI: false, text: transcriptText },
          ]);
        };

        recognition.start(); // Start listening
      } else {
        console.error(
          "SpeechRecognition API is not supported in this browser.",
        );
      }
    };

    initSpeechRecognition();

    return () => {
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

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
                <input
                  type="number"
                  className="w-10 bg-transparent text-[12px] font-bold text-[#A1A1AA] outline-none"
                  defaultValue="8"
                  onChange={(e) => {
                    setMinutes(e.target.value);
                  }}
                />
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
              <button onClick={handleFeedBack}>Report a problem</button>
            </div>
            {showFeedBackModal && (
              <FeedbackModal
                userId={userId}
                questionStem={""}
                leadQuestion={""}
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
              <div
                // onClick={finishReviewHandler}
                className="mb-4 flex cursor-pointer items-center justify-center gap-x-2 font-semibold text-[#3CC8A1]"
              >
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
                <p className="text-[12px]" onClick={handlerOpenDashboardModal}>
                  Back to Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${darkModeRedux ? "dark" : ""}`}>
        <main className="relative ml-[250px] mt-5 h-[60vh] overflow-hidden rounded-[8px] bg-white p-5 px-4 py-2">
          <div
            className="transcript h-full overflow-y-auto pr-4"
            // ref={transcriptContainerRef}
          >
            {transcript.map((entry, index) => (
              <div
                key={index}
                className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}
              >
                <div
                  className={`mb-2 flex items-center ${
                    entry.fromAI ? "justify-start" : "ml-auto flex-row-reverse"
                  }`}
                >
                  {entry.fromAI ? (
                    <div className="flex size-[60px] flex-shrink-0 items-center justify-center rounded-full bg-[#F4F4F5]">
                      <img
                        src="/assets/Logo.png"
                        alt="AI Icon"
                        className="w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="ml-2 flex size-[60px] flex-shrink-0 items-center justify-center rounded-full bg-[#3CC8A1]">
                      <img
                        src="/assets/sethoscope.png"
                        alt="User Icon"
                        className="w-auto object-contain"
                      />
                    </div>
                  )}
                  <span
                    className={`ml-2 rounded-[8px] px-5 py-3 ${
                      entry.fromAI
                        ? "bg-[#EDF2F7] text-[#3F3F46]"
                        : "bg-[#3CC8A1] text-white"
                    }`}
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

        <div className="ml-[250px] mt-5 h-[35vh] rounded-[8px] bg-white p-5">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            {
              <button
                // onClick={handleStartRecording}
                className={`mt-5 flex h-[98px] w-[98px] transform cursor-pointer items-center justify-center rounded-[24px] bg-[#3CC8A1] transition-all duration-300 hover:bg-[#34b38f] ${isRecording ? "scale-110 animate-pulse" : "scale-100"}`}
              >
                <audio ref={audioRef} autoPlay controls />
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
                // onSubmit={}
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

      {isDashboardModalOpen && (
        <DashboardModal
          setShowPopup={setIsDashboardModalOpen}
          handleBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
};

export default AINewVersion;
