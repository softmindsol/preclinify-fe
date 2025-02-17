import { createSlice } from "@reduxjs/toolkit";
import { fetchUserStreak } from "./streak.service";

const initialState = {
    streak: 0,
    totalRecords: 0,
    loading: false,
    error: null,
};

const streakSlice = createSlice({
    name: "streak",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserStreak.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserStreak.fulfilled, (state, action) => {
                state.loading = false;
                state.streak = action.payload.streak;
                state.totalRecords = action.payload.totalRecords;
                state.error = null;
            })
            .addCase(fetchUserStreak.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default streakSlice.reducer;
