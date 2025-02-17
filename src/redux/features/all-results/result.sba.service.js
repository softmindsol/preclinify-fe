import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";


// Define the async thunk SBA
export const insertResult = createAsyncThunk(
    'resultsHistory/insertResult',
    async ({ isCorrect,questionId,userId, moduleId }, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('resultsHistory')
                .insert([
                    {
                        isCorrect, questionId, userId, moduleId
                    },
                ]);
       


            if (error) {
                console.log("error:", error);

                return thunkAPI.rejectWithValue(error.message);
            }

            return data; // Return the inserted data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);



// Define the async thunk
export const insertMockResult = createAsyncThunk(
    'resultsHistory/insertMockResult',
    async ({ isCorrect, questionId, userId, moduleId }, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('resultHistoryMock')
                .insert([
                    {
                        isCorrect, questionId, userId, moduleId
                    },
                ]);



            if (error) {
                console.log("error:", error);

                return thunkAPI.rejectWithValue(error.message);
            }

            return data; // Return the inserted data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);