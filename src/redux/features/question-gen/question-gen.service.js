import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../helper";

// Thunk to insert data into questionGens table
export const insertQuesGenData = createAsyncThunk(
    'module/insertQuesGenData',
    async (quesGenData, thunkAPI) => {
        try {
            console.log("Inserting data:", quesGenData);

            // Insert data into the questionGens table
            const { data, error } = await supabase
                .from('questionGens')
                .insert([
                    {
                        stem: quesGenData.question_stem,
                        answers: quesGenData.options,
                        lead_in_question: quesGenData.lead_in_question,
                        correct_Answer: quesGenData.correct_Answer,
                        explanation: quesGenData.explanation,
                        module: quesGenData.module,
                        presentation: quesGenData.presentation
                    }
                ]);

            if (error) throw error;

            return data; // Return the inserted data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message); // Return error message
        }
    }
);
