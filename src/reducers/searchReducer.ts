import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { Beat, User } from '../types';

interface SearchState {
  isSearching: boolean;
  searchQuery: string | null;
  beats: Array<Beat> | null;
  users: Array<User> | null;
}

const initialState: SearchState = {
  isSearching: false,
  searchQuery: null,
  beats: null,
  users: null,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    beats: (state, action: PayloadAction<Array<Beat> | null>) => {
      state.beats = action.payload;
    },
    users: (state, action: PayloadAction<Array<User> | null>) => {
      state.users = action.payload;
    },
    searching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    searchQuery: (state, action: PayloadAction<string | null>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { beats, users, searching, searchQuery } = searchSlice.actions;

export const selectBeats = (state: RootState) => state.search.beats;
export const selectUsers = (state: RootState) => state.search.users;
export const selectIsSearching = (state: RootState) => state.search.isSearching;
export const selectSearchQuery = (state: RootState) => state.search.searchQuery;

export default searchSlice.reducer;
