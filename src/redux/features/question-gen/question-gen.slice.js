import { createSlice } from "@reduxjs/toolkit";
import { insertQuesGenData } from "./question-gen.service";

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const quesGenInsertSlice = createSlice({
    name: "quesGenInsert",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
