import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../../config/helper';
import dayjs from 'dayjs';

export const insertExamDate = createAsyncThunk(
  'examDates/upsert',
  async ({ userId, exam_date }, { rejectWithValue }) => {
    try {
      console.log("Checking for existing userId:", userId);

      // Insert or update (ensure unique user_id)
      const { data: newRecord, error: upsertError } = await supabase
        .from('examDates')
        .upsert([{ user_id: userId, exam_date }], { onConflict: ['user_id'] })
        .select()
        .single();

      if (upsertError) {
        return rejectWithValue(upsertError.message);
      }

      return newRecord;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchDaysUntilExam = createAsyncThunk(
  'examDates/daysUntilExam',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('examDates')
        .select('exam_date')
        .eq('user_id', userId)
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      if (!data || !data.exam_date) {
        return rejectWithValue('No exam date found');
      }

      const examDate = dayjs(data.exam_date);
      const currentDate = dayjs();
      const daysLeft = examDate.diff(currentDate, 'day'); // Get difference in days

      return daysLeft;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);