import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInformation, insertUserInformation } from "./personal-info.service";

const personalInfoSlice = createSlice({
    name: 'personalInfo',
    initialState: {
        userInfo: [],
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            // Insert User Information
            .addCase(insertUserInformation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(insertUserInformation.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo.push(action.payload);
            })
            .addCase(insertUserInformation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch User Information
            .addCase(fetchUserInformation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserInformation.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(fetchUserInformation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default personalInfoSlice.reducer;