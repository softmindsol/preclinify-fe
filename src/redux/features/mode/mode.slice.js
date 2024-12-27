import { createSlice } from "@reduxjs/toolkit";

const modeSlice=createSlice({
    name: 'mode',

    initialState:{
        mode:"Endless",
        time:0
    },

    reducers:{
        changeMode:(state,action)=>{
            state.mode=action.payload.mode
            state.time = action.payload.timer
        }
    }
})
export const {changeMode}=modeSlice.actions;
export default modeSlice.reducer;