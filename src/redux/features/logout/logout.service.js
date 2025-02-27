import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true; // Returning success flag
    } catch (error) {
        return rejectWithValue(error.message);
    }
});