import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import Drawer from "react-modern-drawer";
//import styles 👇
import "react-modern-drawer/dist/index.css";
import StackedBar from "../components/charts/stacked-bar";
import { useDispatch, useSelector } from "react-redux";
import { clearResult } from "../redux/features/result/result.slice";
import { resetQuestionReviewValue } from "../redux/features/question-review/question-review.slice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import Logo from "../components/common/Logo";
import { TbBaselineDensityMedium } from "react-icons/tb";
import { clearRecentSessions } from "../redux/features/recent-session/recent-session.slice";
import { fetchMcqsByModules } from "../redux/features/SBA/sba.service";
import SetupSessionModal from "../components/SetupSessionModal";
import { setResetLimit } from "../redux/features/limit/limit.slice";
import supabase from "../config/helper";
// import { fetchExamDate } from '../redux/features/exam-countdown/service';
import { fetchUserId } from "../redux/features/user-id/userId.service";
import { fetchDaysUntilExam } from "../redux/features/examDate/service";
import { fetchUserInformation } from "../redux/features/personal-info/personal-info.service";
import { fetchUserStreak } from "../redux/features/streak/streak.service";
import BarChart from "../components/charts/stacked-bar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [workEntries, setWorkEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formattedMonth, setFormattedMonth] = useState("");
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [localRecentSession, setLocalRecentSession] = useState([]);
  const data = useSelector((state) => state.module);
  const [isOpenSetUpSessionModal, setIsOpenSetUpSessionModal] = useState(false);
  const { limit } = useSelector((state) => state.limit);
  const [isLoading, setIsLoading] = useState(false);
  const [isSession, setIsSession] = useState(false);
  const [sessionId, setSessionId] = useState([]);
  const darkModeRedux = useSelector((state) => state.darkMode.isDarkMode);
  const examDuration = useSelector((state) => state?.examDates?.examDate);
  const profile = useSelector((state) => state.personalInfo.userInfo[0]);
  const userId = useSelector((state) => state.user.userId);
  const streaks = useSelector((state) => state?.streak?.streak) || [];
  const userInfo = useSelector((state) => state?.user?.userInfo);

  const [filteredData, setFilteredData] = useState({
    correct: [],
    incorrect: [],
    days: [],
  });

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchDailyWork = async () => {
      try {
        const { data, error } = await supabase
          .from("resultsHistory")
          .select("*")
          .eq("userId", "123456543");

        if (error) throw error;

        const formattedData = data.map((entry) => {
          const date = new Date(entry.timeStamp).toISOString().split("T")[0];
          return { ...entry, date };
        });

        setWorkEntries(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Error fetching daily work");
        setLoading(false);
      }
    };

    fetchDailyWork();
  }, []);

  useEffect(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);

    const aggregatedResults = {};

    workEntries.forEach((entry) => {
      const date = entry.date;

      if (!aggregatedResults[date]) {
        aggregatedResults[date] = {
          workCount: 0,
          correct: 0,
          incorrect: 0,
          totalResult: 0,
        };
      }

      aggregatedResults[date].workCount += 1;

      aggregatedResults[date].correct += entry.correct || 0;
      aggregatedResults[date].incorrect += entry.incorrect || 0;
      aggregatedResults[date].totalResult += entry.result || 0;
    });

    const allDays = eachDayOfInterval({ start, end }).map((day) => {
      const formattedDate = format(day, "yyyy-MM-dd");
      const workEntry = aggregatedResults[formattedDate] || {
        workCount: 0,
        correct: 0,
        incorrect: 0,
        totalResult: 0,
      };

      return {
        date: formattedDate,
        workCount: workEntry.workCount,
        correct: workEntry.correct,
        incorrect: workEntry.incorrect,
        totalResult: workEntry.totalResult,
      };
    });

    setFormattedMonth(format(selectedDate, "MMMM"));
    setDays(allDays);
  }, [selectedDate, workEntries]);

  const getColorClass = (workCount) => {
    if (workCount > 99) return "bg-[#047857]"; // > 99
    if (workCount > 75) return "bg-[#059669]"; // > 75
    if (workCount > 50) return "bg-[#34D399]"; // > 50
    if (workCount > 25) return "bg-[#6EE7B7]"; // > 25
    if (workCount > 0) return "bg-[#A7F3D0]"; // > 0
    return "bg-[#E4E4E7]"; // Default background for days with no workCount
  };

  function handleContinue() {
    setIsOpenSetUpSessionModal(true);
  }

  useEffect(() => {
    const handleSessionContinue = async (sessionId) => {
      // Open the setup session modal
      setIsOpenSetUpSessionModal(true);
      // Find the selected modules based on the sessionId

      // No need to split, just trim the sessionId if necessary
      const flatModuleIds = sessionId
        .split(",")
        .map((id) => parseInt(id.trim(), 10)); // Split and convert to numbers

      // Make an API call based on the selected module IDs

      dispatch(
        fetchMcqsByModules({ moduleIds: flatModuleIds, totalLimit: limit }),
      )
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.error("Error fetching questions:", err);
        })
        .finally(() => {
          setIsLoading(false); // Reset loading state after API call
        });
    };
    if (isSession === true) {
      handleSessionContinue(sessionId);
    }
  }, [limit, isSession]);
  useEffect(() => {
    // Check if recentSessions are available in localStorage
    const storedSessions = localStorage.getItem("recentSessions");
    if (storedSessions) {
      setLocalRecentSession(JSON.parse(storedSessions));
    }
    localStorage.removeItem("minutes");
    localStorage.removeItem("seconds");
    dispatch(setResetLimit());

    dispatch(clearRecentSessions());
  }, []);
  useEffect(() => {
    localStorage.removeItem("examTimer");
    dispatch(clearResult());
    dispatch(resetQuestionReviewValue());
  }, []);

  useEffect(() => {
    dispatch(fetchUserId());
    dispatch(fetchDaysUntilExam(userId));
    dispatch(fetchUserInformation({ userId }));
    dispatch(fetchUserStreak({ userId }));
    dispatch(fetchUserInformation({ user_id: userId }));
  }, []);

  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  };

  const { startOfWeek, endOfWeek } = getWeekRange(selectedDate);

  const filteredStreaks = streaks?.filter((streak) => {
    const streakDate = new Date(streak?.streakDate);
    return streakDate >= startOfWeek && streakDate <= endOfWeek;
  });

  const noOfDays = filteredStreaks?.map((streak) =>
    new Date(streak?.streakDate).getDate(),
  );

  const totalCorrects = filteredStreaks?.map((streak) => streak?.totalCorrect);
  const totalIncorrects = filteredStreaks?.map(
    (streak) => streak?.totalIncorrect,
  );

  return (
    <div className={`w-full lg:flex ${darkModeRedux ? "dark" : ""}`}>
      <div className="fixed hidden h-full text-black dark:bg-[#1E1E2A] dark:text-white lg:block">
        <Sidebar />
      </div>
      <div className="flex items-center justify-between bg-white p-5 lg:hidden">
        <div className="">
          <img src="/assets/small-logo.png" alt="" />
        </div>

        <div className="" onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto py-2 text-black dark:bg-[#1E1E2A] md:py-10 lg:ml-[250px]">
        <div className="xs:gap-x-16 flex h-[150px] w-full flex-row items-center justify-center gap-x-3 py-5 sm:justify-evenly sm:gap-x-36 xl:gap-x-36 2xl:gap-x-20">
          <p className="text-[18px] font-extrabold text-[#52525B] dark:text-white sm:text-[24px] xl:text-[32px]">
            Hello,{" "}
            {profile?.firstName
              ? profile.firstName
              : userInfo?.user_metadata?.displayName?.split(" ")[0] ||
                "unknown"}
          </p>

          <div className="flex flex-col items-center space-y-3 md:flex-row md:gap-x-5 md:space-y-0">
            <div className="flex h-[85px] w-[160px] flex-col items-center justify-center rounded-[6px] bg-[#FFFFFF] dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] xl:w-[250px]">
              {examDuration === null ? (
                <div className="text-center">
                  <p className="text-[16px] font-medium text-[#71717A]">
                    Set your exam date
                  </p>
                  <Link
                    to={"/setting"}
                    className="cursor-pointer font-bold text-[#ED8936] hover:text-[#ff9b48]"
                  >
                    Set up
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[18px] font-black text-[#FF9741] dark:text-white sm:text-[24px] xl:text-[32px]">
                    {examDuration || "N/A"} Days
                  </p>
                  <p className="text-[10px] font-medium text-[#52525B] dark:text-white xl:text-[14px]">
                    Until your exam
                  </p>
                </div>
              )}
            </div>
            <div className="h-[85px] w-[200px] rounded-[6px] bg-[#FFFFFF] text-center text-black dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] xl:w-[250px]">
              <div className="flex h-full items-center justify-center gap-x-5">
                <img
                  src="https://images.unsplash.com/photo-1719937051124-91c677bc58fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D"
                  alt="aaaa"
                  className="h-10 w-10 rounded-full xl:h-14 xl:w-14"
                />
                <div className="">
                  <p className="text-[14px] font-semibold text-[#52525B] dark:text-white xl:text-[18px]">
                    {profile?.firstName && profile?.lastName
                      ? `${profile.firstName} ${profile.lastName}`
                      : userInfo?.user_metadata?.displayName || "unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-5 md:mt-0">
          <div className="flex w-full flex-col items-center justify-center gap-x-5 md:flex-row">
            <div className="xs:w-[420px] h-[430px] w-[95%] rounded-lg bg-white p-6 text-black shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] md:h-[520px] xl:w-[610px] 2xl:w-[745px]">
              <div className="flex items-end justify-end">
                <div className="relative mb-5 w-[180px]">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="I/R"
                    locale="en-GB"
                    showWeekNumbers
                    showWeekPicker
                    className="relative w-[150px] cursor-pointer rounded border p-2 text-[12px] dark:bg-[#1E1E2A] dark:text-white sm:w-[180px] sm:text-[14px]" // Added cursor-pointer class
                  />
                  <span
                    className={`pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 transform transition-transform duration-200 dark:text-white sm:right-3 ${
                      isCalendarOpen ? "rotate-180" : ""
                    }`}
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
                      className="lucide lucide-chevron-down"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[12px] font-semibold text-[#52525B] dark:text-white sm:text-[14px]">
                  Current Streak
                </p>
                <p className="text-[18px] font-black text-[#FF9741] dark:text-white sm:text-[24px] xl:text-[32px]">
                  {streaks?.streak} Days
                </p>
              </div>

              <div className="flex justify-between gap-x-10">
                <div className="mt-4 grid grid-cols-7 gap-[4px] xl:gap-2">
                  {days?.map((day, index) => {
                    const target = day.workCount * 100;
                    const workPercentage = Math.floor(
                      Math.min((day.totalResult / target) * 100, 100),
                    );
                    const bgColorClass = getColorClass(workPercentage);

                    // Compare current day with streak date
                    const currentDate = new Date().toISOString().split("T")[0]; // Format as yyyy-mm-dd
                    const isStreakDay = currentDate === streaks?.streakDate; // Check if this day matches streak date

                    // Ensure that day.date is in the same format as streak.streakDate
                    const dayDateFormatted = new Date(day.date)
                      .toISOString()
                      .split("T")[0];

                    // Check if the current day matches streak day
                    const isCurrentDayStreak =
                      dayDateFormatted === streaks?.streakDate;

                    return (
                      <div
                        key={index}
                        className={`xs:w-8 xs:h-8 relative flex h-6 w-6 items-center justify-center rounded-md text-white xl:h-12 xl:w-12 ${
                          day.workCount > 0 ? bgColorClass : "bg-[#E4E4E7]"
                        } ${isCurrentDayStreak ? "border-2 border-yellow-500" : ""}`} // Highlight streak day
                      >
                        {/* Render streak icon only for the streak day */}
                        {isCurrentDayStreak && streaks?.streak === 1 && (
                          <img
                            src="/assets/heat-icon.svg"
                            alt="heat icon"
                            className="object-fit absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-col space-y-2 dark:text-white">
                  <div className="flex items-center">
                    <div className="xs:w-8 xs:h-8 h-6 w-6 rounded-md bg-[#047857] xl:h-12 xl:w-12"></div>
                    <span className="ml-2 text-[12px] sm:text-[16px]">
                      {" "}
                      &gt; 99
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="xs:w-8 xs:h-8 h-6 w-6 rounded-md bg-[#059669] xl:h-12 xl:w-12"></div>
                    <span className="ml-2 text-[12px] sm:text-[16px]">
                      {" "}
                      &gt; 75
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="xs:w-8 xs:h-8 h-6 w-6 rounded-md bg-[#34D399] xl:h-12 xl:w-12"></div>
                    <span className="ml-2 text-[12px] sm:text-[16px]">
                      {" "}
                      &gt; 50
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="xs:w-8 xs:h-8 h-6 w-6 rounded-md bg-[#6EE7B7] xl:h-12 xl:w-12"></div>
                    <span className="ml-2 text-[12px] sm:text-[16px]">
                      {" "}
                      &gt; 25
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="xs:w-8 xs:h-8 h-6 w-6 rounded-md bg-[#A7F3D0] xl:h-12 xl:w-12"></div>
                    <span className="ml-2 text-[12px] sm:text-[16px]">
                      {" "}
                      &lt; 25
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-[200px] sm:w-[400px]">
                <p className="text-center text-[14px] text-[#71717A] dark:text-white sm:text-[16px]">
                  {formattedMonth}
                </p>
              </div>
            </div>
            <div className="xs:w-[420px] mt-2 h-[430px] w-[95%] rounded-lg bg-white text-black shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] md:mt-0 md:h-[520px] md:w-[280px] xl:w-[320px]">
              <div className="mt-2 p-5 text-center text-[14px] font-bold text-[#52525B] xl:text-[18px]">
                <p className="dark:text-white">Quick Start</p>
              </div>
              <hr />
              <div className="mt-4 flex flex-col items-center justify-between gap-y-8 p-5">
                {localRecentSession.length > 0 ? (
                  localRecentSession.map((sessionId, index) => {
                    const categoryIds = sessionId
                      .split(",")
                      .map((id) => id.trim()); // Convert to array of strings

                    // Find category names corresponding to the category IDs
                    const categoryNames = categoryIds
                      .map((id) => {
                        const category = data.data.find(
                          (item) => item.categoryId === parseInt(id),
                        ); // Find the category by ID
                        return category ? category.categoryName : null; // Return the category name or null if not found
                      })
                      .filter((name) => name !== null); // Filter out any null values
                    const truncateCategoryNames = (names) => {
                      const joinedNames = names.join(", ");
                      return joinedNames.length > 15
                        ? `${joinedNames.slice(0, 15)}+...`
                        : joinedNames;
                    };
                    // Return the JSX for each session
                    return (
                      <div
                        key={index}
                        className="flex w-full items-center justify-between"
                      >
                        <div>
                          <p className="text-[14px] font-medium text-[#3F3F46] dark:text-white md:text-[16px]">
                            {truncateCategoryNames(categoryNames)}
                          </p>
                          <p className="text-[12px] font-semibold text-[#D4D4D8] dark:text-white md:text-[14px]">
                            Recent Session
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setSessionId(sessionId);
                              setIsSession(true);
                              handleContinue();
                            }}
                            className="rounded-[4px] border-[1px] border-[#FF9741] p-2 text-[12px] font-semibold text-[#FF9741] transition-all duration-200 ease-in-out hover:bg-gradient-to-r hover:from-[#FF9741] hover:to-[#FF5722] hover:text-white dark:border-white dark:text-white dark:hover:bg-gradient-to-r dark:hover:from-[#1E1E2A] dark:hover:to-[#3E3E55] dark:hover:text-[#FF9741] dark:hover:shadow-lg dark:hover:shadow-[#FF9741]/60 md:text-[16px]"
                          >
                            Continue &gt;
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center">
                    <p>No Session.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-x-5 md:flex-row-reverse">
            <div className="xs:w-[420px] h-[430px] w-[95%] rounded-lg text-black shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] md:h-[500px] md:w-[435px] xl:w-[665px] 2xl:w-[800px]">
              {/* <h2 className='font-bold text-[20px] text-center py-3 dark:text-white'>
                Monthly Progress
              </h2> */}
              {/* <StackedBar days={days} streak={streak} /> */}
              <BarChart
                heading="Weekly Progress"
                series={[
                  { name: "Correct", data: totalCorrects },
                  { name: "Incorrect", data: totalIncorrects },
                ]}
                colors={["#3CC8A1", "#FF9741"]}
                categories={noOfDays}
              />

              {/* 
              <div className='flex items-center justify-center gap-x-[75px] mt-7  md:mt-5'>
                <p className='text-[#52525B] font-medium dark:text-white'>
                  Correct Questions
                </p>
                <div className='w-[16px] h-[16px] rounded-[2px] bg-[#3CC8A1]' />
              </div>
              <div className='flex items-center justify-center gap-x-16 mb-3 md:mb-0'>
                <p className='text-[#52525B] font-medium dark:text-white'>
                  Incorrect Questions
                </p>
                <div className='w-[16px] h-[16px] rounded-[2px] bg-[#FF9741]' />
              </div> */}
            </div>

            <div className="xs:w-[420px] mt-2 h-[400px] w-[95%] rounded-lg bg-white text-black shadow-md dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] md:mt-0 md:h-[500px] md:w-[261px]">
              <div className="flex cursor-pointer items-center justify-between p-5 text-center text-[18px] font-semibold text-[#52525B]">
                <p className="text-[#3F3F46] dark:text-white">Questions</p>
                <p className="flex items-center justify-center text-[16px] dark:text-white">
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
                    class="lucide lucide-chevron-down text-[#FF9741] dark:text-white"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>{" "}
                </p>
              </div>
              <hr />
              <div className="flex flex-col items-center justify-center">
                <div
                  onClick={() => navigate("/questioning", { state: "SAQ" })}
                  className="flex w-[200px] cursor-pointer items-center justify-center gap-x-5 px-5 py-3 dark:text-white"
                >
                  <div className="w-[20%]">
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
                      class="lucide lucide-pencil dark:text-white"
                    >
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </div>
                  <div className="w-[80%]">
                    <p className="text-[14px] font-semibold text-[#3F3F46] dark:text-white">
                      Short Answer
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => navigate("/questioning", { state: "SBA" })}
                  className="flex w-[200px] cursor-pointer items-center justify-center gap-x-5 px-5 py-3"
                >
                  <div className="w-[20%]">
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
                      class="lucide lucide-circle-check dark:text-white"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div className="w-[80%]">
                    <p className="text-[14px] font-semibold text-[#3F3F46] dark:text-white">
                      Single Best <br /> Answer
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => navigate("/questioning", { state: "Mock" })}
                  className="flex w-[200px] cursor-pointer items-center justify-center gap-x-5 px-5 py-3"
                >
                  <div className="w-[20%]">
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
                      class="lucide lucide-bone dark:text-white"
                    >
                      <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" />
                    </svg>
                  </div>
                  <div className="w-[80%]">
                    <p className="text-[14px] font-semibold text-[#3F3F46] dark:text-white">
                      Mock Paper
                    </p>
                  </div>
                </div>

                {/* <div className='flex items-center justify-center gap-x-5 px-5 py-3 w-[200px] '>
                  <div className='w-[20%]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='lucide lucide-pencil dark:text-white'
                    >
                      <path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' />
                      <path d='m15 5 4 4' />
                    </svg>
                  </div>
                  <div className='w-[80%]'>
                    <p className='font-semibold text-[14px] text-[#3F3F46] dark:text-white'>
                      Anatomy Quiz
                    </p>
                  </div>
                </div> */}

                <div
                  onClick={() => navigate("/questioning", { state: "QuesGen" })}
                  className="flex w-[200px] cursor-pointer items-center justify-center gap-x-5 px-5 py-3"
                >
                  <div className="w-[20%]">
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
                      class="lucide lucide-chart-no-axes-combined dark:text-white"
                    >
                      <path d="M12 16v5" />
                      <path d="M16 14v7" />
                      <path d="M20 10v11" />
                      <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
                      <path d="M4 18v3" />
                      <path d="M8 14v7" />
                    </svg>
                  </div>
                  <div className="w-[80%]">
                    <p className="text-[14px] font-semibold text-[#3F3F46] dark:text-white">
                      Question <br />
                      Generation
                    </p>
                  </div>
                </div>
              </div>
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
            <NavLink to={"/setting"}>
              <div className="group flex cursor-pointer items-center space-x-3 text-[#3F3F46]">
                <i className="fa fa-cog text-xl group-hover:text-[#3CC8A1]"></i>
                <span className="text-[14px] font-medium group-hover:text-[#3CC8A1]">
                  Settings
                </span>
              </div>
            </NavLink>
          </div>
        </div>
      </Drawer>

      {isOpenSetUpSessionModal && (
        <SetupSessionModal
          isOpenSetUpSessionModal={isOpenSetUpSessionModal}
          setIsOpenSetUpSessionModal={setIsOpenSetUpSessionModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
