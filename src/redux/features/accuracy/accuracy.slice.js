import { createSlice } from "@reduxjs/toolkit";

const accuracySlice = createSlice({
    name: 'accuracy',
    initialState: {
        accuracy: 0
    },

    reducers: {
        setMcqsAccuracy(state, action) {            
            state.accuracy = action.payload.accuracy;
        },
        clearMcqsAccuracy(state) {
            state.accuracy = 0;
            state.result = [];
        }
    }
});

export const { setMcqsAccuracy, clearMcqsAccuracy } = accuracySlice.actions;
export default accuracySlice.reducer;
