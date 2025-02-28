import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardModal from "./common/DashboardModal";
import FeedbackModal from "./common/Feedback";
import useVoiceRecorder from "../hooks/useVoiceRecorder";
import useSummaryAndFeedback from "../hooks/useSummaryAndFeedback";
import { insertOSCEBotData } from "../redux/features/osce-bot/osce-bot.service";
import {
  fetchOSCEDataById,
  fetchOSCEPromptById,
} from "../redux/features/osce-static/osce-static.service";
import {
  fetchSubscriptions,
  incrementUsedTokens,
} from "../redux/features/subscription/subscription.service";
import { toast } from "sonner";
import VirtualPatientGuide from "./common/VirtualOsceModal";
import { openModal } from "../redux/features/osce-bot/virtual.modal.slice";

const AINewVersion = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("text");
  const userInfo = useSelector((state) => state?.user?.userInfo);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  // const [transcripts, setTranscript] = useState([]);
  const [isDashboard, setIsDashboard] = useState(false);
  const darkModeRedux = useSelector((state) => state.darkMode.isDarkMode);
  const [minutes, setMinutes] = useState(8);
  const [timerInput, setTimerInput] = useState(8); // Default to 8 minutes
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const { selectedData, loading, error } = useSelector((state) => state.osce);
  const dispatch = useDispatch();
  const [AIPrompt, setAIPrompt] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedBackModal, setShowFeedBackModal] = useState(false);
  const [isPatientOn, setIsPatientOn] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const { subscriptions, plan, loader } = useSelector(
    (state) => state?.subscription,
  );
  const transcriptRef = useRef(null);
  const virtualPatient = useSelector(
    (state) => state?.virtualPatient?.isModalOpen,
  );

  const [finishReview, setFinishReview] = useState(false);
  const {
    isRecording,
    transcript,
    setTranscript,
    audioRef,
    initWebRTC,
    stopRecording,
  } = useVoiceRecorder(AIPrompt);
  const instruction = AIPrompt;
  const { chatFeedback, generateSummaryAndFeedback } =
    useSummaryAndFeedback(transcript);
  console.log(chatFeedback);
  const handleFeedBack = () => {
    setShowFeedBackModal(true);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handlerOpenDashboardModal = () => {
    setIsDashboardModalOpen(!isDashboardModalOpen);
  };
  const handleBackToDashboard = () => {
    if (isDashboardModalOpen) {
      navigate("/dashboard");
    }
  };

  const fetchAIResponse = async (conversationHistory) => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API;

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
            model: "gpt-4o",
            messages: conversationHistory, // Send full chat history including system instruction
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

  const reportHandler = () => {
    setShowFeedBackModal(!showFeedBackModal);
  };

  const handleSendText = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;

    setTranscript((prevTranscript) => [
      ...prevTranscript,
      { fromAI: false, text: inputText }, // User's message
    ]);

    setInputText("");
    setIsLoading(true);

    const conversationHistory = transcript.map((message) => ({
      role: message.fromAI ? "assistant" : "user",
      content: message.text,
    }));

    if (
      conversationHistory.length === 0 ||
      conversationHistory[0].role !== "system"
    ) {
      conversationHistory.unshift({ role: "system", content: instruction });
    }

    conversationHistory.push({ role: "user", content: inputText });

    const aiResponse = await fetchAIResponse(conversationHistory);

    setIsLoading(false);

    setTranscript((prevTranscript) => [
      ...prevTranscript,
      { fromAI: true, text: aiResponse }, // AI's message
    ]);
  };

  const handlerToken = async (e) => {
    e.preventDefault();

    try {
      // // Wait for incrementUsedTokens to complete
      // await dispatch(incrementUsedTokens({ userId: userId })).unwrap();

      // // Now fetch updated subscription data
      // await dispatch(fetchSubscriptions({ userId: userId })).unwrap();

      // Now call handleSendText
      handleSendText(e);
    } catch (error) {
      console.error("Error updating tokens:", error);
    }
  };

  const handleMicClick = async (e) => {
    e.preventDefault();

    try {
      if (subscriptions[0]?.total_tokens === subscriptions[0]?.used_tokens)
        return toast.error("You Have exceeded your limit");
      // First, increment used tokens
      await dispatch(
        incrementUsedTokens({
          userId: userId,
        }),
      ).unwrap();

      // Then, fetch updated subscription data
      if (isRecording) {
        await dispatch(fetchSubscriptions({ userId: userId })).unwrap();
      }

      // Finally, start or stop recording
      isRecording ? stopRecording() : initWebRTC();
    } catch (error) {
      console.error("Error updating tokens:", error);
    }
  };

  const finishReviewHandler = async () => {
    try {
      await dispatch(insertOSCEBotData({ chatFeedback })).unwrap();
      navigate("/chat-history"); // Navigate after successful dispatch
    } catch (error) {
      console.error("Error inserting OSCE Bot Data:", error);
    }
  };

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

    if (timerActive && !virtualPatient) {
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
  }, [timerActive, minutes, seconds, navigate, virtualPatient]);
  useEffect(() => {
    if (transcript.length > 0) {
      generateSummaryAndFeedback();
    }
  }, [transcript]); // Trigger whenever the transcript updates

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);
  useEffect(() => {
    dispatch(fetchOSCEPromptById(id))
      .unwrap()
      .then((res) => {
        setAIPrompt(res);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, [id, dispatch]);
  useEffect(() => {
    dispatch(fetchSubscriptions({ userId }));

    // dispatch(openModal());
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
              <div className="mt-5 text-[#52525B]">
                <p className="text-[16px] font-bold">Current Plan</p>
                {!plan ? (
                  <p className="text-[14px]">Free</p>
                ) : (
                  <p className="text-[14px]">{plan.plan}</p>
                )}
              </div>
            </div>
          </div>
          <div className="w-[90%] text-center text-[14px] font-semibold text-[#52525B]">
            {subscriptions[0]?.total_tokens ===
            subscriptions[0]?.used_tokens ? (
              <div className="space-y-2">
                <p className="text-[#FF453A]">
                  You have exceeded your token limit
                </p>
                <button className="w-[50%] rounded-[8px] border border-[#FF453A] py-1 text-[12px] text-[#FF453A] transition-all duration-150 hover:bg-[#FF453A] hover:text-white">
                  <Link to="/pricing">Buy Tokens</Link>
                </button>
              </div>
            ) : (
              <p>
                {loader ? (
                  <span className="flex items-center justify-center">
                    <div className="loading"></div>
                  </span>
                ) : (
                  <span>
                    {" "}
                    You have{" "}
                    {subscriptions[0]?.total_tokens -
                      subscriptions[0]?.used_tokens}{" "}
                    {subscriptions[0]?.total_tokens -
                      subscriptions[0]?.used_tokens ===
                    1
                      ? "Token"
                      : "Tokens"}{" "}
                    remaining.
                  </span>
                )}
              </p>
            )}
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
                onClick={finishReviewHandler}
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

      <div className="ml-[250px] mt-5">
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-300 pb-2">
          <button
            className={`flex w-full items-center justify-center space-x-4 rounded-tl-[4px] p-2 text-[18px] font-bold ${
              activeTab === "text" ? "bg-[#FAFAFA]" : "bg-[#E4E4E7]"
            } dark:border dark:border-[#3A3A48] dark:bg-[#1E1E2A]`}
            onClick={() => setActiveTab("text")}
          >
            Text
          </button>
          <button
            className={`flex w-full items-center justify-center space-x-4 rounded-tl-[4px] p-2 text-[18px] font-bold ${
              activeTab === "voice" ? "bg-[#FAFAFA]" : "bg-[#E4E4E7]"
            } dark:border dark:border-[#3A3A48] dark:bg-[#1E1E2A]`}
            onClick={() => setActiveTab("voice")}
          >
            Voice
          </button>
        </div>

        {/* Content */}
        <div className={`${darkModeRedux ? "dark" : ""} `}>
          {activeTab === "text" && (
            <div>
              <main className="mb-5 h-[55vh] overflow-hidden rounded-[8px] bg-white p-5 px-4 py-2">
                <div
                  className="transcript h-full overflow-y-auto pr-4"
                  ref={transcriptRef}
                >
                  {transcript.map((entry, index) => (
                    <div
                      key={index}
                      className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}
                    >
                      <div
                        className={`flex items-center ${entry.fromAI ? "justify-start" : "ml-auto flex-row-reverse"}`}
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
                          className={`my-2 ml-2 rounded-[8px] px-5 py-3 ${entry.fromAI ? "bg-[#EDF2F7] text-[#3F3F46]" : "bg-[#3CC8A1] text-white"}`}
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
              <div className="h-[30vh] rounded-[8px] bg-white p-5">
                <div
                  className={`mt-8 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${isPatientOn ? "translate-y-5 opacity-100" : "translate-y-0"}`}
                >
                  <form
                    onSubmit={handleSendText}
                    // onSubmit={handlerToken}
                    className="flex items-center justify-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={handleInputChange}
                      className=" h-[56px] w-[688px] rounded-[8px] border border-[#3F3F46] p-5 transition-all duration-500 placeholder:text-[#A1A1AA]"
                      placeholder="What’s brought you in today? (press spacebar to speak)"
                    />
                    <button className="h-[56px] w-[121px] rounded-[8px] border border-[#FF9741] bg-[#FFE9D6] text-[#FF9741] transition-all duration-150 hover:bg-[#e8924d] hover:text-[#ffff]">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === "voice" && (
            <div className="">
              <main className="z-0 mb-5 h-[55vh] overflow-hidden rounded-[8px] bg-white p-5 px-4 py-2">
                <div
                  className="transcript h-full overflow-y-auto pr-4"
                  ref={transcriptRef}
                >
                  {transcript.map((entry, index) => (
                    <div
                      key={index}
                      className={`message ${entry.fromAI ? "ai-message" : "user-message"}`}
                    >
                      <div
                        className={`mb-2 flex items-center ${entry.fromAI ? "justify-start" : "ml-auto flex-row-reverse"}`}
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
                          className={`ml-2 rounded-[8px] px-5 py-3 ${entry.fromAI ? "bg-[#EDF2F7] text-[#3F3F46]" : "bg-[#3CC8A1] text-white"}`}
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
              <div className="h-[30vh] rounded-[8px] bg-white p-5">
                <div className="flex w-full flex-col items-center justify-center gap-2">
                  <button
                    disabled={
                      subscriptions[0]?.total_tokens ===
                      subscriptions[0]?.used_tokens
                    }
                    onClick={handleMicClick}
                    className={`mt-5 flex h-[98px] w-[98px] transform cursor-pointer items-center justify-center rounded-[24px] transition-all duration-300 ${
                      subscriptions[0]?.total_tokens ===
                      subscriptions[0]?.used_tokens
                        ? "bg-gray-400 disabled:cursor-not-allowed"
                        : "cursor-pointer bg-[#3CC8A1] hover:bg-[#34b38f]"
                    } ${isRecording ? "scale-110 animate-pulse" : "scale-100"}`}
                  >
                    <audio ref={audioRef} className="hidden" />
                    <img
                      src="/assets/mic.svg"
                      width={30}
                      height={30}
                      className={`flex items-center justify-center ${
                        subscriptions[0]?.total_tokens ===
                        subscriptions[0]?.used_tokens
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showFeedBackModal && (
        <FeedbackModal
          showFeedBackModal={showFeedBackModal}
          setShowFeedBackModal={setShowFeedBackModal}
          userId={userId}
          questionStem={""}
          leadQuestion={""}
        />
      )}
      {isDashboardModalOpen && (
        <DashboardModal
          setShowPopup={setIsDashboardModalOpen}
          handleBackToDashboard={handleBackToDashboard}
        />
      )}
      <div className="">{virtualPatient && <VirtualPatientGuide />}</div>
    </div>
  );
};

export default AINewVersion;
