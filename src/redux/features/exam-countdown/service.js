import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../../config/helper';

export const upsertUserRecord = createAsyncThunk(
  'examDates/upsert',
  async ({ userId, newData }, { rejectWithValue }) => {
    try {
      // Check if the record already exists
      const { data: existingRecord, error: fetchError } = await supabase
        .from('examDates')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // If the record exists, delete it
      if (existingRecord) {
        const { error: deleteError } = await supabase
          .from('examDates')
          .delete()
          .eq('user_id', existingRecord.user_id);

        if (deleteError) {
          throw deleteError;
        }
      }

      // Insert the new record
      const { data, error: insertError } = await supabase
        .from('examDates')
        .insert([{ user_id: userId, exam_date: newData }])
        .single();

      if (insertError) {
        throw insertError;
      }

      return { ...data, userId, newData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchExamDate = createAsyncThunk(
  'examDates/fetch',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('examDates')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      if (!data) {
        return { userId, exam_date: null };
      }
      console.log('data:', data);

      return { userId, examDate: data.exam_date };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
