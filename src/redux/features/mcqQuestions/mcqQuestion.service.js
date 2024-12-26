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

            // Apply limit only if limit is provided
            if (limit) {
                query.limit(limit);
            }

            const { data, error } = await query;
            console.log("service:", data);
            console.log("limit services:", limit)

            if (error) {
                return rejectWithValue(error.message || 'Failed to fetch module questions');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error?.message || 'An unexpected error occurred');
        }
    }
);


// Fetch MCQs by moduleId with limit
export const fetchConditionNameById= createAsyncThunk(
    'mcqs/fetchConditionNameById',
    async ({ Id }, { rejectWithValue }) => {
        console.log(Id);
        
        try {
            if (!Id) return rejectWithValue('Invalid conditionNames ID.');

            const query = supabase
                .from('conditionNames')
                .select('*')
                .eq('id', Id);

       

            const { data, error } = await query;
            console.log("service:", data);
     

            if (error) {
                return rejectWithValue(error.message || 'Failed to fetch module questions');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error?.message || 'An unexpected error occurred');
        }
    }
);
