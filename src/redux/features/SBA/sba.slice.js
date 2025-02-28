import { createSlice } from "@reduxjs/toolkit";
import { fetchMcqsQuestion, fetchMcqsByModules, fetchTotalSBAQuestion } from "./sba.service";

const mcqsSlice = createSlice({
    name: 'mcqsQuestion',
    initialState: {
        data: [],   // To store all MCQs data
        mcqsByModulesData: [], // Store data fetched by fetchMcqsByModules
        loading: false,  // To track loading state
        error: null,    // To store error message, if any
        totalSBAQuestionData: [], // To store total SBA questions data
    }, 
    reducers: {
        // Reducer to reset the state
        resetState: (state) => {
            state.data = [];
            state.mcqsByModulesData = [];
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
            .addCase(fetchTotalSBAQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTotalSBAQuestion.fulfilled, (state, action) => {
                state.loading = false;
                
                state.totalSBAQuestionData = action.payload;
            })
            .addCase(fetchTotalSBAQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle fetchMcqsByModules lifecycle
            .addCase(fetchMcqsByModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMcqsByModules.fulfilled, (state, action) => {
                state.loading = false;
                state.mcqsByModulesData = action.payload; // Save fetched data
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
