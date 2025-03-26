import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../../config/helper';

export const fetchModuleCategories = createAsyncThunk(
    'modules/fetchModuleCategories',
    async (_, { rejectWithValue }) => {
        try {
            // conditionNames table se moduleId, conditionName, aur textbookContent fetch karein
            const { data: conditionData, error: conditionError } = await supabase
                .from('conditionNames')
                .select('id, moduleId, conditionName, textbookContent');

            if (conditionError) throw conditionError;

            // Unique moduleIds nikalna
            const uniqueModuleIds = [...new Set(conditionData.map(item => item.moduleId))];

            // modulesNew table se categoryId aur categoryName fetch karein
            const { data: moduleCategories, error: moduleError } = await supabase
                .from('modulesNew')
                .select('categoryName, categoryId')
                .in('categoryId', uniqueModuleIds);

            if (moduleError) throw moduleError;

            // Module data ko structure me arrange karna
            const formattedData = uniqueModuleIds.map(moduleId => {
                const conditions = conditionData
                    .filter(cond => cond.moduleId === moduleId)
                    .map(cond => ({
                        conditionNamesId: cond.id,
                        conditionName: cond.conditionName,
                        textContent: cond.textbookContent || []
                    }));

                return {
                   totalModule: moduleCategories,
                    moduleId,
                    textbook: {
                        conditionNames: conditions
                    }
                };
            });

            return formattedData;

        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// ✅ Async thunk: Fetch notes by moduleId
export const getNotesByModuleId = createAsyncThunk(
    "textbookNotes/getNotesByModuleId",
    async ({ userId, moduleId }, thunkAPI) => {
        console.log("userId:", userId);

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
            console.log(error);
            
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);
