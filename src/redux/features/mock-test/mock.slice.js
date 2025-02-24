import { createSlice } from "@reduxjs/toolkit";
import { fetchMockMcqsByPresentationId, fetchMockTest, fetchMockTestById, fetchModulesById, fetchPresentationMock, fetchTotalMockQuestion } from "./mock.service";

const modulesSlice = createSlice({
    name: 'mockModules',
    initialState: {
        mockTestData: [],
        mockTestIds: [], // Stores IDs fetched from mockTable
        mockMcqsByModulesData: [], // Store data fetched by fetchMcqsByModules
        presentationData: [],
        modules: [], // Stores modules fetched from modulesNew
        presentationMcqs: [],
        paperId:[],
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

            .addCase(fetchTotalMockQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTotalMockQuestion.fulfilled, (state, action) => {
                state.loading = false;

                state.mockMcqsByModulesData = action.payload;
            })
            .addCase(fetchTotalMockQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

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
            })
            .addCase(fetchPresentationMock.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPresentationMock.fulfilled, (state, action) => {
                state.loading = false;
                state.presentationData = action.payload; // Store fetched presentation data
            })
            .addCase(fetchPresentationMock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store the error message
            })
            .addCase(fetchMockMcqsByPresentationId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMockMcqsByPresentationId.fulfilled, (state, action) => {
                state.loading = false;
                state.presentationMcqs = action.payload;
            })
            .addCase(fetchMockMcqsByPresentationId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

// Export the slice reducer
export default modulesSlice.reducer;