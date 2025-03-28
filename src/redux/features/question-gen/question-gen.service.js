import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

// Define an async thunk to fetch modules
export const fetchQuesGenModules = createAsyncThunk(
  "modules/fetchQuesGenModules",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("questionGens")
        .select("module"); // Fetch only the 'module' column

      // If there's an error in the response, reject it
      if (error) {
        return rejectWithValue(error.message);
      }
      console.log("Question Generation:", data);
      

      return data; // Return the fetched data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch MCQs by moduleId with limit
export const fetchQuesGenModuleById = createAsyncThunk(
  "modules/fetchQuesGenModuleById",
  async ({ moduleIds, totalLimit }, { rejectWithValue }) => {
    try {
      if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
        return rejectWithValue("Invalid moduleIds");
      }

      let moduleLimits;

      // Check if totalLimit is 0
      if (totalLimit === 0) {
        // If totalLimit is 0, fetch all questions for each module
        moduleLimits = moduleIds.map((moduleId) => ({
          moduleId,
          limit: null, // Indicate that we want to fetch all
        }));
      } else {
        // Calculate the limit for each module
        const baseLimit = Math.floor(totalLimit / moduleIds.length);
        const remainder = totalLimit % moduleIds.length;

        // Prepare limits for each module
        moduleLimits = moduleIds.map((moduleId, index) => {
          return {
            moduleId,
            limit: baseLimit + (index < remainder ? 1 : 0),
          };
        });
      }

      // Run multiple requests in parallel
      const promises = moduleLimits.map(async ({ moduleId, limit }) => {
        let query = supabase
          .from("questionGens")
          .select("*")
          .eq("module", moduleId);

        // Apply limit only if it's defined
        if (limit !== null) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(
            `Error fetching data for moduleId ${moduleId}: ${error.message}`,
          );
        }

        return data; // Return the fetched data
      });

      const results = await Promise.all(promises); // Wait for all requests to complete

      // Combine all fetched data into a single array
      const combinedData = results.flat(); // Flatten the array of arrays into a single array

      return combinedData; // Return the combined data
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "An unexpected error occurred",
        stack: error?.stack,
      });
    }
  },
);

// Thunk to insert data into questionGens table
export const insertQuesGenData = createAsyncThunk(
  "module/insertQuesGenData",
  async (quesGenDataArray, thunkAPI) => {
    try {
      if (!Array.isArray(quesGenDataArray) || quesGenDataArray.length === 0) {
        throw new Error("Invalid data format: Expected an array of questions.");
      }

      console.log("quesGenDataArray", quesGenDataArray);
      

      // Map each question object to the correct Supabase format
      const formattedData = quesGenDataArray.map((quesGenData) => ({
        question_stem: quesGenData.question_stem,
        answersArray: quesGenData.answersArray,
        lead_in_question: quesGenData.lead_in_question,
        correctAnswerId: quesGenData.correctAnswerId, // Ensure consistent casing
        explanationList: quesGenData.explanationList,
        module: quesGenData.module,
        presentation: quesGenData.presentation,
      }));

      // Insert multiple records into Supabase
      const { data, error } = await supabase
        .from("questionGens")
        .insert(formattedData); // Insert the entire array at once

      if (error) throw error;

      return data; // Return the inserted data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message); // Return error message
    }
  },
);
