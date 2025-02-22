import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardModal from "./common/DashboardModal";
import FeedbackModal from "./common/Feedback";
import useVoiceRecorder from "../hooks/useVoiceRecorder";
import useSummaryAndFeedback from "../hooks/useSummaryAndFeedback";

const AINewVersion = () => {
  const { categoryName } = useParams();

  const userInfo = useSelector((state) => state?.user?.userInfo);
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

  const { isRecording, transcript, audioRef, initWebRTC, stopRecording } =
    useVoiceRecorder(categoryName);

  const { chatFeedback } = useSummaryAndFeedback(transcript);

  const handleFeedBack = () => {
    setShowFeedBackModal(true);
  };

  const handlerOpenDashboardModal = () => {
    setIsDashboardModalOpen(!isDashboardModalOpen);
  };
  const handleBackToDashboard = () => {
    if (isDashboardModalOpen) {
      navigate("/dashboard");
    }
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     if (inputText.trim() !== "") {
  //       sendTextMessage(inputText);
  //       setTranscript((prev) => [...prev, { fromAI: false, text: inputText }]);
  //       setInputText(""); // Clear input field
  //     }
  //   };

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
          <div className="transcript h-full overflow-y-auto pr-4">
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
            <button
              onClick={isRecording ? stopRecording : initWebRTC}
              className={`mt-5 flex h-[98px] w-[98px] transform cursor-pointer items-center justify-center rounded-[24px] bg-[#3CC8A1] transition-all duration-300 hover:bg-[#34b38f] ${isRecording ? "scale-110 animate-pulse" : "scale-100"}`}
            >
              <audio ref={audioRef} className="hidden" />
              <img
                src="/assets/mic.svg"
                width={30}
                height={30}
                className="flex cursor-pointer items-center justify-center"
                alt=""
              />
            </button>

            <div
              className={`mt-8 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${isPatientOn ? "translate-y-5 opacity-100" : "translate-y-0"}`}
            >
              <form
                className="flex items-center justify-center gap-2"
                // onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
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
