import { useState, useEffect } from 'react';
import type { Beat } from '../types';
import {
  getAllBeatsReq,
  getAllBeatsByUserReq,
  getAllBeatsFromFollowingReq,
  getLicensedBeatsByUser,
} from '../lib/axios';
// TODO refactor to take a config object instead having 4 params
/**
 * A hook that gets Beats from the server, if supplied with a user ID, returns all beats created
 * by that user. If supplied with licensed = true & a user ID, returns Beats that are licensed by that user.
 * @param userId - Optional param used for querying Beats by user.
 * @param following - Optional param used for querying Beats from followed users.
 * @param limit - The max number of Beats to retrieve from the server.
 * @param licensed - Optional param used for getting all Beats licensed by a given user.
 * @returns An array of Beat objects or undefined if no beats match the query.
 */
export default function useGetBeats(
  userId?: string,
  following?: boolean,
  limit?: number,
  licensed?: boolean
): { beats: Array<Beat> | undefined; isLoading: boolean } {
  const [beats, setBeats] = useState<Array<Beat>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    // console.log('getting beats...');
    try {
      if (!userId) {
        getAllBeatsReq().then((res) => {
          setBeats(res.data);
        });
      } else if (userId && following) {
        getAllBeatsFromFollowingReq(userId).then((res) => {
          setBeats(res.data);
        });
      } else if (userId && licensed) {
        getLicensedBeatsByUser(userId, limit).then((res) => {
          setBeats(res.data);
        });
      } else {
        getAllBeatsByUserReq(userId).then((res) => {
          setBeats(res.data);
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      // console.log('done!');
    }
  }, [userId]);
  if (beats?.length === 0) {
    return { beats: undefined, isLoading };
  }
  return { beats, isLoading };
}
