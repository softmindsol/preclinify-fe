import React, { useEffect, useState } from "react";
import Logo from "./common/Logo";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./common/Loader";
import DashboardModal from "./common/DashboardModal";
import { FaStar } from "react-icons/fa";
import { setLoading } from "../redux/features/loader/loader.slice";
import { fetchOSCEDataById } from "../redux/features/osce-static/osce-static.service";
import FeedbackModal from "./common/Feedback";
import MarkdownRender from "./markdown-render";

const SceneriosDetail = () => {
  const [minutes, setMinutes] = useState(8); // Starting minute
  const [timerInput, setTimerInput] = useState(8); // Default to 8 minutes

  const [seconds, setSeconds] = useState(0); // Starting second
  const [timerActive, setTimerActive] = useState(false); // Timer active state
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { selectedData, loading, error } = useSelector((state) => state.osce);
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const { id } = useParams(); // Extract 'id' from the URL
  const [checkboxState, setCheckboxState] = useState([]);
  const [score, setScore] = useState(0);
  const [showFeedBackModal, setShowFeedBackModal] = useState(false);
  const [showError, setShowError] = useState(false); // Add this error state
  const togglePanel = (panel) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const extractHeadings = (markdown) => {
    const headingRegex = /^(#{1,6})\s(.+)$/gm; // Match all headings (# to ######)
    const listItemRegex = /^\s*[-*+]\s(.+)$/gm; // Match list items under headings (bullets: -, *, +)

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
      while (
        (listMatch = listItemRegex.exec(markdown.slice(matches.index))) !== null
      ) {
        listMatches.push(listMatch[1]);
      }

      currentList = listMatches;
    }

    if (currentHeading && currentList.length > 0) {
      headings.push({ heading: currentHeading, listItems: currentList });
    }

    return headings;
  };

  const headings =
    selectedData && selectedData.markscheme
      ? extractHeadings(selectedData.markscheme)
      : [];

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
    const totalItems = headings.reduce(
      (total, item) => total + item.listItems.length,
      0,
    );
    const completedItems = checkboxState.reduce(
      (total, itemList) => total + (itemList?.filter(Boolean).length || 0),
      0,
    );
    return (completedItems / totalItems) * 100;
  };

  const handleShowPopup = () => {
    setShowPopup(true); // Close the popup
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
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
    dispatch(fetchOSCEDataById(id))
      .unwrap((res) => {})
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  const reportHandler = () => {
    setShowFeedBackModal(!showFeedBackModal);
  };

  return (
    <div className="w-full">
      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-screen w-[240px] bg-white">
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center"></div>

          <div className="absolute left-1/2 -translate-x-1/2 transform">
            <Logo />
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center">
          <div
            className={`h-[96px] w-[90%] rounded-[8px] text-center text-[#ffff] ${
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
              You cannot set the time to more than 60 minutes.
            </p>
          )}
        </div>
        <div className="p-5 text-center">
          <button
            onClick={() => setTimerActive(!timerActive)}
            className={`h-[32px] w-[90%] rounded-[6px] text-[12px] transition-all duration-200 hover:text-white ${
              minutes === 0 && seconds < 60
                ? "border border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000]" // Red when timer < 1 min
                : timerActive
                  ? "border border-[#3CC8A1] text-[#3CC8A1] hover:bg-[#3CC8A1]"
                  : "border border-[#FF9741] text-[#FF9741] hover:bg-[#FF9741]"
            }`}
          >
            {timerActive ? "Pause Timer" : "Start Timer"}
          </button>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          {/* <div
            onClick={() => {
              navigate("/dashboard");
            }}
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
            <p>Finish and Review</p>
          </div> */}
          <hr className="w-[240px]" />
          <div
            onClick={handleShowPopup}
            className="mt-3 flex cursor-pointer items-center justify-center gap-x-2 whitespace-nowrap font-semibold text-[#FF453A] hover:opacity-70"
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
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <p className="text-[12px]">Back to Dashboard</p>
          </div>
        </div>
      </div>
      {/* Content */}

      {loading ? (
        <div className="ml-40 mt-20">
          <Loader />{" "}
        </div>
      ) : (
        <div className="ml-60 flex items-center justify-center">
          <div className="mt-20 w-[991px] rounded-tl-[4px] rounded-tr-[4px]">
            {/* Header */}
            <div className="mb-5 rounded-t-lg bg-[#3CC8A1] p-4 text-white">
              <h1 className="text-[24px] font-bold">
                {selectedData?.category} # {selectedData?.id}
              </h1>

              <div className="mt-2 flex items-center justify-between text-[16px] font-medium">
                <div className="space-x-5">
                  <span>By Rahul Sagu</span>
                  <span>04.10.24</span>
                </div>

                <button
                  onClick={reportHandler}
                  className="rounded border border-white bg-transparent px-2 py-1 text-xs"
                >
                  Report a problem
                </button>
              </div>
            </div>

            {/* Panels */}
            {[
              {
                id: 1,
                title: "Candidate Brief",
                content: selectedData?.candidateBrief,
              },
              {
                id: 2,
                title: "Actor Brief",
                content: selectedData?.actorBrief,
              },
              {
                id: 3,
                title: "Examiner Brief",
                content: selectedData?.examinerBrief,
              },
              {
                id: 4,
                title: "Mark Scheme",
                content: selectedData?.markscheme,
              },
            ].map((panel) => (
              <div
                key={panel.id}
                className="mb-2 border-b bg-white last:border-b-0"
              >
                <button
                  onClick={() => togglePanel(panel.id)}
                  className="flex w-full items-center justify-between bg-white p-4 text-left"
                >
                  <span className="ml-10 text-[16px] font-bold text-[#52525B]">
                    {panel.title}
                  </span>
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

                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    openPanel === panel.id ? "max-h-full" : "max-h-0"
                  }`}
                >
                  <hr />
                  <div className="bg-white p-4">
                    <p className="h-full text-[20px] text-[#52525B] transition-all duration-200">
                      <MarkdownRender>{panel?.content}</MarkdownRender>
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Static Score Panel */}
            <div className="mb-2 border-b bg-white last:border-b-0">
              <button
                onClick={() => togglePanel(5)} // Use a static ID for Score
                className="flex w-full items-center justify-between bg-white p-4 text-left"
              >
                <span className="ml-10 text-[16px] font-bold text-[#52525B]">
                  <p className="-ml-9 flex items-center gap-x-5">
                    <span className="text-[#3CC8A1]">
                      <FaStar className="" />
                    </span>
                    Score
                  </p>
                </span>
                <span>
                  {openPanel === 5 ? (
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

              <div
                className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                  openPanel === 5 ? "max-h-full" : "max-h-0"
                }`}
              >
                <hr />
                <div className="bg-white p-4">
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-[16px] font-semibold text-[#52525B]">
                        Candidate Score
                      </label>
                      <div className="flex h-[36px] w-[312px] items-center rounded-[4px] border border-[#A1A1AA] px-3 py-2 text-[12px]">
                        <svg
                          className=""
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          class="lucide lucide-lock text-[#D4D4D8]"
                        >
                          <rect
                            width="18"
                            height="11"
                            x="3"
                            y="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="ml-auto text-[16px] text-[#A1A1AA]">
                          {score}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Global Score
                      </label>
                      <div className="flex h-[36px] w-[312px] items-center rounded-[4px] border border-[#A1A1AA] px-3 py-2 text-[12px]">
                        <span className="text-[#A1A1AA]">Maximum: 5</span>
                        <span className="ml-auto text-[16px] font-bold text-gray-700">
                          4
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showFeedBackModal && (
        <FeedbackModal
          showFeedBackModal={showFeedBackModal}
          setShowFeedBackModal={setShowFeedBackModal}
          userId={""}
          questionStem={""}
          leadQuestion={""}
        />
      )}
      {showPopup && (
        <DashboardModal
          handleBackToDashboard={handleBackToDashboard}
          setShowPopup={setShowPopup}
        />
      )}
    </div>
  );
};

export default SceneriosDetail;
