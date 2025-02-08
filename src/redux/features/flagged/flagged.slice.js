import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    flaggedQuestions: [],
};

const flaggedSlice = createSlice({
    name: 'flagged',
    initialState,
    reducers: {
        toggleFlag: (state, action) => {
            const index = action.payload;
            state.flaggedQuestions[index] = !state.flaggedQuestions[index];
        },
        initializeFlags: (state, action) => {
            state.flaggedQuestions = new Array(action.payload).fill(false);
        },
       
    },
});

export const { toggleFlag, initializeFlags } = flaggedSlice.actions;
export default flaggedSlice.reducer;