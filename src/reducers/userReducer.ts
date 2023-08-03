import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UserState {
  isLoggedIn: boolean;
}

const initialState: UserState = {
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { loginUser } = userSlice.actions;

export const selectUserIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export default userSlice.reducer;
