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


// Fetch MCQs by moduleId with limit
export const fetchMcqsByModule = createAsyncThunk(
    'modules/fetchMcqsByModule',
    async ({ moduleId, limit }, { rejectWithValue }) => {
        try {
            if (!moduleId) return rejectWithValue('Invalid moduleId');

            const query = supabase
                .from('mcqQuestions')
                .select('*')
                .eq('moduleId', moduleId);

            // Apply limit if provided
            if (limit) {
                query.limit(limit);
            }

            const { data, error } = await query;

           
            if (error) {
                return rejectWithValue(error.message || 'Failed to fetch module questions');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error?.message || 'An unexpected error occurred');
        }
    }
);