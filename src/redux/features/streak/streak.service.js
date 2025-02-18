import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";


export const fetchUserStreak = createAsyncThunk(
    "user/fetchStreak",
    async ({ userId }, { rejectWithValue }) => {
        console.log("userId:", userId);

        try {
            const today = new Date().toISOString().split("T")[0];

            // Get records from table1
            const { data: table1Data, error: error1 } = await supabase
                .from("resultsHistory")
                .select("isCorrect, timeStamp")
                .eq("userId", userId)
                .gte("timeStamp", today)
                .lt("timeStamp", today + "T23:59:59");

            // Get records from table2
            const { data: table2Data, error: error2 } = await supabase
                .from("resultHistoryMock")
                .select("isCorrect, timeStamp")
                .eq("userId", userId)
                .gte("timeStamp", today)
                .lt("timeStamp", today + "T23:59:59");

            if (error1 || error2) {
                return rejectWithValue(error1?.message || error2?.message);
            }

            // Combine both tables
            const allRecords = [...(table1Data || []), ...(table2Data || [])];

            // Count correct and incorrect answers
            const totalCorrect = allRecords.filter(record => record.isCorrect === true).length;
            const totalIncorrect = allRecords.filter(record => record.isCorrect === false).length;

            console.log("totalCorrect:", totalCorrect);
            console.log("totalIncorrect:", totalIncorrect);

            // Get streak logic
            const streak = totalCorrect + totalIncorrect >= 10 ? 1 : 0;

            // Get the exact date from records or today's date if none
            const streakDate = allRecords.length > 0
                ? allRecords[0].timeStamp.split("T")[0]
                : today; // Default to today if no record found

            return [{ userId, totalCorrect, totalIncorrect, streak, streakDate }];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



export const insertUserStreak = createAsyncThunk(
    "user/insertUserStreak",
    async ({ userId }, { rejectWithValue }) => {
       

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
