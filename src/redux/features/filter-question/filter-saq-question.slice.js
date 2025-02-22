import { createSlice } from "@reduxjs/toolkit";
import { fetchCorrectShortQuestionByModules, fetchIncorrectCorrectShortQuestionByModules, fetchInCorrectShortQuestionByModules, fetchShortQuestionsWithChildren } from "../SAQ/saq.service";

const initialState = {
    shortQuestions: [],
    results: [],
    loading: false,
    error: null,
};

const shortQuestionSlice = createSlice({
    name: "FiltershortQuestions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetchShortQuestionByModules
            .addCase(fetchShortQuestionsWithChildren.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShortQuestionsWithChildren.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchShortQuestionsWithChildren.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle fetchIncorrectCorrectShortQuestionByModules
            .addCase(fetchIncorrectCorrectShortQuestionByModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncorrectCorrectShortQuestionByModules.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchIncorrectCorrectShortQuestionByModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle fetchCorrectShortQuestionByModules
            .addCase(fetchCorrectShortQuestionByModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCorrectShortQuestionByModules.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchCorrectShortQuestionByModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle fetchInCorrectShortQuestionByModules
            .addCase(fetchInCorrectShortQuestionByModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInCorrectShortQuestionByModules.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchInCorrectShortQuestionByModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }, 
});

export default shortQuestionSlice.reducer;
