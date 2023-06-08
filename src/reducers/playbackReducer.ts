import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { Beat } from '../types';

interface PlaybackState {
  trackPlaying: Beat | null;
}

const initialState: PlaybackState = {
  trackPlaying: null,
};

export const playbackSlice = createSlice({
  name: 'playback',
  initialState,
  reducers: {
    playback: (state, action: PayloadAction<Beat>) => {
      state.trackPlaying = action.payload;
    },
  },
});

export const { playback } = playbackSlice.actions;

export const selectPlayback = (state: RootState) => state.playback;

export default playbackSlice.reducer;
