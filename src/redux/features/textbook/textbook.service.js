import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
                .select('categoryName')
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