import { createSlice } from "@reduxjs/toolkit";
import { fetchDailyWork } from "./result.sba.service";

const dailyWorkSlice = createSlice({
    name: "SBAResult",
    initialState: {
        moduleTotals: [],
        status: "idle", // "idle" | "loading" | "succeeded" | "failed"
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDailyWork.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchDailyWork.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.moduleTotals = action.payload;
            })
            .addCase(fetchDailyWork.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default dailyWorkSlice.reducer;
