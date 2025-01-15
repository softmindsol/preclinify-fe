import { createSlice } from "@reduxjs/toolkit";
import { fetchModules } from "./module.service";

// Create the slice
const modulesSlice = createSlice({
    name: 'module',
    initialState: {
        categoryId: null,  // Add categoryId to store the selected category ID
        
        data: [],   // To store the modules data
        loading: false,  // To track loading state
        error: null,    // To store error message, if any
    }, 
    reducers: {
        // Reducer to set the categoryId
        setCategoryId: (state, action) => {
            state.categoryId = action.payload;  // Update the categoryId in the state
        },
    },
    extraReducers: (builder) => {
        builder
            // When the fetchModules thunk is pending (started)
            .addCase(fetchModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // When the fetchModules thunk is fulfilled (success)
            .addCase(fetchModules.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;  // Save the fetched data in state
            })
            // When the fetchModules thunk is rejected (failure)
            .addCase(fetchModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;  // Save the error message in state
            });
    },
});

// Export the action to be used in your components
export const { setCategoryId } = modulesSlice.actions;

// Export the reducer to be used in the store
export default modulesSlice.reducer;
