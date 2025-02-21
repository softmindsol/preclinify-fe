import { createSlice } from "@reduxjs/toolkit";
import { fetchAllResult, fetchCorrectIncorrectResult, fetchCorrectResult, fetchIncorrectResult } from "./filter-question.service";

const initialState = {
    NotAnsweredQuestion: true,
    previouslyIncorrectQuestion: true,
    previouslyCorrectQuestion: true,
    selectedModules: [],
    results: [],
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
        setSelectedSBAModule: (state, action) => {
            state.selectedModules = action.payload;
        },
        clearResults: (state) => {
            state.results = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCorrectIncorrectResult.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCorrectIncorrectResult.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload; // Store the fetched data
            })
            .addCase(fetchCorrectIncorrectResult.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Store error message
            })
            .addCase(fetchAllResult.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllResult.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload; // Store the fetched data
            })
            .addCase(fetchAllResult.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Store error message
            })
            .addCase(fetchCorrectResult.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCorrectResult.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload; // Fetched data ko results array me store kar raha hai
            })
            .addCase(fetchCorrectResult.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Error ko state me store kar raha hai
            })
            .addCase(fetchIncorrectResult.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchIncorrectResult.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload; // Fetched data ko results array me store kar raha hai
            })
            .addCase(fetchIncorrectResult.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Error ko state me store kar raha hai
            });
            ;
    },
});

export const {
    toggleNotAnsweredQuestion,
    togglePreviouslyIncorrectQuestion,
    togglePreviouslyCorrectQuestion,
    setSelectedSBAModule
} = questionsSlice.actions;

export default questionsSlice.reducer;
