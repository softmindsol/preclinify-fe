import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

// Fetch MCQs by moduleId with limit


export const fetchShortQuestionByModules = createAsyncThunk(
    'modules/fetchShortQuestionByModules',
    async (_, { rejectWithValue }) => {
      
        
        try {
           
                let query = supabase
                    .from('saqParent')
                    .select('*')
                    

                const { data, error } = await query;
                if (error) {
                    throw new Error(`Error fetching data for moduleId  ${error.message}`);
                }


            const ids = data.map(item => item.categoryId);

            return{ ids,data}; // Return the fetched data
         
        } catch (error) {
            return rejectWithValue({
                message: error?.message || 'An unexpected error occurred',
                stack: error?.stack,
            });
        }
    }
);

export const fetchModulesById = createAsyncThunk(
    'modules/fetchSQAModules',
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

export const fetchShortQuestionByModulesById = createAsyncThunk(
    'modules/fetchShortQuestionByModuleById',
    async ({ moduleIds }, { rejectWithValue }) => {
       

        try {
            const { data, error } = await supabase
                .from('saqParent')
                .select('*')
                .in('categoryId', moduleIds); // 'in' method ka use

            if (error) {
                throw new Error(`Error fetching data for moduleId: ${error.message}`);
            }

            return data;
        } catch (error) {
            return rejectWithValue({
                message: error?.message || 'An unexpected error occurred',
                stack: error?.stack,
            });
        }
    }
);

;
export const fetchSqaChild = createAsyncThunk(
    'modules/fetchSqaChild',
    async ({ parentIds, limit }, { rejectWithValue }) => {
       

        try {
            if (!parentIds) return rejectWithValue('Invalid moduleId');

            const query = supabase
                .from('saqChild')
                .select('*')
                .in('parentQuestionId', parentIds);

            // Apply limit only if limit is provided
            if (limit) {
                query.limit(limit);
            }

            const { data, error } = await query;
            // console.log("service:", data);
            // console.log("limit services:", limit)

            if (error) {
                return rejectWithValue(error.message || 'Failed to fetch module questions');
            }

            

            return data;
        } catch (error) {
            return rejectWithValue(error?.message || 'An unexpected error occurred');
        }
    }
)


export const fetchShortQuestionGroupByModulesById = createAsyncThunk(
    'modules/fetchShortQuestionGroupByModulesById',
    async (moduleIds, { rejectWithValue }) => {
        try {
            // Extract categoryId from the array of objects
            const categoryIds = moduleIds.map(module => module.categoryId);
console.log("categoryIds:", categoryIds);

            if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
                throw new Error("No valid categoryId found in moduleIds.");
            }

            const { data, error } = await supabase
                .from('saqParent')
                .select('*')
                .in('categoryId', categoryIds); // Using extracted categoryIds array

            if (error) {
                throw new Error(`Error fetching data for moduleId: ${error.message}`);
            }

            console.log("Fetched Data:", data);

            return data;
        } catch (error) {
            return rejectWithValue({
                message: error?.message || 'An unexpected error occurred',
                stack: error?.stack,
            });
        }
    }
);

export const fetchChildrenSaq = createAsyncThunk(
    'saq/fetchChildrenSaq',

    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('saqChild')
                .select('parentQuestionId'); // Sirf parentQuestionId fetch karein

            if (error) {
                return rejectWithValue(error.message || 'Failed to fetch module questions');
            }

            // ✅ Count questions for each parentQuestionId
            const questionCountByParent = data.reduce((acc, { parentQuestionId }) => {
                acc[parentQuestionId] = (acc[parentQuestionId] || 0) + 1;
                return acc;
            }, {});

            console.log("questionCountByParent:", questionCountByParent);
            

            return questionCountByParent; // Object return kar raha hai `{ parentQuestionId: count }`
        } catch (error) {
            return rejectWithValue(error?.message || 'An unexpected error occurred');
        }
    }
);
