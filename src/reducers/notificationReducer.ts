import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { INotificationProps } from '../components/Notification';

interface NotificationState {
  notification: INotificationProps | null;
}

const initialState: NotificationState = {
  notification: null,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notification: (state, action: PayloadAction<INotificationProps | null>) => {
      state.notification = action.payload;
    },
  },
});

export const { notification } = notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification.notification;

export default notificationSlice.reducer;
