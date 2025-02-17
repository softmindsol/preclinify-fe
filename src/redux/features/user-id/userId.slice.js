import { createSlice } from '@reduxjs/toolkit';
import { fetchUserId } from './userId.service';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    userInfo: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearUserId: state => {
      state.userId = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserId.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload?.id;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearUserId } = userSlice.actions;
export default userSlice.reducer;
