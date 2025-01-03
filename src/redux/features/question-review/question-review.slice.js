import { createSlice } from "@reduxjs/toolkit";

const questionReviewSlice=createSlice({
    name:"questionReview",
    initialState:{
        value:false
    },
    reducers:{
        setQuestionReview:(state,action)=>{
            state.value =action.payload
        },
        resetQuestionReviewValue: (state, action)=>{
state.value=false
        }
    }


})
export const { setQuestionReview, resetQuestionReviewValue }=questionReviewSlice.actions
export default questionReviewSlice.reducer;