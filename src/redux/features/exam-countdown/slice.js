import { createSlice } from '@reduxjs/toolkit';
import { fetchExamDate } from './service';

const examDatesSlice = createSlice({
  name: 'examDates',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchExamDate.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamDate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExamDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default examDatesSlice.reducer;
