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
        }
    },
});

// Export reducer
export default presentationSlice.reducer;

// Export actions
export const { setSBAPresentationValue } = presentationSlice.actions;
