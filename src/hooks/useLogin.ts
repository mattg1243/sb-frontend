import { useState } from 'react';
import { AlertObj } from '../types';
import { loginUserReq } from '../lib/axios';
import { User } from '../types/user';

interface ILoginReturn extends AlertObj {
  user: string | null;
}
interface IUseLoginReturn {
  login: (email: string, password: string) => Promise<ILoginReturn>;
  isLoading: Boolean;
}

export default function useLogin(): IUseLoginReturn {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [loginResponse, setLoginResponse] = useState<ILoginReturn>({ status: 'none', message: '', user: null });

  const login = async (email: string, password: string): Promise<ILoginReturn> => {
    try {
      setIsLoading(true);
      // send the post request to the gateway
      const response = await loginUserReq({ email, password });
      if (response.status === 200) {
        setIsLoading(false);
        setLoginResponse({ status: 'success', message: 'You are now logged in!', user: response.data.user });
        Promise.resolve();
      } else {
        setLoginResponse({ status: 'error', message: 'login response has a non-200 status code', user: null });
        Promise.reject();
      }
    } catch (err: any) {
      console.error(err.message);
      let message: string;
      if (err.response.status === 401) {
        message = 'Invalid login credentials';
      } else {
        message = 'An error occured while logging in: ' + err.message;
      }
      setIsLoading(false);
      setLoginResponse({ status: 'error', message: message, user: null });
      Promise.reject();
    } finally {
      return loginResponse;
    }
  };
  return { login, isLoading };
}
