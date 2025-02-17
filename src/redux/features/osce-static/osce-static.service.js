import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

// Thunk to fetch data from staticOSCE table
export const fetchOSCEData = createAsyncThunk(
    'osce/fetchOSCEData',
    async (_, thunkAPI) => {
        try {
            const { data, error } = await supabase.from('staticOSCE').select('*');
            if (error) throw error;
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    } 
);

export const fetchOSCEDataById = createAsyncThunk(
    'osce/fetchOSCEDataById',
    async (id, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('staticOSCE')
                .select('*')
                .eq('id', id)
                .single(); // Use .single() if you expect only one result
                console.log("data:", data);
            if (error) throw error;

            
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);



export const fetchModules = createAsyncThunk(
    'modules/fetchModules',
    async (moduleNames, { rejectWithValue }) => {
        try {
            if (!Array.isArray(moduleNames) || moduleNames.length === 0) {
                return rejectWithValue('Invalid module names array');
            }

            const { data, error } = await supabase
                .from('modulesNew')
                .select('*')
                .in('categoryId', moduleNames); // Ensure correct column name

            if (error) {
                console.log("error:", error);
                
                return rejectWithValue(error.message);
            }

            console.log("data:", data);
            

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
