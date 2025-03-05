import { createSlice } from "@reduxjs/toolkit";
import { fetchShortQuestionsWithChildrenFreeTrial } from "./free-trial-saq.service";

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const shortQuestionsSlice = createSlice({
    name: "shortQuestionsFreeTrial",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchShortQuestionsWithChildrenFreeTrial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShortQuestionsWithChildrenFreeTrial.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchShortQuestionsWithChildrenFreeTrial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default shortQuestionsSlice.reducer;
