// src/redux/features/userAnswers/userAnswersSlice.js

import { createSlice } from '@reduxjs/toolkit';

const userAnswersSlice = createSlice({
    name: 'userAnswers',
    initialState: {
        answers: [], // Array to store answers for each question
    },
    reducers: {
        initializeAnswers: (state, action) => {
            state.answers = Array(action.payload).fill(""); // Initialize answers array with empty strings
        },
        setUserAnswers: (state, action) => {
            const { index, answer } = action.payload;
            state.answers[index] = answer; // Update the answer at the specified index
        },
        clearUserAnswers: (state) => {
            state.answers = []; // Clear all answers
        },
    },
});

// Export actions
export const { initializeAnswers, setUserAnswers, clearUserAnswers } = userAnswersSlice.actions;

// Export reducer
export default userAnswersSlice.reducer;