import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../helper";
// Define an async thunk to fetch modules
export const fetchMcqsQuestion = createAsyncThunk(
    'modules/fetchMcqsQuestion',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('mcqQuestions')
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


// Fetch MCQs by moduleId with limit
export const fetchMcqsByModules = createAsyncThunk(
    'modules/fetchMcqsByModules',
    async ({ moduleIds, totalLimit }, { rejectWithValue }) => {
        try {

            console.log("moduleIds:", moduleIds);
            
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
                    .from('mcqQuestions')
                    .select('*')
                    .eq('moduleId', moduleId)
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


// Fetch MCQs by moduleId with limit
export const fetchConditionNameById= createAsyncThunk(
    'mcqs/fetchConditionNameById',
    async ({ Id }, { rejectWithValue }) => {
        console.log(Id);
        
        try {
            if (!Id) return rejectWithValue('Invalid conditionNames ID.');

            const query = supabase
                .from('conditionNames')
                .select('*')
                .eq('id', Id);

       

            const { data, error } = await query;
            console.log("service:", data);
     

            if (error) {
                return rejectWithValue(error.message || 'Failed to fetch module questions');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error?.message || 'An unexpected error occurred');
        }
    }
);
