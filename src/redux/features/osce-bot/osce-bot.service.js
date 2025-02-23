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
    "osce/insertOSCEBotData",
    async ({ chatFeedback }, thunkAPI) => { // ✅ Consistent naming
        try {
            console.log("chatFeedback received:", chatFeedback);

            if (!chatFeedback || Object.keys(chatFeedback).length === 0) {
                throw new Error("chatFeedback is empty or undefined");
            }

            const { data, error } = await supabase
                .from("AI_OSCE")
                .insert([chatFeedback]); // ✅ Wrap in an array

            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

