import { createSlice } from "@reduxjs/toolkit";

const resultSlice = createSlice({
    name: 'result',
    initialState: {
        result: [],
    },

    reducers: {
        setResult(state, action) {
                        state.result = action.payload.updatedAttempts;
        },
        clearResult(state) {
            state.result = [];
        }
    }
});

export const { setResult, clearResult } = resultSlice.actions;
export default resultSlice.reducer;
