import { useState } from "react";
import { AlertObj } from '../types';
import { sendLoginUserReq } from '../lib/axios';
import { User } from '../types/user';

interface ILoginReturn extends AlertObj {
  user: string | null
}
interface IUseLoginReturn {
  login: (email: string, password: string) => Promise<ILoginReturn>,
  isLoading: Boolean
}

export default function useLogin(): IUseLoginReturn {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [loginResponse, setLoginResponse] = useState<ILoginReturn>({ status: 'none', message: '', user: null });
  
  const login = async (email: string, password: string): Promise<ILoginReturn> => {
    try {
      setIsLoading(true);
      // send the post request to the gateway  
      const response = await sendLoginUserReq({ email, password });

      if (response.status === 200) {
        setIsLoading(false);
        setLoginResponse({ status: 'success', message: 'You are now logged in!', user: response.data.user });
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
    }
    return Promise.resolve(loginResponse);
  }

  return { login, isLoading };
}