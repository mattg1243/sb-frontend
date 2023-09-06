import gatewayUrl from '../config/routing';
import axios from 'axios';
import { getUserIdFromLocalStorage } from './localStorageParser';

export const ensureLoggedIn = async () => {
  const userId = getUserIdFromLocalStorage();
  if (!userId) {
    window.location.href = '/login?goBack=true';
  }
  try {
    await axios.get(`${gatewayUrl}/auth?user=${userId}`, { withCredentials: true });
    return;
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      console.error(err);
      if (err.response?.status === 401) {
        window.location.href = '/login?goBack=true';
      }
    } else {
      console.error('unknown err occurred checking auth: ', err);
    }
  }
};
