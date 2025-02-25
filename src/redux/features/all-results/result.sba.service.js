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
