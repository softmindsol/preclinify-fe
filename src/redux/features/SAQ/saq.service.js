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

export const fetchSqaChild = createAsyncThunk(
    'modules/fetchSqaChild',
    async ({ parentIds, limit }, { rejectWithValue }) => {
        console.log("parentIds:", parentIds);

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

            console.log("data:", data);
            

            return data;
        } catch (error) {
            return rejectWithValue(error?.message || 'An unexpected error occurred');
        }
    }
);
