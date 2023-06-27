import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { Beat } from '../types';

interface BeatsState {
  beats: Array<Beat> | null;
}

const initialState: BeatsState = {
  beats: null,
};

export const beatsSlice = createSlice({
  name: 'beats',
  initialState,
  reducers: {
    beats: (state, action: PayloadAction<Beat[] | null>) => {
      state.beats = action.payload;
    },
  },
});

export const { beats } = beatsSlice.actions;

export const selectBeats = (state: RootState) => state.beats;

export default beatsSlice.reducer;
