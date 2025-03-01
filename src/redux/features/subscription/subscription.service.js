import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const fetchSubscriptions = createAsyncThunk(
    "subscriptions/fetchAll",
    async ({ userId }, { rejectWithValue }) => {
        try {
            // Fetch subscription data based on userId
            const { data: subscriptions, error: subscriptionError } = await supabase
                .from("subscription")
                .select("*")
                .eq("userId", userId);

            if (subscriptionError) {
                return rejectWithValue(subscriptionError.message);
            }

            if (!subscriptions || subscriptions.length === 0) {
                return rejectWithValue("No subscriptions found.");
            }

            // console.log("subscriptions:", subscriptions);

            // Extract planId from the subscription
            const planId = subscriptions[0]?.plan;
            // console.log(" subscriptions, planId:", subscriptions, planId);

            if (!planId) {
                   return { subscriptions, planId };
            }

            // Fetch the corresponding plan details from the plans table
            const { data: plan, error: planError } = await supabase
                .from("plans")
                .select("*")
                .eq("planId", planId)
                .limit(1)
                .maybeSingle(); // Avoids error if multiple/no rows


            if (planError) {
                return rejectWithValue(planError.message);
            }



            // Return both subscription and plan details
            return { subscriptions, plan };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const incrementUsedTokens = createAsyncThunk(
    "subscriptions/incrementUsedTokens",
    async ({ userId }, { rejectWithValue }) => {
        try {

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
