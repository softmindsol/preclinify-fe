import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    NotAnsweredQuestion: false,
    previouslyIncorrectQuestion: false,
    previouslyCorrectQuestion: false,
};

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        addNotAnsweredQuestion: (state, action) => {
            state.NotAnsweredQuestion.push(action.payload);
        },
        addPreviouslyIncorrectQuestion: (state, action) => {
            state.previouslyIncorrectQuestion.push(action.payload);
        },
        addPreviouslyCorrectQuestion: (state, action) => {
            state.previouslyCorrectQuestion.push(action.payload);
        },
        removeNotAnsweredQuestion: (state, action) => {
            state.NotAnsweredQuestion = state.NotAnsweredQuestion.filter(
                (question) => question.id !== action.payload.id
            );
        },
        removePreviouslyIncorrectQuestion: (state, action) => {
            state.previouslyIncorrectQuestion = state.previouslyIncorrectQuestion.filter(
                (question) => question.id !== action.payload.id
            );
        },
        removePreviouslyCorrectQuestion: (state, action) => {
            state.previouslyCorrectQuestion = state.previouslyCorrectQuestion.filter(
                (question) => question.id !== action.payload.id
            );
        },
    },
});

export const {
    addNotAnsweredQuestion,
    addPreviouslyIncorrectQuestion,
    addPreviouslyCorrectQuestion,
    removeNotAnsweredQuestion,
    removePreviouslyIncorrectQuestion,
    removePreviouslyCorrectQuestion,
} = questionsSlice.actions;

export default questionsSlice.reducer;