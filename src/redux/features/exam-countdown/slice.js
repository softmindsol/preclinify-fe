import { createSlice } from '@reduxjs/toolkit';
import { upsertUserRecord } from './service';

const initialState = {
  examDates: [],
  loading: false,
  error: null,
};

const examDatesSlice = createSlice({
  name: 'examDates',
  initialState: {
    record: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(upsertUserRecord.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(upsertUserRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.record = action.payload;
      })
      .addCase(upsertUserRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});
export default examDatesSlice.reducer;
