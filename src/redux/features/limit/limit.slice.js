import  { createSlice } from '@reduxjs/toolkit';


const questionLimit = createSlice({
    name: 'questionLimit',
    initialState: {
        limit: 0,
        },
reducers:{
    setQuestionLimit:(state,action)=>{
        state.limit=action.payload
    },
    setRemoveQuestionLimit(state, action){
        state.limit=0
    }
}
})

export const { setQuestionLimit, setRemoveQuestionLimit } = questionLimit.actions;
export default questionLimit.reducer;