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

export const getUserSubTierReq = async () => {
  return await axios.get(`${gatewayUrl}/user/sub-tier`, { withCredentials: true });
};

export const searchUserReq = async (query: string) => {
  return await axios.get(`${gatewayUrl}/user/search?search=${query}`);
};

export const getUserAvatarReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/user/avatar?id=${userId}`);
};

export const resendVerificationEmailReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/user/resend-verification-email?user=${userId}`);
};

export const resetPasswordReq = async (userEmail: string) => {
  return await axios.post(`${gatewayUrl}/user/reset-password?email=${userEmail}`);
};

export const changePasswordReq = async (userEmail: string, token: string, newPassword: string) => {
  return await axios.post(`${gatewayUrl}/user/change-password?email=${userEmail}&token=${token}`, {
    password: newPassword,
  });
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

export const getCreditBalanceReq = async () => {
  return await axios.get(`${gatewayUrl}/user/credits-balance`, { withCredentials: true });
};

export const getSubRefCodeReq = async () => {
  return await axios.get(`${gatewayUrl}/user/sub-ref-code`, { withCredentials: true });
};

export const setSubReferrerReq = async (refCode: string) => {
  return await axios.post(`${gatewayUrl}/user/sub-ref-code`, { refCode }, { withCredentials: true });
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

type UploadFileTypes = 'beat' | 'stem' | 'image';
export const getSignedUploadUrlReq = async (fileType: UploadFileTypes) => {
  return await axios.get(`${gatewayUrl}/beats/signed-upload-url?fileType=${fileType}`, { withCredentials: true });
};

export const getBeatReq = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats?id=${beatId}`);
};

export const getRandomBeatReq = async () => {
  return await axios.get(`${gatewayUrl}/beats/random`);
};

export const getSimilarBeats = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats/similar?beat=${beatId}`);
};

export const getAllBeatsReq = async (page?: { skip: number; take: number }) => {
  let requestUrl = `${gatewayUrl}/beats/beats`;
  if (page) {
    requestUrl = requestUrl + `?skip=${page.skip}` + `&take=${page.take}`;
  }
  return await axios.get(requestUrl, { withCredentials: true });
};

export const searchBeatsReq = async (query: string, skip?: number, take?: number, genre?: string, key?: string) => {
  let beatSearchUrl = `${gatewayUrl}/beats/search?search=${query}`;
  if (genre) {
    beatSearchUrl += `&genre=${genre}`;
  }
  if (key) {
    beatSearchUrl += `&key=${key}`;
  }
  if (skip) {
    beatSearchUrl += `&skip=${skip}`;
  }
  if (take) {
    beatSearchUrl += `&take=${take}`;
  }
  return await axios.get(beatSearchUrl);
};

export const getAllBeatsByUserReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/beats/beats?userId=${userId}`, { withCredentials: true });
};

export const getLicensedBeatsByUser = async (userId: string, limit?: number) => {
  let reqUrl = `${gatewayUrl}/beats/beats?userId=${userId}&licensed=true`;
  if (limit) {
    reqUrl += `&limit=${limit}`;
  }
  return await axios.get(reqUrl, { withCredentials: true });
};

export const getSavedBeatsByUserReq = async (limit?: number) => {
  let reqUrl = `${gatewayUrl}/beats/saved`;
  if (limit) {
    reqUrl += `&limit=${limit}`;
  }
  return await axios.get(reqUrl, { withCredentials: true });
};

export const saveBeatReq = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats/save?beatId=${beatId}`, { withCredentials: true });
};

export const unsaveBeatReq = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats/unsave?beatId=${beatId}`, { withCredentials: true });
};

export const isBeatSavedReq = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats/is-saved?beatId=${beatId}`, { withCredentials: true });
};

export const getAllBeatsFromFollowingReq = async (userId: string) => {
  return await axios.get(`${gatewayUrl}/beats/beats?userId=${userId}&following=true`, { withCredentials: true });
};

export const deleteBeatReq = async (beatId: string, audioKey: string) => {
  return await axios.delete(`${gatewayUrl}/beats/${beatId}?key=${audioKey}`, { withCredentials: true });
};

export const updateBeatReq = async (data: FormData, beatId: string) => {
  return await axios.post(`${gatewayUrl}/beats/update/${beatId}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
};

export const likeBeatReq = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats/like?beatId=${beatId}`, { withCredentials: true });
};

export const unlikeBeatReq = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats/unlike?beatId=${beatId}`, { withCredentials: true });
};

export const getUserLikesBeatReq = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats/user-likes?beatId=${beatId}`, { withCredentials: true });
};

export const getNumOfLikesReq = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats/likes-count?beatId=${beatId}`);
};

export const addStreamReq = async (beatId: string) => {
  return await axios.get(`${gatewayUrl}/beats/add-stream?beatId=${beatId}`, { withCredentials: true });
};
