import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const fetchUserStreak = createAsyncThunk(
  "user/fetchStreak",
  async ({ userId }, { rejectWithValue }) => {
    try {
      // Fetch Data from both tables
      const { data: table1Data, error: error1 } = await supabase
        .from("resultsHistory")
        .select("isCorrect, timeStamp")
        .eq("userId", userId);
      const { data: table2Data, error: error2 } = await supabase
        .from("resultHistoryMock")
        .select("isCorrect, timeStamp")
        .eq("userId", userId);
      if (error1 || error2) {
        return rejectWithValue(error1?.message || error2?.message);
      }
      // Combine both tables
      const allRecords = [...(table1Data || []), ...(table2Data || [])];
      // Group data by date
      const groupedData = allRecords.reduce((acc, record) => {
        const date = record.timeStamp.split("T")[0]; // Extract date part
        if (!acc[date]) {
          acc[date] = { totalCorrect: 0, totalIncorrect: 0 };
        }
        if (record.isCorrect) {
          acc[date].totalCorrect += 1;
        } else {
          acc[date].totalIncorrect += 1;
        }
        return acc;
      }, {});
      // Convert grouped object to an array
      const result = Object.keys(groupedData).map((date) => ({
        userId,
        streakDate: date,
        totalCorrect: groupedData[date].totalCorrect,
        totalIncorrect: groupedData[date].totalIncorrect,
        streak:
          groupedData[date].totalCorrect + groupedData[date].totalIncorrect >=
          10
            ? 1
            : 0, // Streak condition
      }));
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
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

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
