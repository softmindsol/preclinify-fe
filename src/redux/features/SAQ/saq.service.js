import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../helper";

// Fetch MCQs by moduleId with limit
export const fetchShortQuestionByModules = createAsyncThunk(
    'modules/fetchShortQuestionByModules',
    async ({ moduleIds, totalLimit }, { rejectWithValue }) => {
        try {
            if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
                return rejectWithValue('Invalid moduleIds');
            }

            // Calculate the limit for each module
            const baseLimit = Math.floor(totalLimit / moduleIds.length);
            const remainder = totalLimit % moduleIds.length;

            // Prepare limits for each module
            const moduleLimits = moduleIds.map((moduleId, index) => {
                return {
                    moduleId,
                    limit: baseLimit + (index < remainder ? 1 : 0),
                };
            });

            // Run multiple requests in parallel
            const promises = moduleLimits.map(async ({ moduleId, limit }) => {
                let query = supabase
                    .from('saqParent')
                    .select('*')
                    .eq('categoryId', moduleId)
                    .limit(limit);

                const { data, error } = await query;
                if (error) {
                    throw new Error(`Error fetching data for moduleId ${moduleId}: ${error.message}`);
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

export const fetchSqaChild = createAsyncThunk(
    'modules/fetchSqaChild',
    async ({ parentIds, limit }, { rejectWithValue }) => {
        console.log("parentIds:", parentIds);

        try {
            if (!parentIds) return rejectWithValue('Invalid moduleId');

            const query = supabase
                .from('saqChild')
                .select('*')
                .eq('parentQuestionId', parentIds);

            // Apply limit only if limit is provided
            if (limit) {
                query.limit(limit);
            }

            const { data, error } = await query;
            console.log("service:", data);
            console.log("limit services:", limit)

            if (error) {
                return rejectWithValue(error.message || 'Failed to fetch module questions');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error?.message || 'An unexpected error occurred');
        }
    }
);
