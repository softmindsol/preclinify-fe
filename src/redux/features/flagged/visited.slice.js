import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    visitedQuestions: [],
};

const visitedSlice = createSlice({
    name: 'visited',
    initialState,
    reducers: {
        markVisited: (state, action) => {
            
            
            const { currentIndex, value } = action.payload;       

            // Ensure immutability
            state.visitedQuestions = state.visitedQuestions.map((val, idx) =>
                idx === currentIndex ? value : val
            );
        },
        initializeVisited: (state, action) => {
            state.visitedQuestions = new Array(action.payload).fill(false);
        },
        resetVisited:(state, action) => {
            state.visitedQuestions = [];
        }
    },
});

export const { markVisited, initializeVisited, resetVisited } = visitedSlice.actions;
export default visitedSlice.reducer;