import { createSlice } from "@reduxjs/toolkit";
import { fetchQuesGenModules, insertQuesGenData } from "./question-gen.service";

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const quesGenInsertSlice = createSlice({
    name: "quesGen",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuesGenModules.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error on new fetch
            })
            .addCase(fetchQuesGenModules.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = action.payload; // Set the fetched modules
            })
            .addCase(fetchQuesGenModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set the error message
            })
            .addCase(insertQuesGenData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(insertQuesGenData.fulfilled, (state, action) => {
                state.loading = false;
                state.data.push(action.payload); // Add the inserted data to the state
            })
            .addCase(insertQuesGenData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default quesGenInsertSlice.reducer;
