import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";


// Define the async thunk
export const addResultEntry = createAsyncThunk(
    'resultsHistory/addResultEntry',
    async ({ userId, result, incorrect, correct, moduleId }, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('resultsHistory')
                .insert([
                    {
                        userId,
                        result,
                        incorrect,
                        correct,
                        moduleId
                    },
                ]);
            console.log("data:", data);
                

            if (error) {
                console.log("error:",error);
                
                return thunkAPI.rejectWithValue(error.message);
            }

            return data; // Return the inserted data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);