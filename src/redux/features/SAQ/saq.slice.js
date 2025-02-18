import { createSlice } from "@reduxjs/toolkit";
import {
    fetchShortQuestionByModules,
    fetchModulesById,
    fetchShortQuestionByModulesById,
    fetchSqaChild,
    fetchQuestionCounts
} from "./saq.service";

const initialState = {
    shortQuestions: [],
    modules: [],
    attempts: [],
    counts: {},
    sqaChildren: [],
    organizedData: [],
    userAnswers: [],
    checkedAnswers: [],
    loading: false,
    error: null
};

const shortQuestionSlice = createSlice({
    name: "SQA",
    initialState,
    reducers: {
        setAttemptedShortQuestion: (state, action) => {
            state.attempts = action.payload;
        },
        setUserAnswers: (state, action) => {
            console.log("action.payload:", action.payload);
            
            state.userAnswers = action.payload;
        },
        setCheckedAnswers: (state, action) => {
            state.checkedAnswers = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Short Questions
            .addCase(fetchShortQuestionByModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShortQuestionByModules.fulfilled, (state, action) => {
                state.loading = false;
                state.shortQuestions = action.payload.data;
            })
            .addCase(fetchShortQuestionByModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Modules by ID
            .addCase(fetchModulesById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModulesById.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = action.payload;
            })
            .addCase(fetchModulesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Short Questions by Module IDs
            .addCase(fetchShortQuestionByModulesById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShortQuestionByModulesById.fulfilled, (state, action) => {
                state.loading = false;
                state.shortQuestions = action.payload;
            })
            .addCase(fetchShortQuestionByModulesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchQuestionCounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestionCounts.fulfilled, (state, action) => {
                state.loading = false;
                state.counts = action.payload;
            })
            .addCase(fetchQuestionCounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch SQA Child Questions
            .addCase(fetchSqaChild.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSqaChild.fulfilled, (state, action) => {
                state.loading = false;
                state.sqaChildren = action.payload;

                // Organize data by mapping parents with their children
                state.organizedData = state.shortQuestions.map(parent => ({
                    ...parent,
                    children: action.payload.filter(child => child.parentQuestionId === parent.id)
                }));
            })
            .addCase(fetchSqaChild.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setAttemptedShortQuestion, setUserAnswers, setCheckedAnswers } = shortQuestionSlice.actions;

export default shortQuestionSlice.reducer;
