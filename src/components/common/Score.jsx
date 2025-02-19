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
                  {type === "SAQ" ? (
                    <p className="text-base font-semibold text-[#3F3F46] dark:text-white lg:text-lg">
                      Total Attempted: {saqTotalAttempted}
                    </p>
                  ) : (
                    <p className="text-base font-semibold text-[#3F3F46] dark:text-white lg:text-lg">
                      Total Attempted: {totalAttemped}
                    </p>
                  )}
                </div>
                {type === "SAQ" ? (
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

        <div className="mb-10 flex items-center justify-center">
          <Logo />
        </div>
        <div className="flex min-h-screen flex-col justify-between overflow-y-auto">
          <nav className="w-full space-y-5 text-[#3F3F46]">
            {[
              { name: "Dashboard", icon: "house" },
              { name: "Practice", icon: "dumbbell" },
              { name: "Performance", icon: "chart-line" },
              { name: "Friends", icon: "git-merge" },
              { name: "Textbook", icon: "book-open" },
              { name: "OSCE", icon: "bed" },
            ].map((item, index) => (
              <div
                key={index}
                className="group flex cursor-pointer items-center space-x-3 px-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`lucide lucide-${item.icon} group-hover:text-[#3CC8A1]`}
                >
                  {/* Define paths for the icons */}
                  {item.icon === "house" && (
                    <>
                      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </>
                  )}
                  {item.icon === "dumbbell" && (
                    <>
                      <path d="M14.4 14.4 9.6 9.6" />
                      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
                      <path d="m21.5 21.5-1.4-1.4" />
                      <path d="M3.9 3.9 2.5 2.5" />
                      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
                    </>
                  )}
                  {item.icon === "chart-line" && (
                    <>
                      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </>
                  )}
                  {item.icon === "git-merge" && (
                    <>
                      <circle cx="18" cy="18" r="3" />
                      <circle cx="6" cy="6" r="3" />
                      <path d="M6 21V9a9 9 0 0 0 9 9" />
                    </>
                  )}
                  {item.icon === "book-open" && (
                    <>
                      <path d="M12 7v14" />
                      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                    </>
                  )}
                  {item.icon === "bed" && (
                    <>
                      <path d="M2 4v16" />
                      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                      <path d="M2 17h20" />
                      <path d="M6 8v9" />
                    </>
                  )}
                </svg>
                <span className="text-[14px] font-medium group-hover:text-[#3CC8A1]">
                  {item.name}
                </span>
              </div>
            ))}
          </nav>

          {/* Bottom Settings */}
          <div className="mb-40 mt-auto w-full px-6">
            <Link to={"/setting"}>
              <div className="group flex cursor-pointer items-center space-x-3 text-[#3F3F46]">
                <i className="fa fa-cog text-xl group-hover:text-[#3CC8A1]"></i>
                <span className="text-[14px] font-medium group-hover:text-[#3CC8A1]">
                  Settings
                </span>
              </div>
            </Link>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Score;
