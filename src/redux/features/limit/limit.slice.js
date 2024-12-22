import  { createSlice } from '@reduxjs/toolkit';


const questionLimit = createSlice({
    name: 'questionLimit',
    initialState: {
        limit: 0,
        },
reducers:{
    setQuestionLimit:(state,action)=>{
        state.limit=action.payload
    }
}
})

export const { setQuestionLimit } = questionLimit.actions;
export default questionLimit.reducer;