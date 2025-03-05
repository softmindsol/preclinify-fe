import { createSlice } from "@reduxjs/toolkit";
import { fetchMcqsQuestionFreeBank } from "./free-trial-bank.service";

const freeTrialMcqsSlice = createSlice({
    name: 'FreeTrialMcqsQuestion',
    initialState: {
        freeTrialType: '',
        freeTrialData: [],   // To store all MCQs data
        mcqsFreeTrial: [], // Store data fetched by fetchMcqsByModules
        loading: false,  // To track loading state
        error: null,    // To store error message, if any
        totalSBAFreeTrialData: [], // To store total SBA questions data
    },
    reducers: {
        setFreeTrialType: (state, action) => {
            state.freeTrialType = action.payload
        },
        // Reducer to reset the state
        resetState: (state) => {
            state.freeTrialData = [];
            state.mcqsFreeTrial = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchMcqsQuestion lifecycle
            .addCase(fetchMcqsQuestionFreeBank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMcqsQuestionFreeBank.fulfilled, (state, action) => {
                state.loading = false;
                state.freeTrialData = action.payload; // Save fetched data
            })
            .addCase(fetchMcqsQuestionFreeBank.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Save error message
            })
        // .addCase(fetchTotalSBAQuestion.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(fetchTotalSBAQuestion.fulfilled, (state, action) => {
        //     state.loading = false;

        //     state.totalSBAFreeTrialData = action.payload;
        // })
        // .addCase(fetchTotalSBAQuestion.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // })

        // // Handle fetchMcqsByModules lifecycle
        // .addCase(fetchMcqsByModules.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(fetchMcqsByModules.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.mcqsFreeTrial = action.payload; // Save fetched data
        // })
        // .addCase(fetchMcqsByModules.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload; // Save error message
        // });
    },
});

// Export synchronous actions
export const { resetState, setFreeTrialType } = freeTrialMcqsSlice.actions;

// Export the reducer to be used in the store
export default freeTrialMcqsSlice.reducer;
