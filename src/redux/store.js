import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage for persistence
import sessionStorage from 'redux-persist/lib/storage/session'; // SessionStorage for result
import loaderReducer from './features/loader/loader.slice';
import mcqsQuestion from './features/SBA/sba.slice';
import limitQuestion from './features/limit/limit.slice';
import resultReducer from './features/result/result.slice';
import modeReducer from './features/mode/mode.slice';
import accuracyReducer from './features/accuracy/accuracy.slice';
import questionReviewReducer from './features/question-review/question-review.slice';
import saqReducer from './features/SAQ/saq.slice';
import recentSessionsReducer from './features/recent-session/recent-session.slice';
import modulesReducer from './features/categoryModules/module.slice';
import darkModeReducer from './features/dark-mode/dark-mode.slice';
import { osceReducer } from './features/osce-static/osce-static.slice';
import osceBotReducer from './features/osce-bot/osce-bot.slice';
import quesGenInsertReducer from './features/question-gen/question-gen.slice';
import mockModulesReducer from './features/mock-test/mock.slice';
import attemptReducer from './features/attempts/attempts.slice';
import flaggedReducer from './features/flagged/flagged.slice';
import visitedReducer from './features/flagged/visited.slice';
import userAnswersReducer from './features/SAQ/userAnswer.slice';
import presentationReducer from './features/sort-by-presentation/sort-by-presentation.slice';
import examDatesReducer from './features/exam-countdown/slice';
import userReducer from './features/user-id/userId.slice';
// Redux Persist Config for localStorage and sessionStorage
const persistConfig = {
  key: 'root',
  storage, // LocalStorage for modules and mcqsQuestion
  whitelist: [
    "user",
    'presentations',
    'userAnswers',
    'visited',
    'flagged',
    'attempts',
    'darkMode',
    'quesGen',
    'module',
    'osceBot',
    'mcqsQuestion',
    'osce',
    'accuracy',
    'questionReview',
    'SQA',
    'sessions',
    'mode',
    'limit',
    'mockModules',
  ], // Persist these in localStorage
};

const resultPersistConfig = {
  key: 'result',
  storage: sessionStorage, // Use sessionStorage for result
  whitelist: ['result', 'sessions', 'module'], // Only persist result in sessionStorage
};

// Combine all reducers
const rootReducer = combineReducers({
  presentations: presentationReducer,
  userAnswers: userAnswersReducer,
  visited: visitedReducer,
  flagged: flaggedReducer,
  attempts: attemptReducer,
  module: modulesReducer,
  loading: loaderReducer,
  mcqsQuestion: mcqsQuestion,
  limit: limitQuestion,
  mode: modeReducer,
  accuracy: accuracyReducer,
  SQA: saqReducer,
  darkMode: darkModeReducer,
  questionReview: questionReviewReducer,
  recentSession: recentSessionsReducer,
  osce: osceReducer,
  osceBot: osceBotReducer,
  quesGen: quesGenInsertReducer,
  mockModules: mockModulesReducer,
  examDates: examDatesReducer,
  user: userReducer,
  result: persistReducer(resultPersistConfig, resultReducer), // Apply persistReducer for result
});

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted root reducer
});

// Create the persistor to persist the store
export const persistor = persistStore(store);
