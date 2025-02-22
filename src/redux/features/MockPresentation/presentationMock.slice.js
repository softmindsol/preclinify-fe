import { createSlice } from '@reduxjs/toolkit';

const presentationSlice = createSlice({
    name: 'Mockpresentation',
    initialState: {
        isMockPresentation: false,
        loading: false,
        error: null,
    },
    reducers: {
        setMockPresentationValue: (state, action) => {
            state.isMockPresentation = action.payload;
        },
        resetMockPresentationValue:(state, action)=>{
            state.isMockPresentation = false;
          
        }
    },
});

// Export reducer
export default presentationSlice.reducer;

// Export actions
export const { setMockPresentationValue, resetMockPresentationValue } = presentationSlice.actions;
