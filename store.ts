import { configureStore } from '@reduxjs/toolkit';
import pillarsReducer from './features/pillarsSlice';
import healthReducer from './features/healthSlice';
import rulesReducer from './features/rulesSlice';

export const store = configureStore({
  reducer: {
    pillars: pillarsReducer,
    health: healthReducer,
    rules: rulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
