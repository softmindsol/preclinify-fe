import React, { useRef, useState, useEffect, useCallback } from "react";
import Logo from "./common/Logo";
import DiscussionBoard from "./Discussion";
import DeepChatAI from "./DeepChat";
import Drawer from "react-modern-drawer";
//import styles 👇
import "react-modern-drawer/dist/index.css";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { TbBaselineDensityMedium } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setResult } from "../redux/features/result/result.slice";
import { setMcqsAccuracy } from "../redux/features/accuracy/accuracy.slice";
import { fetchConditionNameById } from "../redux/features/SBA/sba.service";
import DashboardModal from "./common/DashboardModal";
import ChemistryBeaker from "./chemistry-beaker";
import {
  setActive,
  setAttempted,
} from "../redux/features/attempts/attempts.slice";
import { setAttemptedShortQuestion } from "../redux/features/SAQ/saq.slice";
import FeedbackModal from "./common/Feedback";
import {
  initializeVisited,
  markVisited,
} from "../redux/features/flagged/visited.slice";
import {
  initializeFlags,
  toggleFlag,
} from "../redux/features/flagged/flagged.slice";
import {
  initializeAnswers,
  setUserAnswers,
} from "../redux/features/SAQ/userAnswer.slice";
import QuestionNavigator from "./QuestionNavigator";
import { insertSAQResult } from "../redux/features/all-results/result.sba.service";
import Chatbot from "./chatbot";
import Loader from "./common/Loader";
// Function to format the time in MM:SS format
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
const ShortQuestion = () => {
  const FiltershortQuestions = useSelector(
    (state) => state?.FiltershortQuestions?.results,
  );
  const sqa = useSelector((state) => state?.SQA?.organizedData || []);
  const attempted = useSelector((state) => state.attempts?.attempts);
  const [showFeedBackModal, setShowFeedBackModal] = useState(false);
  const [attempts, setAttempts] = useState(attempted);
  const [isFinishEnabled, setIsFinishEnabled] = useState(false);
  const darkModeRedux = useSelector((state) => state.darkMode.isDarkMode);
  const [childIndex, setChildIndex] = useState(0);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccordionVisible, setIsAccordionVisible] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [userAnswer, setUserAnswer] = useState("")
  const [userAnswer, setUserAnswerState] = useState("");
  const navigation = useNavigate();
  const mcqsAccuracy = useSelector((state) => state.accuracy.accuracy);
  // const data = useSelector((state) => state.mcqsQuestion || []);
  const result = useSelector((state) => state.result);
  const [currentPage, setCurrentPage] = useState(0); // Track current page (each page has 20 items)
  const [isReviewEnabled, setIsReviewEnabled] = useState(false);
  const itemsPerPage = 10;
  // Get the items to show for the current page
  const active = useSelector((state) => state.attempts?.active);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All"); // Default is 'All'
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State to toggle submenu visibility
  const isTimerMode = useSelector((state) => state.mode);
  const [timer, setTimer] = useState(
    calculateTimeForQuestions(isTimerMode.time),
  );
  const review = useSelector((state) => state.questionReview.value);
  const [accuracy, setAccuracy] = useState(mcqsAccuracy); // Calculated accuracy
  const menuRef = useRef(null);
  const [testCheckAnswer, setTestCheckAnswer] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [partialCount, setPartialCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [beakerToggle, setBeakerToggle] = useState(false);
  const [error, setError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [parentIndex, setParentIndex] = useState(0);
  const totalQuestions = FiltershortQuestions.reduce(
    (total, parent) => total + parent?.children?.length,
    0,
  );
  const userId = useSelector((state) => state.user.userId);
  const [isAIExpanded, setIsAIExpanded] = useState(false);

  const [checkedAnswers, setCheckedAnswers] = useState(
    Array(totalQuestions).fill(false),
  );

  console.log("FiltershortQuestions:", FiltershortQuestions);

  // Initialize attempts with null values
  // const [attempts, setAttempts] = useState(Array(totalQuestions).fill(null));
  // const currentItems = sqa.children.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const allChildren = FiltershortQuestions.flatMap((parent) => parent.children); // or use: const allChildren = [].concat(...sqa.map(parent => parent.children));
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  // Get the current items based on the current page
  const currentItems = allChildren.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );
  const flaggedQuestions = useSelector(
    (state) => state?.flagged?.flaggedQuestions,
  );
  const visited = useSelector((state) => state?.visited?.visitedQuestions);
  const userAnswers = useSelector((state) => state?.userAnswers?.answers);
  const beakerRef = useRef(null);

  console.log("sqa:", sqa);

  const beakerToggledHandler = () => {
    setBeakerToggle(!beakerToggle);
  };

  const handleCheckAnswer = () => {
    dispatch(setActive(false)); // Dispatch the updated attempts array to Redux
    setIsAnswerChecked(true);
    if (!userAnswer.trim()) {
      setError(true);
      return;
    } else {
      setError(false);
      setIsAnswered(true);
      setTestCheckAnswer(true);
    }
    dispatch(setUserAnswers({ index: currentIndex, answer: userAnswer }));
    setUserAnswerState("");
    let value = false;
    dispatch(markVisited({ currentIndex, value }));
  };

  const nextQuestion = () => {
    if (childIndex < FiltershortQuestions[parentIndex]?.children.length - 1) {
      setChildIndex((prev) => prev + 1);
    } else if (parentIndex < FiltershortQuestions.length - 1) {
      setParentIndex((prev) => prev + 1);
      setChildIndex(0);
    }
    setIsAnswerChecked(false);
    setCurrentIndex((prev) => prev + 1); // Update current index
    setTestCheckAnswer(false);

    const nextIndex = currentIndex + 1;
    setUserAnswerState(userAnswers[nextIndex] || "");

    let value = true;
    if (!isAnswered) {
      dispatch(markVisited({ currentIndex, value }));
    }

    // Check if the next question has a valid answer
    const hasValidAnswer =
      userAnswers[nextIndex] !== null && userAnswers[nextIndex] !== "";

    setTestCheckAnswer(hasValidAnswer);
  };

  const prevQuestion = () => {
    if (childIndex > 0) {
      setChildIndex((prev) => prev - 1);
    } else if (parentIndex > 0) {
      setParentIndex((prev) => prev - 1);
      setChildIndex(FiltershortQuestions[parentIndex - 1]?.children.length - 1);
    }
    setIsAnswerChecked(false);
    setCurrentIndex((prev) => prev - 1); // Update current index
    setTestCheckAnswer(false);

    const prevIndex = currentIndex - 1;
    setUserAnswerState(userAnswers[prevIndex] || "");

    // Check if the previous question has a valid answer
    const hasValidAnswer =
      userAnswers[prevIndex] !== null && userAnswers[prevIndex] !== "";

    setTestCheckAnswer(hasValidAnswer);
  };

  function handleShowPopup() {
    setShowPopup(true);
  }

  const handleBackToDashboard = () => {
    navigation("/dashboard");
  };
  const handleIncorrectClick = useCallback(() => {
    const globalIndex =
      FiltershortQuestions.slice(0, parentIndex).reduce(
        (acc, parent) => acc + parent.children.length,
        0,
      ) + childIndex;
    markQuestion(globalIndex, false);
    dispatch(setMcqsAccuracy({ accuracy }));
    setTestCheckAnswer(false);
    setUserAnswerState("");
    nextQuestion();
    dispatch(
      insertSAQResult({
        isCorrect: false,
        isIncorrect: true,
        isPartial: false,
        questionId: FiltershortQuestions[parentIndex]?.id,
        userId,
        moduleId: FiltershortQuestions[parentIndex]?.categoryId,
        parentId: FiltershortQuestions[parentIndex]?.id,
        childrenId: FiltershortQuestions[parentIndex]?.children[childIndex]?.id,
      }),
    );
  }, [
    FiltershortQuestions,
    parentIndex,
    childIndex,
    dispatch,
    accuracy,
    nextQuestion,
  ]);

  const handlePartialClick = useCallback(() => {
    const globalIndex =
      FiltershortQuestions.slice(0, parentIndex).reduce(
        (acc, parent) => acc + parent.children.length,
        0,
      ) + childIndex;
    markQuestion(globalIndex, "partial");
    dispatch(setMcqsAccuracy({ accuracy }));
    setTestCheckAnswer(false);
    setUserAnswerState("");
    nextQuestion();
    dispatch(
      insertSAQResult({
        isCorrect: false,
        isIncorrect: false,
        isPartial: true,
        questionId: FiltershortQuestions[parentIndex]?.id,
        userId,
        moduleId: FiltershortQuestions[parentIndex]?.categoryId,
        parentId: FiltershortQuestions[parentIndex]?.id,

        childrenId: FiltershortQuestions[parentIndex]?.children[childIndex]?.id,
      }),
    );
  }, [
    FiltershortQuestions,
    parentIndex,
    childIndex,
    dispatch,
    accuracy,
    nextQuestion,
  ]);

  const handleCorrectClick = useCallback(() => {
    const globalIndex =
      FiltershortQuestions.slice(0, parentIndex).reduce(
        (acc, parent) => acc + parent.children.length,
        0,
      ) + childIndex;
    markQuestion(globalIndex, true);
    dispatch(setMcqsAccuracy({ accuracy }));
    setTestCheckAnswer(false);
    setUserAnswerState("");
    nextQuestion();
    dispatch(
      insertSAQResult({
        isCorrect: true,
        isIncorrect: false,
        isPartial: false,
        questionId: FiltershortQuestions[parentIndex]?.id,
        userId,
        moduleId: FiltershortQuestions[parentIndex]?.categoryId,
        parentId: FiltershortQuestions[parentIndex]?.id,

        childrenId: FiltershortQuestions[parentIndex]?.children[childIndex]?.id,
      }),
    );
  }, [
    FiltershortQuestions,
    parentIndex,
    childIndex,
    dispatch,
    accuracy,
    nextQuestion,
  ]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  // Arrays to store indices
  const unseenIndices = [];
  const flaggedIndices = [];
  const allIndices = [];

  // Filter items based on the selected filter
  const filteredItems = currentItems?.filter((question, index) => {
    const displayNumber = currentPage * itemsPerPage + index;

    // All items
    allIndices.push(displayNumber);

    if (selectedFilter === "All") {
      return true; // Include all items
    }

    if (selectedFilter === "Flagged") {
      // Check if item is flagged
      const isFlagged =
        attempts[displayNumber] === true ||
        attempts[displayNumber] === false ||
        attempts[displayNumber] === "partial";
      if (isFlagged) {
        flaggedIndices.push(displayNumber); // Store index for flagged items
        return true;
      }
    }

    if (selectedFilter === "Unseen") {
      // Check if item is unseen
      const isUnseen = attempts[displayNumber] === null;
      if (isUnseen) {
        unseenIndices.push(displayNumber); // Store index for unseen items
        return true;
      }
    }

    return false; // Hide items that don't match the filter
  });

  // Modified flag handler
  const handleFlagQuestion = () => {
    dispatch(toggleFlag(currentIndex));
  };

  const nextPage = () => {
    if ((currentPage + 1) * itemsPerPage < allChildren.length) {
      setCurrentPage(currentPage + 1);
      setCurrentIndex((prev) => prev + 10);
    }
  };

  // Function to go to the previous page
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setCurrentIndex(0);
    }
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsSubMenuOpen(!isSubMenuOpen); // Toggle the menu visibility
  };

  const reportHandler = () => {
    setShowFeedBackModal(!showFeedBackModal);
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

  const markQuestion = useCallback(
    (index, status) => {
      setAttempts((prev) => {
        const updatedAttempts = [...prev];
        updatedAttempts[index] = status; // Update specific question status
        dispatch(setAttempted(updatedAttempts)); // Dispatch the updated attempts array to Redux
        return updatedAttempts;
      });

      // Update scores based on the status
      if (status === true) {
        setCorrectCount((prev) => prev + 1);
        setTotalScore((prev) => prev + 2); // Increment score by 2 for correct answers
      } else if (status === false) {
        setIncorrectCount((prev) => prev + 1);
        // No score increment for incorrect answers
      } else if (status === "partial") {
        setPartialCount((prev) => prev + 1);
        setTotalScore((prev) => prev + 1); // Increment score by 1 for partial answers
      }
      // Increment total attempts
      setTotalAttempts((prev) => prev + 1);
    },
    [dispatch],
  );

  const getQuestionRange = (currentIndex) => {
    // Number of items to show in the sidebar
    const start = Math.floor(currentIndex / itemsPerPage) * itemsPerPage; // Calculate the start index
    const end = Math.min(start + itemsPerPage, allChildren.length); // Calculate the end index

    return { start, end };
  };

  // Get the range of questions to display
  const { start, end } = getQuestionRange(currentIndex);

  const handleFinishAndReview = () => {
    if (isFinishEnabled) {
      setReviewLoading(true);
      dispatch(setMcqsAccuracy({ accuracy }));

      setTimeout(() => {
        navigation("/score");
        setReviewLoading(false);
      }, 2000);
    }
  };

  const handleFinishAndReviewAtLast = () => {
    if (isReviewEnabled) {
      setReviewLoading(true);
      dispatch(setMcqsAccuracy({ accuracy }));

      setTimeout(() => {
        navigation("/score");
        setReviewLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const validAttempts = attempted?.filter((item) => item !== null);

    if (validAttempts.length > 0) {
      setIsFinishEnabled(true);
    }
  }, [attempted]);

  useEffect(() => {
    if (FiltershortQuestions.length > 0) {
      if (active) {
        dispatch(initializeAnswers(totalQuestions)); // Initialize answers when the component mounts
      }
    }
  }, [FiltershortQuestions, dispatch, totalQuestions]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isAnswerChecked) return; // Ignore key presses if the answer hasn't been checked

      switch (event.key) {
        case "1": // Key "1" for Incorrect
          handleIncorrectClick();
          break;
        case "2": // Key "2" for Partial
          handlePartialClick();
          break;
        case "3": // Key "3" for Correct
          handleCorrectClick();
          break;
        default:
          break; // Ignore other keys
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isAnswerChecked,
    handleIncorrectClick,
    handlePartialClick,
    handleCorrectClick,
  ]);

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

  useEffect(() => {
    const maxScore = totalAttempts * 2; // Maximum score if all answers are correct
    if (maxScore === 0) {
      // setAccuracy(0); // Avoid division by zero
    } else {
      setAccuracy(((totalScore / maxScore) * 100).toFixed(2)); // Calculate accuracy
    }
  }, [totalScore, totalAttempts]);

  useEffect(() => {
    setIsReviewEnabled(false);
    if (FiltershortQuestions[parentIndex]?.children.length === childIndex + 1) {
      setIsReviewEnabled(true); // Enable the Finish button when the condition is met
    }
  }, [childIndex, FiltershortQuestions[parentIndex]?.children.length]); // Re-run whenever currentIndex changes
  useEffect(() => {
    const totalQuestions = FiltershortQuestions.reduce(
      (acc, parent) => acc + parent.children.length,
      0,
    );
    const currentQuestionNumber =
      childIndex +
      1 +
      FiltershortQuestions.slice(0, parentIndex).reduce(
        (acc, parent) => acc + parent.children.length,
        0,
      );

    setIsReviewEnabled(currentQuestionNumber === totalQuestions);
  }, [childIndex, parentIndex, FiltershortQuestions]);

  useEffect(() => {
    if (active) {
      setAttempts(Array(allChildren?.length).fill(null)); // Initialize attempts as unseen
      dispatch(setAttempted(Array(allChildren?.length).fill(null))); // Dispatch the updated attempts array to Redux
      dispatch(initializeVisited(allChildren.length));
      dispatch(initializeFlags(allChildren.length));
    }

    if (review) {
      const hasValidAnswer =
        userAnswers[currentIndex] !== null && userAnswers[currentIndex] !== "";
      setTestCheckAnswer(hasValidAnswer);
    }
  }, [active]); // Ensure 'active' is the only dependency

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

  if (reviewLoading) {
    return <Loader />;
  }

  return (
    <div className={`min-h-screen ${darkModeRedux ? "dark" : ""} `}>
      <div className="flex w-full items-center justify-between bg-white p-5 lg:hidden">
        <div className="">
          <img src="/assets/small-logo.png" alt="" />
        </div>

        <div className="" onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>
      <div className="flex h-screen items-center justify-center dark:bg-[#1E1E2A]">
        <div className="h-screen w-[100%] max-w-full md:w-[80%] lg:w-[70%] xl:w-[55%]">
          {/* Header Section */}

          <div className="relative ml-6 mt-5 flex w-[90%] items-center justify-between rounded-md bg-[#3CC8A1] p-6 text-white sm:w-[95%] lg:w-[720px]">
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-[4px] w-full overflow-hidden rounded-md bg-[#D4D4D8]">
              <div
                className="h-full bg-[#60B0FA] transition-all duration-300 ease-in-out"
                style={{
                  width: `${
                    ((childIndex +
                      1 +
                      FiltershortQuestions.slice(0, parentIndex).reduce(
                        (acc, parent) => acc + parent.children.length,
                        0,
                      )) /
                      FiltershortQuestions.reduce(
                        (total, parent) => total + parent.children.length,
                        0,
                      )) *
                    100
                  }%`,
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
                disabled={childIndex + 1 <= 1 && parentIndex === 0}
                className={`text-white ${
                  childIndex + 1 <= 1 && parentIndex === 0
                    ? "cursor-not-allowed opacity-70"
                    : ""
                }`}
                onClick={prevQuestion}
              >
                <img src="/assets/whiteLeftArrow.svg" alt="" />
              </button>
              <h2 className="text-center font-semibold">
                Question{" "}
                {
                  // Calculate current question number
                  childIndex +
                    1 +
                    FiltershortQuestions.slice(0, parentIndex).reduce(
                      (acc, parent) => acc + parent.children.length,
                      0,
                    )
                }{" "}
                of{" "}
                {
                  // Calculate total questions
                  FiltershortQuestions.reduce(
                    (total, parent) => total + parent.children.length,
                    0,
                  )
                }
              </h2>
              <button
                className={`text-white ${
                  childIndex + 1 ===
                    FiltershortQuestions[parentIndex]?.children?.length &&
                  parentIndex === FiltershortQuestions.length - 1
                    ? "opacity-70 disabled:cursor-not-allowed"
                    : ""
                }`}
                onClick={nextQuestion}
              >
                <img src="/assets/whiteRightArrow.svg" alt="" />
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
                  flaggedQuestions[currentIndex] ? "white" : "currentColor"
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

          {/* Question Section */}
          <div className="mt-6 p-6">
            <p className="w-[100%] text-justify text-[#000000] dark:text-white lg:w-[720px]">
              {FiltershortQuestions[parentIndex]?.parentQuestion}
            </p>

            <h3 className="mt-4 w-[100%] text-wrap text-[14px] font-bold text-[#27272A] dark:text-white lg:w-[720px]">
              {
                FiltershortQuestions[parentIndex]?.children[childIndex]
                  ?.questionLead
              }
            </h3>

            <div></div>
            {!testCheckAnswer ? (
              <div>
                <textarea
                  className={`mt-2 h-[180px] w-[100%] text-wrap rounded-[6px] border border-[#ffff] p-5 placeholder:text-[14px] placeholder:font-normal placeholder:text-[#D4D4D8] lg:w-[720px] ${
                    error ? "border border-red-500" : "border"
                  }`}
                  placeholder="Type here to answer the question..."
                  onChange={(e) => {
                    setError(false); // Set an error if empty
                    setUserAnswerState(e.target.value);
                  }}
                  value={userAnswer}
                />
                {error ? (
                  <p className="text-[12px] text-red-500">
                    Please enter your answer
                  </p>
                ) : (
                  <p></p>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  className="mt-2 h-[120px] w-[100%] text-wrap rounded-[6px] bg-[#E4E4E7] p-5 lg:w-[720px]"
                  placeholder="This is the user’s answer"
                  value={userAnswer || userAnswers[currentIndex] || ""}
                  readOnly
                />

                <textarea
                  className="mt-2 h-[180px] w-[100%] text-wrap rounded-[6px] border border-[#3CC8A1] p-5 placeholder:font-semibold placeholder:text-[#3F3F46] lg:w-[720px]"
                  placeholder="This is the user’s answer"
                  value={
                    FiltershortQuestions[parentIndex]?.children[childIndex]
                      ?.idealAnswer
                  }
                  readOnly
                />
              </div>
            )}
            <div></div>
            {testCheckAnswer ? (
              <div className="flex flex-wrap items-center sm:space-x-5 md:space-x-10 lg:space-x-3">
                {review ? (
                  <button
                    className="mt-2 flex w-[100%] items-center justify-center gap-x-3 rounded-md border border-[#60B0FA] bg-[#60B0FA] px-6 py-2 text-[14px] font-semibold text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#60B0FA] lg:w-[720px] lg:text-[16px]"
                    onClick={() => {
                      navigation("/dashboard");
                    }}
                  >
                    Back to Dashboard
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
                ) : (
                  <div className="flex w-[100%] flex-wrap items-center justify-center sm:space-x-5 md:space-x-5 lg:justify-start lg:space-x-3">
                    <button
                      className="w-[150px] rounded-[8px] bg-[#EF4444] p-2 text-[#FFFF] lg:w-[230px]"
                      onClick={handleIncorrectClick}
                    >
                      Incorrect{" "}
                      <span className="ml-2 rounded-[4px] bg-[#F4F4F5] p-1.5 font-medium text-[#27272A]">
                        1
                      </span>
                    </button>
                    <button
                      className="w-[150px] rounded-[8px] bg-[#FF9741] p-2 text-[#FFFF] lg:w-[230px]"
                      onClick={handlePartialClick}
                    >
                      Partial{" "}
                      <span className="ml-2 rounded-[4px] bg-[#F4F4F5] p-1 font-medium text-[#27272A]">
                        2
                      </span>
                    </button>
                    <button
                      className="w-[150px] rounded-[8px] bg-[#3CC8A1] p-2 text-[#FFFF] lg:w-[230px]"
                      onClick={handleCorrectClick}
                    >
                      Correct{" "}
                      <span className="ml-2 rounded-[4px] bg-[#F4F4F5] p-1 font-medium text-[#27272A]">
                        3
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="group">
                <button
                  className="mt-2 flex w-[100%] items-center justify-center gap-x-3 rounded-md border border-[#3CC8A1] bg-[#3CC8A1] px-6 py-2 text-[14px] font-semibold text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#3CC8A1] lg:w-[720px] lg:text-[16px]"
                  onClick={handleCheckAnswer}
                >
                  Check Answer
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
            )}

            {isReviewEnabled && (
              <div
                className={`flex w-[100%] items-center gap-x-2 font-semibold lg:w-[720px] ${
                  isFinishEnabled
                    ? "cursor-pointer text-[#3CC8A1]"
                    : "cursor-not-allowed text-[#D4D4D8]"
                } justify-center`}
                onClick={handleFinishAndReviewAtLast}
              >
                {!review && (
                  <button className="group mt-2 flex w-full items-center justify-center gap-x-3 rounded-md border border-[#60B0FA] bg-[#60B0FA] px-6 py-2 text-[14px] font-semibold text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#60B0FA] lg:text-[16px]">
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
                )}
              </div>
            )}

            <div className="mt-5 flex w-[100%] items-center justify-between gap-x-10 lg:w-[720px]">
              <div className="flex w-full items-center justify-between">
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
            </div>

            <div></div>
          </div>
        </div>

        {/* Sidebar Section */}

        <div className={`fixed right-0 top-0 hidden dark:border lg:block`}>
          <div
            className={`flex h-screen w-[28%] flex-col items-center justify-between bg-white text-black dark:bg-[#1E1E2A] md:w-[25%] lg:w-[240px] ${
              !toggleSidebar ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 dark:border-[1px] dark:border-[#3A3A48]`}
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
                    className="lucide lucide-chevrons-left dark:text-white"
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
                      accuracy > 34 ? "bg-[#3CC8A1]" : "bg-[#FF453A]"
                    } text-center text-[#ffff]`}
                  >
                    <div>
                      {" "}
                      <p className="mt-3 text-[12px]">Accuracy</p>
                      <p className="text-[36px] font-black">{accuracy}%</p>
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
            </div>

            <>
              <hr className="mx-5" />
            </>
            <div className="mb-2">
              <div className="text-xs">
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
          </div>
          <div
            className={`absolute right-0 top-0 h-screen w-[28%] bg-white md:w-[25%] lg:w-[50px] ${
              !toggleSidebar && "translate-x-full"
            } text-black transition-transform duration-300 dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A]`}
          >
            <div
              className="flex cursor-pointer items-center dark:bg-[#1E1E2A]"
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
                class="lucide lucide-chevrons-right ml-3 mt-5 dark:text-white"
              >
                <path d="m6 17 5-5-5-5" />
                <path d="m13 17 5-5-5-5" />
              </svg>{" "}
            </div>
          </div>
        </div>
      </div>

      {isAccordionVisible && (
        <div className="flex w-[100%] items-center justify-center gap-x-96 md:w-[70%] xl:w-[55%] 2xl:w-[90%]">
          <p className="text-[16px] font-medium text-[#3F3F46]">
            How did you find this question?
          </p>
          <button className="bg-gray-200 p-3 text-[14px] text-[#71717A]">
            Report
          </button>
        </div>
      )}
      {isAccordionVisible && <DiscussionBoard />}

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
            <div className="h-[96px] w-[90%] rounded-[8px] bg-[#3CC8A1] text-center text-[#ffff] 2xl:w-[308px]">
              {isTimerMode === "Endless" ? (
                <div>
                  {" "}
                  <p className="mt-3 text-[12px]">Accuracy</p>
                  <p className="text-[36px] font-black">{accuracy}%</p>
                </div>
              ) : (
                <div>
                  <p className="mt-3 text-[12px]">Time:</p>

                  <p className="text-[36px] font-black">
                    {<p>{formatTime(timer)}</p>}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="">
            <div className="flex w-full items-center justify-between p-5 text-[12px]">
              <span
                className={`w-[30%] cursor-pointer text-center ${
                  selectedFilter === "All"
                    ? "border-b-[1px] border-[#3CC8A1] text-[#3CC8A1]"
                    : "hover:text-[#3CC8A1]"
                }`}
                onClick={() => handleFilterChange("All")}
              >
                All
              </span>
              <span
                className={`w-[36%] cursor-pointer text-center ${
                  selectedFilter === "Flagged"
                    ? "border-b-[1px] border-[#3CC8A1] text-[#3CC8A1]"
                    : "hover:text-[#3CC8A1]"
                }`}
                onClick={() => handleFilterChange("Flagged")}
              >
                Flagged
              </span>
              <span
                className={`w-[30%] cursor-pointer text-center ${
                  selectedFilter === "Unseen"
                    ? "border-b-[1px] border-[#3CC8A1] text-[#3CC8A1]"
                    : "hover:text-[#3CC8A1]"
                }`}
                onClick={() => handleFilterChange("Unseen")}
              >
                Unseen
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="grid grid-cols-5 gap-2">
              {indicesToDisplay.map((num, i) => {
                const bgColor =
                  result.result[num] === true
                    ? "bg-[#3CC8A1]" // Correct
                    : result.result[num] === false
                      ? "bg-[#FF453A]" // Incorrect (Flagged)
                      : "bg-gray-300"; // Unseen (null)

                return (
                  <div key={i}>
                    <div
                      className={`${bgColor} flex h-[26px] w-[26px] items-center justify-center rounded-[2px] text-[14px] font-bold text-white`}
                      onClick={() => markQuestion(num)} // Use `num` for marking
                    >
                      <p>{num + 1}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-x-28 text-[#71717A]">
            <button
              className={`${
                currentPage === 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              onClick={currentPage > 0 ? prevPage : null}
              disabled={currentPage === 0}
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
                className="lucide lucide-move-left"
              >
                <path d="M6 8L2 12L6 16" />
                <path d="M2 12H22" />
              </svg>
            </button>

            <button
              className={`${
                (currentPage + 1) * itemsPerPage >= currentItems.length
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
              onClick={
                (currentPage + 1) * itemsPerPage < currentItems.length
                  ? nextPage
                  : null
              }
              disabled={(currentPage + 1) * itemsPerPage >= currentItems.length}
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
                className="lucide lucide-move-right"
              >
                <path d="M18 8L22 12L18 16" />
                <path d="M2 12H22" />
              </svg>
            </button>
          </div>
          <div className="px-10 py-5 text-[#D4D4D8]">
            <hr />
          </div>

          <div>
            <DeepChatAI W="250px" />
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
  );
};

export default ShortQuestion;
