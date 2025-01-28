import { createSlice } from "@reduxjs/toolkit";
import { fetchQuesGenData } from "./module-type.service";

const initialState = {
    moduleType: '',
    data: [],
    loading: false,
    error: null,
};

const quesGenSlice = createSlice({
    name: "quesGen",
    initialState,
    reducers: {
   
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuesGenData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuesGenData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchQuesGenData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default quesGenSlice.reducer;