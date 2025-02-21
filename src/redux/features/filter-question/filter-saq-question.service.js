import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const fetchCorrectIncorrectResult = createAsyncThunk(
    "resultsHistory/fetchCorrectIncorrectResult",
    async ({ moduleId }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }

            // Step 1: Fetch moduleId and questionId from resultsHistory for both correct and incorrect results
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

            // Extract moduleIds and questionIds
            const moduleIds = results.map(item => item.moduleId);
            const questionIds = results.map(item => item.questionId);

            if (moduleIds.length === 0 || questionIds.length === 0) {
                return thunkAPI.rejectWithValue("No module IDs or question IDs found.");
            }

            // Step 2: Fetch questions from mcqQuestions using moduleId and questionId
            const { data: questions, error: questionsError } = await supabase
                .from("mcqQuestions")
                .select("*")
                .in("moduleId", moduleIds) // moduleId ke against filter
                .in("id", questionIds); // questionId ke against filter

            if (questionsError) {
                return thunkAPI.rejectWithValue(questionsError.message);
            }
            console.log("questions:", questions)
            // Step 3: Merge the results with their corresponding questions


            // console.log("Fetched Correct & Incorrect Questions:", mergedResults);
            return questions; // Final merged data return karega
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


// Define the async thunk SBA
export const fetchCorrectResult = createAsyncThunk(
    "resultsHistory/fetchCorrectResult",
    async ({ moduleId }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }

            // Step 1: Fetch moduleId and questionId from resultsHistory where isCorrect = true
            const { data: correctResults, error: resultsError } = await supabase
                .from("resultsHistory")
                .select("moduleId, questionId") // Sirf moduleId aur questionId lenge
                .in("moduleId", moduleId)
                .eq("isCorrect", true) // Sirf correct wale records lenge
                .order("moduleId", { ascending: true });

            if (resultsError) {
                return thunkAPI.rejectWithValue(resultsError.message);
            }

            if (!correctResults || correctResults.length === 0) {
                return thunkAPI.rejectWithValue("No correct results found.");
            }

            // Extract moduleIds and questionIds
            const moduleIds = correctResults.map(item => item.moduleId);
            const questionIds = correctResults.map(item => item.questionId);

            if (moduleIds.length === 0 || questionIds.length === 0) {
                return thunkAPI.rejectWithValue("No module IDs or question IDs found in correct results.");
            }

            // Step 2: Fetch questions from mcqQuestions using moduleId and questionId
            const { data: questions, error: questionsError } = await supabase
                .from("mcqQuestions")
                .select("*")
                .in("moduleId", moduleIds) // moduleId ke against filter
                .in("id", questionIds); // questionId ke against filter

            if (questionsError) {
                return thunkAPI.rejectWithValue(questionsError.message);
            }

            console.log("Fetched Correct Questions:", questions);
            return questions; // Final data return karega
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);



// Define the async thunk SBA
export const fetchIncorrectResult = createAsyncThunk(
    "resultsHistory/fetchIncorrectResult",
    async ({ moduleId }, thunkAPI) => {
        try {
            if (!moduleId || moduleId.length === 0) {
                return thunkAPI.rejectWithValue("moduleId array is empty or not provided");
            }

            // Step 1: Fetch moduleId and questionId from resultsHistory
            const { data: incorrectResults, error: resultsError } = await supabase
                .from("resultsHistory")
                .select("moduleId, questionId") // Sirf moduleId aur questionId lenge
                .in("moduleId", moduleId)
                .eq("isCorrect", false) // Sirf incorrect wale records lenge
                .order("moduleId", { ascending: true });

            if (resultsError) {
                return thunkAPI.rejectWithValue(resultsError.message);
            }

            if (!incorrectResults || incorrectResults.length === 0) {
                return thunkAPI.rejectWithValue("No incorrect results found.");
            }




            // Extract moduleIds and questionIds
            const moduleIds = incorrectResults.map(item => item.moduleId);
            const questionIds = incorrectResults.map(item => item.questionId);


            if (moduleIds.length === 0 || questionIds.length === 0) {
                return thunkAPI.rejectWithValue("No module IDs or question IDs found in incorrect results.");
            }

            // Step 2: Fetch questions from mcqQuestions using moduleId and questionId
            const { data: questions, error: questionsError } = await supabase
                .from("mcqQuestions")
                .select("*")
                .in("moduleId", moduleIds) // moduleId ke against filter
                .in("id", questionIds); // questionId ke against filter

            if (questionsError) {
                return thunkAPI.rejectWithValue(questionsError.message);
            }

            console.log("Fetched Questions:", questions);
            return questions; // Final data return karega
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const fetchAllResultSaq = createAsyncThunk(
    "modules/fetchAllResultSaq",
    async ({ moduleIds, limit }, thunkAPI) => {
        try {
            if (!moduleIds || moduleIds.length === 0) {
                return thunkAPI.rejectWithValue("Module IDs array is empty or not provided");
            }

            // Step 1: Fetch Parent Questions
            const { data: parentQuestions, error: parentError } = await supabase
                .from("shortQuestions")
                .select("*")
                .in("moduleId", moduleIds);

            if (parentError) {
                return thunkAPI.rejectWithValue(parentError.message);
            }

            if (!parentQuestions || parentQuestions.length === 0) {
                return thunkAPI.rejectWithValue("No short questions found for the given modules.");
            }

            // Extracting parentIds
            const parentIds = parentQuestions.map((item) => item.id);

            // Step 2: Fetch Child Questions
            const { data: childQuestions, error: childError } = await supabase
                .from("sqaChild")
                .select("*")
                .in("parentQuestionId", parentIds)
                .limit(limit); // Applying limit if provided

            if (childError) {
                return thunkAPI.rejectWithValue(childError.message);
            }

            // Step 3: Organize Data (Merging Parent with Children)
            const organizedData = parentQuestions.map((parent) => ({
                ...parent,
                children: childQuestions.filter((child) => child.parentQuestionId === parent.id),
            }));
            console.log("organizedData:", organizedData);

            return organizedData;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
