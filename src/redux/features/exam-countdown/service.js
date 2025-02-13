import { createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../../config/helper';

export const upsertUserRecord = createAsyncThunk(
  'examDates/upsert',
  async ({ userId, newData }, { rejectWithValue }) => {
    try {
      const { data: existingRecord, error: fetchError } = await supabase
        .from('examDates')
        .select('user_id')
        .eq('user_id', userId)
        .single();
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      if (existingRecord) {
        const { error: deleteError } = await supabase
          .from('examDates')
          .delete()
          .eq('user_id', existingRecord.user_id);
        if (deleteError) {
          throw deleteError;
        }
      }
      const { data: newRecord, error: insertError } = await supabase
        .from('examDates')
        .insert([{ user_id: userId, data: newData }])
        .single();
      if (insertError) {
        throw insertError;
      }
      return newRecord;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
