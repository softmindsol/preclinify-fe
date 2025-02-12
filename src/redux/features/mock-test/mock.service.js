import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const fetchMockTest = createAsyncThunk(
    'modules/fetchMockTest',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('mockTable')
                .select('*'); // Fetch only the 'id' column

            // If there's an error in the response, reject it
            if (error) {
                return rejectWithValue(error.message);
            }



            // Extract IDs from the data

            const ids = data.map(item => item.moduleId);

            return ids; // Return the fetched IDs
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchModulesById = createAsyncThunk(
    'modules/fetchModulesByMock',
    async ({ ids }, { rejectWithValue }) => {

        try {
            // Fetch modules where the 'id' is in the provided 'ids' array
            const { data, error } = await supabase
                .from('modulesNew')
                .select('*')
                .in('categoryId', ids); // Filter modules based on the provided IDs

            // If there's an error in the response, reject it
            if (error) {
                console.log("error:", error);

                return rejectWithValue(error.message);
            }

            return data; // Return the fetched modules
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTotalMockQuestion = createAsyncThunk(
    'modules/fetchTotalMockQuestion',
    async ({ ids }, { rejectWithValue }) => {
        try {


            // Extract categoryId values from the array of objects
            const categoryIds = ids.map(item => item.categoryId);
            console.log("categoryIds:", categoryIds);

            const { data, error } = await supabase
                .from('mockTable')
                .select('*')
                .in('moduleId', categoryIds); // Pass array of categoryIds

            if (error) {
                console.log("error in fetchTotalMockQuestion:", error);

                return rejectWithValue(error.message);
            }

     

            // Group questions by categoryId
            const groupedData = categoryIds.map(categoryId => ({
                categoryId,
                questions: data.filter(question => question.moduleId === categoryId)
            }));


            console.log("Mock Data:", groupedData);

            return groupedData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



export const fetchMockTestById = createAsyncThunk(
    'modules/fetchMockTestById',
    async ({ moduleIds, totalLimit }, { rejectWithValue }) => {



        try {

            if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
                return rejectWithValue('Invalid moduleIds');
            }

            let moduleLimits;

            // Check if totalLimit is 0
            if (totalLimit === 0) {
                // If totalLimit is 0, fetch all questions for each module
                moduleLimits = moduleIds.map(moduleId => ({
                    moduleId,
                    limit: null // Indicate that we want to fetch all
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
                    .from('mockTable')
                    .select('*')
                    .eq('moduleId', moduleId);

                // Apply limit only if it's defined
                if (limit !== null) {
                    query = query.limit(limit);
                }

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
            return rejectWithValue(error.message);
        }
    }
);
