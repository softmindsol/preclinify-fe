import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

// Thunk to fetch data from staticOSCE table
export const fetchOSCEData = createAsyncThunk(
    'osce/fetchOSCEData',
    async (_, thunkAPI) => {
        try {
            const { data, error } = await supabase.from('staticOSCE').select('*');
            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const fetchOSCEDataById = createAsyncThunk(
    'osce/fetchOSCEDataById',
    async (id, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('staticOSCE')
                .select('*')
                .eq('id', id)
                .single(); // Use .single() if you expect only one result
            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);