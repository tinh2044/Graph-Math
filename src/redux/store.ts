import { configureStore } from '@reduxjs/toolkit';
// import expressionReducer from './slices/expressionSlice'; // Will be removed
// import historyReducer from './slices/historySlice'; // Will be removed
import graphDataReducer from './slices/graphDataSlice'; // New combined slice
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    graphData: graphDataReducer, // Use the new reducer
    // expressions: expressionReducer, // Remove old
    // history: historyReducer, // Remove old
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 