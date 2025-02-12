import { createSlice } from '@reduxjs/toolkit';
import { fetchExamDate, insertExamDate } from './service';

const initialState = {
  examDates: [],
  loading: false,
  error: null,
};

const examDateSlice = createSlice({
  name: 'examDates',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchExamDate.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamDate.fulfilled, (state, action) => {
        state.loading = false;
        state.examDates = action.payload;
      })
      .addCase(fetchExamDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(insertExamDate.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertExamDate.fulfilled, (state, action) => {
        state.loading = false;
        state.examDates.push(action.payload);
      })
      .addCase(insertExamDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default examDateSlice.reducer;
