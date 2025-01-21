import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage for persistence
import sessionStorage from 'redux-persist/lib/storage/session'; // SessionStorage for result
import loaderReducer from './features/loader/loader.slice';
import mcqsQuestion from './features/SBA/sba.slice';
import limitQuestion from './features/limit/limit.slice';
import resultReducer from './features/result/result.slice';
import modeReducer from './features/mode/mode.slice';
import accuracyReducer from './features/accuracy/accuracy.slice'
import questionReviewReducer from './features/question-review/question-review.slice';
import sqaReducer from './features/SAQ/saq.slice'
import recentSessionsReducer from './features/recent-session/recent-session.slice'
import modulesReducer from './features/categoryModules/module.slice';
import darkModeReducer from './features/dark-mode/dark-mode.slice';
// Redux Persist Config for localStorage and sessionStorage
const persistConfig = {
    key: 'root',
    storage, // LocalStorage for modules and mcqsQuestion
    whitelist: ['darkMode','module', 'mcqsQuestion', 'accuracy', 'questionReview', "shortQuestion","sessions","mode","limit"], // Persist these in localStorage
};

const resultPersistConfig = {
    key: 'result',
    storage: sessionStorage, // Use sessionStorage for result
    whitelist: ['result', 'sessions','module'], // Only persist result in sessionStorage
};

// Combine all reducers
const rootReducer = combineReducers({
    module: modulesReducer,
    loading: loaderReducer,
    mcqsQuestion: mcqsQuestion,
    limit: limitQuestion,
    mode: modeReducer,
    accuracy: accuracyReducer,
    sqa: sqaReducer,
    darkMode: darkModeReducer,
    questionReview: questionReviewReducer,
    recentSession: recentSessionsReducer,
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
