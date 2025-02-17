import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";
export const fetchUserStreak = createAsyncThunk(
    "user/fetchStreak",
    async ({ userId }, { rejectWithValue }) => {
        console.log("userId:", userId);

        try {
            // Get records for the user from table1 with exact date
            const { data: table1Data, error: error1 } = await supabase
                .from("resultsHistory")
                .select("*")
                .eq("userId", userId)
                .gte("timeStamp", new Date().toISOString().split("T")[0]) // Get today's date
                .lt("timeStamp", new Date().toISOString().split("T")[0] + "T23:59:59"); // End of the day

            // Get records for the user from table2 with exact date
            const { data: table2Data, error: error2 } = await supabase
                .from("resultHistoryMock")
                .select("*")
                .eq("userId", userId)
                .gte("timeStamp", new Date().toISOString().split("T")[0])
                .lt("timeStamp", new Date().toISOString().split("T")[0] + "T23:59:59");

            if (error1 || error2) {
                return rejectWithValue(error1?.message || error2?.message);
            }

            // Calculate total records for today
            const totalRecords = (table1Data?.length || table2Data?.length) || 0;

            console.log("totalRecords:", totalRecords);

            const streak = totalRecords >= 10 ? 1 : 0;

            // Get the exact date from records or today's date if none
            const streakDate = table1Data?.length > 0
                ? table1Data[0].timeStamp.split("T")[0]
                : table2Data?.length > 0
                    ? table2Data[0].timeStamp.split("T")[0]
                    : new Date().toISOString().split("T")[0]; // Default to today if no record found

            return { userId, totalRecords, streak, streakDate };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const insertUserStreak = createAsyncThunk(
    "user/insertUserStreak",
    async ({ userId }, { rejectWithValue }) => {
        console.log("userId:", userId);

        try {
            // Get records for the user from table1
            const { data, error } = await supabase
                .from("resultsHistory")
                .select("*")
                .eq("userId", userId)
                .gte("timeStamp", new Date().toISOString().split("T")[0]);

            // Get records for the user from table2
           

           return data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
