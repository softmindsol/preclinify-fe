import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const fetchMockTest = createAsyncThunk(
  "modules/fetchMockTest",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("mockTable").select("*"); // Fetch only the 'id' column

      if (error) {
        return rejectWithValue(error.message);
      }

      const ids = data.map((item) => item.moduleId);

      return ids;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMockTestByPresentationId = createAsyncThunk(
  "modules/fetchMockTestByPresentationId",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("mockTable").select("*"); // Fetch only the 'id' column

      if (error) {
        return rejectWithValue(error.message);
      }

      const ids = data.map((item) => item.presentationId);

      return ids;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchModulesById = createAsyncThunk(
  "modules/fetchModulesByMock",
  async ({ ids }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("modulesNew")
        .select("*")
        .in("categoryId", ids);
      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchTotalMockQuestion = createAsyncThunk(
  "modules/fetchTotalMockQuestion",
  async ({ ids }, { rejectWithValue }) => {
    try {
      const categoryIds = ids.map((item) => item.categoryId);

      const { data, error } = await supabase
        .from("mockTable")
        .select("*")
        .in("moduleId", categoryIds); // Pass array of categoryIds

      if (error) {
        return rejectWithValue(error.message);
      }

      const groupedData = categoryIds.map((categoryId) => ({
        categoryId,
        questions: data.filter((question) => question.moduleId === categoryId),
      }));

      return groupedData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchPresentationMock = createAsyncThunk(
  "modules/fetchPresentationMock",
  async ({ ids }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("presentations")
        .select("*")
        .in("presentationId", ids); // Fetch only the 'id' column

      if (error) {
        return rejectWithValue(error.message);
      }

      return data; // Return the fetched data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMockTestById = createAsyncThunk(
  "modules/fetchMockTestById",
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
      const promises = moduleLimits.map(async ({ moduleId, limit }) => {
        let query = supabase
          .from("mockTable")
          .select("*")
          .eq("moduleId", moduleId);

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

      const combinedData = results.flat(); // Flatten the array of arrays into a single array

      return combinedData; // Return the combined data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMockMcqsByPresentationId = createAsyncThunk(
  "modules/fetchMockMcqsByPresentationId",
  async ({ presentationIds, totalLimit }, { rejectWithValue }) => {
    try {
      if (
        !presentationIds ||
        !Array.isArray(presentationIds) ||
        presentationIds.length === 0
      ) {
        return rejectWithValue("Invalid presentationIds");
      }

      // Calculate limits for each module
      const moduleLimits = presentationIds.map((pId, index) => {
        if (totalLimit === 0) {
          // Fetch all questions if totalLimit is 0
          return { pId, limit: null };
        } else {
          // Distribute totalLimit among modules
          const baseLimit = Math.floor(totalLimit / presentationIds.length);
          const remainder = totalLimit % presentationIds.length;
          return {
            pId,
            limit: baseLimit + (index < remainder ? 1 : 0),
          };
        }
      });

      // Fetch data for each presentationId in parallel
      const promises = moduleLimits.map(async ({ pId, limit }) => {
        let query = supabase
          .from("mockTable")
          .select("*")
          .eq("presentationId", pId);

        // Apply limit if specified
        if (limit !== null) {
          query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) {
          throw new Error(
            `Error fetching data for presentationId ${pId}: ${error.message}`,
          );
        }

        return data; // Return fetched data for this presentationId
      });

      // Wait for all promises to resolve
      const results = await Promise.all(promises);

      // Combine all results into a single array
      const combinedData = results.flat();

      return combinedData; // Return the combined data
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "An unexpected error occurred",
        stack: error?.stack,
      });
    }
  },
);
