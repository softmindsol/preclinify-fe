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
    async ({ moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }

            // Step 1: Fetch correct and incorrect results
            const { data: results, error: resultsError } = await supabase
                .from("resultsHistory")
                .select("moduleId, questionId, isCorrect") // moduleId, questionId aur isCorrect lenge
                .in("moduleId", moduleId)
                .order("moduleId", { ascending: true });

            if (resultsError) {
                return thunkAPI.rejectWithValue(resultsError.message);
            }

            if (!results || results.length === 0) {
                return thunkAPI.rejectWithValue("No results found.");
            }

            // Extract unique moduleIds and questionIds
            const moduleIds = [...new Set(results.map(item => item.moduleId))];
            const questionIds = results.map(item => item.questionId);

            if (moduleIds.length === 0 || questionIds.length === 0) {
                return thunkAPI.rejectWithValue("No module IDs or question IDs found.");
            }

            // Step 2: Apply limit logic
            const moduleLimits = distributeLimits(moduleIds, totalLimit);

            // Fetch questions with distributed limits
            const promises = moduleLimits.map(async ({ moduleId, limit }) => {
                let query = supabase
                    .from("mcqQuestions")
                    .select("*")
                    .eq("moduleId", moduleId)
                    .in("id", questionIds); // Filter by question IDs

                if (limit !== null) {
                    query = query.limit(limit);
                }

                const { data, error } = await query;
                if (error) {
                    throw new Error(`Error fetching questions for moduleId ${moduleId}: ${error.message}`);
                }
                return data;
            });

            const resultsData = await Promise.all(promises);
            const combinedData = resultsData.flat().sort(() => Math.random() - 0.5); // Shuffle

            console.log("Fetched Correct & Incorrect Questions:", combinedData);
            return combinedData;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);



// UnAswered Question

export const fetchUnattemptedQuestions = createAsyncThunk(
    "resultsHistory/fetchUnattemptedQuestions",
    async ({ moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }

            // Step 1: Fetch all attempted questionIds from resultsHistory
            const { data: attemptedResults, error: attemptedResultsError } = await supabase
                .from("resultsHistory")
                .select("questionId")
                .in("moduleId", moduleId);

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
                .in("moduleId", moduleId);

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
    async ({ moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }

            // Step 1: Fetch correct results
            const { data: correctResults, error: resultsError } = await supabase
                .from("resultsHistory")
                .select("moduleId, questionId")
                .in("moduleId", moduleId)
                .eq("isCorrect", true)
                .order("moduleId", { ascending: true });

            if (resultsError) {
                return thunkAPI.rejectWithValue(resultsError.message);
            }

            if (!correctResults || correctResults.length === 0) {
                return thunkAPI.rejectWithValue("No correct results found.");
            }

            // Extract unique moduleIds and questionIds
            const moduleIds = [...new Set(correctResults.map(item => item.moduleId))];
            const questionIds = correctResults.map(item => item.questionId);

            if (moduleIds.length === 0 || questionIds.length === 0) {
                return thunkAPI.rejectWithValue("No module IDs or question IDs found in correct results.");
            }

            // Step 2: Apply limit logic
            const moduleLimits = distributeLimits(moduleIds, totalLimit);

            // Fetch questions with distributed limits
            const promises = moduleLimits.map(async ({ moduleId, limit }) => {
                let query = supabase
                    .from("mcqQuestions")
                    .select("*")
                    .eq("moduleId", moduleId)
                    .in("id", questionIds); // Filter by question IDs

                if (limit !== null) {
                    query = query.limit(limit);
                }

                const { data, error } = await query;
                if (error) {
                    throw new Error(`Error fetching questions for moduleId ${moduleId}: ${error.message}`);
                }
                return data;
            });

            const results = await Promise.all(promises);
            const combinedData = results.flat().sort(() => Math.random() - 0.5); // Shuffle

            console.log("Fetched Correct Questions:", combinedData);
            return combinedData;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);



export const fetchIncorrectResult = createAsyncThunk(
    "resultsHistory/fetchIncorrectResult",
    async ({ moduleId, totalLimit }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }

            // Step 1: Fetch incorrect results
            const { data: incorrectResults, error: resultsError } = await supabase
                .from("resultsHistory")
                .select("moduleId, questionId")
                .in("moduleId", moduleId)
                .eq("isCorrect", false)
                .order("moduleId", { ascending: true });

            if (resultsError) {
                return thunkAPI.rejectWithValue(resultsError.message);
            }

            if (!incorrectResults || incorrectResults.length === 0) {
                return thunkAPI.rejectWithValue("No incorrect results found.");
            }

            // Extract unique moduleIds and questionIds
            const moduleIds = [...new Set(incorrectResults.map(item => item.moduleId))];
            const questionIds = incorrectResults.map(item => item.questionId);

            if (moduleIds.length === 0 || questionIds.length === 0) {
                return thunkAPI.rejectWithValue("No module IDs or question IDs found in incorrect results.");
            }

            // Step 2: Apply limit logic
            const moduleLimits = distributeLimits(moduleIds, totalLimit);

            // Fetch questions with distributed limits
            const promises = moduleLimits.map(async ({ moduleId, limit }) => {
                let query = supabase
                    .from("mcqQuestions")
                    .select("*")
                    .eq("moduleId", moduleId)
                    .in("id", questionIds); // Filter by question IDs

                if (limit !== null) {
                    query = query.limit(limit);
                }

                const { data, error } = await query;
                if (error) {
                    throw new Error(`Error fetching questions for moduleId ${moduleId}: ${error.message}`);
                }
                return data;
            });

            const results = await Promise.all(promises);
            const combinedData = results.flat().sort(() => Math.random() - 0.5); // Shuffle

            console.log("Fetched fetchIncorrectResult Questions:", combinedData);
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

