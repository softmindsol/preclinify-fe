import React, { useEffect, useState } from "react";
import Sidebar from "./common/Sidebar";
import { TbBaselineDensityMedium } from "react-icons/tb";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Link } from "react-router-dom";
import Logo from "./common/Logo";
import { RxCross2 } from "react-icons/rx";
import SetupSessionModal from "./SetupSessionModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchModules } from "../redux/features/categoryModules/module.service";
import { setLoading } from "../redux/features/loader/loader.slice";
import {
  fetchMcqsByModules,
  fetchTotalSBAQuestion,
} from "../redux/features/SBA/sba.service";
import { clearResult } from "../redux/features/result/result.slice";
import { setResetLimit } from "../redux/features/limit/limit.slice";
import Loader from "./common/Loader";
import { resetQuestionReviewValue } from "../redux/features/question-review/question-review.slice";
import {
  fetchQuestionCounts,
  fetchShortQuestionByModules,
  fetchShortQuestionByModulesById,
  fetchSqaChild,
} from "../redux/features/SAQ/saq.service";

import { setPreclinicalType } from "../redux/features/mode/mode.slice";
import {
  clearRecentSessions,
  updateRecentSessions,
} from "../redux/features/recent-session/recent-session.slice";
import { clearMcqsAccuracy } from "../redux/features/accuracy/accuracy.slice";
import FileUpload from "./Upload";
import { setModeType } from "../redux/features/question-gen/question-gen.slice";
import supabase from "../config/helper";
import {
  resetAttempts,
  setActive,
} from "../redux/features/attempts/attempts.slice";
import {
  fetchQuesGenModules,
  fetchQuesGenModuleById,
} from "../redux/features/question-gen/question-gen.service";
import {
  fetchModulesById,
  fetchMockTest,
  fetchMockTestById,
  fetchTotalMockQuestion,
  fetchMockTestByPresentationId,
  fetchPresentationMock,
  fetchMockMcqsByPresentationId,
} from "../redux/features/mock-test/mock.service";
import { clearFlags } from "../redux/features/flagged/flagged.slice";
import { clearUserAnswers } from "../redux/features/SAQ/userAnswer.slice";
import { resetVisited } from "../redux/features/flagged/visited.slice";
import {
  fetchMcqsByPresentationId,
  fetchPresentation,
} from "../redux/features/sort-by-presentation/sort-by-presentation.service";
import { useLocation } from "react-router-dom";
import {
  resetSBAPresentationValue,
  setSBAPresentationValue,
} from "../redux/features/presentationSBA/presentationSBA.slice";
import {
  resetMockPresentationValue,
  setMockPresentationValue,
} from "../redux/features/MockPresentation/presentationMock.slice";
import { setSelectedSBAModule } from "../redux/features/filter-question/filter-question.slice";
import MobileBar from "./common/Drawer";
import { fetchDailyWork } from "../redux/features/all-results/result.sba.service";
import { fetchSubscriptions } from "../redux/features/subscription/subscription.service";
import { fetchMcqsQuestionFreeBank } from "../redux/features/free-trial-bank/free-trial-bank.service";
import { setFreeTrialType } from "../redux/features/free-trial-bank/free-trial-bank.slice";
import {
  fetchShortQuestionFreeTrial,
  fetchShortQuestionsWithChildrenFreeTrial,
} from "../redux/features/free-trial-bank/free-trial-saq.service";
import ShowPopup from "./common/ShowPopup";

const Questioning = () => {
  // const planType = useSelector((state) => state?.subscriptions?.plan);
  const { subscriptions, plan, loader, planType } = useSelector(
    (state) => state?.subscription,
  );

  const location = useLocation();
  const { state } = location;
  const sqa = useSelector((state) => state?.SQA || []);
  const darkModeRedux = useSelector((state) => state.darkMode.isDarkMode);
  const recentSession = useSelector(
    (state) => state.recentSession.recentSessions,
  );

  const type = useSelector((state) => state.mode?.questionMode?.selectedOption);
  const questionGenModule = useSelector((state) => state?.quesGen);
  const {
    mockTestIds,
    mockMcqsByModulesData,
    presentationData,
    presentationMcqs,
    modules,
    loading,
    error,
  } = useSelector((state) => state.mockModules);
  const data = useSelector((state) => state.module);
  const freeTrialType = useSelector(
    (state) => state?.FreeTrialMcqsQuestion?.freeTrialType || "",
  );
  const { limit } = useSelector((state) => state.limit);
  const [isOpenSetUpSessionModal, setIsOpenSetUpSessionModal] = useState(false);
  const [storedSession, setStoredSession] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [checkedItems, setCheckedItems] = useState({}); // State for checkboxes
  const [moduleId, setModuleId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState(
    planType === undefined ? "Trial" : "SBA",
  );
  const [selectedPreClinicalOption, setSelectedPreClinicalOption] =
    useState("QuesGen");
  const [recentSessions, setRecentSessions] = useState([]);
  const [isSession, setIsSession] = useState(false);
  const [sessionId, setSessionId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const [localRecentSession, setLocalRecentSession] = useState([]);
  const [isSortedByPresentation, setIsSortedByPresentation] = useState(false);
  const [saqModule, setSAQModule] = useState([]);
  const SBADataLength = useSelector(
    (state) => state?.mcqsQuestion?.totalSBAQuestionData,
  );
  const userId = localStorage.getItem("userId");
  const [showPlanPopup, setShowPlanPopup] = useState(false);

  const presentationSBA = useSelector(
    (state) => state?.SBAPresentation?.isSBAPresentation,
  );

  const SBAResult = useSelector((state) => state?.SBAResult?.moduleTotals);
  const [selectPresentation, setSelectPresentation] = useState([]);
  const filteredSBAModules = data.data.filter((module) =>
    module.categoryName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredMockModules = modules.filter((module) =>
    module.categoryName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSAQModules = saqModule.filter((module) =>
    module.categoryName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [totals, setTotals] = useState({
    totalCorrect: 0,
    totalIncorrect: 0,
    totalUnanswered: 0,
  });
  const [moduleTotals, setModuleTotals] = useState({});
  const [mockModuleTotals, setMockModuleTotals] = useState([{}]);
  const [saqModuleTotals, setSaqModuleTotals] = useState({});
  const [selectedTab, setSelectedTab] = useState("Clinical");
  const presentations = useSelector(
    (state) => state.presentations.presentations,
  );
  const handleToggle = () => {
    setIsSortedByPresentation((prev) => !prev);
    dispatch(setSBAPresentationValue(!isSortedByPresentation));
    dispatch(setMockPresentationValue(!isSortedByPresentation));
    if (plan === undefined || planType === null || planType === undefined) {
      setShowPlanPopup(true);
    }
    console.log("handleChange on change", selectedOption);
  };

  const cleanedPresentations = presentations?.map((presentation) => ({
    ...presentation,
    presentationName: presentation.presentationName.replace(/'/g, ""),
  }));

  const cleanedMockPresentations = presentationData?.map((presentation) => ({
    ...presentation,
    presentationName: presentation.presentationName.replace(/'/g, ""),
  }));

  const filterPresentations = (searchTerm) => {
    return cleanedPresentations.filter((presentation) =>
      presentation.presentationName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  };

  const filterMockPresentations = (searchTerm) => {
    return cleanedMockPresentations.filter((presentation) =>
      presentation.presentationName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);

    // if (
    //   plan === undefined ||
    //   planType === null ||
    //   planType === undefined
    // ) {
    //   setShowPlanPopup(true);
    // }
    // console.log(
    //   "handleChange on change",
    //   selectedOption,
    // );
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleFreeTrialOnChange = (trialId) => {
    // If the same checkbox is unchecked, reset the state to an empty string
    dispatch(setFreeTrialType(freeTrialType === trialId ? "" : trialId));
  };
  const handleCheckboxChange = (categoryId) => {
    const selectedModule = data.data.find(
      (module) => module.categoryId === categoryId,
    ); // Find the selected module
    const moduleName = selectedModule ? selectedModule.categoryName : ""; // Get the module name

    setSelectedModules(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // Remove if already selected
          : [...prev, categoryId], // Add if not selected
    );

    setRecentSessions((prev) => {
      const selectedModuleNames = data.data
        .filter(
          (module) =>
            selectedModules.includes(module.categoryId) ||
            module.categoryId === categoryId,
        )
        .map((module) => module.categoryId);
      const selectedModuleName = data.data
        .filter(
          (module) =>
            selectedModules.includes(module.categoryId) ||
            module.categoryId === categoryId,
        )
        .map((module) => module.categoryName);
      // Combine module names into a single string
      const combinedSession = selectedModuleNames.join(", ");

      // Update recent sessions: keep only the last entry if a new combination is made
      return combinedSession ? [combinedSession] : [];
    });
  };

  const handleCheckboxChangePresentation = (presentationId) => {
    const selectedModule = presentations.find(
      (module) => module.presentationId === presentationId,
    ); // Find the selected module
    const moduleName = selectedModule ? selectedModule.presentationName : ""; // Get the module name

    setSelectPresentation(
      (prev) =>
        prev.includes(presentationId)
          ? prev.filter((id) => id !== presentationId) // Remove if already selected
          : [...prev, presentationId], // Add if not selected
    );

    setRecentSessions((prev) => {
      const selectedPresentationNames = presentations
        .filter(
          (module) =>
            selectPresentation.includes(module.presentationId) ||
            module.presentationId === presentationId,
        )
        .map((module) => module.presentationId);
      const selectedModuleName = presentations
        .filter(
          (module) =>
            selectedModules.includes(module.presentationId) ||
            module.presentationId === presentationId,
        )
        .map((module) => module.presentationName);
      // Combine module names into a single string
      const combinedSession = selectedPresentationNames.join(", ");

      // Update recent sessions: keep only the last entry if a new combination is made
      return combinedSession ? [combinedSession] : [];
    });
  };

  const preClinicalHandler = () => {
    setSelectedPreClinicalOption("QuesGen");
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      // Select all module IDs
      const allModuleIds = data?.data?.map((row) => row.categoryId) || [];
      setSelectedModules(allModuleIds);
    } else {
      // Deselect all module IDs
      setSelectedModules([]);
    }
  };

  useEffect(() => {
    handleFreeTrialOnChange();
  }, []);
  function handleContinue() {
    setIsOpenSetUpSessionModal(true);
  }

  useEffect(() => {
    const handleSessionContinue = async (sessionId) => {
      setIsOpenSetUpSessionModal(true); // Set to true to open the modal

      const flatModuleIds = sessionId
        .split(",")
        .map((id) => parseInt(id.trim(), 10)); // Split and convert to numbers
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

  // SAB and
  useEffect(() => {
    if (type === "SBA") {
      dispatch(setLoading({ key: "modules/fetchModules", value: true }));
      setIsSortedByPresentation(false);
      setIsLoading(true);
      dispatch(fetchModules())
        .unwrap()
        .then((res) => {
          setIsLoading(false);
          dispatch(setLoading({ key: "modules/fetchModules", value: false }));

          // dispatch(fetchTotalSBAQuestion({ ids: res }));
        })
        .catch((err) => {
          dispatch(setLoading({ key: "modules/fetchModules", value: false }));
          setIsLoading(false);
        });
    } else if (type === "SAQ") {
      setIsSortedByPresentation(false);

      dispatch(setLoading({ key: "modules/fetchModules", value: true }));
      setIsLoading(true);
      dispatch(fetchModules())
        .unwrap()
        .then((res) => {
          setIsLoading(false);
          dispatch(setLoading({ key: "modules/fetchModules", value: false }));
        })
        .catch((err) => {
          dispatch(setLoading({ key: "modules/fetchModules", value: false }));
          setIsLoading(false);
        });
    } else if (type === "QuesGen") {
      setIsSortedByPresentation(false);

      dispatch(setLoading({ key: "modules/fetchQuesGenModules", value: true }));
      setIsLoading(true);
      dispatch(fetchQuesGenModules())
        .unwrap()
        .then(() => {
          setIsLoading(false);
          dispatch(
            setLoading({ key: "modules/fetchQuesGenModules", value: false }),
          );
        })
        .catch((err) => {
          dispatch(
            setLoading({ key: "modules/fetchQuesGenModules", value: false }),
          );
          setIsLoading(false);
        });
    } else if (type === "Mock") {
      setIsSortedByPresentation(false);

      dispatch(setLoading({ key: "modules/fetchMockTest", value: true }));
      setIsLoading(true);
      dispatch(fetchMockTest())
        .unwrap()
        .then((res) => {
          setIsLoading(false);
          dispatch(setLoading({ key: "modules/fetchMockTest", value: false }));
        })
        .catch((err) => {
          dispatch(
            setLoading({ key: "modules/fetchModulesByMock", value: false }),
          );
          setIsLoading(false);
        });
    }

    sessionStorage.removeItem("persist:result");
    // Dispatch Redux action to clear 'result' from Redux store

    dispatch(resetSBAPresentationValue());
    dispatch(resetMockPresentationValue());
    dispatch(clearResult());
    dispatch(clearMcqsAccuracy());
    dispatch(resetAttempts([]));
    dispatch(setResetLimit());
    dispatch(resetQuestionReviewValue());
    dispatch(clearFlags());
    dispatch(clearUserAnswers());
    dispatch(resetVisited());
    dispatch(setActive(true));
  }, [type, selectedOption, freeTrialType]);

  useEffect(() => {
    dispatch(setPreclinicalType({ selectedOption }));

    if (selectedTab === "Clinical") {
      if (selectedOption === "SBA") {
        dispatch(
          setLoading({ key: "modules/fetchMcqsByModules", value: true }),
        );
        dispatch(
          fetchMcqsByModules({ moduleIds: selectedModules, totalLimit: limit }),
        )
          .unwrap()
          .then(() => {
            dispatch(
              setLoading({ key: "modules/fetchMcqsByModules", value: false }),
            );
          })
          .catch((err) => {
            dispatch(
              setLoading({ key: "modules/fetchMcqsByModules", value: false }),
            );
          });
      } else if (selectedOption === "SAQ") {
        dispatch(
          setLoading({
            key: "modules/fetchShortQuestionByModules",
            value: true,
          }),
        );

        dispatch(
          fetchShortQuestionByModules({
            moduleIds: selectedModules,
            totalLimit: limit,
          }),
        )
          .unwrap()
          .then((res) => {
            dispatch(
              setLoading({
                key: "modules/fetchShortQuestionByModules",
                value: false,
              }),
            );

            dispatch(fetchModulesById({ ids: res.ids }))
              .unwrap()
              .then((res) => {
                setIsLoading(false);
                dispatch(
                  setLoading({
                    key: "modules/fetchModulesByMock",
                    value: false,
                  }),
                );

                setSAQModule(res);
              })
              .catch((err) => {
                setIsLoading(false);
                dispatch(
                  setLoading({
                    key: "modules/fetchModulesByMock",
                    value: false,
                  }),
                );
              });
          })
          .catch((err) => {
            dispatch(
              setLoading({
                key: "modules/fetchShortQuestionByModules",
                value: false,
              }),
            );
          });

        // Fetch Question By ID
        dispatch(
          fetchShortQuestionByModulesById({ moduleIds: selectedModules }),
        )
          .unwrap()
          .then((res) => {
            dispatch(
              setLoading({
                key: "modules/fetchShortQuestionByModuleById",
                value: false,
              }),
            );

            if (res && res.length > 0) {
              // Extracting all parentIds
              const parentIds = res.map((item) => item.id);

              // Dispatch fetchSqaChild with all parentIds
              dispatch(fetchSqaChild({ parentIds, limit }))
                .unwrap()
                .then((childRes) => {
                  // Organizing Data
                  const organizedData = res.map((parent) => ({
                    ...parent,
                    children: childRes.filter(
                      (child) => child.parentQuestionId === parent.id,
                    ),
                  }));
                })
                .catch((err) => {
                  console.log("Error fetching SQA Child:", err);
                });
            }
          })
          .catch((err) => {
            dispatch(
              setLoading({
                key: "modules/fetchShortQuestionByModules",
                value: false,
              }),
            );
          });
      } else if (selectedOption === "Mock") {
        dispatch(setLoading({ key: "modules/fetchMockTest", value: true }));
        dispatch(fetchMockTest())
          .unwrap()
          .then((ids) => {
            // Pass the fetched IDs to fetchModules

            console.log("questioning ids:", ids);

            // dispatch(fetchModulesById({ ids }))
            //   .unwrap()
            //   .then((res) => {
            //     setIsLoading(false);
            //     dispatch(
            //       setLoading({
            //         key: "modules/fetchModulesByMock",
            //         value: false,
            //       }),
            //     );

            //     dispatch(fetchTotalSBAQuestion({ ids: res }))
            //       .unwrap()
            //       .then((res) => {
            //         dispatch(fetchTotalMockQuestion({ ids: res })).unwrap();
            //       });
            //   })
            //   .catch((err) => {
            //     setIsLoading(false);
            //     dispatch(
            //       setLoading({
            //         key: "modules/fetchModulesByMock",
            //         value: false,
            //       }),
            //     );
            //   });
          })
          .catch((err) => {
            setIsLoading(false);
            dispatch(
              setLoading({ key: "modules/fetchModulesByMock", value: false }),
            );
          });

        dispatch(setLoading({ key: "modules/fetchMockTestById", value: true }));
        dispatch(
          fetchMockTestById({ moduleIds: selectedModules, totalLimit: limit }),
        )
          .unwrap()
          .then((res) => {
            dispatch(
              setLoading({ key: "modules/fetchMockTestById", value: false }),
            );
          })
          .catch((err) => {
            dispatch(
              setLoading({ key: "modules/fetchMockTestById", value: false }),
            );
          });
      } else if (type === "Trial" && freeTrialType === "SBATrialBank") {
        dispatch(
          setLoading({
            key: "freeBank/fetchMcqsQuestionFreeBank",
            value: true,
          }),
        );
        setIsSortedByPresentation(false);
        setIsLoading(true);

        dispatch(fetchMcqsQuestionFreeBank({ limit }))
          .unwrap()
          .finally(() => {
            setIsLoading(false);
            dispatch(
              setLoading({
                key: "freeBank/fetchMcqsQuestionFreeBank",
                value: false,
              }),
            );
          });
      } else if (type === "Trial" && freeTrialType === "SAQTrialBank") {
        dispatch(
          setLoading({
            key: "modules/fetchShortQuestionByModules",
            value: true,
          }),
        );

        dispatch(
          fetchShortQuestionsWithChildrenFreeTrial({
            limit,
          }),
        )
          .unwrap()
          .then((res) => {
            dispatch(
              setLoading({
                key: "modules/fetchShortQuestionByModules",
                value: false,
              }),
            );
          })
          .catch((err) => {
            dispatch(
              setLoading({
                key: "modules/fetchShortQuestionByModules",
                value: false,
              }),
            );
          });
      }
    }
  }, [selectedModules, limit, selectedOption, selectedTab, freeTrialType]);

  useEffect(() => {
    if (selectedTab === "Pre-clinical") {
      if (selectedPreClinicalOption === "QuesGen") {
        dispatch(setPreclinicalType({ selectedPreClinicalOption }));

        dispatch(
          setLoading({ key: "modules/fetchQuesGenModules", value: true }),
        );
        setIsLoading(true);
        dispatch(fetchQuesGenModules())
          .unwrap()
          .then(() => {
            setIsLoading(false);
            dispatch(
              setLoading({ key: "modules/fetchQuesGenModules", value: false }),
            );
          })
          .catch((err) => {
            dispatch(
              setLoading({ key: "modules/fetchQuesGenModules", value: false }),
            );
            setIsLoading(false);
          });

        dispatch(
          setLoading({ key: "modules/fetchQuesGenModuleById", value: true }),
        );
        dispatch(
          fetchQuesGenModuleById({
            moduleIds: selectedModules,
            totalLimit: limit,
          }),
        )
          .unwrap()
          .then((res) => {
            dispatch(
              setLoading({
                key: "modules/fetchQuesGenModuleById",
                value: false,
              }),
            );
          })
          .catch((err) => {
            console.error("Error fetching QuesGen modules:", err);
            dispatch(
              setLoading({
                key: "modules/fetchQuesGenModuleById",
                value: false,
              }),
            );
          });
      }
    }
  }, [selectedPreClinicalOption, selectedModules, limit]); // Add selectedPreClinicalOption and selectedModules to dependencies

  useEffect(() => {
    localStorage.removeItem("examTimer"); // Clear storage when timer ends
    // Check if recentSessions are available in localStorage
    const storedSessions = localStorage.getItem("recentSessions");

    if (storedSessions) {
      setLocalRecentSession(JSON.parse(storedSessions)); // Parse and set to state
    }
    dispatch(clearRecentSessions());
  }, []);

  useEffect(() => {
    if (recentSessions.length > 0) {
      // Dispatch to update the Redux store
      dispatch(updateRecentSessions(recentSessions));
    }
  }, [recentSessions]);

  // sort By presentation
  useEffect(() => {
    if (isSortedByPresentation) {
      dispatch(setLoading({ key: "modules/fetchPresentation", value: true }));

      dispatch(fetchPresentation())
        .unwrap()
        .then((res) => {
          dispatch(
            setLoading({ key: "modules/fetchPresentation", value: false }),
          );
        })
        .catch((err) => {
          dispatch(
            setLoading({ key: "modules/fetchPresentation", value: false }),
          );
        });
    }
  }, [isSortedByPresentation]);
  // sort By presentation
  useEffect(() => {
    if (isSortedByPresentation) {
      dispatch(setLoading({ key: "modules/fetchMockTest", value: true }));
      dispatch(fetchMockTestByPresentationId())
        .unwrap()
        .then((ids) => {
          // Pass the fetched IDs to fetchModules
          dispatch(fetchPresentationMock({ ids }))
            .unwrap()
            .then((res) => {})
            .catch((err) => {
              setIsLoading(false);
              dispatch(
                setLoading({ key: "modules/fetchModulesByMock", value: false }),
              );
            });
        })
        .catch((err) => {
          setIsLoading(false);
          dispatch(
            setLoading({ key: "modules/fetchModulesByMock", value: false }),
          );
        });
      dispatch(setLoading({ key: "modules/fetchPresentation", value: true }));
    }
  }, [isSortedByPresentation]);

  // sort By presentation
  useEffect(() => {
    if (isSortedByPresentation) {
      dispatch(
        setLoading({ key: "modules/fetchMcqsByPresentationId", value: true }),
      );

      dispatch(
        fetchMcqsByPresentationId({
          presentationIds: selectPresentation,
          totalLimit: limit,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(
            setLoading({
              key: "modules/fetchMcqsByPresentationId",
              value: false,
            }),
          );
        })
        .catch((err) => {
          dispatch(
            setLoading({
              key: "modules/fetchMcqsByPresentationId",
              value: false,
            }),
          );
        });
    }
  }, [isSortedByPresentation, selectPresentation, limit]);

  // presentation by Mock

  // sort By presentation
  useEffect(() => {
    if (isSortedByPresentation) {
      dispatch(
        setLoading({ key: "modules/fetchMcqsByPresentationId", value: true }),
      );

      dispatch(
        fetchMockMcqsByPresentationId({
          presentationIds: selectPresentation,
          totalLimit: limit,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(
            setLoading({
              key: "modules/fetchMcqsByPresentationId",
              value: false,
            }),
          );
        })
        .catch((err) => {
          dispatch(
            setLoading({
              key: "modules/fetchMcqsByPresentationId",
              value: false,
            }),
          );
        });
    }
  }, [isSortedByPresentation, selectPresentation, limit]);

  useEffect(() => {
    if (selectedOption !== "SBA") return;

    setIsLoading(true);

    dispatch(fetchTotalSBAQuestion({ ids: data.data }))
      .unwrap()
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [selectedModules, selectedOption]); // Runs only once when the component mounts

  useEffect(
    () => {
      if (selectedOption !== "SBA") return;
      // const fetchDailyWork = async () => {
      //   console.log("SBA selected", selectedOption);

      //   try {
      //     const query = supabase
      //       .from("resultsHistory")
      //       .select("moduleId, isCorrect, userId")
      //       .eq("userId", userId);

      //     if (selectedModules?.length) {
      //       query.in("moduleId", selectedModules);
      //     }

      //     const { data, error } = await query;

      //     if (error) throw error;

      //     // Compute totals
      //     const totalsByModule = data.reduce((acc, curr) => {
      //       const { moduleId, isCorrect } = curr;

      //       if (!acc[moduleId]) {
      //         acc[moduleId] = { moduleId, totalCorrect: 0, totalIncorrect: 0 };
      //       }

      //       if (Boolean(isCorrect)) {
      //         acc[moduleId].totalCorrect += 1;
      //       } else {
      //         acc[moduleId].totalIncorrect += 1;
      //       }

      //       return acc;
      //     }, {});

      //     console.log("totalsByModule:", totalsByModule);
      //     setModuleTotals(Object.values(totalsByModule));
      //   } catch (err) {
      //     console.error("Error fetching daily work:", err);
      //   }
      // };

      // if (userId) {
      // fetchDailyWork();
      dispatch(fetchDailyWork({ userId, selectedModules: filteredSBAModules }));

      // }
    },
    [userId, selectedTab],
    // selectedModules,
  ); // Run only once

  useEffect(() => {
    const fetchDailyWork = async () => {
      try {
        const query = supabase
          .from("resultHistoryMock")
          .select("paperId, isCorrect, userId") // Yahan specify kiya ke kaun se fields chahiye
          .eq("userId", userId);

        if (selectedModules?.length) {
          query.in("paperId", selectedModules);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Compute totals
        const totalsByModule = data.reduce((acc, curr) => {
          const { paperId, isCorrect } = curr;

          if (!acc[paperId]) {
            acc[paperId] = { paperId, totalCorrect: 0, totalIncorrect: 0 }; // moduleId bhi add kiya
          }

          if (Boolean(isCorrect)) {
            acc[paperId].totalCorrect += 1;
          } else {
            acc[paperId].totalIncorrect += 1;
          }

          return acc;
        }, {});
        setMockModuleTotals(Object.values(totalsByModule)); // Object ko array mein convert kiya
      } catch (err) {
        console.error("Error fetching daily work:", err);
      }
    };

    if (userId) fetchDailyWork();
  }, [selectedOption, userId]); // Handle selectedModules properly

  useEffect(() => {
    const fetchDailyWork = async () => {
      try {
        const query = supabase
          .from("resultHistorySaq")
          .select("moduleId, isCorrect, isIncorrect, isPartial, userId") // Required columns
          .eq("userId", userId);

        if (selectedModules?.length) {
          query.in("moduleId", selectedModules);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Compute totals
        const totalsByModule = data.reduce((acc, curr) => {
          const { moduleId, isCorrect, isIncorrect, isPartial } = curr;

          if (!acc[moduleId]) {
            acc[moduleId] = {
              moduleId,
              totalCorrect: 0,
              totalIncorrect: 0,
              totalPartial: 0,
            };
          }

          // Count only `true` values
          if (isCorrect) acc[moduleId].totalCorrect += 1;
          if (isIncorrect) acc[moduleId].totalIncorrect += 1;
          if (isPartial) acc[moduleId].totalPartial += 1;

          return acc;
        }, {});

        setSaqModuleTotals(Object.values(totalsByModule)); // Convert object to array
      } catch (err) {
        console.error("Error fetching daily work:", err);
      }
    };

    if (userId) fetchDailyWork();
  }, [selectedOption, userId]);

  useEffect(() => {
    dispatch(setSelectedSBAModule(selectedModules));
  }, [dispatch, selectedModules]);

  useEffect(() => {
    if (state) {
      setSelectedOption(state);
    }
  }, [state]);

  useEffect(() => {
    if (state === "QuesGen") {
      setSelectedTab("Pre-clinical");
      setSelectedPreClinicalOption(state);
    }
  }, [state]);

  useEffect(() => {
    dispatch(fetchSubscriptions({ userId }));
  }, [dispatch, userId]);

  return (
    <div className={`w-ful lg:flex ${darkModeRedux ? "dark" : ""}`}>
      <div className="fixed hidden h-full lg:block">
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
      <div className="w-full lg:ml-[260px] xl:ml-[250px]">
        <div>
          <div className="flex-grow overflow-y-auto overflow-x-hidden dark:bg-[#1E1E2A]">
            {/* Table Header */}

            <div className="flex min-h-screen flex-col space-y-4 px-16 py-4 sm:m-10">
              <div className="flex flex-col space-y-10">
                <div className="h-[137px] p-4">
                  {/* Tab Section */}
                  <div className="flex items-center justify-between space-x-2 text-[12px] font-medium text-[#3F3F46] md:text-[16px]">
                    <button
                      className={`w-[100%] px-4 py-2 ${
                        selectedTab === "Clinical"
                          ? "bg-white text-black"
                          : "bg-[#E4E4E7] text-gray-500"
                      } rounded-[8px]`}
                      onClick={() => handleTabChange("Clinical")}
                    >
                      Clinical
                    </button>
                    {/* <button
                      className={`w-[50%] px-4 py-2 ${
                        selectedTab === "Pre-clinical"
                          ? "bg-white text-black"
                          : "bg-[#E4E4E7] text-gray-500"
                      } rounded-[8px]`}
                      onClick={() => handleTabChange("Pre-clinical")}
                    >
                      Pre-clinical
                    </button> */}
                  </div>
                  {/* Search and Button Section */}
                  <div className="flex h-[110px] items-center justify-between rounded-[8px] bg-white text-black dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white">
                    {/* Search Bar */}
                    <div className="flex items-center gap-x-10 p-8">
                      {selectedTab === "Clinical" && (
                        <p className="whitespace-nowrap text-[11px] font-semibold text-[#52525B] dark:text-white sm:text-[16px] md:text-[18px] 2xl:text-[20px]">
                          Clinical
                        </p>
                      )}
                      {/* {selectedTab === "Pre-clinical" && (
                        <p className="whitespace-nowrap text-[11px] font-semibold text-[#52525B] dark:text-white sm:text-[16px] md:text-[18px] 2xl:text-[20px]">
                          Pre Clinical
                        </p>
                      )} */}
                      <div className="hidden items-center rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-[2px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] xl:flex">
                        <div className="group">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-search text-gray-500 transition-colors duration-200 group-hover:text-teal-500"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Search for modules"
                          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                          className="ml-2 w-[200px] placeholder:text-[12px] placeholder:text-[#D4D4D8] focus:outline-none dark:bg-[#1E1E2A] 2xl:w-[280px]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 p-8 xl:flex-row xl:space-x-5 xl:space-y-0">
                      <div className="relative w-[105px]">
                        {selectedTab === "Clinical" ? (
                          <select
                            className="h-[40px] w-full appearance-none rounded border border-[#A1A1AA] px-3 py-2 pr-1 text-[14px] dark:bg-[#1E1E2A]"
                            value={selectedOption} // Bind the selected value to state
                            onChange={handleSelectChange} // Trigger the handler on change
                          >
                            {(planType === "Osce" ||
                              planType === undefined) && (
                              <option value="Trial">Trial</option>
                            )}
                            <option value="SBA">SBA</option>
                            <option value="SAQ">SAQ</option>
                            <option value="Mock">Mock</option>
                          </select>
                        ) : (
                          <select
                            className="h-[40px] w-full appearance-none rounded border border-[#A1A1AA] px-3 py-2 pr-1 text-[14px] dark:bg-[#1E1E2A]"
                            value={selectedPreClinicalOption} // Bind the selected value to state
                            onChange={preClinicalHandler} // Trigger the handler on change
                          >
                            <option value="QuesGen">QuesGen</option>
                          </select>
                        )}
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
                      {/* Dropdown */}
                      {/* Continue Button */}
                      <button
                        onClick={handleContinue}
                        disabled={
                          selectPresentation.length === 0 &&
                          selectedModules.length === 0 &&
                          freeTrialType.length === 0
                        } // Disable the button if both arrays are empty
                        className={`bg-[#3CC8A1] ${
                          selectPresentation.length === 0 &&
                          selectedModules.length === 0 &&
                          freeTrialType.length === 0
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-transparent hover:text-[#3CC8A1]"
                        } rounded-md border-[1px] border-[#3CC8A1] px-6 py-2 text-[12px] font-semibold text-white transition-all md:text-[14px] 2xl:text-[16px]`}
                      >
                        Continue &gt;
                      </button>
                    </div>
                  </div>
                </div>
                {selectedTab === "Pre-clinical" && <FileUpload />}
                <div className="relative">
                  {(planType === "Osce" ||
                    plan === undefined ||
                    plan === null ||
                    planType === undefined) &&
                    type !== "Trial" && (
                      <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center backdrop-blur-sm">
                        <div className="mt-[300px] h-full">
                          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-[#1E1E2A]">
                            <div className="text-center">
                              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3CC8A1]/10">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-[#3CC8A1]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                              </div>

                              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Upgrade Your Plan
                              </h3>

                              <p className="mb-6 text-gray-600 dark:text-gray-300">
                                To access this feature, please upgrade your
                                plan.
                              </p>

                              <div className="flex justify-center gap-4">
                                <Link
                                  to="/pricing"
                                  className="rounded-md bg-[#3CC8A1] px-6 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#34b08c]"
                                >
                                  Buy Plan
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  {selectedTab === "Clinical" && (
                    <div className="relative">
                      <div className="m-4 flex h-[212px] items-center rounded-[8px] bg-white p-5 text-black dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white">
                        <div className="mr-10 flex w-[35%] items-center justify-between">
                          <p className="w-full text-center text-[12px] font-bold text-[#3F3F46] dark:text-white sm:text-[16px] 2xl:text-[18px]">
                            Recent Sessions
                          </p>
                          <div className="h-[212px] w-[1px] bg-[#A1A1AA] dark:bg-[#3A3A48]" />
                        </div>
                        <div className="w-[65%] space-y-3">
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
                                  return category
                                    ? category.categoryName
                                    : null; // Return the category name or null if not found
                                })
                                .filter((name) => name !== null); // Filter out any null values
                              // Return the JSX for each session
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between gap-y-2"
                                >
                                  <div>
                                    <p className="text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                                      {categoryNames.join(", ")}{" "}
                                      {/* Join category names into a single string */}
                                    </p>
                                    <p className="text-[12px] font-semibold text-[#D4D4D8] 2xl:text-[14px]">
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
                              <p>No Recent Session</p>
                            </div>
                          )}
                        </div>
                      </div>{" "}
                    </div>
                  )}

                  {isLoading ? (
                    <Loader />
                  ) : (
                    <div className="ml-4 mr-4 rounded-[8px] bg-white px-10 py-8 text-[14px] text-black dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white md:text-[16px]">
                      <div className="flex w-full flex-col justify-between pb-2 font-medium text-[#3F3F46] lg:flex-row lg:items-center">
                        <div className="flex items-center gap-x-10 dark:text-white">
                          {type == "Trial" ? (
                            <div></div>
                          ) : (
                            <div className="flex items-center gap-x-10 dark:text-white">
                              <div className="3xl:text-[16px] flex items-center text-left text-[14px]">
                                <input
                                  type="checkbox"
                                  className="mr-2 size-4"
                                  checked={data?.data?.every((row) =>
                                    selectedModules.includes(row.categoryId),
                                  )} // Parent checkbox state
                                  onChange={(e) =>
                                    handleSelectAll(e.target.checked)
                                  } // Parent checkbox change handler
                                />
                                Select All
                              </div>
                              {selectedOption !== "SAQ" && (
                                <div className="flex items-center space-x-2 p-4">
                                  <span className="3xl:text-[16px] flex items-center text-[14px] font-medium text-[#3F3F46] dark:text-white">
                                    Sort By Presentation
                                  </span>
                                  <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                      type="checkbox"
                                      className="peer sr-only"
                                      onChange={handleToggle}
                                    />
                                    <div className="peer h-6 w-10 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#3CC8A1] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-gray-300 dark:peer-focus:ring-blue-800 2xl:h-6 2xl:w-11"></div>
                                  </label>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="3xl:text-[16px] flex items-center gap-x-5 text-right text-[14px] dark:text-white">
                          <div className="hidden text-center sm:block">
                            Progress
                          </div>
                          <div className="flex items-center gap-x-3">
                            <div className="h-4 w-4 rounded-sm bg-[#3CC8A1]"></div>
                            <p>Correct</p>
                          </div>
                          <div className="flex items-center gap-x-3">
                            <div className="h-4 w-4 rounded-sm bg-[#FF453A]"></div>
                            <p>Incorrect</p>
                          </div>
                          <div className="flex items-center gap-x-3">
                            <div className="h-4 w-4 rounded-sm bg-[#E4E4E7]"></div>
                            <p>Unanswered</p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-5 mt-2 h-[1px] bg-[#A1A1AA]" />
                      <div>
                        {/* {selectedTab === "Pre-clinical" &&
                      (questionGenModule?.modules?.length > 0 ? (
                        questionGenModule.modules
                          .filter(
                            (row, index, arr) =>
                              // Keep only first occurrence of each module
                              arr.findIndex((r) => r.module === row.module) ===
                              index,
                          )
                          .map((row, id) => (
                            <div
                              key={id}
                              className="grid items-center py-3 md:grid-cols-2"
                            >
                              <div className="cursor-pointer text-left text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                                <label className="flex cursor-pointer items-center hover:opacity-85">
                                  <input
                                    type="checkbox"
                                    className="custom-checkbox mr-2 hover:opacity-70"
                                    checked={selectedModules.includes(row.module)}
                                    onChange={() =>
                                      handleCheckboxChange(row.module)
                                    }
                                  />
                                  {row.module}
                                </label>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="py-3 text-center text-gray-500">
                          No modules available.
                        </div>
                      ))} */}

                        {/* Free plan */}
                        {selectedTab === "Clinical" &&
                          !isSortedByPresentation &&
                          type === "Trial" &&
                          [
                            { type: "SBA Trial Bank", trialId: "SBATrialBank" },
                            { type: "SAQ Trial Bank", trialId: "SAQTrialBank" },
                          ].map((row) => (
                            <div
                              key={row.trialId}
                              className="grid items-center py-3 md:grid-cols-2"
                            >
                              <div className="cursor-pointer text-left text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                                <label className="flex cursor-pointer items-center hover:opacity-85">
                                  <input
                                    type="checkbox"
                                    className="mr-2 size-4 rounded-none text-[#3F3F46]"
                                    checked={freeTrialType === row.trialId} // Use freeTrialType instead of selectedTrial
                                    onChange={() =>
                                      handleFreeTrialOnChange(row.trialId)
                                    }
                                  />
                                  {row.type}
                                </label>
                              </div>
                            </div>
                          ))}

                        <div className="">
                          {selectedTab === "Clinical" &&
                            type === "SBA" &&
                            isSortedByPresentation &&
                            filterPresentations(searchQuery)?.map((row, id) => {
                              const totals = moduleTotals[row.categoryId] || {
                                totalCorrect: 0,
                                totalIncorrect: 0,
                                totalUnanswered: 0,
                              };
                              const totalQuestions =
                                totals.totalCorrect +
                                totals.totalIncorrect +
                                totals.totalUnanswered;
                              // Calculate widths based on total counts
                              const correctWidth =
                                totalQuestions > 0
                                  ? (totals.totalCorrect / totalQuestions) * 100
                                  : 0;
                              const incorrectWidth =
                                totalQuestions > 0
                                  ? (totals.totalIncorrect / totalQuestions) *
                                    100
                                  : 0;
                              const unansweredWidth =
                                totalQuestions > 0
                                  ? (totals.totalUnanswered / totalQuestions) *
                                    100
                                  : 0;
                              return (
                                <div
                                  key={row.presentationId}
                                  className="grid items-center py-3 md:grid-cols-2"
                                >
                                  <div className="cursor-pointer text-left text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                                    <label className="flex cursor-pointer items-center hover:opacity-85">
                                      <input
                                        type="checkbox"
                                        className="custom-checkbox mr-2 hover:opacity-70"
                                        checked={selectPresentation.includes(
                                          row.presentationId,
                                        )}
                                        onChange={() =>
                                          handleCheckboxChangePresentation(
                                            row.presentationId,
                                          )
                                        }
                                      />
                                      {row.presentationName}
                                    </label>
                                  </div>
                                  <div className="flex items-center justify-center space-x-1">
                                    {/* Green */}
                                    <div
                                      className="h-[19px] rounded-l-md bg-[#3CC8A1] sm:h-[27px]"
                                      style={{ width: `${correctWidth}%` }}
                                    ></div>
                                    {/* Red */}
                                    <div
                                      className="h-[19px] bg-[#FF453A] sm:h-[27px]"
                                      style={{ width: `${incorrectWidth}%` }}
                                    ></div>
                                    {/* Gray */}
                                    <div
                                      className="h-[19px] rounded-r-md bg-[#E4E4E7] sm:h-[27px]"
                                      style={{ width: `${unansweredWidth}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}

                          {selectedTab === "Clinical" &&
                            isSortedByPresentation &&
                            type === "Mock" &&
                            filterMockPresentations(searchQuery)?.map(
                              (row, id) => {
                                const totals = moduleTotals[row.categoryId] || {
                                  totalCorrect: 0,
                                  totalIncorrect: 0,
                                  totalUnanswered: 0,
                                };
                                const totalQuestions =
                                  totals.totalCorrect +
                                  totals.totalIncorrect +
                                  totals.totalUnanswered;
                                // Calculate widths based on total counts
                                const correctWidth =
                                  totalQuestions > 0
                                    ? (totals.totalCorrect / totalQuestions) *
                                      100
                                    : 0;
                                const incorrectWidth =
                                  totalQuestions > 0
                                    ? (totals.totalIncorrect / totalQuestions) *
                                      100
                                    : 0;
                                const unansweredWidth =
                                  totalQuestions > 0
                                    ? (totals.totalUnanswered /
                                        totalQuestions) *
                                      100
                                    : 0;
                                return (
                                  <div
                                    key={row.presentationId}
                                    className="grid items-center py-3 md:grid-cols-2"
                                  >
                                    <div className="cursor-pointer text-left text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                                      <label className="flex cursor-pointer items-center hover:opacity-85">
                                        <input
                                          type="checkbox"
                                          className="custom-checkbox mr-2 hover:opacity-70"
                                          checked={selectPresentation.includes(
                                            row.presentationId,
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangePresentation(
                                              row.presentationId,
                                            )
                                          }
                                        />
                                        {row.presentationName}
                                      </label>
                                    </div>
                                    <div className="flex items-center justify-center space-x-1">
                                      {/* Green */}
                                      <div
                                        className="h-[19px] rounded-l-md bg-[#3CC8A1] sm:h-[27px]"
                                        style={{ width: `${correctWidth}%` }}
                                      ></div>
                                      {/* Red */}
                                      <div
                                        className="h-[19px] bg-[#FF453A] sm:h-[27px]"
                                        style={{ width: `${incorrectWidth}%` }}
                                      ></div>
                                      {/* Gray */}
                                      <div
                                        className="h-[19px] rounded-r-md bg-[#E4E4E7] sm:h-[27px]"
                                        style={{ width: `${unansweredWidth}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          {selectedTab === "Clinical" &&
                            !isSortedByPresentation &&
                            type === "SBA" &&
                            filteredSBAModules?.map((row) => {
                              const moduleData = SBADataLength?.find(
                                (module) =>
                                  module.categoryId === row.categoryId,
                              );
                              // console.log("moduleData:", moduleData);

                              const totalQuestions = moduleData
                                ? moduleData.questions.length
                                : 0;
                              // Ensure moduleTotals is always an array

                              const moduleTotalsArray = Array.isArray(SBAResult)
                                ? SBAResult
                                : Object.values(SBAResult || {});
                              // Get the totals for correct and incorrect answers
                              const moduleTotal = moduleTotalsArray.find(
                                (m) =>
                                  String(m.moduleId) === String(row.categoryId),
                              ) || { totalCorrect: 0, totalIncorrect: 0 };
                              const { totalCorrect, totalIncorrect } =
                                moduleTotal;
                              // Calculate percentage for progress bar
                              const correctPercentage = totalQuestions
                                ? (totalCorrect / totalQuestions) * 100
                                : 0;
                              const incorrectPercentage = totalQuestions
                                ? (totalIncorrect / totalQuestions) * 100
                                : 0;
                              // console.log("moduleTotalsArray:", moduleTotalsArray);

                              return (
                                <div
                                  key={row.categoryId}
                                  className="grid items-center py-3 md:grid-cols-2"
                                >
                                  {/* Category Name and Checkbox */}
                                  <div className="cursor-pointer text-left text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                                    <label className="flex cursor-pointer items-center hover:opacity-85">
                                      <input
                                        type="checkbox"
                                        className="mr-2 size-4 rounded-none text-gray-800"
                                        checked={selectedModules.includes(
                                          row.categoryId,
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(row.categoryId)
                                        }
                                      />
                                      {row.categoryName}
                                    </label>
                                  </div>
                                  {/* Progress Bar and Total Questions */}
                                  <div className="flex w-full items-center justify-center space-x-2">
                                    {/* Progress Bar */}
                                    <div className="flex h-[19px] w-full overflow-hidden rounded-md bg-[#E4E4E7] sm:h-[27px]">
                                      {/* Green Section (Correct Answers) */}
                                      <span
                                        className="flex items-center justify-center bg-[#3CC8A1] text-xs text-white"
                                        style={{
                                          width: `${correctPercentage}%`,
                                        }}
                                      >
                                        {totalCorrect > 0 && (
                                          <span>{totalCorrect}</span>
                                        )}
                                      </span>
                                      {/* Red Section (Incorrect Answers) */}
                                      <span
                                        className="flex items-center justify-center bg-[#FF453A] text-xs text-white"
                                        style={{
                                          width: `${incorrectPercentage}%`,
                                        }}
                                      >
                                        {totalIncorrect > 0 && (
                                          <span>{totalIncorrect}</span>
                                        )}
                                      </span>
                                    </div>
                                    {/* Total Questions */}
                                    {/* <span className="text-sm text-gray-700 dark:text-white">
                                {totalQuestions}
                              </span> */}
                                  </div>
                                </div>
                              );
                            })}
                          {selectedTab === "Clinical" &&
                            !isSortedByPresentation &&
                            type === "SAQ" &&
                            filteredSAQModules?.map((row) => {
                              // Find the count of questions for the current categoryId
                              const moduleData =
                                sqa?.counts?.[row.categoryId] || 0; // Get the count directly from sqa.counts
                              const totalQuestions = moduleData; // Directly use the count from sqa.counts
                              // Ensure moduleTotals is always an array
                              const moduleTotalsArray = Array.isArray(
                                saqModuleTotals,
                              )
                                ? saqModuleTotals
                                : Object.values(saqModuleTotals || {});
                              // Get the totals for correct, incorrect, and partial answers
                              const moduleTotal = moduleTotalsArray.find(
                                (m) =>
                                  String(m.moduleId) === String(row.categoryId),
                              ) || {
                                totalCorrect: 0,
                                totalIncorrect: 0,
                                totalPartial: 0,
                              };
                              const {
                                totalCorrect,
                                totalIncorrect,
                                totalPartial,
                              } = moduleTotal;
                              // Calculate percentage for progress bar
                              const correctPercentage = totalQuestions
                                ? (totalCorrect / totalQuestions) * 100
                                : 0;
                              const incorrectPercentage = totalQuestions
                                ? (totalIncorrect / totalQuestions) * 100
                                : 0;
                              const partialPercentage = totalQuestions
                                ? (totalPartial / totalQuestions) * 100
                                : 0;
                              return (
                                <div
                                  key={row.categoryId} // Use moduleId as the key
                                  className="grid items-center py-3 md:grid-cols-2"
                                >
                                  <div className="cursor-pointer text-left text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                                    <label className="flex cursor-pointer items-center hover:opacity-85">
                                      <input
                                        type="checkbox"
                                        className="mr-2 size-4 rounded-none text-gray-800"
                                        checked={selectedModules.includes(
                                          row.categoryId,
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(row.categoryId)
                                        }
                                      />
                                      {row.categoryName}
                                    </label>
                                  </div>
                                  {/* Progress Bar and Total Questions */}
                                  <div className="flex w-full items-center justify-center space-x-2">
                                    {/* Progress Bar */}
                                    <div className="flex h-[19px] w-full overflow-hidden rounded-md bg-[#E4E4E7] sm:h-[27px]">
                                      {/* Green Section (Correct Answers) */}
                                      <span
                                        className="flex items-center justify-center bg-[#3CC8A1] text-xs text-white"
                                        style={{
                                          width: `${correctPercentage}%`,
                                        }}
                                      >
                                        {totalCorrect > 0 && (
                                          <span>{totalCorrect}</span>
                                        )}
                                      </span>
                                      {/* Orange Section (Partial Answers) */}
                                      <span
                                        className="flex items-center justify-center bg-[#FFA500] text-xs text-white"
                                        style={{
                                          width: `${partialPercentage}%`,
                                        }}
                                      >
                                        {totalPartial > 0 && (
                                          <span>{totalPartial}</span>
                                        )}
                                      </span>
                                      {/* Red Section (Incorrect Answers) */}
                                      <span
                                        className="flex items-center justify-center bg-[#FF453A] text-xs text-white"
                                        style={{
                                          width: `${incorrectPercentage}%`,
                                        }}
                                      >
                                        {totalIncorrect > 0 && (
                                          <span>{totalIncorrect}</span>
                                        )}
                                      </span>
                                    </div>
                                    {/* Display total questions next to the progress bar */}
                                    {/* <span className="ml-2 text-sm text-gray-600">
                                {totalQuestions} Questions
                              </span> */}
                                  </div>
                                </div>
                              );
                            })}
                          {selectedTab === "Clinical" &&
                            !isSortedByPresentation &&
                            type === "Mock" &&
                            mockTestIds?.map((row) => {
                              const moduleData = mockModuleTotals?.find(
                                (module) => module?.paperId === row,
                              );
                              const totalQuestions = moduleData; // Directly use the count from sqa.counts
                              // const totalQuestions = moduleData
                              //   ? moduleData.questions.length
                              //   : 0;
                              console.log("totalQuestions:", totalQuestions);
                              // Ensure moduleTotals is always an array
                              const moduleTotalsArray = Array.isArray(
                                mockModuleTotals,
                              )
                                ? mockModuleTotals
                                : Object.values(mockModuleTotals || {});
                              // Get the totals for correct and incorrect answers
                              const moduleTotal = moduleTotalsArray.find(
                                (m) => String(m.paperId) === String(row),
                              ) || { totalCorrect: 0, totalIncorrect: 0 };
                              const { totalCorrect, totalIncorrect } =
                                moduleTotal;
                              // Calculate percentage for progress bar
                              const correctPercentage = totalQuestions
                                ? (totalCorrect / totalQuestions) * 100
                                : 0;
                              const incorrectPercentage = totalQuestions
                                ? (totalIncorrect / totalQuestions) * 100
                                : 0;
                              return (
                                <div
                                  key={row.categoryId}
                                  className="grid items-center py-3 md:grid-cols-2"
                                >
                                  <div className="cursor-pointer text-left text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                                    <label className="flex cursor-pointer items-center hover:opacity-85">
                                      <input
                                        type="checkbox"
                                        className="mr-2 size-4 rounded-none text-gray-800"
                                        checked={selectedModules.includes(row)}
                                        onChange={() =>
                                          handleCheckboxChange(row)
                                        }
                                      />
                                      Paper {row}
                                    </label>
                                  </div>
                                  {/* Progress Bar and Total Questions */}
                                  <div className="flex w-full items-center justify-center space-x-2">
                                    <div className="flex h-[19px] w-full overflow-hidden rounded-md bg-[#E4E4E7] sm:h-[27px]">
                                      <span
                                        className="flex items-center justify-center bg-[#3CC8A1] text-xs text-white"
                                        style={{
                                          width: `${correctPercentage}%`,
                                        }}
                                      >
                                        {totalCorrect > 0 && (
                                          <span>{totalCorrect}</span>
                                        )}
                                      </span>
                                      <span
                                        className="flex items-center justify-center bg-[#FF453A] text-xs text-white"
                                        style={{
                                          width: `${incorrectPercentage}%`,
                                        }}
                                      >
                                        {totalIncorrect > 0 && (
                                          <span>{totalIncorrect}</span>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>{" "}
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
      <MobileBar
        toggleDrawer={toggleDrawer}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {isOpenSetUpSessionModal && (
        <SetupSessionModal
          isOpenSetUpSessionModal={isOpenSetUpSessionModal}
          setIsOpenSetUpSessionModal={setIsOpenSetUpSessionModal}
        />
      )}
    </div>
  );
};

export default Questioning;
