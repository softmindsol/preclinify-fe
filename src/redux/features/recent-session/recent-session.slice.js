import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    recentSessions: [],
    isSessionCompleted:false
};

// Create the slice
const recentSessionsSlice = createSlice({
    name: 'recentSessions',
    initialState,
    reducers: {
        // Action to update the recent sessions
        updateRecentSessions(state, action) {
            const selectedModules = action.payload; // Array of selected module names
            if (selectedModules.length > 0) {
                const combinedSession = selectedModules.join(', '); // Combine module names with commas
                state.recentSessions = [combinedSession]; // Update with the combined string
            } else {
                state.recentSessions = []; // If no modules selected, keep it as an empty array
            }
        },
        sessionCompleted(state,action){
            state.isSessionCompleted=true

        },
        // Optional: Clear recent sessions
        clearRecentSessions(state) {
            state.recentSessions = [];
        },
    },
});

// Export actions
export const { updateRecentSessions, clearRecentSessions, sessionCompleted } = recentSessionsSlice.actions;

// Export the reducer
export default recentSessionsSlice.reducer;
