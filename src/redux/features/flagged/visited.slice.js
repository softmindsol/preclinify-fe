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
            console.log(currentIndex, value);
       

            // Ensure immutability
            state.visitedQuestions = state.visitedQuestions.map((val, idx) =>
                idx === currentIndex ? value : val
            );
        },
        initializeVisited: (state, action) => {
            state.visitedQuestions = new Array(action.payload).fill(false);
        },
    },
});

export const { markVisited, initializeVisited } = visitedSlice.actions;
export default visitedSlice.reducer;