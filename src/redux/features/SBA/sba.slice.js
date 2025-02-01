import { createSlice } from "@reduxjs/toolkit";
import { fetchMcqsQuestion, fetchMcqsByModules } from "./sba.service";

const mcqsSlice = createSlice({
    name: 'mcqsQuestion',
    initialState: {
        data: [],   // To store fetched MCQs data
        loading: false,  // To track loading state
        error: null,    // To store error message, if any
    },
    reducers: {
        // Reducer to reset the state
        resetState: (state) => {
            state.data = [];

            state.loading = false;
            state.error = null;
        },
 
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchMcqsQuestion lifecycle
            .addCase(fetchMcqsQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMcqsQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Save fetched data
            })
            .addCase(fetchMcqsQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Save error message
            })
            // Handle fetchMcqsByModule lifecycle
            .addCase(fetchMcqsByModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMcqsByModules.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Save fetched data
            })
            .addCase(fetchMcqsByModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Save error message
            });
    },
});

// Export synchronous actions
export const { resetState } = mcqsSlice.actions;

// Export the reducer to be used in the store
export default mcqsSlice.reducer;
