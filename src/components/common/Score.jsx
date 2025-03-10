import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
// import component 👇
import Drawer from "react-modern-drawer";
import { RxCross2 } from "react-icons/rx";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import { TbBaselineDensityMedium } from "react-icons/tb";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFeedbackMessage } from "../../utils/GlobalApiHandler";
import { addResultEntry } from "../../redux/features/accuracy/accuracy.service";
import { setQuestionReview } from "../../redux/features/question-review/question-review.slice";
import {
  sessionCompleted,
  updateRecentSessions,
} from "../../redux/features/recent-session/recent-session.slice";
import { fetchMockTestById } from "../../redux/features/mock-test/mock.service";
import { fetchQuesGenModules } from "../../redux/features/question-gen/question-gen.service";
import { fetchMcqsByModules } from "../../redux/features/SBA/sba.service";
import { fetchShortQuestionByModules } from "../../redux/features/SAQ/saq.service";
import MobileBar from "./Drawer";
const Score = () => {
  const [isOpen, setIsOpen] = useState(false);
  const result = useSelector((state) => state.result);
  const accuracy = useSelector((state) => state.accuracy.accuracy);
  const dispatch = useDispatch();
  const [correct, setCorrect] = useState(null);
  const [incorrect, setIncorrect] = useState(null);
  const [unseen, setUnseen] = useState(0);
  const [sqacorrect, setSqaCorrect] = useState(0);
  const [sqaincorrect, setSqaIncorrect] = useState(0);
  const [sqaunseen, setSqaUnseen] = useState(0);
  const [sqaPartial, setSqapartial] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [totalAttemped, setTotalAttemped] = useState(0);
  const [saqTotalAttempted, setSaqTotalAttemped] = useState(0);
  const navigation = useNavigate();
  const recentSession = useSelector(
    (state) => state?.recentSession?.recentSessions,
  );
  const darkModeRedux = useSelector((state) => state.darkMode.isDarkMode);
  const type = useSelector((state) => state.mode?.questionMode?.selectedOption);
  const typeQues = useSelector(
    (state) => state.mode?.questionMode?.selectedPreClinicalOption,
  );
 const { freeTrialType } = useSelector(
    (state) => state?.FreeTrialMcqsQuestion,
  );

  const presentationSBA = useSelector(
    (state) => state?.SBAPresentation?.isSBAPresentation,
  );
  const isLoading = useSelector(
    (state) => state?.loading?.[fetchMcqsByModules.typePrefix],
  );
  const isLoadingShortQuestion = useSelector(
    (state) => state?.loading?.[fetchShortQuestionByModules.typePrefix],
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
  const attempts = useSelector((state) => state?.attempts?.attempts);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
 
  const handleQuestionReview = () => {
    dispatch(setQuestionReview(true));

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
    const moduleId = localStorage.getItem("module");
    // Calculate counts for correct, incorrect, and unseen
    const correctCount = result.result.filter((value) => value === true).length;
    const incorrectCount = result.result.filter(
      (value) => value === false,
    ).length;
    const partialCount = result.result.filter(
      (value) => value === "partial",
    ).length;
    const unseenCount = result.result.filter(
      (value) => value === null || value === undefined,
    ).length;

    const sqaCorrectCount = attempts.filter((value) => value === true).length;
    const sqaIncorrectCount = attempts.filter(
      (value) => value === false,
    ).length;
    const sqaPartialCount = attempts.filter(
      (value) => value === "partial",
    ).length;
    const sqaUnseenCount = attempts.filter(
      (value) => value === null || value === undefined,
    ).length;

    setSqaCorrect(sqaCorrectCount);
    setSqaIncorrect(sqaIncorrectCount);
    setSqaUnseen(sqaUnseenCount);
    setSqapartial(sqaPartialCount);
    setSaqTotalAttemped(sqaCorrectCount + sqaIncorrectCount + sqaPartialCount);

    // Update the states
    setCorrect(correctCount);
    setIncorrect(incorrectCount);
    setUnseen(unseenCount);
    setTotalAttemped(correctCount + incorrectCount);
    const response = getFeedbackMessage(Math.floor(accuracy));
    setFeedback(response);
    dispatch(
      addResultEntry({
        userId: "123456543",
        result: accuracy,
        incorrect: incorrectCount,
        correct: correctCount,
        moduleId: moduleId,
      }),
    );
    dispatch(sessionCompleted(false));
  }, []);

  useEffect(() => {
    if (recentSession.length > 0) {
      // Retrieve existing sessions from localStorage
      const existingSessions =
        JSON.parse(localStorage.getItem("recentSessions")) || [];

      // Combine existing sessions with the new session entry while removing duplicates
      const updatedSessions = Array.from(
        new Set([...existingSessions, ...recentSession]),
      );

      // Keep only the last 3 sessions
      const trimmedSessions = updatedSessions.slice(-3);

      // Store the updated sessions in localStorage
      localStorage.setItem("recentSessions", JSON.stringify(trimmedSessions));
    }
  }, [recentSession]); // Dependency added to run effect when recentSession changes

  return (
    <div
      className={`min-h-screen w-full lg:flex ${darkModeRedux ? "dark" : ""}`}
    >
      <div className="fixed hidden h-full lg:block">
        <Sidebar />
      </div>

      <div className="flex-grow overflow-y-auto overflow-x-hidden">
        <div className="flex w-full items-center justify-between bg-white p-5 lg:hidden">
          <img src="/assets/small-logo.png" alt="" />

          <div className="" onClick={toggleDrawer}>
            <TbBaselineDensityMedium />
          </div>
        </div>
        <div className="w-full dark:bg-black lg:ml-[150px]">
          <div className="mx-auto w-full max-w-[690px]">
            <div className="mt-2 flex flex-col items-center justify-center">
              <div>
                <img
                  src="/assets/score.png"
                  alt="score ballon"
                  className="h-[150px] w-[350px] object-contain lg:h-[250px]"
                />
              </div>
              <div className="text-center">
                <p className="mb-6 text-lg font-extrabold leading-none text-[#3F3F46] dark:text-white lg:text-2xl">
                  Final Score:
                </p>
                <p className="mb-2 text-5xl font-black text-[#3CC8A1] md:text-6xl lg:text-8xl">
                  {accuracy}%
                </p>
                <p className="mb-5 text-xs font-bold leading-none text-[#A1A1AA] dark:text-white md:text-sm lg:text-base">
                  {feedback}
                </p>
              </div>
              <div>
                <button
                  onClick={handleQuestionReview}
                  className="h-[38px] w-[250px] rounded-[8px] border-[1px] border-[#FF9741] bg-[#FFE9D6] p-2 text-xs font-semibold text-[#FF9741] transition-all duration-200 hover:bg-[#FF9741] hover:text-white md:h-[47px] md:w-[321px] md:text-base"
                >
                  REVIEW QUESTIONS
                </button>
              </div>
            </div>
            <div className="mb-5 flex flex-col-reverse md:flex-col">
              <div className="flex flex-col-reverse space-y-3 md:flex-col">
                <div className="mt-2 md:mt-5">
                  {type === "SAQ" ||
                  (type === "Trial" && freeTrialType === "SAQTrialBank") ? (
                    <p className="text-base font-semibold text-[#3F3F46] dark:text-white lg:text-lg">
                      Total Attempted: {saqTotalAttempted}
                    </p>
                  ) : (
                    <p className="text-base font-semibold text-[#3F3F46] dark:text-white lg:text-lg">
                      Total Attempted: {totalAttemped}
                    </p>
                  )}
                </div>
                {type === "SAQ" ||
                (type === "Trial" && freeTrialType === "SAQTrialBank") ? (
                  <div className="flex flex-col items-center justify-between gap-x-12 text-base font-medium text-[#3F3F46] dark:text-white md:flex-row lg:text-lg">
                    <p className="whitespace-nowrap">
                      Correct:<span>{sqacorrect || 0}</span>
                    </p>
                    <p className="whitespace-nowrap">
                      Incorrect: <span>{sqaincorrect || 0}</span>
                    </p>
                    <p className="whitespace-nowrap">
                      Partial: <span>{sqaPartial || 0}</span>
                    </p>
                    <p className="whitespace-nowrap">
                      Not Attempted: <span>{sqaunseen || 0}</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-x-16 text-base font-medium text-[#3F3F46] dark:text-white md:flex-row lg:text-lg">
                    <p>Correct:{correct || 0}</p>
                    <p>Incorrect: {incorrect || 0}</p>
                    <p>Not Attempted: {unseen || 0}</p>
                  </div>
                )}
              </div>
              {type === "SAQ" ? (
                <div className="mt-2.5 flex items-center">
                  <div className="flex w-[80%] items-center space-x-1">
                    <div
                      className="ml-5 rounded-[6px] bg-[#3CC8A1] p-1.5 md:ml-0"
                      style={{
                        width: `${
                          sqacorrect === 0
                            ? 3
                            : (sqacorrect / (sqacorrect + sqaincorrect)) * 100
                        }%`, // Set width to 2% if correct is 0
                      }}
                    >
                      <span className="hidden items-center text-base font-extrabold text-white md:block lg:text-lg">
                        {sqacorrect}
                      </span>
                    </div>
                    <div
                      className="mr-5 rounded-[6px] bg-[#FF453A] p-1.5 text-right md:mr-0"
                      style={{
                        width: `${
                          sqaincorrect === 0
                            ? 3
                            : (sqaincorrect / (sqacorrect + sqaincorrect)) * 100
                        }%`, // Set width to 2% if incorrect is 0
                      }}
                    >
                      <span className="hidden text-base font-extrabold text-white md:block lg:text-lg">
                        {sqaincorrect}
                      </span>
                    </div>
                    <div
                      className="mr-5 rounded-[6px] bg-[#FF9741] p-1.5 text-right md:mr-0"
                      style={{
                        width: `${
                          sqaPartial === 0
                            ? 3
                            : (sqaPartial / (sqacorrect + sqaincorrect)) * 100
                        }%`, // Set width to 2% if incorrect is 0
                      }}
                    >
                      <span className="hidden text-base font-extrabold text-white md:block lg:text-lg">
                        {sqaPartial}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2.5 flex items-center justify-center">
                  <div className="flex w-[80%] items-center space-x-1">
                    <div
                      className="ml-5 rounded-[6px] bg-[#3CC8A1] p-1.5 md:ml-0"
                      style={{
                        width: `${
                          correct === 0
                            ? 3
                            : (correct / (correct + incorrect)) * 100
                        }%`, // Set width to 2% if correct is 0
                      }}
                    >
                      <span className="hidden items-center text-base font-extrabold text-white md:block lg:text-lg">
                        {correct}
                      </span>
                    </div>
                    <div
                      className="mr-5 rounded-[6px] bg-[#FF453A] p-1.5 text-right md:mr-0"
                      style={{
                        width: `${
                          incorrect === 0
                            ? 3
                            : (incorrect / (correct + incorrect)) * 100
                        }%`, // Set width to 2% if incorrect is 0
                      }}
                    >
                      <span className="hidden text-base font-extrabold text-white md:block lg:text-lg">
                        {incorrect}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileBar
        toggleDrawer={toggleDrawer}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default Score;
