import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const insertOrUpdateUserInformation = createAsyncThunk(
  "user/insertOrUpdateUserInformation",
  async ({ user_id, formData }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("personalInformation") // Apni table ka naam yahan change karein
        .upsert([{ user_id, ...formData }], { onConflict: ["user_id"] }); // Agar user_id match karega to update hoga, warna insert

      if (error) throw error;

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch user information from Supabase
export const fetchUserInformation = createAsyncThunk(
  "user/personalInformation",
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("personalInformation")
        .select("*")
        .eq("user_id", user_id);
      if (error) throw error;

      return data?.[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
