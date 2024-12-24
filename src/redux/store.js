// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Using localStorage for persistence
import modulesReducer from './features/categoryModules/module.slice';
import loaderReducer from './features/loader/loader.slice';
import mcqsQuestion from './features/mcqQuestions/mcqQuestion.slice';
import limitQuestion from './features/limit/limit.slice';

// Configure redux-persist to use localStorage
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['categoryModule', 'mcqsQuestion'], // Specify reducers to persist
};

// Combine all reducers
const rootReducer = combineReducers({
    categoryModule: modulesReducer,
    loading: loaderReducer,
    mcqsQuestion: mcqsQuestion,
    limit: limitQuestion,
});

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
    reducer: persistedReducer, // Use the persisted root reducer
});

// Create the persistor to persist the store
export const persistor = persistStore(store);
