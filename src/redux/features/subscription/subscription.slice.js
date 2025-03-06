import { createSlice } from "@reduxjs/toolkit";
import { fetchSubscriptions } from "./subscription.service";

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState: {
    subscriptions: [],
    plan: null,
    planType: null,
    completePlanData: [],
    loading: false,
    error: null,
    type: "osce",
  },
  reducers: {
    resetPlan:(state,action)=>{
      state.subscriptions = [];
      state.plan = null;
      state.planType = null;
      state.completePlanData = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action?.payload?.subscriptions; // Store subscription data
        state.plan = action?.payload?.plan?.planId; // Store plan details
        state.planType = action?.payload?.plan?.type; // Store plan details
        state.completePlanData = action?.payload?.plan
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetPlan } = subscriptionSlice.actions;


export default subscriptionSlice.reducer;
