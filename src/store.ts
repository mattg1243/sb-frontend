import { configureStore } from '@reduxjs/toolkit';
import { playbackReducer, playPauseReducer } from './reducers/playbackReducer';
import searchReducer from './reducers/searchReducer';
import notificationReducer from './reducers/notificationReducer';
import userReducer from './reducers/userReducer';

export const store = configureStore({
  reducer: {
    playback: playbackReducer,
    playPause: playPauseReducer,
    search: searchReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});

// From the Redux docs:
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
