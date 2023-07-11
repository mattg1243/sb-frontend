import { configureStore } from '@reduxjs/toolkit';
import playbackReducer from './reducers/playbackReducer';
import searchReducer from './reducers/searchReducer';
import notificationReducer from './reducers/notificationReducer';

export const store = configureStore({
  reducer: {
    playback: playbackReducer,
    search: searchReducer,
    notification: notificationReducer,
  },
});

// From the Redux docs:
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
