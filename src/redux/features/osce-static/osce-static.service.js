import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

// Thunk to fetch data from staticOSCE table
export const fetchOSCEData = createAsyncThunk(
  "osce/fetchOSCEData",
  async (_, thunkAPI) => {
    try {
      const { data, error } = await supabase.from("staticOSCE").select("*");
      if (error) throw error;
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const fetchOSCEDataById = createAsyncThunk(
  "osce/fetchOSCEDataById",
  async (id, thunkAPI) => {

    try {
      const { data, error } = await supabase
        .from("staticOSCE")
        .select("*")
        .eq("id", id)
        .single(); // Use .single() if you expect only one result
      if (error) throw error;

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);


export const fetchOSCEPromptById = createAsyncThunk(
  "osce/fetchOSCEPromptById",
  async (id, thunkAPI) => {
    try {
      const { data, error } = await supabase
        .from("staticOSCE")
        .select("OSCE_prompt")
        .eq("id", id)
        .single();

      if (error) throw error;

      console.log("Fetched Data:", data); // Debugging ke liye log karo

      return data?.OSCE_prompt; // Sirf OSCE_prompt return karna
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const fetchModules = createAsyncThunk(
  "modules/fetchModules",
  async (moduleNames, { rejectWithValue }) => {
    try {
      if (!Array.isArray(moduleNames) || moduleNames.length === 0) {
        return rejectWithValue("Invalid module names array");
      }

      const { data, error } = await supabase
        .from("modulesNew")
        .select("*")
        .in("categoryId", moduleNames); // Ensure correct column name

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
