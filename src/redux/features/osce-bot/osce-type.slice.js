// virtualPatientSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    type: null
};

const osceTypeSlice = createSlice({
    name: 'osceType',
    initialState,
    reducers: {
        setOSCEBotType: (state) => {
            state.type = true;
        }
    }
});

export const { setOSCEBotType } = osceTypeSlice.actions;
export default osceTypeSlice.reducer;