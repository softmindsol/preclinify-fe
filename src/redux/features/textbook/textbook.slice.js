import { createSlice } from "@reduxjs/toolkit";
import { fetchModuleCategories } from "./textbook.service";

const textbookSlice = createSlice({
    name: 'textbook',
    initialState: {
        textbookModules: [],
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
            });
    },
});

export default textbookSlice.reducer;
