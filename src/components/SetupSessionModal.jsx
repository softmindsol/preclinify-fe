import React, { useEffect, useState, useCallback, useRef } from "react";
import { setLimit } from "../redux/features/limit/limit.slice";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../utils/GlobalApiHandler";
import { Link, useNavigate } from "react-router-dom";
import { changeMode } from "../redux/features/mode/mode.slice";
import { fetchMcqsByModules } from "../redux/features/SBA/sba.service";
import { fetchQuesGenModules } from "../redux/features/question-gen/question-gen.service";
import {
  fetchMockTest,
  fetchMockTestById,
} from "../redux/features/mock-test/mock.service";
import {
  fetchCorrectShortQuestionByModules,
  fetchFilteredCorrecUnAnsweredShortQuestions,
  fetchIncorrectCorrectShortQuestionByModules,
  fetchInCorrectShortQuestionByModules,
  fetchModulesById,
  fetchShortQuestionByModules,
  fetchShortQuestionByModulesById,
  fetchShortQuestionsWithChildren,
  fetchSqaChild,
} from "../redux/features/SAQ/saq.service";
import {
  toggleNotAnsweredQuestion,
  togglePreviouslyCorrectQuestion,
  togglePreviouslyIncorrectQuestion,
} from "../redux/features/filter-question/filter-question.slice";
import {
  fetchAllResult,
  fetchCorrectIncorrectResult,
  fetchCorrectResult,
  fetchIncorrectResult,
  fetchUnattemptedAndCorrectQuestions,
  fetchUnattemptedAndIncorrectQuestions,
  fetchUnattemptedQuestions,
} from "../redux/features/filter-question/filter-question.service";
import { fetchAllResultSaq } from "../redux/features/filter-question/filter-saq-question.service";
import { fetchDailyWork } from "../redux/features/all-results/result.sba.service";
import { fetchMcqsQuestionFreeBank } from "../redux/features/free-trial-bank/free-trial-bank.service";

const SetupSessionModal = ({
  isOpenSetUpSessionModal,
  setIsOpenSetUpSessionModal,
}) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.mode?.questionMode?.selectedOption);
  const typeQues = useSelector(
    (state) => state.mode?.questionMode?.selectedPreClinicalOption,
  );
  const darkModeRedux = useSelector((state) => state?.darkMode?.isDarkMode);
  const isLoading = useSelector(
    (state) => state?.loading?.[fetchMcqsByModules.typePrefix],
  );
  const isLoadingFreeTrial = useSelector(
    (state) => state?.loading?.[fetchMcqsQuestionFreeBank.typePrefix],
  );
  const isLoadingShortQuestion = useSelector(
    (state) => state?.loading?.[fetchShortQuestionByModules.typePrefix],
  );
  const presentationSBA = useSelector(
    (state) => state?.SBAPresentation?.isSBAPresentation,
  );
  const presentationMock = useSelector(
    (state) => state?.MockPresentation?.isMockPresentation,
  );
  const isQuesGenLoading = useSelector(
    (state) => state?.loading?.[fetchQuesGenModules.typePrefix],
  );
  const isMockLoading = useSelector(
    (state) => state?.loading?.[fetchMockTestById.typePrefix],
  );
  const modalRef = useRef(null); // Reference for modal container
  const navigation = useNavigate();
  const [numQuestions, setNumQuestions] = useState();
  const [timer, setTimer] = useState(5);
  const [modeType, setModeType] = useState("Endless");
  const filterQuestion = useSelector((state) => state?.filterQuestion);
  const { limit } = useSelector((state) => state?.limit);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saqModule, setSAQModule] = useState([]);
  const userId = localStorage.getItem("userId");
  const SaqfilterQuestion = useSelector((state) => state?.SaqfilterQuestion);
  const FiltershortQuestions = useSelector(
    (state) => state?.FiltershortQuestions?.results,
  ); // Debounced dispatch handler
  const data = useSelector((state) => state.module);
  const { freeTrialType } = useSelector(
    (state) => state?.FreeTrialMcqsQuestion,
  );


  const filteredSBAModules = data.data.filter((module) => module);

  const debouncedDispatch = useCallback(
    debounce((value) => {
      dispatch(setLimit(value));
    }, 0), // 0ms delay
    [dispatch],
  );

  // Update state and call debounced handler
  const handleNumQuestionsChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0; // Ensure it's a number
    if (value <= 200) {
      setNumQuestions(value);
      debouncedDispatch(value); // Call debounced function
      dispatch(setLimit(value));
    }
  };

  // Update state and call debounced handler
  const handleTimerChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0; // Ensure it's a number
    if (value <= 200) {
      setTimer(value);
      debouncedDispatch(value); // Call debounced function
    }
  };

  // Close modal when clicking outside
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpenSetUpSessionModal(false);
    }
  };

  const handleQuestion = () => {
    if (type === "SAQ" && !isLoadingShortQuestion) {
      navigation("/short-question");
    } else if (type === "SBA" && presentationSBA) {
      navigation("/sba-presentation");
    } else if (type === "SBA" && !isLoading) {
      navigation("/question-card");
    } else if (type === "Trial" && freeTrialType === "SBATrialBank") {
      navigation("/question-card");
    } else if (type === "Trial" && freeTrialType === "SAQTrialBank") {
      navigation("/short-question");
    } else if (type === "Mock" && presentationMock) {
      navigation("/mock-presentation");
    } else if (typeQues === "QuesGen" && !isQuesGenLoading) {
      navigation("/question-generator");
    } else if (type === "Mock" && !isMockLoading) {
      navigation("/mock-test");
    }
  };


  useEffect(() => {
    if (type === "SBA" && !isLoading) {
      if (
        !filterQuestion?.NotAnsweredQuestion &&
        filterQuestion?.previouslyIncorrectQuestion &&
        filterQuestion?.previouslyCorrectQuestion
      ) {
        dispatch(
          fetchCorrectIncorrectResult({
            moduleId: filterQuestion.selectedModules,
            totalLimit: limit,
            userId,
          }),
        )
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.error(err);
          });
      } else if (
        !filterQuestion?.previouslyIncorrectQuestion &&
        filterQuestion?.previouslyCorrectQuestion &&
        filterQuestion?.NotAnsweredQuestion
      ) {
        dispatch(
          fetchUnattemptedAndCorrectQuestions({
            moduleId: filterQuestion.selectedModules,
            totalLimit: limit,
            userId,
          }),
        )
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.error(err);
          });
      } else if (
        filterQuestion?.previouslyIncorrectQuestion &&
        !filterQuestion?.previouslyCorrectQuestion &&
        filterQuestion?.NotAnsweredQuestion
      ) {
        dispatch(
          fetchUnattemptedAndIncorrectQuestions({
            moduleId: filterQuestion.selectedModules,
            totalLimit: limit,
            userId,
          }),
        )
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.error(err);
          });
      } else if (
        filterQuestion?.NotAnsweredQuestion &&
        filterQuestion?.previouslyIncorrectQuestion &&
        filterQuestion?.previouslyCorrectQuestion
      ) { 
        dispatch(
          fetchAllResult({
            moduleId: filterQuestion.selectedModules,
            totalLimit: limit,
            userId,
          }),
        )
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.error(err);
          });
      } else if (filterQuestion?.previouslyCorrectQuestion) {
        dispatch(
          fetchCorrectResult({
            moduleId: filterQuestion.selectedModules,
            totalLimit: limit,
            userId,
          }),
        )
          .unwrap()
          .then((res) => {})
          .catch((err) => {});
      } else if (filterQuestion?.previouslyIncorrectQuestion) {
        dispatch(
          fetchIncorrectResult({
            moduleId: filterQuestion.selectedModules,
            totalLimit: limit,
            userId,
          }),
        )
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.error(err);
          });
      } else if (filterQuestion?.NotAnsweredQuestion) {
        dispatch(
          fetchUnattemptedQuestions({
            moduleId: filterQuestion.selectedModules,
            totalLimit: limit,
            userId,
          }),
        )
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [
    type,
    isLoading,
    dispatch,
    filterQuestion?.NotAnsweredQuestion,
    filterQuestion?.previouslyIncorrectQuestion,
    filterQuestion?.previouslyCorrectQuestion,
  ]);

  useEffect(() => {
    if (type === "SAQ") {
      if (
        filterQuestion?.NotAnsweredQuestion &&
        filterQuestion?.previouslyIncorrectQuestion &&
        filterQuestion?.previouslyCorrectQuestion
      ) {
        dispatch(
          fetchShortQuestionsWithChildren({
            moduleIds: filterQuestion.selectedModules,
            limit: limit,
            userId,
          }),
        );
      } else if (
        !filterQuestion?.NotAnsweredQuestion &&
        filterQuestion?.previouslyIncorrectQuestion &&
        filterQuestion?.previouslyCorrectQuestion
      ) {
        dispatch(
          fetchIncorrectCorrectShortQuestionByModules({
            moduleIds: filterQuestion.selectedModules,
            limit: limit,
            userId,
          }),
        )
          .unwrap()
          .then()
          .catch((err) => {
            console.log("previously correctIncorrect error", err);
          });
      } else if (filterQuestion?.previouslyCorrectQuestion) {
        dispatch(
          fetchCorrectShortQuestionByModules({
            moduleIds: filterQuestion.selectedModules,
            limit: limit,
            userId,
          }),
        )
          .unwrap()
          .then((res) => {})
          .catch((err) => {});
      } else if (filterQuestion?.previouslyIncorrectQuestion) {
        dispatch(
          fetchInCorrectShortQuestionByModules({
            moduleIds: filterQuestion.selectedModules,
            limit: limit,
            userId,
          }),
        )
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [
    type,
    isLoading,
    dispatch,
    filterQuestion?.NotAnsweredQuestion,
    filterQuestion?.previouslyIncorrectQuestion,
    filterQuestion?.previouslyCorrectQuestion,
    limit,
  ]);

  useEffect(() => {
    if (isOpenSetUpSessionModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenSetUpSessionModal]);

  useEffect(() => {
    dispatch(changeMode({ mode: modeType, timer }));
    dispatch(setLimit());
    dispatch(
      fetchDailyWork({
        userId,
        selectedModules: filteredSBAModules,
      }),
    );
  }, [modeType, timer, dispatch, filterQuestion.selectedModules]);

  return (
    <div
      className={`flex items-center justify-center rounded-[4px] bg-white ${
        darkModeRedux ? "dark" : ""
      }`}
    >
      {/* Modal */}
      {isOpenSetUpSessionModal && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div
            ref={modalRef} // Attach ref to modal container
            className="relative min-h-[670px] w-[451px] rounded-[4px] bg-white p-6 text-black shadow-lg dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A]"
          >
            <h2 className="mb-4 text-[20px] font-bold text-[#3F3F46] dark:text-white">
              Set up session
            </h2>

            {/* Number of Questions */}
            <div className="mb-4 mt-8">
              <label className="mb-1 block text-[20px] font-semibold text-[#52525B] dark:text-white">
                Number of Questions
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  value={numQuestions}
                  onChange={handleNumQuestionsChange}
                  className="w-full rounded border px-[20px] py-[10px] text-end placeholder-transparent dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white"
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform text-[14px] font-medium text-[#A1A1AA] dark:text-white">
                  Maximum: 200
                </span>
              </div>
            </div>

            {/* Pick The Module To Save In */}
            {type === "QuesGen" && (
              <div className="mb-4 mt-8">
                <label className="mb-1 block text-[20px] font-semibold text-[#52525B] dark:text-white">
                  Pick The Module To Save In
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    className="w-full rounded border px-[20px] py-[10px] text-end placeholder-transparent dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-[14px] font-medium text-[#A1A1AA] dark:text-white">
                    Start Typing
                  </span>
                </div>
              </div>
            )}

            {/* Mode Type */}
            <div className="mb-4 mt-8 flex items-center justify-between">
              <label className="mb-1 block text-[20px] font-semibold text-[#52525B] dark:text-white">
                Mode Type
              </label>
              <div className="relative w-[145px]">
                <select
                  value={modeType}
                  onChange={(e) => setModeType(e.target.value)}
                  className="h-[42px] w-full appearance-none rounded border border-[#A1A1AA] px-3 py-2 pr-8 text-[14px] dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white"
                >
                  <option value="Endless">Endless</option>
                  <option value="Exam">Exam</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {modeType === "Exam" && (
              <div className="relative w-full">
                <label className="mb-1 block text-[20px] font-semibold text-[#A1A1AA] dark:text-white">
                  Amount of time
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={timer}
                    onChange={handleTimerChange}
                    className="w-full rounded border px-3 py-2 text-end placeholder-transparent dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white"
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform text-[14px] font-medium text-[#A1A1AA] dark:text-white">
                    In Minutes
                  </span>
                </div>
              </div>
            )}
            {(type === "SBA" || type === "SAQ") && (
              <div className="mb-6 mt-8">
                <p className="mb-2 block text-[20px] font-medium text-[#52525B] dark:text-white">
                  Question Type
                </p>
                <div className="mb-10 mt-5 flex items-center justify-between">
                  <label className="capitalize text-gray-600 dark:text-white">
                    Not Answered Questions
                  </label>
                  <input
                    type="checkbox"
                    checked={filterQuestion?.NotAnsweredQuestion}
                    onChange={() => dispatch(toggleNotAnsweredQuestion())} // Toggle the state
                    className={`mr-2 h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-200 checked:border-[#3CC8A1] checked:bg-[#3CC8A1]`}
                  />
                </div>

                <div className="mb-10 mt-5 flex items-center justify-between">
                  <label className="capitalize text-gray-600 dark:text-white">
                    Previously Incorrect Questions
                  </label>
                  <input
                    type="checkbox"
                    checked={filterQuestion?.previouslyIncorrectQuestion}
                    onChange={() =>
                      dispatch(togglePreviouslyIncorrectQuestion())
                    } // Toggle the state
                    className={`mr-2 h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-200 checked:border-[#3CC8A1] checked:bg-[#3CC8A1]`}
                  />
                </div>

                <div className="mb-10 mt-5 flex items-center justify-between">
                  <label className="capitalize text-gray-600 dark:text-white">
                    Previously Correct Questions
                  </label>
                  <input
                    type="checkbox"
                    checked={filterQuestion?.previouslyCorrectQuestion}
                    onChange={() => dispatch(togglePreviouslyCorrectQuestion())} // Toggle the state
                    className={`mr-2 h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-200 checked:border-[#3CC8A1] checked:bg-[#3CC8A1]`}
                  />
                </div>
              </div>
            )}
            {/* Action Buttons */}
            {type === "SBA" || type === "SAQ" ? (
              <div className="absolute bottom-3 left-5 right-5">
                <button
                  onClick={handleQuestion}
                  className={`py-2 ${
                    !filterQuestion?.previouslyIncorrectQuestion &&
                    !filterQuestion?.previouslyCorrectQuestion &&
                    !filterQuestion?.NotAnsweredQuestion
                      ? "bg-[#82c7b4]"
                      : "bg-[#3CC8A1]"
                  } ${
                    filterQuestion?.isLoading && "disabled:cursor-not-allowed"
                  } w-[100%] rounded-[8px] text-[16px] font-semibold text-white hover:bg-[#2e9e7e] dark:text-white`}
                  disabled={
                    (!filterQuestion?.previouslyIncorrectQuestion &&
                      !filterQuestion?.previouslyCorrectQuestion &&
                      !filterQuestion?.NotAnsweredQuestion) ||
                    filterQuestion?.isLoading
                  }
                >
                  {filterQuestion?.isLoading ? "Loading..." : "Start Questions"}
                </button>
              </div>
            ) : (
              <div className="absolute bottom-3 left-5 right-5">
                <button
                  onClick={handleQuestion}
                  className={`py-2 ${
                    isLoading ||
                    isLoadingShortQuestion ||
                    isQuesGenLoading ||
                    isMockLoading
                      ? "bg-[#82c7b4]"
                      : "bg-[#3CC8A1]"
                  } ${
                    isLoading ||
                    isQuesGenLoading ||
                    (isMockLoading && "disabled:cursor-not-allowed")
                  } w-[100%] rounded-[8px] text-[16px] font-semibold text-white hover:bg-[#2e9e7e] dark:text-white`}
                  disabled={
                    isLoading ||
                    isLoadingShortQuestion ||
                    isQuesGenLoading ||
                    isMockLoading
                  }
                >
                  {isLoading ||
                  isLoadingShortQuestion ||
                  isQuesGenLoading ||
                  isMockLoading
                    ? "Loading..."
                    : "Start Questions"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupSessionModal;
