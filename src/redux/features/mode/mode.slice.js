import { createSlice } from "@reduxjs/toolkit";

const modeSlice=createSlice({
    name: 'mode',

    initialState:{
        mode:"Endless"
    },

    reducers:{
        changeMode:(state,action)=>{
            state.mode=action.payload
        }
    }
})
export const {changeMode}=modeSlice.actions;
export default modeSlice.reducer;