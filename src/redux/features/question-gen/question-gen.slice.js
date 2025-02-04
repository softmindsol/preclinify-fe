import { createSlice } from "@reduxjs/toolkit";
import { fetchQuesGenModules, insertQuesGenData, fetchQuesGenModuleById } from "./question-gen.service";

const initialState = {
    data: [],
    modules: [],       // For storing module list
    moduleMCQs: [],    // For storing fetched MCQs by module
    loading: false,
    error: null,
};

const quesGenInsertSlice = createSlice({
    name: "quesGen",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Existing cases for fetchQuesGenModules
            .addCase(fetchQuesGenModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuesGenModules.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = action.payload;
            })
            .addCase(fetchQuesGenModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // New cases for fetchQuesGenModuleById
            .addCase(fetchQuesGenModuleById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.moduleMCQs = []; // Clear previous MCQs
            })
            .addCase(fetchQuesGenModuleById.fulfilled, (state, action) => {
                state.loading = false;
                state.moduleMCQs = action.payload; // Store fetched MCQs
            })
            .addCase(fetchQuesGenModuleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Existing cases for insertQuesGenData
            .addCase(insertQuesGenData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(insertQuesGenData.fulfilled, (state, action) => {
                state.loading = false;
                state.data.push(action.payload);
            })
            .addCase(insertQuesGenData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default quesGenInsertSlice.reducer;