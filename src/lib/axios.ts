import axios, { AxiosResponse } from "axios";
import gatewayUrl from "../config/routing";
import { Beat, User } from '../types';

// user
interface ILoginRequest {
  email: string,
  password: string
}

export const loginUserReq = async (credentials: ILoginRequest): Promise<AxiosResponse> => {
  return await axios.post(`${gatewayUrl}/auth/login`, credentials, 
      { 
        headers: { 'Content-Type': 'application/json', },
        withCredentials: true,
      }
    )
}

export const logoutUserReq = async () => {
  return await axios.get(`${gatewayUrl}/auth/logout`);
}

export const getUserReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/user/?id=${userId}`, { withCredentials: true });
}

interface UpdateUserArg extends Omit<User, 'avatar'> {
  avatar: File | string
}

export const updateUserReq = async (user: UpdateUserArg) => {
  return await axios.post(`${gatewayUrl}/user/update`, 
    user, { 
      headers: { 'Content-Type': 'application/json', },
      withCredentials: true,
    }
  );
}

export const updateAvatarReq = async (newAvatar: FormData) => {
  return await axios.post(`${gatewayUrl}/user/avatar`, 
    newAvatar, { 
      headers: { 'Content-Type': 'multipart/form-data', },
      withCredentials: true,
    }
  );
}
// beats
export const uploadBeatReq = async (data: FormData): Promise<AxiosResponse> => {
  return await axios.post(`${gatewayUrl}/beats/upload`, 
    data, { 
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
      withCredentials: true 
    }
  );
}

export const getAllBeatsReq = async () => {
  return await axios.get(`${gatewayUrl}/beats/beats`);
}

export const getAllBeatsByUserReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/beats/beats?user=${userId}`)
}

export const deleteBeatReq = async (beatId: string) => {
  return await axios.delete(`${gatewayUrl}/beats/${beatId}`, { withCredentials: true });
}

export const updateBeatReq = async (beat: Beat) => {
  return await axios.post(`${gatewayUrl}/beats/update`, 
    beat, 
    { 
      headers: { 'Content-Type': 'application/json', }, 
      withCredentials: true 
    }
  );
}