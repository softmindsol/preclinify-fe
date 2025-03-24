import React, { useEffect, useRef, useState } from "react";
import Logo from "./common/Logo";
import DiscussionBoard from "./Discussion";
import { TbBaselineDensityMedium } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import Drawer from "react-modern-drawer";
//import styles 👇
import "react-modern-drawer/dist/index.css";

import { useDispatch, useSelector } from "react-redux";
import { clearResult, setResult } from "../redux/features/result/result.slice";
import { useNavigate } from "react-router-dom";
import { setRemoveQuestionLimit } from "../redux/features/limit/limit.slice";
import { fetchConditionNameById } from "../redux/features/SBA/sba.service";
import DeepChatAI from "./DeepChat";
import { setMcqsAccuracy } from "../redux/features/accuracy/accuracy.slice";
import { sessionCompleted } from "../redux/features/recent-session/recent-session.slice";
import ChemistryBeaker from "./chemistry-beaker";
import DashboardModal from "./common/DashboardModal";
import Article from "./Article";
import { setAttemptedData } from "../redux/features/SBA/sba.slice";
import {
  setActive,
  setAttempted,
} from "../redux/features/attempts/attempts.slice";
import FeedbackModal from "./common/Feedback";
import {
  initializeFlags,
  toggleFlag,
} from "../redux/features/flagged/flagged.slice";
import {
  initializeVisited,
  markVisited,
} from "../redux/features/flagged/visited.slice";
import QuestionNavigator from "./QuestionNavigator";
import { insertResult } from "../redux/features/all-results/result.sba.service";
import Chatbot from "./chatbot";
import Loader from "./common/Loader";
import { fetchSubscriptions } from "../redux/features/subscription/subscription.service";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
};

// Function to calculate total time based on number of questions
const calculateTimeForQuestions = (numQuestions) => {
  const timePerQuestionInSeconds = 60; // 1 minute per question
  const totalTimeInSeconds = numQuestions * timePerQuestionInSeconds; // Calculate total time
  return totalTimeInSeconds; // Return total time in seconds
};
const QuestionCard = () => {
  const darkModeRedux = useSelector((state) => state?.darkMode?.isDarkMode);
  const dispatch = useDispatch();
  const attempted = useSelector((state) => state?.attempts?.attempts);
  const [isOpen, setIsOpen] = useState(false);
  const [attempts, setAttempts] = useState(attempted); // Array to track question status: null = unseen, true = correct, false = incorrect
  const [isAccordionVisible, setIsAccordionVisible] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedBackModal, setShowFeedBackModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const beakerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinishEnabled, setIsFinishEnabled] = useState(false);
  const navigation = useNavigate();
  const [border, setBorder] = useState(true);
  const mcqsAccuracy = useSelector((state) => state?.accuracy?.accuracy);
  const [showPopup, setShowPopup] = useState(false);
  const { subscriptions, plan, loader, planType } = useSelector(
    (state) => state?.subscription,
  );
  const data = useSelector((state) => state?.quesGen?.moduleMCQs);

  const result = useSelector((state) => state.result);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReviewEnabled, setIsReviewEnabled] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const itemsPerPage = 10;
  const [article, setArticle] = useState({});
  const userId = localStorage.getItem("userId");
  const isQuestionReview = useSelector((state) => state?.questionReview?.value);
  const [feedback, setFeedback] = useState("");
  const [isAIExpanded, setIsAIExpanded] = useState(false);

  // Get the items to show for the current page
  const currentItems = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State to toggle submenu visibility
  const isTimerMode = useSelector((state) => state.mode);
  const [timer, setTimer] = useState(() => {
    // Calculate the initial timer value based on the number of questions
    const initialTime = calculateTimeForQuestions(isTimerMode.time);
    const savedTime = localStorage.getItem("examTimer");
    return savedTime ? parseInt(savedTime, 10) : initialTime; // Use saved time if available
  });

  const flaggedQuestions = useSelector(
    (state) => state?.flagged?.flaggedQuestions,
  );
  const visited = useSelector((state) => state?.visited?.visitedQuestions);
  const review = useSelector((state) => state?.questionReview?.value);
  const [accuracy, setAccuracy] = useState(mcqsAccuracy); // Calculated accuracy
  const [beakerToggle, setBeakerToggle] = useState(false);
  const menuRef = useRef(null);
  const active = useSelector((state) => state?.attempts?.active);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  // Arrays to store indices
  const unseenIndices = [];
  const flaggedIndices = [];
  const allIndices = [];

  // Update getQuestionRange to use currentPage correctly
  const getQuestionRange = (currentPage) => {
    const start = currentPage * itemsPerPage;
    const end = Math.min(start + itemsPerPage, data?.length);
    return { start, end };
  };

  // Use currentPage to determine the start and end indices
  const { start, end } = getQuestionRange(currentPage);
  // Filtered items to display based on the selected filter
  const filteredItems = data?.slice(start, end).filter((question, index) => {
    const displayNumber = start + index;

    // All items
    allIndices.push(displayNumber);

    if (selectedFilter === "All") {
      return true; // Include all items
    }

    if (selectedFilter === "Flagged") {
      // Check if item is flagged (attempted)
      const isFlagged =
        attempted[displayNumber] === true || attempted[displayNumber] === false;
      if (isFlagged) {
        flaggedIndices.push(displayNumber); // Store index for flagged items
        return true;
      }
    }

    if (selectedFilter === "Unseen") {
      // Check if item is unseen (unattempted)
      const isUnseen = attempted[displayNumber] === null;
      if (isUnseen) {
        unseenIndices.push(displayNumber); // Store index for unseen items
        return true;
      }
    }

    return false; // Hide items that don't match the filter
  });

  const toggleAccordion = (index) => {
    setIsAccordionOpen((prev) => {
      if (Array.isArray(prev)) {
        const newAccordionState = [...prev]; // Create a copy to avoid mutation
        newAccordionState[index] = !newAccordionState[index]; // Toggle the state at the given index
        return newAccordionState; // Return the updated array
      } else {
        // If prev is not an array, initialize it with a new array based on data length
        return new Array(data?.length).fill(false);
      }
    });
  };

  const beakerToggledHandler = () => {
    setBeakerToggle(!beakerToggle);
  };

  function handleToggleSidebar() {
    setToggleSidebar(true);
  }

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);
  };

  const handleCheckAnswer = () => {
    dispatch(setActive(false));

    if (selectedAnswer) {
      setIsButtonClicked(true);
      setIsAccordionVisible(true);
      setBorder(false);

      const correctAnswer =
        data[currentIndex].answersArray[data[currentIndex].correctAnswerId];
      const isCorrect = selectedAnswer === correctAnswer;

      setAttempts((prev) => {
        const updatedAttempts = [...prev];
        updatedAttempts[currentIndex] = isCorrect;
        dispatch(setAttempted(updatedAttempts));
        if (data[currentIndex]?.conditionName !== null) {
          dispatch(
            fetchConditionNameById({
              id: data[currentIndex]?.conditionName,
            }),
          )
            .unwrap()
            .then((res) => {
              setArticle(res);
            });
        }
        if (subscriptions[0].plan !== null) {
          dispatch(
            insertResult({
              isCorrect,
              questionId: data[currentIndex].id,
              userId,
              moduleId: data[currentIndex].moduleId,
            }),
          );
        }

        dispatch(setResult({ updatedAttempts }));
        return updatedAttempts;
      });

      // Open the correct answer's accordion and selected if incorrect
      setIsAccordionOpen((prev) => {
        const newAccordionState = [...prev].fill(false); // Close all first
        const selectedIndex =
          data[currentIndex].answersArray.indexOf(selectedAnswer);
        const correctIndex = data[currentIndex].correctAnswerId;

        newAccordionState[correctIndex] = true; // Always open correct answer
        if (!isCorrect) {
          newAccordionState[selectedIndex] = true; // Open selected if incorrect
        }
        return newAccordionState;
      });

      let value = false;
      dispatch(markVisited({ currentIndex, value }));
    }
  };

  // Modified flag handler
  const handleFlagQuestion = () => {
    dispatch(toggleFlag(currentIndex));
  };

  const nextQuestion = () => {
    if (currentIndex < data.length - 1) {
      // Mark the current question as unseen if skipped
      if (attempted[currentIndex] === null) {
        setAttempts((prev) => {
          const updatedAttempts = [...prev];
          updatedAttempts[currentIndex] = null; // Mark as unseen
          return updatedAttempts;
        });
      }
      if (attempted[currentIndex + 1] !== null) {
        setIsAnswered(true);
        setIsAccordionVisible(true);
      } else {
        setIsAnswered(false);
        setIsAccordionVisible(false);
      }
      setIsButtonClicked(false);

      if (isQuestionReview) {
        // setIsAnswered(true);
        // setIsAccordionVisible(true);
        if (data[currentIndex]?.conditionName !== null) {
          dispatch(
            fetchConditionNameById({
              id: data[currentIndex]?.conditionName,
            }),
          )
            .unwrap()
            .then((res) => {
              setArticle(res);
            });
        }
      }

      let value = true;
      if (isAnswered === false) {
        dispatch(markVisited({ currentIndex, value }));
      }
      setCurrentIndex((prev) => prev + 1);
    }
  };
  const getAttemptedQuestions = () => {
    return data?.filter((_, index) => attempted[index] !== null);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);

      // Check if the previous question has been attempted
      if (attempted[currentIndex - 1] !== null) {
        setIsAnswered(true);
        setIsAccordionVisible(true);
      } else {
        setIsAnswered(false);
        setIsAccordionVisible(false);
      }
      setIsButtonClicked(false);

      if (isQuestionReview) {
        // setIsAnswered(true);
        // setIsAccordionVisible(true);
      }
    }
  };

  // Correct the nextPage function
  const nextPage = () => {
    const newPage = currentPage + 1;
    if (newPage * itemsPerPage < data?.length) {
      setCurrentPage(newPage);
      setCurrentIndex(newPage * itemsPerPage); // Set to the first question of the new page
    }
  };

  // Correct the prevPage function
  const prevPage = () => {
    const newPage = currentPage - 1;
    if (newPage >= 0) {
      setCurrentPage(newPage);
      setCurrentIndex(newPage * itemsPerPage);
    }
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  // data[currentIndex]?.explanationList?.map((explanation, index) => {
  //   let isSelected = selectedAnswer === explanation;
  //   const isCorrectAnswer = index === data[currentIndex].correctAnswerId;
  // });

  const markQuestion = (index, status) => {
    setAttempts((prev) => {
      const updatedAttempts = [...prev];
      updatedAttempts[index] = status; // Update specific question as correct (true) or incorrect (false)
      return updatedAttempts;
    });
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleFinishAndReview = () => {
    if (!isFinishEnabled) return;

    setReviewLoading(true);

    if (isButtonClicked) {
      handleCheckAnswer();
    }

    setTimeout(() => {
      navigation("/score");
      setReviewLoading(false);
    }, 2000);
  };

  function handleShowPopup() {
    setShowPopup(true); // Close the popup
  }

  const handleBackToDashboard = () => {
    navigation("/dashboard");
  };

  const indicesToDisplay =
    selectedFilter === "All"
      ? allIndices
      : selectedFilter === "Flagged"
        ? flaggedIndices
        : selectedFilter === "Unseen"
          ? unseenIndices
          : []; // Default to an empty array if no filter is selected

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsSubMenuOpen(false); // Close the menu if the click is outside
    }
  };

  useEffect(() => {
    if (data?.length) {
      const initialAccordionState = data[currentIndex]?.answersArray?.map(
        () => false,
      );
      setIsAccordionOpen(initialAccordionState);
    }
  }, [data]);

  useEffect(() => {
    // Reset accordion state when the current question changes
    if (data[currentIndex]?.answersArray) {
      const numAnswers = data[currentIndex].answersArray.length;
      setIsAccordionOpen(Array(numAnswers).fill(false));
    }
  }, [currentIndex, data]);

  useEffect(() => {
    if (active) {
      setAttempts(Array(data?.length).fill(null)); // Initialize attempts as unseen
      dispatch(setAttempted(Array(data?.length).fill(null))); // Dispatch the updated attempts array to Redux
    }
  }, [data]);

  useEffect(() => {
    if (data?.length > 0) {
      if (active) {
        dispatch(initializeFlags(data?.length));
        dispatch(initializeVisited(data?.length));
      }
    }
  }, [data]);

  useEffect(() => {
    const correct = attempts.filter((attempt) => attempt === true).length;
    const incorrect = attempts.filter((attempt) => attempt === false).length;
    const totalAttempted = attempts.filter(
      (attempt) => attempt !== null,
    ).length;
    setAccuracy(
      totalAttempted > 0 ? ((correct / totalAttempted) * 100).toFixed(1) : 0,
    );

    const hasAnswer = attempts.some(
      (value) => value === true || value === false,
    );

    setIsFinishEnabled(hasAnswer);
  }, [attempts]);

  useEffect(() => {
    if (review === false) {
      dispatch(setMcqsAccuracy({ accuracy }));
    }
  }, [accuracy]);

  useEffect(() => {
    if (isTimerMode["mode"] === "Exam") {
      // Save the timer value in localStorage on every update
      localStorage.setItem("examTimer", timer);

      if (timer === 0) {
        handleFinishAndReview();
        localStorage.removeItem("examTimer"); // Clear storage when timer ends
        return;
      }

      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, isTimerMode, handleFinishAndReview]);

  // Attach the click event listener to the document when the menu is open
  useEffect(() => {
    if (isSubMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSubMenuOpen]);

  // Check if it's time to enable the Finish button
  useEffect(() => {
    setIsReviewEnabled(false);
    if (data.length === currentIndex + 1) {
      setIsReviewEnabled(true); // Enable the Finish button when the condition is met
    }
  }, [currentIndex, data?.length]); // Re-run whenever currentIndex changes

  const reportHandler = () => {
    setShowFeedBackModal(!showFeedBackModal);
  };

  useEffect(() => {
    if (showFeedBackModal || isAIExpanded) return; // Agar modal open hai toh event listener add nahi hoga

    const handleKeyPress = (e) => {
      if (e.key === "ArrowRight") {
        nextQuestion();
        return;
      }

      if (e.key === "ArrowLeft") {
        prevQuestion();
        return;
      }

      if (e.key === " ") {
        e.preventDefault();

        if (isAnswered && !answerChecked) {
          handleCheckAnswer();
          setAnswerChecked(true);
        } else if (answerChecked) {
          nextQuestion();
          setAnswerChecked(false);
        }

        return;
      }

      if (attempted[currentIndex] !== null) return;

      const key = e.key.toUpperCase();
      const validKeys = ["Q", "W", "E", "R", "T"];
      const keyIndex = validKeys.indexOf(key);

      if (
        keyIndex !== -1 &&
        keyIndex < data[currentIndex]?.answersArray.length
      ) {
        const answer = data[currentIndex].answersArray[keyIndex];

        handleAnswerSelect(answer);
        setIsAnswered(true);
        dispatch(setResult({ attempted }));
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [
    currentIndex,
    attempted,
    data,
    isAnswered,
    showFeedBackModal,
    isAIExpanded,
  ]); // ✅ showFeedBackModal added

  useEffect(() => {
    if (review) {
      setAccuracy(100);
      setIsButtonClicked(true);
      setIsAccordionVisible(true);
      setBorder(false);
      setSelectedAnswer(true);
      setIsAnswered(true);
      // setIsAccordionVisible(true)
    }
  }, [review]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (beakerRef.current && !beakerRef.current.contains(event.target)) {
        setBeakerToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && review === true) {
        navigation("/dashboard");
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [navigation]);
  useEffect(() => {
    dispatch(fetchSubscriptions({ userId }));
  }, [dispatch, userId]);
  if (reviewLoading) {
    return <Loader />;
  }

  return (
    <div className={`min-h-screen ${darkModeRedux ? "dark" : ""} `}>
      {data.length == 0 ? (
        <div>
          <p className="text-center text-gray-500">No record available</p>
        </div>
      ) : (
        <div>
          <div className="min-h-screen dark:bg-[#1E1E2A]">
            <div className="flex w-full items-center justify-between bg-white p-5 lg:hidden">
              <div className="">
                <img src="/assets/small-logo.png" alt="Logo sm" />
              </div>

              <div className="" onClick={toggleDrawer}>
                <TbBaselineDensityMedium />
              </div>
            </div>
            <div className="mx-auto flex items-center justify-center p-6 text-black">
              <div
                className={`w-[100%] max-w-full transition-all duration-150 md:w-[80%] lg:w-[70%] xl:w-[55%] ${
                  toggleSidebar ? "2xl:w-[55%]" : "2xl:w-[40%]"
                } ${toggleSidebar ? "lg:mr-[130px]" : "lg:mr-[200px]"} `}
              >
                {/* Header Section */}
                <div className="relative flex items-center justify-between rounded-md bg-[#3CC8A1] p-6 text-white">
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 h-[4px] w-full overflow-hidden rounded-md bg-[#D4D4D8]">
                    <div
                      className="h-full bg-[#60B0FA] transition-all duration-300 ease-in-out"
                      style={{
                        width: `${((currentIndex + 1) / data?.length) * 100}%`,
                      }}
                    ></div>
                  </div>

                  {/* Left Icon */}
                  <div className="absolute left-4">
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-ellipsis h-4 w-4 cursor-pointer lg:h-6 lg:w-6"
                        onClick={(e) => toggleMenu(e)} // Toggle submenu on click
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>

                      {/* Submenu */}
                      {isSubMenuOpen && (
                        <div
                          ref={menuRef} // Attach ref to the submenu container
                          className="absolute right-0 mt-2 w-[150px] rounded-md border border-gray-300 bg-white shadow-lg"
                        >
                          <ul>
                            <li
                              className="cursor-pointer p-2 text-[#3F3F46] hover:bg-[#3CC8A1] hover:text-white"
                              onClick={reportHandler}
                            >
                              Report
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Navigation */}
                  <div className="absolute left-1/2 flex -translate-x-1/2 transform items-center space-x-4 text-[14px] lg:text-[18px]">
                    <button
                      className={`text-white ${
                        currentIndex + 1 <= 1
                          ? "cursor-not-allowed opacity-70"
                          : ""
                      }`}
                      onClick={prevQuestion}
                    >
                      &larr;
                    </button>
                    <h2 className="text-center font-semibold">
                      Question {currentIndex + 1} of {data?.length}
                    </h2>
                    <button
                      className={`text-white ${
                        currentIndex + 1 === data?.length
                          ? "cursor-not-allowed opacity-70"
                          : ""
                      }`}
                      onClick={nextQuestion}
                    >
                      &rarr;
                    </button>
                  </div>

                  {/* Right Icons */}
                  <div className="absolute right-4 flex space-x-4">
                    <div className="relative">
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
                        className="lucide lucide-flask-conical cursor-pointer hover:opacity-80"
                        onClick={beakerToggledHandler}
                      >
                        <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
                        <path d="M6.453 15h11.094" />
                        <path d="M8.5 2h7" />
                      </svg>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={flaggedQuestions[currentIndex] ? "white" : "none"}
                      stroke={
                        flaggedQuestions[currentIndex]
                          ? "white"
                          : "currentColor"
                      }
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-flag cursor-pointer hover:opacity-80"
                      onClick={handleFlagQuestion}
                    >
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" x2="4" y1="22" y2="15" />
                    </svg>
                  </div>
                </div>

                {/* Question start */}
                {data.length > 0 && (
                  <div className="mt-6 p-6" key={currentIndex}>
                    <p className="text-justify text-[14px] text-[#000000] dark:text-white lg:text-[16px]">
                      {data[currentIndex].question_stem}
                    </p>

                    <h3 className="mt-4 text-[12px] font-bold text-[#3F3F46] dark:text-white lg:text-[14px]">
                      {data[currentIndex].lead_in_question}
                    </h3>
                    <div className="mt-4 space-y-4">
                      {data[currentIndex]?.answersArray?.map(
                        (answer, index) => {
                          const isSelected = selectedAnswer === answer;
                          const isCorrectAnswer =
                            index === data[currentIndex]?.correctAnswerId;

                          const borderColor =
                            isButtonClicked || attempted[currentIndex] !== null
                              ? isCorrectAnswer
                                ? "border-[#22C55E]"
                                : "border-[#EF4444]"
                              : "";
                          const bgColor =
                            isButtonClicked || attempted[currentIndex] !== null
                              ? isCorrectAnswer
                                ? "bg-[#DCFCE7]"
                                : "bg-[#FEE2E2]"
                              : "";

                          return (
                            <div
                              key={index}
                              className={`rounded-md border ${
                                attempted[currentIndex] !== null
                                  ? isCorrectAnswer
                                    ? "border-[#22C55E] bg-[#DCFCE7]"
                                    : isSelected
                                      ? "border-[#EF4444] bg-[#FEE2E2]"
                                      : "border-white bg-white"
                                  : isSelected
                                    ? "border-[#3CC8A1] bg-[#FAFAFA]"
                                    : "border-white bg-white hover:border-[#3CC8A1]"
                              }`}
                            >
                              {!isAccordionVisible &&
                              attempted[currentIndex] === null ? (
                                <label
                                  className={`flex cursor-pointer items-center space-x-3 rounded-md p-4 py-[12px] text-[14px] dark:border dark:bg-[#1E1E2A] lg:text-[16px]`}
                                  onClick={() =>
                                    handleAnswerSelect(answer, index)
                                  }
                                >
                                  <input
                                    type="radio"
                                    name="answer"
                                    className="form-radio h-5 w-5 text-green-500 focus:ring-green-500"
                                    checked={isSelected}
                                    readOnly
                                  />
                                  <span className="flex-1 font-medium text-[#3F3F46] dark:text-white">
                                    {answer}
                                  </span>
                                  <span className="rounded-md bg-gray-200 px-2 py-1 text-[#27272A]">
                                    {["Q", "W", "E", "R", "T"][index]}
                                  </span>
                                </label>
                              ) : (
                                <div
                                  className={`border ${borderColor} ${bgColor} rounded-md`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAccordion(index);
                                  }}
                                >
                                  <label
                                    className={`flex cursor-pointer items-center space-x-3 rounded-md p-4 text-[14px] lg:text-[16px]`}
                                    onClick={() =>
                                      handleAnswerSelect(answer, index)
                                    }
                                  >
                                    <div
                                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                        isButtonClicked ||
                                        attempted[currentIndex] !== null
                                          ? isCorrectAnswer
                                            ? "border border-green-500 bg-green-100"
                                            : "border border-red-500 bg-red-100"
                                          : "border border-gray-300 bg-gray-100"
                                      }`}
                                    >
                                      {(isButtonClicked ||
                                        attempted[currentIndex] !== null) &&
                                        (isCorrectAnswer ? (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="green"
                                            className="h-4 w-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        ) : (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="red"
                                            className="h-4 w-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M6 18L18 6M6 6l12 12"
                                            />
                                          </svg>
                                        ))}
                                    </div>
                                    <span className="flex-1 text-[#27272A]">
                                      {answer}
                                    </span>
                                    {isAccordionOpen[index] ? (
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
                                  </label>

                                  {/* Conditionally render the hr and p tags */}
                                  {isAccordionOpen[index] && (
                                    <>
                                      <hr className={`mx-5 ${borderColor}`} />
                                      <p className="px-5 py-2 text-[12px] text-[#3F3F46]">
                                        {
                                          data[currentIndex]?.explanationList[
                                            index
                                          ]
                                        }
                                      </p>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>

                    {/* Submit Button */}
                    {!isReviewEnabled &&
                      (isAccordionVisible ? (
                        <div className="group">
                          <button
                            className="mt-2 flex w-full items-center justify-center gap-x-3 rounded-md border border-[#3CC8A1] bg-[#3CC8A1] px-6 py-2 text-[14px] font-semibold text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#3CC8A1] lg:text-[16px]"
                            onClick={nextQuestion}
                          >
                            Next Question
                            <span className="rounded-[4px] bg-white px-[2px] transition-all duration-300 ease-in-out group-hover:bg-[#3CC8A1]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-space text-black transition-all duration-300 ease-in-out group-hover:text-white"
                              >
                                <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
                              </svg>
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="group">
                          <button
                            className={`mt-2 flex w-full items-center justify-center gap-x-3 rounded-md bg-[#3CC8A1] px-6 py-2 text-[14px] font-semibold text-white transition-all duration-300 ease-in-out lg:text-[16px] ${
                              isAnswered && "hover:bg-transparent"
                            } ${
                              isAnswered && "hover:text-[#3CC8A1]"
                            } border border-[#3CC8A1] ${
                              !isAnswered && "cursor-not-allowed"
                            }`}
                            onClick={handleCheckAnswer}
                            disabled={isAnswered === false}
                          >
                            Check Answer
                            <span
                              className={`rounded-[4px] bg-white px-[2px] ${
                                isAnswered && "group-hover:bg-[#3CC8A1]"
                              } transition-all duration-300 ease-in-out`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`lucide lucide-space text-black ${
                                  isAnswered && "group-hover:text-white"
                                } transition-all duration-300 ease-in-out`}
                              >
                                <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
                              </svg>
                            </span>
                          </button>
                        </div>
                      ))}
                    {isReviewEnabled && (
                      <div
                        className={`flex items-center gap-x-2 font-semibold ${
                          isFinishEnabled
                            ? "cursor-pointer text-[#3CC8A1]"
                            : "cursor-not-allowed text-[#D4D4D8]"
                        } justify-center`}
                        onClick={handleFinishAndReview}
                      >
                        {review === false && (
                          <div className="group w-full">
                            <button className="mt-2 flex w-full items-center justify-center gap-x-3 rounded-md border border-[#60B0FA] bg-[#60B0FA] px-6 py-2 text-[14px] font-semibold text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#60B0FA] lg:text-[16px]">
                              Finish and Review
                              <span className="rounded-[4px] bg-white px-[2px] transition-all duration-300 ease-in-out group-hover:bg-[#60B0FA]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-space text-black transition-all duration-300 ease-in-out group-hover:text-white"
                                >
                                  <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
                                </svg>
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {review === true && (
                      <div className="group w-full">
                        <div tabIndex="0">
                          {" "}
                          {/* Ensure the div is focusable */}
                          <button
                            className="mt-2 flex w-full items-center justify-center gap-x-3 rounded-md border border-[#60B0FA] bg-[#60B0FA] px-6 py-2 text-[14px] font-semibold text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#60B0FA] lg:text-[16px]"
                            onClick={() => navigation("/dashboard")}
                          >
                            Back to Dashboard
                            <span className="flex items-center gap-1 rounded-[4px] bg-white px-[4px] py-[2px] transition-all duration-300 ease-in-out group-hover:bg-[#60B0FA]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-corner-down-left text-black transition-all duration-300 ease-in-out group-hover:text-white"
                              >
                                <polyline points="9 10 4 15 9 20" />
                                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                              </svg>
                              <span className="text-[12px] font-semibold text-black group-hover:text-white">
                                Enter
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isAccordionVisible && (
                  <div className="mx-7 flex items-center justify-between">
                    <p className="text-[16px] font-medium text-[#3F3F46] dark:text-white">
                      Notice a problem with this question?
                    </p>
                    <button
                      onClick={reportHandler}
                      className="rounded-[4px] bg-gray-200 p-3 text-[14px] font-semibold text-[#193154] transition-all duration-300 hover:bg-[#d9d9db]"
                    >
                      Report
                    </button>
                  </div>
                )}
                {/* {isAccordionVisible && <DiscussionBoard setIsAIExpanded = {setIsAIExpanded} />} */}
                {isAccordionVisible && (
                  <Article
                    article={article}
                    id={data[currentIndex]?.conditionName}
                  />
                )}
              </div>

              {/* Sidebar Section */}
              <div className={`fixed right-0 top-0 hidden lg:block`}>
                <div
                  className={`flex h-screen w-[28%] flex-col items-center justify-between bg-white text-black dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] md:w-[25%] lg:w-[240px] ${
                    !toggleSidebar ? "translate-x-0" : "translate-x-full"
                  } transition-transform duration-300`}
                >
                  <div className="w-full">
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center"></div>

                      <div className="absolute left-1/2 -translate-x-1/2 transform">
                        <Logo />
                      </div>

                      <div
                        className="flex cursor-pointer items-center"
                        onClick={() => {
                          setToggleSidebar(!toggleSidebar);
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
                          className="lucide lucide-chevrons-left mr-4 dark:text-white"
                        >
                          <path d="m11 17-5-5 5-5" />
                          <path d="m18 17-5-5 5-5" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-10 flex flex-col items-center justify-center">
                      {isTimerMode["mode"] === "Endless" && (
                        <div
                          className={`h-[96px] w-[90%] rounded-[8px] bg-[#3CC8A1] ${
                            mcqsAccuracy > 34 ? "bg-[#3CC8A1]" : "bg-[#FF453A]"
                          } text-center text-[#ffff]`}
                        >
                          <div>
                            <p className="mt-3 text-[12px]">Accuracy</p>
                            <p className="text-[36px] font-black">
                              {mcqsAccuracy}%
                            </p>
                          </div>
                        </div>
                      )}

                      {isTimerMode["mode"] === "Exam" && (
                        <div
                          className={`h-[96px] w-[90%] rounded-[8px] ${
                            timer <= 60 ? "bg-[#FF453A]" : "bg-[#3CC8A1]"
                          } text-center text-[#ffff]`}
                        >
                          <div>
                            <p className="mt-3 text-[12px]">Time:</p>
                            {review === true ? (
                              <p className="text-[36px] font-black">
                                {"00:00"}
                              </p>
                            ) : (
                              <p className="text-[36px] font-black">
                                {formatTime(timer)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <QuestionNavigator
                      attempted={attempted}
                      flaggedQuestions={flaggedQuestions}
                      visited={visited}
                      currentIndex={currentIndex}
                      setCurrentIndex={setCurrentIndex}
                    />
                    <div className="px-10 py-5 text-[#D4D4D8]">
                      <hr />
                    </div>
                  </div>
                  <div>
                    <hr className="mx-5" />
                  </div>

                  <div className="mb-5 text-[12px]">
                    <button
                      className={`flex w-full items-center gap-x-2 font-semibold ${
                        isFinishEnabled
                          ? "cursor-pointer text-[#3CC8A1]"
                          : "cursor-not-allowed text-[#D4D4D8]"
                      } justify-center`}
                      onClick={handleFinishAndReview}
                      disabled={!isFinishEnabled}
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
                    </button>
                    <hr className="my-2 w-[200px]" />

                    <div
                      className="flex cursor-pointer items-center justify-center gap-x-2 whitespace-nowrap font-semibold text-[#FF453A]"
                      onClick={handleShowPopup}
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
                      <p>Back to Dashboard</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`3A3A48 absolute right-0 top-0 h-screen w-[28%] bg-white dark:border-[1px] dark:border-[#3A3A48] md:w-[25%] lg:w-[50px] ${
                    !toggleSidebar && "translate-x-full"
                  } text-black transition-transform duration-300 dark:bg-[#1E1E2A]`}
                >
                  <div
                    className="flex cursor-pointer items-center dark:bg-[#1E1E2A]"
                    onClick={() => setToggleSidebar(!toggleSidebar)}
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
                      className="lucide lucide-chevrons-right ml-3 mt-5 dark:text-white"
                    >
                      <path d="m6 17 5-5-5-5" />
                      <path d="m13 17 5-5-5-5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showPopup && (
            <DashboardModal
              handleBackToDashboard={handleBackToDashboard}
              setShowPopup={setShowPopup}
            />
          )}

          {showFeedBackModal && (
            <FeedbackModal
              showFeedBackModal={showFeedBackModal}
              setShowFeedBackModal={setShowFeedBackModal}
              userId={userId}
              questionStem={data[currentIndex]}
              leadQuestion={data[currentIndex].leadQuestion}
            />
          )}

          <div
            ref={beakerRef}
            className={`absolute right-0 top-0 transition-all duration-500 ${
              beakerToggle
                ? "visible opacity-100"
                : "pointer-events-none invisible opacity-0"
            }`}
          >
            <ChemistryBeaker beakerToggledHandler={beakerToggledHandler} />
          </div>

          <Drawer
            open={isOpen}
            onClose={toggleDrawer}
            direction="right"
            className="bla bla bla"
            lockBackgroundScroll={true}
          >
            <div className="m-5" onClick={toggleDrawer}>
              <RxCross2 />
            </div>

            <div className="h-screen bg-white">
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center"></div>

                <div className="absolute left-1/2 -translate-x-1/2 transform">
                  <Logo />
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center">
                {isTimerMode["mode"] === "Endless" && (
                  <div
                    className={`h-[96px] w-[90%] rounded-[8px] bg-[#3CC8A1] ${
                      mcqsAccuracy > 34 ? "bg-[#3CC8A1]" : "bg-[#FF453A]"
                    } text-center text-[#ffff]`}
                  >
                    <div>
                      {" "}
                      <p className="mt-3 text-[12px]">Accuracy</p>
                      <p className="text-[36px] font-black">{mcqsAccuracy}%</p>
                    </div>
                  </div>
                )}

                {isTimerMode["mode"] === "Exam" && (
                  <div
                    className={`h-[96px] w-[90%] rounded-[8px] ${
                      timer <= 60 ? "bg-[#FF453A]" : "bg-[#3CC8A1]"
                    } text-center text-[#ffff]`}
                  >
                    <div>
                      <p className="mt-3 text-[12px]">Time:</p>

                      {review === true ? (
                        <p className="text-[36px] font-black">{"00:00"}</p>
                      ) : (
                        <p className="text-[36px] font-black">
                          {formatTime(timer)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <QuestionNavigator
                attempted={attempted}
                flaggedQuestions={flaggedQuestions}
                visited={visited}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />

              <div>
                <hr className="mx-5" />
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-[12px]">
                {/* Finish and Review Button */}
                <button
                  className={`flex w-full items-center gap-x-2 font-semibold ${
                    isFinishEnabled
                      ? "cursor-pointer text-[#3CC8A1]"
                      : "cursor-not-allowed text-[#D4D4D8]"
                  } justify-center`}
                  onClick={handleFinishAndReview}
                  disabled={!isFinishEnabled}
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
                </button>
                <hr className="my-2 w-[200px]" />
                {/* Back to Dashboard Button */}
                <div className="flex items-center justify-center gap-x-2 whitespace-nowrap font-semibold text-[#FF453A]">
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
                  <p>Back to Dashboard</p>
                </div>
              </div>
            </div>
          </Drawer>

          <Chatbot setIsAIExpanded={setIsAIExpanded} />
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
