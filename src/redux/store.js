// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Using localStorage for persistence
import modulesReducer from './features/categoryModules/module.slice'; // Your slice
import loaderReducer from './features/loader/loader.slice'
import mcqsQuestion from './features/mcqQuestions/mcqQuestion.slice'
// Configure redux-persist to use localStorage
const persistConfig = {
    key: 'root',  
    storage,      
    whitelist: ['categoryModule','mcqsQuestion'],  // Specify which reducers to persist (categoryModule in this case)
};

// Apply persistReducer to the module slice reducer
const persistedReducer = persistReducer(persistConfig, modulesReducer);

// Create the store
export const store = configureStore({
    reducer: {
        categoryModule: persistedReducer,  // Use the persisted reducer for categoryModule
        loading: loaderReducer,
        mcqsQuestion: mcqsQuestion

    },
});

// Create the persistor to persist the store
export const persistor = persistStore(store);
