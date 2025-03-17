import {  createAsyncThunk } from '@reduxjs/toolkit';
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


export const insertNotes = createAsyncThunk(
    "textbook/insertNotes",
    async ({ notes }, thunkAPI) => { // ✅ Consistent naming
        try {
            console.log("notes received:", notes);

            if (!notes || Object.keys(notes).length === 0) {
                throw new Error("notes is empty or undefined");
            }

            const { data, error } = await supabase
                .from("textbookNotes")
                .insert([notes]); // ✅ Wrap in an array

            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
