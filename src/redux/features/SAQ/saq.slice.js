import { createSlice } from '@reduxjs/toolkit';
import { fetchShortQuestionByModules, fetchSqaChild } from './saq.service'; // Import your async actions

const initialState = {
    shortQuestions: [],  // Store the short questions data
    sqaChildData: [],    // Store the child data
    loading: false,      // Loading state
    error: null,         // Error state
};

const modulesSlice = createSlice({
    name: 'sqa',
    initialState,
    reducers: {
        // You can add additional reducers here if necessary
        resetModulesState: (state) => {
            state.shortQuestions = [];
            state.sqaChildData = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Handle the loading, success, and error for fetchShortQuestionByModules
        builder
            .addCase(fetchShortQuestionByModules.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShortQuestionByModules.fulfilled, (state, action) => {
                state.loading = false;
                state.shortQuestions = action.payload;  // Store the data from the response
                state.error = null;  // Clear the error if the request was successful
            })
            .addCase(fetchShortQuestionByModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch questions';  // Set the error message
            });

        // Handle the loading, success, and error for fetchSqaChild
        builder
            .addCase(fetchSqaChild.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSqaChild.fulfilled, (state, action) => {
                state.loading = false;
                state.sqaChildData = action.payload;  // Store the data from the response
                state.error = null;  // Clear the error if the request was successful
            })
            .addCase(fetchSqaChild.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch child data';  // Set the error message
            });
    },
});

export const { resetModulesState } = modulesSlice.actions;

export default modulesSlice.reducer;
