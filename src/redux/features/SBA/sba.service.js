import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";
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

export const fetchTotalSBAQuestion = createAsyncThunk(
    'modules/fetchTotalSBAQuestion',
    async ({ ids }, { rejectWithValue }) => {
        try {
          

            // Extract categoryId values from the array of objects
            const categoryIds = ids.map(item => item.categoryId);

            const { data, error } = await supabase
                .from('mcqQuestions')
                .select('*')
                .in('moduleId', categoryIds); // Pass array of categoryIds

            if (error) { 
                console.log("error in fetchTotalSBAQuestion:", error);
                
                return rejectWithValue(error.message);
            }

            // Group questions by categoryId
            const groupedData = categoryIds.map(categoryId => ({
                categoryId,
                questions: data.filter(question => question.moduleId === categoryId)
            }));

           
            return groupedData;
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

            // Run multiple requests in parallel
            const promises = moduleLimits.map(async ({ moduleId, limit }) => {
                let query = supabase
                    .from('mcqQuestions')
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
            const combinedQuestion = results.flat(); // Flatten the array of arrays into a single array
            const combinedData = combinedQuestion.sort(() => Math.random() - 0.5); // Randomly shuffles the array
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
    async ({ id }, { rejectWithValue }) => {
      
        
        try {
            if (!id) return rejectWithValue(' conditionNames ID is not defined for this question.');

            const query = supabase
                .from('conditionNames')
                .select('*')
                .eq('id', id);

       

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
