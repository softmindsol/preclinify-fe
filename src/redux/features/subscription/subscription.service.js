import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";
export const fetchSubscriptions = createAsyncThunk(
    "subscriptions/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.from("subscription").select("*");

            if (error) {
                return rejectWithValue(error.message);
            }

            return data; // Return the fetched subscription data
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateSubscriptionTokens = createAsyncThunk(
    "subscriptions/updateTokens",
    async ({ id, total_tokens, used_tokens }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from("subscription")
                .update({ total_tokens, used_tokens })
                .eq("id", id)
                .select();

            if (error) {
                return rejectWithValue(error.message);
            }

            return data[0]; // Return updated subscription
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);