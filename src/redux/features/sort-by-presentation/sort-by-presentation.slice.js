import { createSlice } from "@reduxjs/toolkit";
import { fetchPresentation, fetchMcqsByPresentationId } from "./sort-by-presentation.service";

const initialState = {
    presentations: [],
    mcqs: [], // Store fetched MCQs
    loading: false,
    mcqsLoading: false, // Separate loading state for MCQs
    error: null,
    mcqsError: null, // Separate error state for MCQs
};

const presentationSlice = createSlice({
    name: "presentations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Presentations
            .addCase(fetchPresentation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPresentation.fulfilled, (state, action) => {
                state.loading = false;
                state.presentations = action.payload;
            })
            .addCase(fetchPresentation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch MCQs by Presentation ID
            .addCase(fetchMcqsByPresentationId.pending, (state) => {
                state.mcqsLoading = true;
                state.mcqsError = null;
            })
            .addCase(fetchMcqsByPresentationId.fulfilled, (state, action) => {
                state.mcqsLoading = false;
                state.mcqs = action.payload;
            })
            .addCase(fetchMcqsByPresentationId.rejected, (state, action) => {
                state.mcqsLoading = false;
                state.mcqsError = action.payload;
            });
    },
});

export default presentationSlice.reducer;
