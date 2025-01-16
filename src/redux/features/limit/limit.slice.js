import  { createSlice } from '@reduxjs/toolkit';


const questionLimit = createSlice({
    name: 'limit',
    initialState: {
        limit: 0,
        },
reducers:{
    setLimit:(state,action)=>{
        state.limit=action.payload
    },
    setResetLimit(state, action){
        state.limit=0
    }
}
})

export const { setLimit, setResetLimit } = questionLimit.actions;
export default questionLimit.reducer;