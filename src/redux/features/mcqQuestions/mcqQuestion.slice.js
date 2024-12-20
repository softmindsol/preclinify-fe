import { createSlice } from "@reduxjs/toolkit";
import { fetchMcqsQuestion } from "./mcqQuestion.service";

// Create the slice
const mcqsSlice = createSlice({
    name: 'mcqsQuestion',
    initialState: {
        data: [],   // To store the modules data
        loading: false,  // To track loading state
        error: null,    // To store error message, if any
    },
    reducers: {
        // Reducer to set the categoryId
      
    },
    extraReducers: (builder) => {
        builder
            // When the fetchModules thunk is pending (started)
            .addCase(fetchMcqsQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // When the fetchModules thunk is fulfilled (success)
            .addCase(fetchMcqsQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;  // Save the fetched data in state
            })
            // When the fetchModules thunk is rejected (failure)
            .addCase(fetchMcqsQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;  // Save the error message in state
            });
    },
});

// Export the action to be used in your components

// Export the reducer to be used in the store
export default mcqsSlice.reducer;
