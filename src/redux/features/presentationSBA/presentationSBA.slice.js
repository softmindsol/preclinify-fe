import { createSlice } from '@reduxjs/toolkit';

const presentationSlice = createSlice({
    name: 'SBApresentation',
    initialState: {
        isSBAPresentation: false,
        loading: false,
        error: null,
    },
    reducers: {
        setSBAPresentationValue: (state, action) => {
            state.isSBAPresentation = action.payload;
        },
        resetSBAPresentationValue: (state, action) => {
            state.isSBAPresentation = false;
        },
    },
});

// Export reducer
export default presentationSlice.reducer;

// Export actions
export const { setSBAPresentationValue, resetSBAPresentationValue } = presentationSlice.actions;
