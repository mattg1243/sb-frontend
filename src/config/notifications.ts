import { type INotificationProps } from '../components/Notification';

export const notifications: { [key: string]: INotificationProps } = {
  loginExp: { type: 'info', message: 'You must be logged in to use this feature.' },
};
