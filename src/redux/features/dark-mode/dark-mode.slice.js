import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isDarkMode: false, // Default mode is light
};

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode; // Toggles the dark mode
        },
        setDarkMode: (state, action) => {
            state.isDarkMode = action.payload; // Allows explicitly setting dark mode
        },
    },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
