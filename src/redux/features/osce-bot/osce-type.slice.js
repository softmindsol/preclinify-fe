// virtualPatientSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    type: 'text'
};

const osceTypeSlice = createSlice({
    name: 'osceType',
    initialState,
    reducers: {
        setOSCEBotType: (state,action) => {            
            state.type = action.payload.type;
        }
    }
});

export const { setOSCEBotType } = osceTypeSlice.actions;
export default osceTypeSlice.reducer;