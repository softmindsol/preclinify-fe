import { createSlice } from "@reduxjs/toolkit";
import { fetchUserId } from "./userId.service";

// Slice for managing user state
const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: null,
        loading: false,
        error: null,
    },
    reducers: {}, // You can add other reducers here if needed
    extraReducers: (builder) => {
        builder
            // Handle pending state
            .addCase(fetchUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handle fulfilled state
            .addCase(fetchUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.userId = action.payload; // Set the userId
            })
            // Handle rejected state
            .addCase(fetchUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Set the error message
            });
    },
});

export default userSlice.reducer;