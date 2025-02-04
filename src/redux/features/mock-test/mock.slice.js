import { createSlice } from "@reduxjs/toolkit";
import { fetchMockTest, fetchMockTestById, fetchModulesById } from "./mock.service";

const modulesSlice = createSlice({
    name: 'mockModules',
    initialState: {
        mockTestData:[],
        mockTestIds: [], // Stores IDs fetched from mockTable
        modules: [], // Stores modules fetched from modulesNew
        loading: false,
        error: null,
    },
    reducers: {
        // Add any additional reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            // fetchMockTest
            .addCase(fetchMockTest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMockTest.fulfilled, (state, action) => {
                state.loading = false;
                state.mockTestIds = action.payload; // Store the fetched IDs
            })
            .addCase(fetchMockTest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store the error message
            })

            // fetchModules
            .addCase(fetchModulesById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModulesById.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = action.payload; // Store the fetched modules
            })
            .addCase(fetchModulesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store the error message
            })

            // fetchMockTestById
            .addCase(fetchMockTestById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMockTestById.fulfilled, (state, action) => {
                state.loading = false;
                state.mockTestData = action.payload; // Store the fetched mock test data
            })
            .addCase(fetchMockTestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store the error message
            });
    },
});

// Export the slice reducer
export default modulesSlice.reducer;