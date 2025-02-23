import { createSlice } from "@reduxjs/toolkit";
import { fetchOSCEData, fetchOSCEDataById, fetchOSCEPromptById } from "./osce-static.service";

const osceSlice = createSlice({
    name: 'osce',
    initialState: {
        data: [],
        selectedData: null, // For storing data fetched by ID
        AIPrompt:{}, //
        loading: false,
        error: null, 
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOSCEData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOSCEData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchOSCEData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handling fetchOSCEDataById (specific data by ID)
            .addCase(fetchOSCEDataById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOSCEDataById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedData = action.payload;
            })
            .addCase(fetchOSCEDataById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handling fetchOSCEDataById (specific data by ID)
            .addCase(fetchOSCEPromptById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOSCEPromptById.fulfilled, (state, action) => {
                state.loading = false;
                state.AIPrompt = action.payload?.OSCE_prompt || ""; // Store only the prompt text
            })


            .addCase(fetchOSCEPromptById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    
    },
    
});

export const osceReducer = osceSlice.reducer;