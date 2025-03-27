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
import { TbBaselineDensityMedium } from "react-icons/tb";
import AIBotSidebar from "./common/AIBotSidebar";
import UpgradePlanModal from "./common/UpgradePlan";
import { ClipLoader } from "react-spinners";
import BouncingBall from "./common/BouncingBall";
import { setOSCEBotType } from "../redux/features/osce-bot/osce-type.slice";
import Popup from "./common/SessionClose";
const AINewVersion = () => {
  const { id } = useParams();
  const userInfo = useSelector((state) => state?.user?.userInfo);
  const [showModal, setShowModal] = useState(false);
  const { type } = useSelector((state) => state?.osceType);

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const userId = localStorage.getItem("userId");
  const { subscriptions, plan, loader, completePlanData } = useSelector(
    (state) => state?.subscription,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [sessionClose, setSessionClose] = useState(false);
  const transcriptRef = useRef(null);
  const virtualPatient = useSelector(
    (state) => state?.virtualPatient?.isModalOpen,
  );
  const [showError, setShowError] = useState(false); // Add this error state
  const [finishReview, setFinishReview] = useState(false);
  const {
    isRecording,
    transcript,
    setTranscript,
    audioRef,
    initWebRTC,
    isAISpeaking,
    stopRecording,
    setIsAISpeaking,
    isLoader,
  } = useVoiceRecorder(AIPrompt);
  // console.log("transcript:", transcript);
  console.log("isAISpeaking:", isAISpeaking);

  const instruction = AIPrompt;
  const { chatFeedback, generateSummaryAndFeedback } = useSummaryAndFeedback(
    transcript,
    setIsAISpeaking,
  );
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

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
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
      await dispatch(fetchSubscriptions({ userId: userId })).unwrap();
      initWebRTC();
    } catch (error) {
      console.error("Error updating tokens:", error);
    }
  };

  const stopRecordingHandler = () => {
    try {
      setSessionClose(true);
    } catch (error) {
      console.log("Error while triggering stop recording handler");
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

    if (
      timerActive &&
      !virtualPatient &&
      subscriptions[0]?.total_tokens !== subscriptions[0]?.used_tokens
    ) {
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
  }, []);

  useEffect(() => {
    if (
      subscriptions[0]?.total_tokens <= subscriptions[0]?.used_tokens &&
      type === "ai-bot"
    ) {
      toast.error(" Token limit exceeded for Voice Bot.");
    }
  }, [type]);
  useEffect(() => {
    if (subscriptions[0]?.total_tokens <= subscriptions[0]?.used_tokens) {
      setShowUpgradeModal(true);
    }
  }, [subscriptions]);
  console.log("isRecording:", isRecording);

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
                  className={`w-10 bg-transparent text-[12px] font-bold outline-none ${
                    showError ? "text-red-400" : "text-[#A1A1AA]"
                  }`}
                  value={timerInput} // Use value instead of defaultValue for controlled input
                  min="0"
                  onChange={(e) => {
                    const value = e.target.value;

                    // Convert to number for comparison
                    const numericValue = Number(value);

                    // Check if value exceeds 60
                    if (numericValue > 60) {
                      setShowError(true);
                      setMinutes(60); // Cap the actual timer at 60
                      setTimerInput(60); // Cap the displayed value at 60
                    } else if (numericValue < 0) {
                      setShowError(false);
                      setMinutes(0);
                      setTimerInput(0);
                    } else {
                      setShowError(false);
                      setMinutes(numericValue);
                      setTimerInput(value); // Keep the input value as is (string)
                    }
                  }}
                  onInput={(e) => {
                    // Remove non-numeric characters
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  onKeyDown={(e) => {
                    const currentValue = Number(e.target.value);
                    if (
                      (e.key === "ArrowUp" && currentValue >= 60) ||
                      (e.key === "ArrowDown" && currentValue <= 0)
                    ) {
                      e.preventDefault();
                    }
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              {showError && (
                <p className="mt-1 text-center text-red-400">
                  You cannot set the time above 60 minutes
                </p>
              )}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center">
              <div
                className={`h-[96px] w-[90%] rounded-[8px] text-center text-[#ffff] ${subscriptions[0]?.total_tokens <= subscriptions[0]?.used_tokens && "opacity-30"} ${
                  minutes === 0 && seconds < 60
                    ? "bg-[#FF453A]" // Red when timer is below 1 minute
                    : timerActive
                      ? "bg-[#3CC8A1]"
                      : "bg-[#FF9741]"
                }`}
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
                className={`h-[32px] w-[90%] rounded-[6px] text-[12px] transition-all duration-200 hover:text-white ${subscriptions[0]?.total_tokens <= subscriptions[0]?.used_tokens && "opacity-30"} ${
                  minutes === 0 && seconds < 60
                    ? "border border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000]" // Red when timer < 1 min
                    : timerActive
                      ? "border border-[#3CC8A1] text-[#3CC8A1] hover:bg-[#3CC8A1]"
                      : "border border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741]"
                }`}
              >
                {timerActive ? "Pause Timer" : "Start Timer"}
              </button>

              <div className="mt-5 text-[#52525B]">
                <p className="text-[16px] font-bold">Current Plan</p>
                {!plan ? (
                  <p className="text-[14px]">Free</p>
                ) : (
                  <p className="text-[14px]">{completePlanData.plan}</p>
                )}
              </div>
            </div>
          </div>
          <div className="w-[90%] text-center text-[14px] font-semibold text-[#52525B]">
            {subscriptions[0]?.total_tokens <= subscriptions[0]?.used_tokens ? (
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
                    You have{" "}
                    {Math.max(
                      0,
                      subscriptions[0]?.total_tokens -
                        subscriptions[0]?.used_tokens,
                    )}{" "}
                    {Math.max(
                      0,
                      subscriptions[0]?.total_tokens -
                        subscriptions[0]?.used_tokens,
                    ) === 1
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
                  className={`flex h-5 w-10 items-center ${!isRecording ? "bg-[#28C3A6]" : "bg-[#F4F4F5]"} rounded-full p-1 transition duration-300 ${!isRecording ? "justify-end" : "justify-start"}`}
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
      {/* Sidebar responsive */}
      <div className="flex items-center justify-between bg-white p-5 lg:hidden">
        <div className="">
          <img src="/assets/small-logo.png" alt="" />
        </div>

        <div className="" onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>
      <div className="mt-5 lg:ml-[250px]">
        {/* Content */}
        <div className={`${darkModeRedux ? "dark" : ""} `}>
          {type === "text" && (
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
              <form
                className="h-[30vh] rounded-[8px] bg-white p-5"
                onSubmit={handleSendText}
              >
                <div
                  className={`mt-8 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${isPatientOn ? "translate-y-5 opacity-100" : "translate-y-0"}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative h-[100px] w-[688px]">
                      <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        className="h-full w-full rounded-[8px] border border-[#3F3F46] pb-[4.25rem] pl-4 pt-[0.25rem] transition-all duration-500 placeholder:text-[#A1A1AA]"
                        placeholder="type your message..."
                      />
                      <div className="absolute bottom-2 left-2 flex cursor-pointer items-center pr-2">
                        <span
                          className="mr-2 rounded-full bg-gray-200 p-2"
                          onClick={() => {
                            dispatch(setOSCEBotType({ type: "ai-bot" }));
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-mic"
                          >
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" x2="12" y1="19" y2="22" />
                          </svg>
                        </span>
                        {/* <span className="rounded-full bg-gray-200 p-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-x"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </span> */}
                      </div>

                      <div className="absolute bottom-1.5 right-0 flex items-center pr-2">
                        <button className="rounded-full bg-[#3CC8A1] p-2 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-arrow-up"
                          >
                            <path d="m5 12 7-7 7 7" />
                            <path d="M12 19V5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {type === "ai-bot" && (
            <div className="">
              <main className="bg z-0 mb-5 h-[55vh] overflow-hidden rounded-[8px] p-5 px-4 py-2">
                <div
                  className="transcript h-full overflow-y-auto pr-4"
                  ref={transcriptRef}
                >
                  <BouncingBall
                    isRecording={isRecording}
                    transcript={transcript}
                    isAISpeaking={isAISpeaking}
                    isLoader={isLoader}
                  />
                </div>
              </main>
              <div className="mt-20 h-[30vh] rounded-[8px] p-5">
                <div className="flex h-full items-center justify-center gap-x-20">
                  <button
                    disabled={isAISpeaking}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#d8dbe0] p-4 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (isAISpeaking) {
                        return;
                      } else {
                        dispatch(setOSCEBotType({ type: "text" }));
                      }

                      if (isRecording) {
                        stopRecording();
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-message-square"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <button
                      disabled={
                        subscriptions[0]?.total_tokens <=
                          subscriptions[0]?.used_tokens || isRecording
                      }
                      onClick={handleMicClick}
                      className={`flex h-[65px] w-[65px] transform cursor-pointer items-center justify-center rounded-full transition-all duration-300 ${
                        subscriptions[0]?.total_tokens <=
                        subscriptions[0]?.used_tokens
                          ? "bg-gray-400 disabled:cursor-not-allowed"
                          : "cursor-pointer bg-[#3CC8A1] hover:bg-[#34b38f]"
                      } ${isRecording ? "animate-pulse" : ""} `}
                    >
                      <audio ref={audioRef} className="hidden" />
                      {isLoader ? (
                        <ClipLoader color="#ffff" size={20} />
                      ) : (
                        <img
                          src="/assets/mic.svg"
                          width={16}
                          height={16}
                          className={`flex items-center justify-center ${
                            subscriptions[0]?.total_tokens <=
                            subscriptions[0]?.used_tokens
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          alt=""
                        />
                      )}
                    </button>
                  </div>
                  <button
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#d8dbe0] p-4 disabled:cursor-not-allowed"
                    onClick={stopRecordingHandler}
                    disabled={!isRecording}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-x"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>{" "}
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

      {virtualPatient &&
        subscriptions[0]?.used_tokens < subscriptions[0]?.total_tokens && (
          <VirtualPatientGuide />
        )}

      <AIBotSidebar
        toggleDrawer={toggleDrawer}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setMinutes={setMinutes}
        minutes={minutes}
        seconds={seconds}
        timerActive={timerActive}
        setTimerActive={setTimerActive}
        plan={plan}
        completePlanData={completePlanData}
        subscriptions={subscriptions}
        loader={loader}
        handleFeedBack={handleFeedBack}
        userId={userId}
        showFeedBackModal={showFeedBackModal}
        setShowFeedBackModal={setShowFeedBackModal}
        isPatientOn={isPatientOn}
        isRecording={isRecording}
        finishReviewHandler={finishReviewHandler}
        handlerOpenDashboardModal={handlerOpenDashboardModal}
        FeedbackModal={FeedbackModal}
      />
      {subscriptions[0]?.used_tokens >= subscriptions[0]?.total_tokens && (
        <UpgradePlanModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}

      {sessionClose && (
        <Popup
          sessionClose={sessionClose}
          setSessionClose={setSessionClose}
          stopRecording={stopRecording}
        />
      )}
    </div>
  );
};

export default AINewVersion;
