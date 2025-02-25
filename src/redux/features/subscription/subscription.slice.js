import { createSlice } from "@reduxjs/toolkit";
import { fetchSubscriptions } from "./subscription.service";

const subscriptionSlice = createSlice({
    name: "subscriptions",
    initialState: { data: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSubscriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default subscriptionSlice.reducer;