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
import { setSBAPresentationValue } from "../redux/features/presentationSBA/presentationSBA.slice";
import { setMockPresentationValue } from "../redux/features/MockPresentation/presentationMock.slice";

const Questioning = () => {
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

  const { limit } = useSelector((state) => state.limit);
  const [isOpenSetUpSessionModal, setIsOpenSetUpSessionModal] = useState(false);
  const [storedSession, setStoredSession] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [checkedItems, setCheckedItems] = useState({}); // State for checkboxes
  const [moduleId, setModuleId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("SBA");
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
    (state) => state?.mcqsQuestion?.mcqsByModulesData,
  );
  const userId = useSelector((state) => state.user.userId);
  const presentationSBA = useSelector(
    (state) => state?.SBAPresentation?.isSBAPresentation,
  );

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
  const [mockModuleTotals, setMockModuleTotals] = useState({});
  const [saqModuleTotals, setSaqModuleTotals] = useState({});
  const [selectedTab, setSelectedTab] = useState("Clinical");
  const presentations = useSelector(
    (state) => state.presentations.presentations,
  );
  const handleToggle = () => {
    setIsSortedByPresentation((prev) => !prev);
    dispatch(setSBAPresentationValue(!isSortedByPresentation));
    dispatch(setMockPresentationValue(!isSortedByPresentation));
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
  };
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
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

          dispatch(fetchTotalSBAQuestion({ ids: res }));
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

      dispatch(setLoading({ key: "modules/fetchModulesByMock", value: true }));
      setIsLoading(true);
      dispatch(fetchModules())
        .unwrap()
        .then((res) => {
          setIsLoading(false);
          dispatch(
            setLoading({ key: "modules/fetchModulesByMock", value: false }),
          );
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
    dispatch(clearResult());
    dispatch(clearMcqsAccuracy());
    dispatch(resetAttempts([]));
    dispatch(setResetLimit());
    dispatch(resetQuestionReviewValue());
    dispatch(clearFlags());
    dispatch(clearUserAnswers());
    dispatch(resetVisited());
    dispatch(setActive(true));
  }, [type, selectedOption]);

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
        dispatch(fetchQuestionCounts());
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
            dispatch(fetchModulesById({ ids }))
              .unwrap()
              .then((res) => {
                setIsLoading(false);
                dispatch(
                  setLoading({
                    key: "modules/fetchModulesByMock",
                    value: false,
                  }),
                );

                dispatch(fetchTotalSBAQuestion({ ids: res }))
                  .unwrap()
                  .then((res) => {
                    dispatch(fetchTotalMockQuestion({ ids: res })).unwrap();
                  });
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
      }
    }
  }, [selectedModules, limit, selectedOption, selectedTab]);

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

  // result SAQ
  // useEffect(()=>{
  //   dispatch(fetchChildrenSaq())
  // },[type])

  useEffect(() => {
    const fetchDailyWork = async () => {
      try {
        const query = supabase
          .from("resultsHistory")
          .select("moduleId, isCorrect, userId") // Yahan specify kiya ke kaun se fields chahiye
          .eq("userId", userId);

        if (selectedModules?.length) {
          query.in("moduleId", selectedModules);
        }

        const { data, error } = await query;

        if (error) throw error;
        // Compute totals
        const totalsByModule = data.reduce((acc, curr) => {
          const { moduleId, isCorrect } = curr;

          if (!acc[moduleId]) {
            acc[moduleId] = { moduleId, totalCorrect: 0, totalIncorrect: 0 }; // moduleId bhi add kiya
          }

          if (Boolean(isCorrect)) {
            acc[moduleId].totalCorrect += 1;
          } else {
            acc[moduleId].totalIncorrect += 1;
          }

          return acc;
        }, {});
        setModuleTotals(Object.values(totalsByModule)); // Object ko array mein convert kiya
      } catch (err) {
        console.error("Error fetching daily work:", err);
      }
    };

    if (userId) fetchDailyWork();
  }, [JSON.stringify(selectedModules), userId]); // Handle selectedModules properly

  useEffect(() => {
    const fetchDailyWork = async () => {
      try {
        const query = supabase
          .from("resultsHistory")
          .select("moduleId, isCorrect, userId") // Yahan specify kiya ke kaun se fields chahiye
          .eq("userId", userId);

        if (selectedModules?.length) {
          query.in("moduleId", selectedModules);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Compute totals
        const totalsByModule = data.reduce((acc, curr) => {
          const { moduleId, isCorrect } = curr;

          if (!acc[moduleId]) {
            acc[moduleId] = { moduleId, totalCorrect: 0, totalIncorrect: 0 }; // moduleId bhi add kiya
          }

          if (Boolean(isCorrect)) {
            acc[moduleId].totalCorrect += 1;
          } else {
            acc[moduleId].totalIncorrect += 1;
          }

          return acc;
        }, {});
        setModuleTotals(Object.values(totalsByModule)); // Object ko array mein convert kiya
      } catch (err) {
        console.error("Error fetching daily work:", err);
      }
    };

    if (userId) fetchDailyWork();
  }, [JSON.stringify(selectedModules), userId]); // Handle selectedModules properly

  useEffect(() => {
    const fetchDailyWork = async () => {
      try {
        const query = supabase
          .from("resultHistoryMock")
          .select("moduleId, isCorrect, userId") // Yahan specify kiya ke kaun se fields chahiye
          .eq("userId", userId);

        if (selectedModules?.length) {
          query.in("moduleId", selectedModules);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Compute totals
        const totalsByModule = data.reduce((acc, curr) => {
          const { moduleId, isCorrect } = curr;

          if (!acc[moduleId]) {
            acc[moduleId] = { moduleId, totalCorrect: 0, totalIncorrect: 0 }; // moduleId bhi add kiya
          }

          if (Boolean(isCorrect)) {
            acc[moduleId].totalCorrect += 1;
          } else {
            acc[moduleId].totalIncorrect += 1;
          }

          return acc;
        }, {});
        setMockModuleTotals(Object.values(totalsByModule)); // Object ko array mein convert kiya
      } catch (err) {
        console.error("Error fetching daily work:", err);
      }
    };

    if (userId) fetchDailyWork();
  }, [JSON.stringify(selectedModules), userId]); // Handle selectedModules properly

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
  }, [JSON.stringify(selectedModules), userId]);
  // Handle selectedModules properly

  console.log(saqModuleTotals);

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

  return (
    <div className={`w-full lg:flex ${darkModeRedux ? "dark" : ""}`}>
      <div className="fixed hidden h-full lg:block">
        <Sidebar />
      </div>

      <div className="flex-grow overflow-y-auto overflow-x-hidden dark:bg-[#1E1E2A] lg:ml-[260px] xl:ml-[250px]">
        <div className="flex items-center justify-between bg-white p-5 lg:hidden">
          <div className="">
            <img src="/assets/small-logo.png" alt="" />
          </div>

          <div className="" onClick={toggleDrawer}>
            <TbBaselineDensityMedium />
          </div>
        </div>

        {/* Table Header */}
        <div className="flex min-h-screen flex-col space-y-4 px-16 py-4 sm:m-10">
          <div className="flex flex-col space-y-10">
            <div className="h-[137px] p-4">
              {/* Tab Section */}
              <div className="flex items-center justify-between space-x-2 text-[12px] font-medium text-[#3F3F46] md:text-[16px]">
                <button
                  className={`w-[50%] px-4 py-2 ${
                    selectedTab === "Clinical"
                      ? "bg-white text-black"
                      : "bg-[#E4E4E7] text-gray-500"
                  } rounded-[8px]`}
                  onClick={() => handleTabChange("Clinical")}
                >
                  Clinical
                </button>
                <button
                  className={`w-[50%] px-4 py-2 ${
                    selectedTab === "Pre-clinical"
                      ? "bg-white text-black"
                      : "bg-[#E4E4E7] text-gray-500"
                  } rounded-[8px]`}
                  onClick={() => handleTabChange("Pre-clinical")}
                >
                  Pre-clinical
                </button>
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

                  {selectedTab === "Pre-clinical" && (
                    <p className="whitespace-nowrap text-[11px] font-semibold text-[#52525B] dark:text-white sm:text-[16px] md:text-[18px] 2xl:text-[20px]">
                      Pre Clinical
                    </p>
                  )}
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
                      selectedModules.length === 0
                    } // Disable the button if both arrays are empty
                    className={`bg-[#3CC8A1] ${
                      selectPresentation.length === 0 &&
                      selectedModules.length === 0
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

            {selectedTab === "Clinical" && (
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
                          return category ? category.categoryName : null; // Return the category name or null if not found
                        })
                        .filter((name) => name !== null); // Filter out any null values

                      // Return the JSX for each session
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between"
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
                      <p>No Session</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="ml-4 mr-4 rounded-[8px] bg-white px-10 py-8 text-[14px] text-black dark:border-[1px] dark:border-[#3A3A48] dark:bg-[#1E1E2A] dark:text-white md:text-[16px]">
              <div className="flex w-full flex-col justify-between pb-2 font-medium text-[#3F3F46] lg:flex-row lg:items-center">
                <div className="flex items-center gap-x-10 dark:text-white">
                  <div className="3xl:text-[16px] flex items-center text-left text-[14px]">
                    <input
                      type="checkbox"
                      className="custom-checkbox mr-2"
                      checked={data?.data?.every((row) =>
                        selectedModules.includes(row.categoryId),
                      )} // Parent checkbox state
                      onChange={(e) => handleSelectAll(e.target.checked)} // Parent checkbox change handler
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

                <div className="3xl:text-[16px] flex items-center gap-x-5 text-right text-[14px] dark:text-white">
                  <div className="hidden text-center sm:block">Progress</div>

                  <div className="flex items-center gap-x-3">
                    <div className="h-4 w-4 bg-[#3CC8A1]"></div>
                    <p>Correct</p>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <div className="h-4 w-4 bg-[#FF453A]"></div>
                    <p>Incorrect</p>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <div className="h-4 w-4 bg-[#E4E4E7]"></div>
                    <p>Unanswered</p>
                  </div>
                </div>
              </div>
              <div className="mb-5 mt-2 h-[1px] bg-[#A1A1AA]" />

              <div>
                {selectedTab === "Pre-clinical" &&
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
                  ))}

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
                        ? (totals.totalIncorrect / totalQuestions) * 100
                        : 0;
                    const unansweredWidth =
                      totalQuestions > 0
                        ? (totals.totalUnanswered / totalQuestions) * 100
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
                  filterMockPresentations(searchQuery)?.map((row, id) => {
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
                        ? (totals.totalIncorrect / totalQuestions) * 100
                        : 0;
                    const unansweredWidth =
                      totalQuestions > 0
                        ? (totals.totalUnanswered / totalQuestions) * 100
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
                  !isSortedByPresentation &&
                  type === "SBA" &&
                  filteredSBAModules?.map((row) => {
                    const moduleData = SBADataLength?.find(
                      (module) => module.categoryId === row.categoryId,
                    );

                    const totalQuestions = moduleData
                      ? moduleData.questions.length
                      : 0;

                    // Ensure moduleTotals is always an array
                    const moduleTotalsArray = Array.isArray(moduleTotals)
                      ? moduleTotals
                      : Object.values(moduleTotals || {});

                    // Get the totals for correct and incorrect answers
                    const moduleTotal = moduleTotalsArray.find(
                      (m) => String(m.moduleId) === String(row.categoryId),
                    ) || { totalCorrect: 0, totalIncorrect: 0 };

                    const { totalCorrect, totalIncorrect } = moduleTotal;

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
                        {/* Category Name and Checkbox */}
                        <div className="cursor-pointer text-left text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                          <label className="flex cursor-pointer items-center hover:opacity-85">
                            <input
                              type="checkbox"
                              className="custom-checkbox mr-2 hover:opacity-70"
                              checked={selectedModules.includes(row.categoryId)}
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
                              style={{ width: `${correctPercentage}%` }}
                            >
                              {totalCorrect > 0 && <span>{totalCorrect}</span>}
                            </span>

                            {/* Red Section (Incorrect Answers) */}
                            <span
                              className="flex items-center justify-center bg-[#FF453A] text-xs text-white"
                              style={{ width: `${incorrectPercentage}%` }}
                            >
                              {totalIncorrect > 0 && (
                                <span>{totalIncorrect}</span>
                              )}
                            </span>
                          </div>

                          {/* Total Questions */}
                          {/* <span className="text-gray-700 dark:text-white text-sm">{totalQuestions}</span> */}
                        </div>
                      </div>
                    );
                  })}

                {selectedTab === "Clinical" &&
                  !isSortedByPresentation &&
                  type === "SAQ" &&
                  filteredSAQModules?.map((row) => {
                    // Find the count of questions for the current categoryId
                    const moduleData = sqa?.counts?.[row.categoryId] || 0; // Get the count directly from sqa.counts
                    const totalQuestions = moduleData; // Directly use the count from sqa.counts

                    // Ensure moduleTotals is always an array
                    const moduleTotalsArray = Array.isArray(saqModuleTotals)
                      ? saqModuleTotals
                      : Object.values(saqModuleTotals || {});

                    // Get the totals for correct, incorrect, and partial answers
                    const moduleTotal = moduleTotalsArray.find(
                      (m) => String(m.moduleId) === String(row.moduleId),
                    ) || {
                      totalCorrect: 0,
                      totalIncorrect: 0,
                      totalPartial: 0,
                    };

                    console.log("moduleTotalsArray:", moduleTotalsArray);

                    const { totalCorrect, totalIncorrect, totalPartial } =
                      moduleTotal;

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
                        key={row.moduleId} // Use moduleId as the key
                        className="grid items-center py-3 md:grid-cols-2"
                      >
                        <div className="cursor-pointer text-left text-[14px] font-medium text-[#3F3F46] dark:text-white 2xl:text-[16px]">
                          <label className="flex cursor-pointer items-center hover:opacity-85">
                            <input
                              type="checkbox"
                              className="custom-checkbox mr-2 hover:opacity-70"
                              checked={selectedModules.includes(row.moduleId)}
                              onChange={() =>
                                handleCheckboxChange(row.moduleId)
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
                              style={{ width: `${correctPercentage}%` }}
                            >
                              {totalCorrect > 0 && <span>{totalCorrect}</span>}
                            </span>

                            {/* Orange Section (Partial Answers) */}
                            <span
                              className="flex items-center justify-center bg-[#FFA500] text-xs text-white"
                              style={{ width: `${partialPercentage}%` }}
                            >
                              {totalPartial > 0 && <span>{totalPartial}</span>}
                            </span>

                            {/* Red Section (Incorrect Answers) */}
                            <span
                              className="flex items-center justify-center bg-[#FF453A] text-xs text-white"
                              style={{ width: `${incorrectPercentage}%` }}
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
                  filteredMockModules?.map((row) => {
                    const moduleData = mockMcqsByModulesData?.find(
                      (module) => module.categoryId === row.categoryId,
                    );
                    const totalQuestions = moduleData
                      ? moduleData.questions.length
                      : 0;

                    // Ensure moduleTotals is always an array
                    const moduleTotalsArray = Array.isArray(mockModuleTotals)
                      ? mockModuleTotals
                      : Object.values(mockModuleTotals || {});

                    // Get the totals for correct and incorrect answers
                    const moduleTotal = moduleTotalsArray.find(
                      (m) => String(m.moduleId) === String(row.categoryId),
                    ) || { totalCorrect: 0, totalIncorrect: 0 };

                    const { totalCorrect, totalIncorrect } = moduleTotal;

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
                              className="custom-checkbox mr-2 hover:opacity-70"
                              checked={selectedModules.includes(row.categoryId)}
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
                              style={{ width: `${correctPercentage}%` }}
                            >
                              {totalCorrect > 0 && <span>{totalCorrect}</span>}
                            </span>

                            {/* Red Section (Incorrect Answers) */}
                            <span
                              className="flex items-center justify-center bg-[#FF453A] text-xs text-white"
                              style={{ width: `${incorrectPercentage}%` }}
                            >
                              {totalIncorrect > 0 && (
                                <span>{totalIncorrect}</span>
                              )}
                            </span>
                          </div>

                          {/* Total Questions */}
                          {/* <span className="text-gray-700 dark:text-white text-sm">{totalQuestions}</span> */}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
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
