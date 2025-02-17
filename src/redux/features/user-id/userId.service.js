import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../../../config/helper';

export const fetchUserId = createAsyncThunk('user/fetchUserId', async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return user;
  }
  return null;
});
