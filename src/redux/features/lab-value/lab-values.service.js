import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";
// Define an async thunk to fetch modules
export const fetchLabValues = createAsyncThunk(
    'modules/fetchLabValues',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('labValues')
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
