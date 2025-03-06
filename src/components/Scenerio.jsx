import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./common/Sidebar";
import { Link } from "react-router-dom";
import Logo from "./common/Logo";
import { RxCross2 } from "react-icons/rx";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { TbBaselineDensityMedium } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchModules,
  fetchOSCEData,
} from "../redux/features/osce-static/osce-static.service";
import MobileBar from "./common/Drawer";
import { fetchSubscriptions } from "../redux/features/subscription/subscription.service";
import {
  openModal,
  toggleModal,
} from "../redux/features/osce-bot/virtual.modal.slice";
import ShowPopup from "./common/ShowPopup";

const Scenarios = () => {
  const { data = [], loading } = useSelector((state) => state.osce);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const darkModeRedux = useSelector((state) => state.darkMode.isDarkMode);
  const [activeFilters, setActiveFilters] = useState([]);
  const [module, setModule] = useState([]);
  const [activeTab, setActiveTab] = useState("static");
  const categoryRef = useRef(null);
  const { subscriptions, plan, loader, planType } = useSelector(
    (state) => state?.subscription,
  );
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const sortDataById = (data) => {
    return data.slice().sort((a, b) => {
      return sortAscending ? a.id - b.id : b.id - a.id;
    });
  };

  const toggleSortOrder = () => {
    setSortAscending((prev) => !prev);
  };

  const sortedData = sortDataById(data);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newFilter = searchQuery.trim();
      if (newFilter && !activeFilters.includes(newFilter)) {
        setActiveFilters([...activeFilters, newFilter]);
        setSearchQuery("");
      }
    }
  };

  const filteredData = sortedData.filter((osce) => {
    const lowerCaseCategory = osce.category.toLowerCase();
    const lowerCaseStationName = osce.stationName.toLowerCase();
    const lowerCaseId = osce.id.toString();

    const matchedCategory = module.find(
      (mod) => mod.categoryId === osce.module,
    );
    const categoryName = matchedCategory ? matchedCategory.categoryName : "";
    const lowerCaseCategoryName = categoryName.toLowerCase();

    const matchesCategory = selectedCategory
      ? lowerCaseCategory === selectedCategory.toLowerCase()
      : true;

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some((filter) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
          lowerCaseCategory.includes(lowerCaseFilter) ||
          lowerCaseStationName.includes(lowerCaseFilter) ||
          lowerCaseId.includes(lowerCaseFilter) ||
          lowerCaseCategoryName.includes(lowerCaseFilter)
        );
      });

    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const matchesSearchQuery =
      lowerCaseCategory.includes(lowerCaseSearchQuery) ||
      lowerCaseStationName.includes(lowerCaseSearchQuery) ||
      lowerCaseId.includes(lowerCaseSearchQuery) ||
      lowerCaseCategoryName.includes(lowerCaseSearchQuery);

    return matchesCategory && matchesFilters && matchesSearchQuery;
  });

  useEffect(() => {
    dispatch(openModal());
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        localStorage.removeItem("minutes");
        localStorage.removeItem("seconds");

        const osceData = await dispatch(fetchOSCEData()).unwrap();
        const moduleNames = osceData.map((item) => item.module);

        dispatch(fetchModules(moduleNames))
          .unwrap()
          .then((res) => {
            setModule(res);
          })
          .catch((err) => {
            console.error("Fetch Modules Error:", err);
          });
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className={`min-h-screen md:flex ${darkModeRedux ? "dark" : ""}`}>
      <div className="fixed hidden h-full md:block">
        <Sidebar />
      </div>
      <div className="flex w-full items-center justify-between bg-white p-5 md:hidden">
        <div className="">
          <img src="/assets/small-logo.png" alt="" />
        </div>
        <div className="" onClick={toggleDrawer}>
          <TbBaselineDensityMedium />
        </div>
      </div>
      <div className="w-full px-10 dark:bg-[#1E1E2A] md:ml-[250px]">
        <div className="mt-8">
          <div className="flex w-full items-center justify-center gap-x-2 text-[14px] lg:text-[16px] xl:text-[20px]">
            {/* Static Scenarios Tab */}
            <div
              className={`flex w-full items-center justify-center space-x-4 rounded-tl-[4px] ${
                activeTab === "static" ? "bg-[#FAFAFA]" : "bg-[#E4E4E7]"
              } dark:border dark:border-[#3A3A48] dark:bg-[#1E1E2A]`}
            >
              <button
                className="flex items-center space-x-4 px-4 py-2 font-semibold text-[#3F3F46] dark:text-white"
                onClick={() => setActiveTab("static")}
              >
                <span>Static Scenarios</span>
              </button>
            </div>

            {/* AI Patient Scenarios Tab */}
            <div
              className={`flex w-full items-center justify-center rounded-tr-[4px] ${
                activeTab === "ai" ? "bg-[#FAFAFA]" : "bg-[#E4E4E7]"
              } dark:border dark:border-[#3A3A48] dark:bg-[#1E1E2A]`}
            >
              <button
                className="flex items-center space-x-4 px-4 py-2 font-medium text-[#3F3F46] dark:text-white"
                onClick={() => setActiveTab("ai")}
              >
                <span>AI Patient Scenarios</span>
              </button>
            </div>
          </div>

          {activeTab === "static" ? (
            <div>
              <div className="rounded-[8px] bg-white p-5 dark:border dark:border-[#3A3A48] dark:bg-[#1E1E2A]">
                <div className="flex items-center justify-center">
                  <div className="mb-6 grid justify-items-center gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    {[
                      {
                        cat: "Examination",
                        icon: (
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
                            className="lucide lucide-stethoscope"
                          >
                            <path d="M11 2v2" />
                            <path d="M5 2v2" />
                            <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
                            <path d="M8 15a6 6 0 0 0 12 0v-3" />
                            <circle cx="20" cy="10" r="2" />
                          </svg>
                        ),
                      },
                      {
                        cat: "History",
                        icon: (
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
                            className="lucide lucide-file-clock"
                          >
                            <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
                            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                            <circle cx="8" cy="16" r="6" />
                            <path d="M9.5 17.5 8 16.25V14" />
                          </svg>
                        ),
                      },
                      {
                        cat: "Interpretation",
                        icon: (
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
                            className="lucide lucide-heart-pulse"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                          </svg>
                        ),
                      },
                      {
                        cat: "Counselling",
                        icon: (
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
                            className="lucide lucide-message-circle"
                          >
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                          </svg>
                        ),
                      },
                    ].map((category) => (
                      <button
                        key={category.cat}
                        onClick={() => {
                          // Toggle the selected category
                          setSelectedCategory((prev) =>
                            prev === category.cat ? null : category.cat,
                          );
                        }}
                        className={`flex h-[45px] w-[200px] items-center justify-center rounded-[4px] px-4 py-2 font-bold lg:h-[56px] lg:w-[242px] ${
                          selectedCategory === category.cat
                            ? "bg-transparent text-[#3CC8A1]"
                            : "bg-[#3CC8A1] text-white"
                        } border border-[#3CC8A1] text-[14px] transition-all duration-200 lg:text-[18px]`}
                      >
                        <span>{category.icon}</span>
                        <span className="text-[20px]">{category.cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-around gap-5 xl:flex-row">
                  <div className="flex w-full items-center justify-end gap-x-5">
                    <div className="flex h-[45px] w-full max-w-[347px] items-center gap-2 bg-[#F4F4F5] px-5 text-black">
                      <button className="text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                          />
                        </svg>
                      </button>
                      <input
                        type="text"
                        placeholder="Search for specialties, topics and symptoms"
                        className="w-full bg-transparent text-[9px] font-semibold focus:outline-none sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-evenly">
                  <div className="flex w-[68%] flex-wrap items-center justify-start space-x-4 p-4">
                    {activeFilters.map((filter, index) => (
                      <div
                        key={index}
                        className="mb-2 flex items-center rounded-full border-2 border-[#FF9741] px-4 py-2 text-[#FF9741]"
                      >
                        <span>{filter}</span>
                        <button
                          onClick={() => {
                            setActiveFilters(
                              activeFilters.filter((_, i) => i !== index),
                            );
                          }}
                          className="ml-2"
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
                            className="lucide lucide-x"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-10 flex w-full flex-col items-center justify-center">
                  <div className="grid w-full gap-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                    {loading ? (
                      [...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="w-full animate-pulse rounded-[8px] border bg-[#F4F4F5] p-4 text-center shadow-md dark:border-[#3A3A48] dark:bg-[#1E1E2A]"
                        >
                          <div className="mx-auto mb-3 h-5 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
                          <div className="mx-auto mb-2 h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
                          <div className="mx-auto mb-4 h-5 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
                          <div className="mx-auto h-10 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
                        </div>
                      ))
                    ) : filteredData.length > 0 ? (
                      filteredData.map((osce) => {
                        const matchedCategory = module.find(
                          (mod) => mod.categoryId === osce.module,
                        );
                        const categoryName = matchedCategory
                          ? matchedCategory.categoryName
                          : "Fetching...";

                        return (
                          <div
                            key={osce.id}
                            className="relative cursor-pointer rounded-[8px] border bg-[#F4F4F5] p-4 text-center shadow-md hover:opacity-75 dark:border-[#3A3A48] dark:bg-[#1E1E2A]"
                            onClick={() => {
                              if (
                                plan === null ||
                                planType === null ||
                                planType === undefined
                              ) {
                                setShowPlanPopup(true);
                              }
                            }}
                          >
                            {plan === null ||
                            planType === null ||
                            planType === undefined ? (
                              <div className="flex h-full flex-col justify-between">
                                <div>
                                  <p className="absolute right-2 top-1 text-[12px] font-semibold text-[#A1A1AA] dark:text-white lg:text-[14px]">
                                    {osce.category}
                                  </p>
                                  <div className="mt-3 text-[20px] font-bold text-[#3F3F46] dark:text-white">
                                    {categoryName}
                                  </div>
                                  <div className="text-[16px] font-semibold text-[#A1A1AA] dark:text-white">
                                    {osce.stationName}
                                  </div>
                                </div>
                                <div className="text-[48px] font-bold text-[#52525B] dark:text-white">
                                  #{osce.id}
                                </div>
                              </div>
                            ) : (
                              <Link
                                to={
                                  activeTab === "static"
                                    ? `/static-scenerios-detail/${osce.id}`
                                    : `/osce-ai-bot/${categoryName.replace(/\s+/g, "-")}`
                                }
                              >
                                <div className="flex h-full flex-col justify-between">
                                  <div>
                                    <p className="absolute right-2 top-1 text-[12px] font-semibold text-[#A1A1AA] dark:text-white lg:text-[14px]">
                                      {osce.category}
                                    </p>
                                    <div className="mt-3 text-[20px] font-bold text-[#3F3F46] dark:text-white">
                                      {categoryName}
                                    </div>
                                    <div className="text-[16px] font-semibold text-[#A1A1AA] dark:text-white">
                                      {osce.stationName}
                                    </div>
                                  </div>
                                  <div className="text-[48px] font-bold text-[#52525B] dark:text-white">
                                    #{osce.id}
                                  </div>
                                </div>
                              </Link>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center text-gray-500 dark:text-gray-300">
                        No records found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            activeTab === "ai" && (
              <div className="rounded-[8px] bg-white p-5 dark:border dark:border-[#3A3A48] dark:bg-[#1E1E2A]">
                <div className="flex items-center justify-center">
                  <div className="mb-6 grid justify-items-center gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    {[
                      {
                        cat: "Examination",
                        icon: (
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
                            className="lucide lucide-stethoscope"
                          >
                            <path d="M11 2v2" />
                            <path d="M5 2v2" />
                            <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
                            <path d="M8 15a6 6 0 0 0 12 0v-3" />
                            <circle cx="20" cy="10" r="2" />
                          </svg>
                        ),
                      },
                      {
                        cat: "History",
                        icon: (
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
                            className="lucide lucide-file-clock"
                          >
                            <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
                            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                            <circle cx="8" cy="16" r="6" />
                            <path d="M9.5 17.5 8 16.25V14" />
                          </svg>
                        ),
                      },
                      {
                        cat: "Interpretation",
                        icon: (
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
                            className="lucide lucide-heart-pulse"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                          </svg>
                        ),
                      },
                      {
                        cat: "Counselling",
                        icon: (
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
                            className="lucide lucide-message-circle"
                          >
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                          </svg>
                        ),
                      },
                    ].map((category) => (
                      <button
                        key={category.cat}
                        onClick={() => {
                          // Toggle the selected category
                          setSelectedCategory((prev) =>
                            prev === category.cat ? null : category.cat,
                          );
                        }}
                        className={`flex h-[45px] w-[200px] items-center justify-center rounded-[4px] px-4 py-2 font-bold lg:h-[56px] lg:w-[242px] ${
                          selectedCategory === category.cat
                            ? "bg-transparent text-[#3CC8A1]"
                            : "bg-[#3CC8A1] text-white"
                        } border border-[#3CC8A1] text-[14px] transition-all duration-200 lg:text-[18px]`}
                      >
                        <span>{category.icon}</span>
                        <span className="text-[20px]">{category.cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-around gap-5 xl:flex-row">
                  <div className="flex w-full items-center justify-end gap-x-5">
                    <div className="flex h-[45px] w-full max-w-[347px] items-center gap-2 bg-[#F4F4F5] px-5 text-black">
                      <button className="text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                          />
                        </svg>
                      </button>
                      <input
                        type="text"
                        placeholder="Search for specialties, topics and symptoms"
                        className="w-full bg-transparent text-[9px] font-semibold focus:outline-none sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-evenly">
                  <div className="flex w-[68%] flex-wrap items-center justify-start space-x-4 p-4">
                    {activeFilters.map((filter, index) => (
                      <div
                        key={index}
                        className="mb-2 flex items-center rounded-full border-2 border-[#FF9741] px-4 py-2 text-[#FF9741]"
                      >
                        <span>{filter}</span>
                        <button
                          onClick={() => {
                            setActiveFilters(
                              activeFilters.filter((_, i) => i !== index),
                            );
                          }}
                          className="ml-2"
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
                            className="lucide lucide-x"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-10 flex flex-col items-center justify-center">
                  <div className="grid w-full gap-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                    {loading ? (
                      [...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="w-full animate-pulse rounded-[8px] border bg-[#F4F4F5] p-4 text-center shadow-md dark:border-[#3A3A48] dark:bg-[#1E1E2A]"
                        >
                          <div className="mx-auto mb-3 h-5 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
                          <div className="mx-auto mb-2 h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
                          <div className="mx-auto mb-4 h-5 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
                          <div className="mx-auto h-10 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
                        </div>
                      ))
                    ) : filteredData.length > 0 ? (
                      filteredData.map((osce) => {
                        const matchedCategory = module.find(
                          (mod) => mod.categoryId === osce.module,
                        );
                        const categoryName = matchedCategory
                          ? matchedCategory.categoryName
                          : "Fetching...";

                        return (
                          <div
                            key={osce.id}
                            className="relative cursor-pointer rounded-[8px] border bg-[#F4F4F5] p-4 text-center shadow-md hover:opacity-75 dark:border-[#3A3A48] dark:bg-[#1E1E2A]"
                          >
                            <Link
                              to={
                                activeTab === "static"
                                  ? `/static-scenerios-detail/${osce.id}`
                                  : `/osce-ai-bot/${osce.id}`
                              }
                            >
                              <div className="flex h-full flex-col justify-between">
                                <div>
                                  <p className="absolute right-2 top-1 text-[12px] font-semibold text-[#A1A1AA] dark:text-white lg:text-[14px]">
                                    {osce.category}
                                  </p>
                                  <div className="mt-3 text-[20px] font-bold text-[#3F3F46] dark:text-white">
                                    {categoryName}
                                  </div>
                                  <div className="text-[16px] font-semibold text-[#A1A1AA] dark:text-white">
                                    {osce.stationName}
                                  </div>
                                </div>
                                <div className="text-[48px] font-bold text-[#52525B] dark:text-white">
                                  #{osce.id}
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center text-gray-500 dark:text-gray-300">
                        No records found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      {showPlanPopup && <ShowPopup setShowPlanPopup={setShowPlanPopup} />}
      <MobileBar
        toggleDrawer={toggleDrawer}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default Scenarios;
