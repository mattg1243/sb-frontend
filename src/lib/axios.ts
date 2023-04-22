import axios, { AxiosResponse } from 'axios';
import gatewayUrl from '../config/routing';
import { User } from '../types';

// user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUserReq = async (credentials: ILoginRequest): Promise<AxiosResponse> => {
  return await axios.post(`${gatewayUrl}/login`, credentials, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
};

export const logoutUserReq = async () => {
  return await axios.get(`${gatewayUrl}/logout`, { withCredentials: true });
};

export const getUserReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/user/?id=${userId}`, { withCredentials: true });
};

export const getUserAvatarReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/user/avatar?id=${userId}`);
};

interface UpdateUserArg extends Omit<User, 'avatar'> {
  avatar: File | string;
}

export const updateUserReq = async (user: UpdateUserArg) => {
  return await axios.post(`${gatewayUrl}/user/update`, user, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
};

export const updateAvatarReq = async (newAvatar: FormData, progressSetter: (p: number) => void) => {
  return await axios.post(`${gatewayUrl}/user/avatar`, newAvatar, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
    onUploadProgress: (progressEvent) => {
      progressSetter(Math.round((progressEvent.loaded / progressEvent.bytes) * 100));
    },
  });
};

export const followUserReq = async (userToFollow: string) => {
  return await axios.post(
    `${gatewayUrl}/user/follow`,
    { userToFollow },
    {
      withCredentials: true,
    }
  );
};

export const unfollowUserReq = async (userToUnfollow: string) => {
  return await axios.post(
    `${gatewayUrl}/user/unfollow`,
    { userToUnfollow },
    {
      withCredentials: true,
    }
  );
};

export const getFollowersReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/user/followers?user=${userId}`);
};

export const getFollowingReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/user/following?user=${userId}`);
};
// beats
export const uploadBeatReq = async (data: FormData, progressSetter: (p: number) => void): Promise<AxiosResponse> => {
  return await axios.post(`${gatewayUrl}/beats/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
    onUploadProgress: (progressEvent) => {
      progressSetter(Math.round((progressEvent.loaded / progressEvent.bytes) * 100));
    },
  });
};

export const getAllBeatsReq = async () => {
  return await axios.get(`${gatewayUrl}/beats/beats`, { withCredentials: true });
};

export const getAllBeatsByUserReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/beats/beats?userId=${userId}`, { withCredentials: true });
};

export const getAllBeatsFromFollowingReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/beats/beats?userId=${userId}&following=true`);
};

export const deleteBeatReq = async (beatId: string) => {
  return await axios.delete(`${gatewayUrl}/beats/${beatId}`, { withCredentials: true });
};

export const updateBeatReq = async (data: FormData, beatId: string) => {
  return await axios.post(`${gatewayUrl}/beats/update/${beatId}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
};
