import axios, { AxiosResponse } from "axios";
import gatewayUrl from "../config/routing";

export const sendUploadBeatReq = async (data: FormData): Promise<AxiosResponse> => {
  const response = await axios.post(`${gatewayUrl}/beats/upload`, data, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true })
  console.log(response);
  return response;
}

interface ILoginRequest {
  email: string,
  password: string
}

export const sendLoginUserReq = async (credentials: ILoginRequest): Promise<AxiosResponse> => {
  return await axios.post(`${gatewayUrl}/auth/login`, credentials, 
      { 
        headers: { 'Content-Type': 'application/json', },
        withCredentials: true,
      }
    )
}

export const getUser = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/user/?id=${userId}`, { withCredentials: true });
}

export const getAllBeatsReq = async () => {
  return await axios.get(`${gatewayUrl}/beats/beats`);
}

export const getAllBeatsByUserReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/beats/beats?user=${userId}`)
}