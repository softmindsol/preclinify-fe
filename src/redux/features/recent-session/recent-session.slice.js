import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    recentSessions: [],
    isSessionCompleted:false
};

// Create the slice
const recentSessionsSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        // Action to update the recent sessions
        updateRecentSessions(state, action) {
            const selectedModules = action.payload; // Array of selected module names
        
                const combinedSession = selectedModules.join(', '); // Combine module names with commas
                state.recentSessions = [combinedSession]; // Update with the combined string
            
        },
        sessionCompleted(state,action){
            state.isSessionCompleted = action.payload

        },
       
    },
});

// Export actions
export const { updateRecentSessions, sessionCompleted } = recentSessionsSlice.actions;

// Export the reducer
export default recentSessionsSlice.reducer;
