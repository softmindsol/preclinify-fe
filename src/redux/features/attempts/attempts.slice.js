// attemptsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    attempts: [], // Array to store the status of each question
    active:true // Active status,
};

const attemptsSlice = createSlice({
    name: 'attempts',
    initialState,
    reducers: {
        setAttempted: (state, action) => {
            state.attempts = action.payload; // Update the attempts array
        },
        resetAttempts: (state,action) => {
            state.attempts =action.payload; // Reset the attempts array
        },
        setActive:(state,action) => {
            state.active = action.payload; // Set the active status
        }
    },
});

export const { setAttempted, resetAttempts, setActive } = attemptsSlice.actions;
export default attemptsSlice.reducer;