import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const fetchUserStreak = createAsyncThunk(
    "user/fetchStreak",
    async ({userId}, { rejectWithValue }) => {
        console.log("userId:", userId);
        
        try {
            // Get records for the user from table1
            const { data: table1Data, error: error1 } = await supabase
                .from("resultsHistory")
                .select("*")
                .eq("userId", userId)
                .gte("timeStamp", new Date().toISOString().split("T")[0]);

            // Get records for the user from table2
            const { data: table2Data, error: error2 } = await supabase
                .from("resultHistoryMock")
                .select("*")
                .eq("userId", userId)
                .gte("timeStamp", new Date().toISOString().split("T")[0]);

            if (error1 || error2) {
                return rejectWithValue(error1?.message || error2?.message);
            }
            
            // Calculate total records for today
            const totalRecords = (table1Data?.length || table2Data?.length) ||0;

            console.log("totalRecords:", totalRecords);
            
            const streak = totalRecords >= 10 ? 1 : 0;

            return { userId, totalRecords, streak };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
