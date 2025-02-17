import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../../config/helper';

// Insert user information into Supabase
export const insertUserInformation = createAsyncThunk(
    'user/insertUserInformation',
    async (userData, { rejectWithValue }) => {
        try {

            console.log("userData:", userData);
            
            const { data, error } = await supabase
                .from('personalInformation')
                .insert([userData])
                .select();

            if (error) throw error;
            return data[0];  // Returning inserted record
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
); 

// Fetch user information from Supabase
export const fetchUserInformation = createAsyncThunk(
    'user/personalInformation',
    async ({userId}, { rejectWithValue }) => {
        try {
            console.log("userId:", userId);
            
            const { data, error } = await supabase.from('personalInformation').select('*').eq('user_id', userId);
            if (error) throw error;

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


