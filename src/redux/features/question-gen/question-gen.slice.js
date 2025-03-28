import { createSlice } from "@reduxjs/toolkit";
import { fetchQuesGenModules, insertQuesGenData, fetchQuesGenModuleById } from "./question-gen.service";

const initialState = {
    data: [],
    modules: [],       // For storing module list
    moduleMCQs: [],    // For storing fetched MCQs by module
    QuesQuesLoading: false,
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
                state.QuesLoading = true;
                state.error = null;
            })
            .addCase(fetchQuesGenModules.fulfilled, (state, action) => {
                state.QuesLoading = false;
                state.modules = action.payload;
            })
            .addCase(fetchQuesGenModules.rejected, (state, action) => {
                state.QuesLoading = false;
                state.error = action.payload;
            })

            // New cases for fetchQuesGenModuleById
            .addCase(fetchQuesGenModuleById.pending, (state) => {
                state.QuesLoading = true;
                state.error = null;
                state.moduleMCQs = []; // Clear previous MCQs
            })
            .addCase(fetchQuesGenModuleById.fulfilled, (state, action) => {
                state.QuesLoading = false;
                state.moduleMCQs = action.payload; // Store fetched MCQs
            })
            .addCase(fetchQuesGenModuleById.rejected, (state, action) => {
                state.QuesLoading = false;
                state.error = action.payload;
            })

            // Existing cases for insertQuesGenData
            .addCase(insertQuesGenData.pending, (state) => {
                state.QuesLoading = true;
                state.error = null;
            })
            .addCase(insertQuesGenData.fulfilled, (state, action) => {
                state.QuesLoading = false;
                state.data.push(action.payload);
            })
            .addCase(insertQuesGenData.rejected, (state, action) => {
                state.QuesLoading = false;
                state.error = action.payload;
            });
    },
});

export default quesGenInsertSlice.reducer;