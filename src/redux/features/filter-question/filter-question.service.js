import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";



export const distributeLimits = (moduleIds, totalLimit) => {
    if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
        throw new Error("Invalid moduleIds");
    }

    let moduleLimits;

    if (totalLimit === 0) {
        // Fetch all records if totalLimit is 0
        moduleLimits = moduleIds.map((moduleId) => ({
            moduleId,
            limit: null,
        }));
    } else {
        const baseLimit = Math.floor(totalLimit / moduleIds.length);
        const remainder = totalLimit % moduleIds.length;

        moduleLimits = moduleIds.map((moduleId, index) => ({
            moduleId,
            limit: baseLimit + (index < remainder ? 1 : 0),
        }));
    }

    return moduleLimits;
};

export const fetchCorrectIncorrectResult = createAsyncThunk(
    "resultsHistory/fetchCorrectIncorrectResult",
    async ({ userId, moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }
            if (!userId) {
                return thunkAPI.rejectWithValue("User ID is required.");
            }

            // Step 1: Fetch correct and incorrect results
            const { data: results, error: resultsError } = await supabase
                .from("resultsHistory")
                .select("moduleId, questionId, isCorrect") // Fetch moduleId, questionId & isCorrect
                .in("moduleId", moduleId)
                .eq("userId", userId) // Filter by userId
                .order("moduleId", { ascending: true });

            if (resultsError) {
                return thunkAPI.rejectWithValue(resultsError.message);
            }

            if (!results || results.length === 0) {
                return thunkAPI.rejectWithValue("No results found.");
            }

            // Step 2: Group by moduleId while preserving duplicates
            const moduleWiseQuestions = results.reduce((acc, item) => {
                if (!acc[item.moduleId]) acc[item.moduleId] = [];
                acc[item.moduleId].push(item.questionId); // Maintain duplicates
                return acc;
            }, {});

            // Step 3: Distribute limit per module
            const moduleLimits = distributeLimits(Object.keys(moduleWiseQuestions), totalLimit);

            // Step 4: Fetch questions while maintaining order & duplicacy
            const promises = moduleLimits.map(async ({ moduleId, limit }) => {
                const questionIds = moduleWiseQuestions[moduleId]; // Get original duplicate-preserved IDs

                if (!questionIds.length) return [];

                // Fetch each question individually (preserving duplicates)
                const questionFetchPromises = questionIds.map(async (questionId) => {
                    const { data, error } = await supabase
                        .from("mcqQuestions")
                        .select("*")
                        .eq("moduleId", moduleId)
                        .eq("id", questionId)
                        .limit(1); // Fetch one at a time to maintain duplicate count

                    if (error) {
                        throw new Error(`Error fetching question for moduleId ${moduleId}, questionId ${questionId}: ${error.message}`);
                    }
                    return data[0]; // Return single object
                });

                let questions = await Promise.all(questionFetchPromises);

                // Apply limit per module
                if (limit !== null && limit < questions.length) {
                    questions = questions.slice(0, limit);
                }

                return questions;
            });

            const resultsData = await Promise.all(promises);
            const combinedData = resultsData.flat().sort(() => Math.random() - 0.5); // Shuffle

            console.log("Fetched Correct & Incorrect Questions (Limited & Preserving Duplicates):", combinedData);
            return combinedData;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


// UnAswered Question

export const fetchUnattemptedQuestions = createAsyncThunk(
    "resultsHistory/fetchUnattemptedQuestions",
    async ({ userId, moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }

            if (!userId) {
                return thunkAPI.rejectWithValue("User ID is required.");
            }
            // Step 1: Fetch all attempted questionIds from resultsHistory
            const { data: attemptedResults, error: attemptedResultsError } = await supabase
                .from("resultsHistory")
                .select("questionId")
                .eq("userId", userId) // Filter by userId
                .in("moduleId", moduleId)


            if (attemptedResultsError) {
                return thunkAPI.rejectWithValue(attemptedResultsError.message);
            }
            console.log("attemptedResults:", attemptedResults)

            // Extract attempted question IDs
            const attemptedQuestionIds = attemptedResults.map(item => item.questionId);

            // Step 2: Fetch questions that are NOT in attemptedQuestionIds
            let query = supabase
                .from("mcqQuestions")
                .select("*")
                .in("moduleId", moduleId)


            if (attemptedQuestionIds.length > 0) {
                query = query.not("id", "in", `(${attemptedQuestionIds.join(",")})`);
            }

            const { data: mcqData, error: mcqError } = await query;

            if (mcqError) {
                return thunkAPI.rejectWithValue(mcqError.message);
            }

            // Step 3: Shuffle data and apply limit
            const shuffledData = mcqData.sort(() => Math.random() - 0.5);
            const finalData = totalLimit ? shuffledData.slice(0, totalLimit) : shuffledData;

            console.log("Fetched Unattempted Questions:", finalData);
            return finalData;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


// Define the async thunk SBA
export const fetchCorrectResult = createAsyncThunk(
    "resultsHistory/fetchCorrectResult",
    async ({ userId, moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!userId) {
                return thunkAPI.rejectWithValue("User ID is required.");
            }

            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("Module ID array is empty or not provided.");
            }

            // Step 1: Fetch incorrect results for the specific user
            const { data: incorrectResults, error: resultsError } = await supabase
                .from("resultsHistory")
                .select("*")
                .eq("userId", userId) // Filter by userId
                .in("moduleId", moduleId)
                .eq("isCorrect", true)
                .order("moduleId", { ascending: true });

            if (resultsError) {
                return thunkAPI.rejectWithValue(resultsError.message);
            }

            if (!incorrectResults || incorrectResults.length === 0) {
                return thunkAPI.rejectWithValue("No incorrect results found for this user.");
            }

            console.log("Fetched Incorrect Results:", incorrectResults);

            // Step 2: Apply limit logic
            const moduleLimits = distributeLimits(moduleId, totalLimit);

            // **Use Map to group incorrect questions by moduleId**
            const moduleQuestionMap = new Map();
            incorrectResults.forEach((result) => {
                if (!moduleQuestionMap.has(result.moduleId)) {
                    moduleQuestionMap.set(result.moduleId, []);
                }
                moduleQuestionMap.get(result.moduleId).push(result.questionId);
            });

            // Fetch questions while preserving duplicates
            const promises = moduleLimits.map(async ({ moduleId, limit }) => {
                const questionIds = moduleQuestionMap.get(moduleId) || [];

                if (questionIds.length === 0) return [];

                // Fetch each question individually (preserving duplicates)
                const questionFetchPromises = questionIds.map(async (questionId) => {
                    const { data, error } = await supabase
                        .from("mcqQuestions")
                        .select("*")
                        .eq("moduleId", moduleId)
                        .eq("id", questionId)
                        .limit(1); // Fetch one at a time to maintain duplicate count

                    if (error) {
                        throw new Error(`Error fetching question for moduleId ${moduleId}, questionId ${questionId}: ${error.message}`);
                    }
                    return data[0]; // Return single object
                });

                let questions = await Promise.all(questionFetchPromises);

                // Apply limit per module
                if (limit !== null && limit < questions.length) {
                    questions = questions.slice(0, limit);
                }

                return questions;
            });

            const results = await Promise.all(promises);
            const combinedData = results.flat().sort(() => Math.random() - 0.5); // Shuffle

            console.log("Final Incorrect Questions (Limited & Preserving Duplicates):", combinedData);
            return combinedData;

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const fetchIncorrectResult = createAsyncThunk(
    "resultsHistory/fetchIncorrectResult",
    async ({ userId, moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!userId) {
                return thunkAPI.rejectWithValue("User ID is required.");
            }

            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("Module ID array is empty or not provided.");
            }

            // Step 1: Fetch incorrect results for the specific user
            const { data: incorrectResults, error: resultsError } = await supabase
                .from("resultsHistory")
                .select("*")
                .eq("userId", userId) // Filter by userId
                .in("moduleId", moduleId)
                .eq("isCorrect", false)
                .order("moduleId", { ascending: true });

            if (resultsError) {
                return thunkAPI.rejectWithValue(resultsError.message);
            }

            if (!incorrectResults || incorrectResults.length === 0) {
                return thunkAPI.rejectWithValue("No incorrect results found for this user.");
            }

            console.log("Fetched Incorrect Results:", incorrectResults);

            // Step 2: Apply limit logic
            const moduleLimits = distributeLimits(moduleId, totalLimit);

            // **Use Map to group incorrect questions by moduleId**
            const moduleQuestionMap = new Map();
            incorrectResults.forEach((result) => {
                if (!moduleQuestionMap.has(result.moduleId)) {
                    moduleQuestionMap.set(result.moduleId, []);
                }
                moduleQuestionMap.get(result.moduleId).push(result.questionId);
            });

            // Fetch questions while preserving duplicates
            const promises = moduleLimits.map(async ({ moduleId, limit }) => {
                const questionIds = moduleQuestionMap.get(moduleId) || [];

                if (questionIds.length === 0) return [];

                // Fetch each question individually (preserving duplicates)
                const questionFetchPromises = questionIds.map(async (questionId) => {
                    const { data, error } = await supabase
                        .from("mcqQuestions")
                        .select("*")
                        .eq("moduleId", moduleId)
                        .eq("id", questionId)
                        .limit(1); // Fetch one at a time to maintain duplicate count

                    if (error) {
                        throw new Error(`Error fetching question for moduleId ${moduleId}, questionId ${questionId}: ${error.message}`);
                    }
                    return data[0]; // Return single object
                });

                let questions = await Promise.all(questionFetchPromises);

                // Apply limit per module
                if (limit !== null && limit < questions.length) {
                    questions = questions.slice(0, limit);
                }

                return questions;
            });

            const results = await Promise.all(promises);
            const combinedData = results.flat().sort(() => Math.random() - 0.5); // Shuffle

            console.log("Final Incorrect Questions (Limited & Preserving Duplicates):", combinedData);
            return combinedData;

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);



// Define the async thunk SBA
export const fetchAllResult = createAsyncThunk(
    "resultsHistory/fetchAllResult",
    async ({ moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }

            // Distribute totalLimit among moduleId
            const moduleLimits = distributeLimits(moduleId, totalLimit);

            // Fetch data for each module with its respective limit
            const promises = moduleLimits.map(async ({ moduleId, limit }) => {
                let query = supabase
                    .from("mcqQuestions")
                    .select("*")
                    .eq("moduleId", moduleId);

                if (limit !== null) {
                    query = query.limit(limit);
                }

                const { data, error } = await query;
                if (error) {
                    throw new Error(`Error fetching data for moduleId ${moduleId}: ${error.message}`);
                }
                return data;
            });

            const results = await Promise.all(promises);
            const combinedData = results.flat().sort(() => Math.random() - 0.5); // Shuffle the data

            console.log("All Filtered & Sorted Data:", combinedData);
            return combinedData;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


//  fetchUnattemptedAndCorrectQuestions SBA
export const fetchUnattemptedAndCorrectQuestions = createAsyncThunk(
    "resultsHistory/fetchUnattemptedAndCorrectQuestions",
    async ({ userId, moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }
            if (!userId) {
                return thunkAPI.rejectWithValue("User ID is required.");
            }
            console.log("fetchUnattemptedAndCorrectQuestions")

            // Step 1: Fetch all attempted questionIds from resultsHistory
            const { data: attemptedResults, error: attemptedResultsError } = await supabase
                .from("resultsHistory")
                .select("questionId, isCorrect, moduleId")
                .eq("userId", userId)
                .in("moduleId", moduleId);

            if (attemptedResultsError) {
                return thunkAPI.rejectWithValue(attemptedResultsError.message);
            }
            console.log("attemptedResults:", attemptedResults);


            // Step 2: Extract attempted question IDs and count correct answers
            const attemptedQuestionIds = new Set();
            const correctQuestionCount = new Map(); // Track occurrences of each correct question

            attemptedResults.forEach(({ questionId, isCorrect, moduleId }) => {
                attemptedQuestionIds.add(questionId);

                if (isCorrect) {
                    const key = `${moduleId}-${questionId}`; // Unique key for tracking
                    correctQuestionCount.set(key, (correctQuestionCount.get(key) || 0) + 1);
                }
            });

            // Step 3: Fetch unattempted questions (i.e., those NOT in attemptedQuestionIds)
            let unattemptedQuery = supabase
                .from("mcqQuestions")
                .select("*")
                .in("moduleId", moduleId);

            if (attemptedQuestionIds.size > 0) {
                unattemptedQuery = unattemptedQuery.not("id", "in", `(${Array.from(attemptedQuestionIds).join(",")})`);
            }

            const { data: unattemptedQuestions, error: unattemptedError } = await unattemptedQuery;
            if (unattemptedError) {
                return thunkAPI.rejectWithValue(unattemptedError.message);
            }

            // Step 4: Fetch correct questions while preserving duplicates
            const correctQuestionPromises = Array.from(correctQuestionCount.entries()).map(async ([key, count]) => {
                const [moduleId, questionId] = key.split("-");

                const { data, error } = await supabase
                    .from("mcqQuestions")
                    .select("*")
                    .eq("id", questionId)
                    .eq("moduleId", moduleId)
                    .limit(1); // Fetch one question at a time

                if (error) {
                    throw new Error(`Error fetching correct question for moduleId ${moduleId}, questionId ${questionId}: ${error.message}`);
                }

                return Array(count).fill(data[0]); // Duplicate the question based on its occurrence count
            });

            const correctQuestions = (await Promise.all(correctQuestionPromises)).flat();

            // Step 5: Merge, shuffle, and apply total limit
            const combinedQuestions = [...unattemptedQuestions, ...correctQuestions].sort(() => Math.random() - 0.5);
            const finalData = totalLimit ? combinedQuestions.slice(0, totalLimit) : combinedQuestions;

            console.log("Fetched Unattempted & Correct Questions:", finalData);
            return finalData;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


export const fetchUnattemptedAndIncorrectQuestions = createAsyncThunk(
    "resultsHistory/fetchUnattemptedAndIncorrectQuestions",
    async ({ userId, moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }
            if (!userId) {
                return thunkAPI.rejectWithValue("User ID is required.");
            }
            console.log("fetchUnattemptedAndIncorrectQuestions");

            // Step 1: Fetch all attempted questionIds from resultsHistory
            const { data: attemptedResults, error: attemptedResultsError } = await supabase
                .from("resultsHistory")
                .select("questionId, isCorrect, moduleId")
                .eq("userId", userId)
                .in("moduleId", moduleId);

            if (attemptedResultsError) {
                return thunkAPI.rejectWithValue(attemptedResultsError.message);
            }
            console.log("attemptedResults:", attemptedResults);

            // Step 2: Extract attempted question IDs and count incorrect answers
            const attemptedQuestionIds = new Set();
            const incorrectQuestionCount = new Map(); // Track occurrences of each incorrect question

            attemptedResults.forEach(({ questionId, isCorrect, moduleId }) => {
                attemptedQuestionIds.add(questionId);

                if (!isCorrect) {
                    const key = `${moduleId}-${questionId}`; // Unique key for tracking
                    incorrectQuestionCount.set(key, (incorrectQuestionCount.get(key) || 0) + 1);
                }
            });

            // Step 3: Fetch unattempted questions (i.e., those NOT in attemptedQuestionIds)
            let unattemptedQuery = supabase
                .from("mcqQuestions")
                .select("*")
                .in("moduleId", moduleId);

            if (attemptedQuestionIds.size > 0) {
                unattemptedQuery = unattemptedQuery.not("id", "in", `(${Array.from(attemptedQuestionIds).join(",")})`);
            }

            const { data: unattemptedQuestions, error: unattemptedError } = await unattemptedQuery;
            if (unattemptedError) {
                return thunkAPI.rejectWithValue(unattemptedError.message);
            }

            // Step 4: Fetch incorrect questions while preserving duplicates
            const incorrectQuestionPromises = Array.from(incorrectQuestionCount.entries()).map(async ([key, count]) => {
                const [moduleId, questionId] = key.split("-");

                const { data, error } = await supabase
                    .from("mcqQuestions")
                    .select("*")
                    .eq("id", questionId)
                    .eq("moduleId", moduleId)
                    .limit(1); // Fetch one question at a time

                if (error) {
                    throw new Error(`Error fetching incorrect question for moduleId ${moduleId}, questionId ${questionId}: ${error.message}`);
                }

                return Array(count).fill(data[0]); // Duplicate the question based on its occurrence count
            });

            const incorrectQuestions = (await Promise.all(incorrectQuestionPromises)).flat();

            // Step 5: Merge, shuffle, and apply total limit
            const combinedQuestions = [...unattemptedQuestions, ...incorrectQuestions].sort(() => Math.random() - 0.5);
            const finalData = totalLimit ? combinedQuestions.slice(0, totalLimit) : combinedQuestions;

            console.log("Fetched Unattempted & Incorrect Questions:", finalData);
            return finalData;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
