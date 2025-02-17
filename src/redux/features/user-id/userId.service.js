import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import supabase from '../../../config/helper';

// Async Thunk to fetch the current user's ID
export const fetchUserId = createAsyncThunk(
  'user/fetchUserId',
  async () => {
    const { data: { user } } = await supabase.auth.getUser();

    console.log("user:", user);
    
    if (user) {
      return user.id; // Return the user ID
    }
    return null; // Return null if no user is logged in
  }
);
