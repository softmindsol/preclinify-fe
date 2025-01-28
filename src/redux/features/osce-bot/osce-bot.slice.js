import { createSlice } from "@reduxjs/toolkit";
import { fetchOSCEBotData } from "./osce-bot.service"; // Assuming the thunk is in the thunks.js file

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const osceSlice = createSlice({
    name: "osceBot",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOSCEBotData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOSCEBotData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchOSCEBotData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default osceSlice.reducer;
