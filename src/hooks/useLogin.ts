import { useState } from "react";
import axios from "axios";
import { AlertObj } from '../types';
import { devHostNames, prodHostNames } from '../config/microRoutes';

interface IUseLoginReturn {
  login: (email: string, password: string) => Promise<AlertObj>,
  isLoading: Boolean
}

const hostNames = process.env.NODE_ENV !== 'production' ? devHostNames: prodHostNames;

export default function useLogin(): IUseLoginReturn {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [loginResponse, setLoginResponse] = useState<AlertObj>({status: 'none', message: ''});
  
  const login = async (email: String, password: String): Promise<AlertObj> => {
    try {
    setIsLoading(true);
    // send the post request to the gateway  
    const response = await axios.post(`${hostNames.gateway}/auth/login`, { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        setLoginResponse({ status: 'success', message: 'You are now logged in!' });
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
      setLoginResponse({ status: 'error', message: message });
    }

    return Promise.resolve(loginResponse);
  }

  return { login, isLoading };
}