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
            console.log("presentationIds, totalLimit:", presentationIds, totalLimit);

            // Validate presentationIds
            if (!presentationIds || !Array.isArray(presentationIds) || presentationIds.length === 0) {
                return rejectWithValue('Invalid presentationIds');
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
                    .from('mcqQuestions')
                    .select('*')
                    .eq('presentationId', pId);

                // Apply limit if specified
                if (limit !== null) {
                    query = query.limit(limit);
                }

                const { data, error } = await query;
                if (error) {
                    throw new Error(`Error fetching data for presentationId ${pId}: ${error.message}`);
                }

                return data; // Return fetched data for this presentationId
            });

            // Wait for all promises to resolve
            const results = await Promise.all(promises);

            // Combine all fetched data into a single array
            const combinedQuestion = results.flat(); // Flatten the array of arrays into a single array
            const combinedData = combinedQuestion.sort(() => Math.random() - 0.5); // Randomly shuffles the array

            return combinedData; // Return the combined data
        } catch (error) {
            return rejectWithValue({
                message: error?.message || 'An unexpected error occurred',
                stack: error?.stack,
            });
        }
    }
);
