import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage for persistence
import sessionStorage from 'redux-persist/lib/storage/session'; // SessionStorage for result
import modulesReducer from './features/categoryModules/module.slice';
import loaderReducer from './features/loader/loader.slice';
import mcqsQuestion from './features/mcqQuestions/mcqQuestion.slice';
import limitQuestion from './features/limit/limit.slice';
import resultReducer from './features/result/result.slice';

// Redux Persist Config for localStorage and sessionStorage
const persistConfig = {
    key: 'root',
    storage, // LocalStorage for modules and mcqsQuestion
    whitelist: ['modules', 'mcqsQuestion'], // Persist these in localStorage
};

const resultPersistConfig = {
    key: 'result',
    storage: sessionStorage, // Use sessionStorage for result
    whitelist: ['result'], // Only persist result in sessionStorage
};

// Combine all reducers
const rootReducer = combineReducers({
    categoryModule: modulesReducer,
    loading: loaderReducer,
    mcqsQuestion: mcqsQuestion,
    limit: limitQuestion,
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
