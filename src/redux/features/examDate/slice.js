import { createSlice } from '@reduxjs/toolkit';
import { fetchDaysUntilExam, insertExamDate } from './service';

const initialState = {
  examDates: [],
  loading: false,
  error: null,
};

const examDatesSlice = createSlice({
  name: 'examDates',
  initialState: {
    record: null,
    examDate: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(insertExamDate.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(insertExamDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.record = action.payload;
      })
      .addCase(insertExamDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchDaysUntilExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDaysUntilExam.fulfilled, (state, action) => {
        state.loading = false;
        state.examDate = action.payload;
      })
      .addCase(fetchDaysUntilExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default examDatesSlice.reducer;
