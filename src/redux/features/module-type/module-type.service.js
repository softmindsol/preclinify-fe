import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../helper";

// Thunk to fetch data from staticOSCE table
export const fetchQuesGenData = createAsyncThunk(
    'module/fetchQuesGenData',
    async (_, thunkAPI) => {
        try {
            const { data, error } = await supabase.from('questionGens').select('*');
            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);