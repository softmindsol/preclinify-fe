import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const fetchOSCEBotData = createAsyncThunk(
    'osce/fetchOSCEBotData',
    async ({ user_id }, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('AI_OSCE')
                .select('*')
                .eq('user_id', user_id); // Filter results by user_id

            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


export const insertOSCEBotData = createAsyncThunk(
    'osce/insertOSCEBotData',
    async ({ chatFeedBack }, thunkAPI) => {
        try {

            console.log("chatFeedBack:", chatFeedBack);

            const { data, error } = await supabase
                .from('AI_OSCE')
                .insert([chatFeedBack]); // Insert the chatFeedBack object into the table

            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


