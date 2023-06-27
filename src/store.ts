import { configureStore } from '@reduxjs/toolkit';
import playbackReducer from './reducers/playbackReducer';
import beatsReducer from './reducers/beatsReducer';

export const store = configureStore({
  reducer: {
    playback: playbackReducer,
    beats: beatsReducer,
  },
});

// From the Redux docs:
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
