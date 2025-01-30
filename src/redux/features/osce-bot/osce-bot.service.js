import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

// Thunk to fetch data from staticOSCE table
export const fetchOSCEBotData = createAsyncThunk(
    'osce/fetchOSCEBotData',
    async (_, thunkAPI) => {
        try {
            const { data, error } = await supabase.from('AI_OSCE').select('*');
            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);