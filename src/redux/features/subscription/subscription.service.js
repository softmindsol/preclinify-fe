import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";
export const fetchSubscriptions = createAsyncThunk(
    "subscriptions/fetchAll",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.from("subscription").select("*").eq("userId", userId);

            if (error) {
                return rejectWithValue(error.message);
            }



            return data; // Return the fetched subscription data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const incrementUsedTokens = createAsyncThunk(
    "subscriptions/incrementUsedTokens",
    async ({ userId }, { rejectWithValue }) => {
        try {
            console.log("userId:", userId);

            if (!userId) {
                console.log("UserId is required");

                // return  new Error("UserId is required");

            }
            // Fetch current used_tokens
            const { data, error } = await supabase
                .from("subscription")
                .select("used_tokens")
                .eq("userId", userId)
                .single();

            if (error) {
                console.log("incrementUsedTokens", error);
                return rejectWithValue(error.message);
            }

            // Increment used_tokens by 1
            const updatedTokens = data.used_tokens + 1;

            // Update used_tokens in the database
            const { data: updatedData, error: updateError } = await supabase
                .from("subscription")
                .update({ used_tokens: updatedTokens })
                .eq("userId", userId)
                .select();

            if (updateError) {
                return rejectWithValue(updateError.message);
            }

            return updatedData[0]; // Return updated subscription
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
