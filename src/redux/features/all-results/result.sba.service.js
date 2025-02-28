import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";
import { Children } from "react";

// Define the async thunk SBA
export const insertResult = createAsyncThunk(
  "resultsHistory/insertResult",
  async ({ isCorrect, questionId, userId, moduleId }, thunkAPI) => {
    try {
      const { data, error } = await supabase.from("resultsHistory").insert([
        {
          isCorrect,
          questionId,
          userId,
          moduleId,
        },
      ]);

      if (error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      return data; // Return the inserted data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// Define the async thunk
export const insertMockResult = createAsyncThunk(
  "resultsHistory/insertMockResult",
  async ({ isCorrect, questionId, userId, moduleId, paperId }, thunkAPI) => {
    try {
      const { data, error } = await supabase.from("resultHistoryMock").insert([
        {
          isCorrect,
          questionId,
          userId,
          moduleId,
          paperId
        },
      ]);

      if (error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      return data; // Return the inserted data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// Define the async thunk
export const insertSAQResult = createAsyncThunk(
  "resultsHistory/insertSAQResult",
  async (
    { childrenId, parentId, isCorrect, isIncorrect, isPartial, questionId, userId, moduleId },
    thunkAPI,
  ) => {
    try {
      const { data, error } = await supabase.from("resultHistorySaq").insert([
        {
          isCorrect,
          isIncorrect,
          isPartial,
          questionId,
          userId,
          moduleId,
          parentId,
          childrenId
        },
      ]);

      if (error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      return data; // Return the inserted data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);



// fetch SBA

export const fetchDailyWork = createAsyncThunk(
  "work/fetchDailyWork",
  async ({ userId, selectedModules }, { rejectWithValue }) => {
    try {
      console.log("Fetching daily work for user:", userId);


      let query = supabase
        .from("resultsHistory")
        .select("moduleId, isCorrect, userId")
        .eq("userId", userId);

      const modules = selectedModules?.map(module => module.categoryId)

      if (selectedModules?.length) {
        query = query.in("moduleId", modules);
      }


      const { data, error } = await query;


      if (error) throw error;

      // Compute totals
      const totalsByModule = data.reduce((acc, curr) => {
        const { moduleId, isCorrect } = curr;

        if (!acc[moduleId]) {
          acc[moduleId] = { moduleId, totalCorrect: 0, totalIncorrect: 0 };
        }

        if (Boolean(isCorrect)) {
          acc[moduleId].totalCorrect += 1;
        } else {
          acc[moduleId].totalIncorrect += 1;
        }

        return acc;
      }, {});


      return Object.values(totalsByModule);
    } catch (err) {
      console.error("Error fetching daily work:", err);
      return rejectWithValue(err.message);
    }
  }
);
