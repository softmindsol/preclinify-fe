import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const fetchMockTest = createAsyncThunk(
    'modules/fetchMockTest',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('mockTable')
                .select('moduleId'); // Fetch only the 'id' column

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
    async ({ids}, { rejectWithValue }) => {
            
        try {
            // Fetch modules where the 'id' is in the provided 'ids' array
            const { data, error } = await supabase
                .from('modulesNew')
                .select('*')
                .in('categoryId', ids); // Filter modules based on the provided IDs

            // If there's an error in the response, reject it
            if (error) {
                console.log("error:",error);
                
                return rejectWithValue(error.message);
            }            

            return data; // Return the fetched modules
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchMockTestById = createAsyncThunk(
    'modules/fetchMockTestById',
    async (Id, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('mockTable')
                .select('*')
                .eq("moduleId",Id)

            // If there's an error in the response, reject it
            if (error) {
                return rejectWithValue(error.message);
            }

            return data; // Return the fetched IDs
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
