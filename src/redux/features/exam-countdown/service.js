import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../../config/helper';
import { toast } from 'sonner';
import { values } from 'pdf-lib';
// Define an async thunk to fetch modules
export const fetchExamDate = createAsyncThunk(
  'modules/fetchExamDate',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('examDates')
        .select('*')
        .eq('user_id', userId); // Fetch only the 'module' column
      if (error) {
        return rejectWithValue(error.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Define an async thunk to insert exam dates
export const insertExamDate = createAsyncThunk(
  'modules/insertExamDate',
  async ({ exam_date, user_id }, { rejectWithValue }) => {
    try {
      const response = await supabase.from('examDates').insert([{ exam_date, user_id }]);
      if (response.status === 201) {
        toast.success('Exam date is scheduled successfully');
      }
      if (response?.error) {
        return rejectWithValue(response?.error.message);
      }
      return response?.data; // Return the inserted data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
