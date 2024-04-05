import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { Beat } from '../types';

interface PlaybackState {
  trackPlaying: Beat | null;
}

type PlayPauseStatus = 'playing' | 'loading' | 'paused' | null;
interface PlayPauseState {
  status: PlayPauseStatus;
}

const initialPlaybackState: PlaybackState = {
  trackPlaying: null,
};

const initialPlayPauseState: PlayPauseState = {
  status: null,
};

export const playbackSlice = createSlice({
  name: 'playback',
  initialState: initialPlaybackState,
  reducers: {
    playback: (state, action: PayloadAction<Beat | null>) => {
      state.trackPlaying = action.payload;
    },
  },
});

export const playPauseSlice = createSlice({
  name: 'playPause',
  initialState: initialPlayPauseState,
  reducers: {
    playPause: (state, action: PayloadAction<PlayPauseStatus>) => {
      state.status = action.payload;
    },
  },
});

export const { playback } = playbackSlice.actions;
export const { playPause } = playPauseSlice.actions;

export const selectPlayback = (state: RootState) => state.playback;
export const selectPlayPause = (state: RootState) => state.playPause;
// export const selectStatus = (state: RootState) =>

export const playbackReducer = playbackSlice.reducer;
export const playPauseReducer = playPauseSlice.reducer;
