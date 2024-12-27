import { createSlice } from "@reduxjs/toolkit";

const resultSlice = createSlice({
    name: 'result',
    initialState: {
        result: [],
        accuracy: 0
    },

    reducers: {
        setResult(state, action) {
            console.log(action.payload.accuracy);
            
            state.accuracy = action.payload.accuracy;
            state.result = action.payload.updatedAttempts;
        },
        clearResult(state) {
            state.accuracy = 0;
            state.result = [];
        }
    }
});

export const { setResult, clearResult } = resultSlice.actions;
export default resultSlice.reducer;
