import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";
// Define an async thunk to fetch modules
export const fetchPresentation = createAsyncThunk(
    'modules/fetchPresentation',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('presentations')
                .select('*');

            // If there's an error in the response, reject it
            if (error) {
                return rejectWithValue(error.message);
            }

            console.log("data:", data);
            

            return data; // Return the fetched data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMcqsByPresentationId = createAsyncThunk(
    'modules/fetchMcqsByPresentationId',
    async ({ presentationIds, totalLimit }, { rejectWithValue }) => {
        try {

            if (!presentationIds || !Array.isArray(presentationIds) || presentationIds.length === 0) {
                return rejectWithValue('Invalid presentationIds');
            }

            let moduleLimits;

            // Check if totalLimit is 0
            if (totalLimit === 0) {
                // If totalLimit is 0, fetch all questions for each module
                moduleLimits = presentationIds.map(moduleId => ({
                    moduleId,
                    limit: null // Indicate that we want to fetch all
                }));
            } else {
                // Calculate the limit for each module
                const baseLimit = Math.floor(totalLimit / presentationIds.length);
                const remainder = totalLimit % presentationIds.length;

                // Prepare limits for each module
                moduleLimits = presentationIds.map((pId, index) => {
                    return {
                        pId,
                        limit: baseLimit + (index < remainder ? 1 : 0),
                    };
                });
            }

            // Run multiple requests in parallel
            const promises = moduleLimits.map(async ({ pId, limit }) => {
                let query = supabase
                    .from('mcqQuestions')
                    .select('*')
                    .eq('presentationId', pId);

                // Apply limit only if it's defined
                if (limit !== null) {
                    query = query.limit(limit);
                }

                const { data, error } = await query;
                if (error) {
                    throw new Error(`Error fetching data for moduleId: ${error.message}`);
                }

                return data; // Return the fetched data
            });

            const results = await Promise.all(promises); // Wait for all requests to complete
            console.log("results:", results);

            // Combine all fetched data into a single array
            const combinedData = results.flat(); // Flatten the array of arrays into a single array
            console.log("combinedData:", combinedData);

            return combinedData; // Return the combined data
        } catch (error) {
            return rejectWithValue({
                message: error?.message || 'An unexpected error occurred',
                stack: error?.stack,
            });
        }
    }
);
