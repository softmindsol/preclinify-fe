import { createSlice } from "@reduxjs/toolkit";
import { fetchPresentation } from "./sort-by-presentation.service";

const initialState = {
    presentations: [],
    loading: false,
    error: null,
};

const presentationSlice = createSlice({
    name: "presentations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            });
    },
});

export default presentationSlice.reducer;