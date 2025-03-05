import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";
import { useSelector } from "react-redux";

// Define an async thunk to fetch modules
export const fetchMcqsQuestionFreeBank = createAsyncThunk(
    "freeBank/fetchMcqsQuestionFreeBank",
    async ({ limit } = {}, { rejectWithValue }) => {
        try {
            let query = supabase.from("mcqFreeTrial").select("*");

            // Apply limit only if it's defined and greater than 0
            if (typeof limit === "number" && limit > 0) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) {
                return rejectWithValue(error.message);
            }
            console.log("data:", data);

            return data; // Return the fetched data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTotalSBAQuestion = createAsyncThunk(
    "modules/fetchTotalSBAQuestion",
    async ({ ids }, { rejectWithValue }) => {
        try {
            // Extract categoryId values from the array of objects
            const categoryIds = ids.map((item) => item.categoryId);

            const { data, error } = await supabase
                .from("mcqQuestions")
                .select("*")
                .in("moduleId", categoryIds); // Pass array of categoryIds

            if (error) {
                return rejectWithValue(error.message);
            }

            // Group questions by categoryId
            const groupedData = categoryIds.map((categoryId) => ({
                categoryId,
                questions: data.filter((question) => question.moduleId === categoryId),
            }));

            return groupedData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);



// Fetch MCQs by moduleId with limit
export const fetchConditionNameById = createAsyncThunk(
    "mcqs/fetchConditionNameById",
    async ({ id }, { rejectWithValue }) => {
        try {
            if (!id)
                return rejectWithValue(
                    " conditionNames ID is not defined for this question.",
                );

            const query = supabase.from("conditionNames").select("*").eq("id", id);

            const { data, error } = await query;

            if (error) {
                return rejectWithValue(
                    error.message || "Failed to fetch module questions",
                );
            }

            return data;
        } catch (error) {
            return rejectWithValue(error?.message || "An unexpected error occurred");
        }
    },
);
