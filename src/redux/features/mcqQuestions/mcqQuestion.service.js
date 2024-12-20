import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../helper";
// Define an async thunk to fetch modules
export const fetchMcqsQuestion = createAsyncThunk(
    'modules/fetchMcqsQuestion',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('mcqQuestions')
                .select('*');

            // If there's an error in the response, reject it
            if (error) {
                return rejectWithValue(error.message);
            }

            return data; // Return the fetched data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// Define an async thunk to fetch mcqQuestions based on categoryId
export const fetchMcqsByModule = createAsyncThunk(
    'modules/fetchMcqsByModule',
    async (Id, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('mcqQuestions')
                .select('*')
                .eq('moduleId', Id); // Filter by categoryId

            // If there's an error in the response, reject it
            if (error) {
                return rejectWithValue(error.message);
            }
            console.log("data:", data)

            return data; // Return the filtered data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);