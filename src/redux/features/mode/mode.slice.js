import { createSlice } from "@reduxjs/toolkit";

const modeSlice=createSlice({
    name: 'mode',

    initialState:{
        mode:"Endless",
        questionMode:"SBA",
        time:0
    },

    reducers:{
        changeMode:(state,action)=>{
            state.mode=action.payload.mode
            state.time = action.payload.timer
        },
          setPreclinicalType(state, action) {
              state.questionMode = action.payload
        },
        resetPreclinicalType(state, action) {
            state.questionMode = 'SBA'
        },
    }
})
export const { changeMode, setPreclinicalType, resetPreclinicalType }=modeSlice.actions;
export default modeSlice.reducer;