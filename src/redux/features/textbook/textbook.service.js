import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../../config/helper';

export const fetchModuleCategories = createAsyncThunk(
    'modules/fetchModuleCategories',
    async (_, { rejectWithValue }) => {
        try {
            // Pehle sab unique moduleIds nikal lein
            const { data: moduleIdsData, error: moduleIdsError } = await supabase
                .from('textbookPages')
                .select('*');

            if (moduleIdsError) throw moduleIdsError;

            const uniqueModuleIds = [...new Set(moduleIdsData?.map(item => item.moduleId))];

            // Ab modulesNew se categoryId fetch karna hai
            const { data: modulesData, error: modulesError } = await supabase
                .from('modulesNew')
                .select('categoryName, categoryId')
                .in('categoryId', uniqueModuleIds);

            if (modulesError) throw modulesError;

            const textbookData = {
                categoryName: modulesData,
                textbook: moduleIdsData
            }

            // Ab data ko map karke response banana


            return textbookData;

        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


// ✅ Async thunk: Fetch notes by moduleId
export const getNotesByModuleId = createAsyncThunk(
    "textbookNotes/getNotesByModuleId",
    async ({ userId, moduleId }, thunkAPI) => {
        try {
            if (!userId) {
                throw new Error("userId is required");
            }

            const { data, error } = await supabase
                .from("textbookNotes")
                .select("notes")
                .eq("userId", userId)
                .eq("moduleId", moduleId); // ✅ Added moduleId condition

            if (error) throw error;
            console.log(data);

            return data[0]?.notes || '';
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const insertOrUpdateNotes = createAsyncThunk(
    "textbook/insertOrUpdateNotes",
    async ({ notes, moduleId, userId }, thunkAPI) => {
        try {
            if (!notes || Object.keys(notes).length === 0) {
                throw new Error("Notes is empty or undefined");
            }

            const { data, error } = await supabase
                .from("textbookNotes")
                .upsert([{ notes, moduleId, userId }], { onConflict: ["userId", "moduleId"] });

            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
