import { useState, useEffect } from 'react';
import type { Beat } from '../types';
import {
  getAllBeatsReq,
  getSavedBeatsByUserReq,
  getAllBeatsFromFollowingReq,
  getLicensedBeatsByUser,
  getAllBeatsByUserReq,
} from '../lib/axios';
// TODO refactor to take a config object instead having 4 params
export interface IUseGetBeatsOptions {
  userId?: string;
  following?: boolean;
  take?: number;
  skip?: number;
  licensed?: boolean;
  saved?: boolean;
}
/**
 * A hook that gets Beats from the server, if supplied with a user ID, returns all beats created
 * by that user. If supplied with licensed = true & a user ID, returns Beats that are licensed by that user.
 * @param userId - Optional param used for querying Beats by user.
 * @param following - Optional param used for querying Beats from followed users.
 * @param limit - The max number of Beats to retrieve from the server.
 * @param licensed - Optional param used for getting all Beats licensed by a given user.
 * @returns An array of Beat objects or undefined if no beats match the query.
 */
export default function useGetBeats(options?: IUseGetBeatsOptions): {
  beats: Array<Beat> | undefined;
  isLoading: boolean;
} {
  const [beats, setBeats] = useState<Array<Beat>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    // console.log('getting beats...');
    try {
      if (!options?.userId) {
        getAllBeatsReq({ skip: 0, take: options?.take || 8 })
          .then((res) => {
            setBeats(res.data);
          })
          .then(() => setIsLoading(false));
      } else if (options.userId && options.following) {
        getAllBeatsFromFollowingReq(options.userId)
          .then((res) => {
            setBeats(res.data);
          })
          .then(() => setIsLoading(false));
      } else if (options.userId && options.licensed) {
        getLicensedBeatsByUser(options.userId, options.take)
          .then((res) => {
            setBeats(res.data);
          })
          .then(() => setIsLoading(false));
      } else if (options.userId && options.saved) {
        getSavedBeatsByUserReq()
          .then((res) => {
            setBeats(res.data);
          })
          .then(() => setIsLoading(false));
      } else {
        getAllBeatsByUserReq(options.userId)
          .then((res) => {
            setBeats(res.data);
          })
          .then(() => setIsLoading(false));
      }
    } catch (err) {
      console.error(err);
    }
  }, [options?.userId]);
  if (beats?.length === 0) {
    return { beats: undefined, isLoading };
  }
  return { beats, isLoading };
}
