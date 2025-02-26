import { createSlice } from "@reduxjs/toolkit";
import { fetchSubscriptions } from "./subscription.service";

const subscriptionSlice = createSlice({
    name: "subscriptions",
    initialState: {
        subscriptions: [],
        plan: null,
        loader: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptions.pending, (state) => {
                state.loader = true;
                state.error = null;
            })
            .addCase(fetchSubscriptions.fulfilled, (state, action) => {
                state.loader = false;
                state.subscriptions = action.payload.subscriptions; // Store subscription data
                state.plan = action.payload.plan; // Store plan details
            })
            .addCase(fetchSubscriptions.rejected, (state, action) => {
                state.loader = false;
                state.error = action.payload;
            });
    },
});

export default subscriptionSlice.reducer;
