import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { Beat, User } from '../types';
import { Key } from '../types/beat';
import { genreTags } from '../utils/genreTags';

interface SearchState {
  isSearching: boolean;
  searchIsLoading: boolean;
  searchBeatFilters: ISearchBeatFilters | null;
  searchQuery: string | null;
  beats: Array<Beat> | null;
  users: Array<User> | null;
}

export interface ISearchBeatFilters {
  key: Key | undefined;
  genre: (typeof genreTags)[number] | undefined;
}

const initialState: SearchState = {
  isSearching: false,
  searchIsLoading: false,
  searchBeatFilters: null,
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
    searchIsLoading: (state, action: PayloadAction<boolean>) => {
      state.searchIsLoading = action.payload;
    },
    searchQuery: (state, action: PayloadAction<string | null>) => {
      state.searchQuery = action.payload;
    },
    searchFilters: (state, action: PayloadAction<ISearchBeatFilters | null>) => {
      state.searchBeatFilters = action.payload;
    },
  },
});

export const { beats, users, searching, searchIsLoading, searchQuery, searchFilters } = searchSlice.actions;

export const selectBeats = (state: RootState) => state.search.beats;
export const selectUsers = (state: RootState) => state.search.users;
export const selectIsSearching = (state: RootState) => state.search.isSearching;
export const selectSearchQuery = (state: RootState) => state.search.searchQuery;
export const selectSearchBeatFilters = (state: RootState) => state.search.searchBeatFilters;
export const selectSearchIsLoading = (state: RootState) => state.search.searchIsLoading;

export default searchSlice.reducer;
