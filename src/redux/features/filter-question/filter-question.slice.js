import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  NotAnsweredQuestion: true,
  previouslyIncorrectQuestion: true,
  previouslyCorrectQuestion: true,
};

const questionsSlice = createSlice({
  name: "filterQuestion",
  initialState,
  reducers: {
    toggleNotAnsweredQuestion: (state) => {
      state.NotAnsweredQuestion = !state.NotAnsweredQuestion;
    },
    togglePreviouslyIncorrectQuestion: (state) => {
      state.previouslyIncorrectQuestion = !state.previouslyIncorrectQuestion;
    },
    togglePreviouslyCorrectQuestion: (state) => {
      state.previouslyCorrectQuestion = !state.previouslyCorrectQuestion;
    },
  },
});

export const {
  toggleNotAnsweredQuestion,
  togglePreviouslyIncorrectQuestion,
  togglePreviouslyCorrectQuestion,
} = questionsSlice.actions;

export default questionsSlice.reducer;
