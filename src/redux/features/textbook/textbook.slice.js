import { createSlice } from "@reduxjs/toolkit";
import { fetchModuleCategories, getNotesByModuleId, insertOrUpdateNotes } from "./textbook.service";

const textbookSlice = createSlice({
    name: 'textbook',
    initialState: {
        textbookModules: [],
        notes: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchModuleCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModuleCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.textbookModules = action.payload;
            })
            .addCase(fetchModuleCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
              // 🔹 Handle insertNotes
            .addCase(insertOrUpdateNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(insertOrUpdateNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.notes=action.payload; // Append new note
            })
            .addCase(insertOrUpdateNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔹 Handle getNotesByModuleId
            .addCase(getNotesByModuleId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotesByModuleId.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload; // Replace notes with fetched ones
            })
            .addCase(getNotesByModuleId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default textbookSlice.reducer;
