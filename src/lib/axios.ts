import axios, { AxiosResponse } from "axios";
import gatewayUrl from "../config/routing";

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

// beats
export const uploadBeatReq = async (data: FormData): Promise<AxiosResponse> => {
  return await axios.post(`${gatewayUrl}/beats/upload`, 
    data, { 
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
      withCredentials: true 
    });
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