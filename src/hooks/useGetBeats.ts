import { useState, useEffect } from 'react';
import type { Beat } from '../types';
import { getAllBeatsReq, getAllBeatsByUserReq } from '../lib/axios';

/**
 * A hook that gets all Beats from the server, if supplied with a user ID, returns all beats created
 * by that user.
 * @param userId - Optional param used for querying Beats by user.
 * @returns An array of Beat objects or undefined if no beats match the query.
 */
export default function useGetBeats(userId?: string): { beats: Array<Beat> | undefined } {
  const [beats, setBeats] = useState<Array<Beat>>();

  useEffect(() => {
    if (!userId) {
      getAllBeatsReq().then((res) => {
        setBeats(res.data);
      });
    } else {
      getAllBeatsByUserReq(userId).then((res) => {
        setBeats(res.data);
      });
    }
  }, [userId]);

  if (beats?.length === 0) {
    return { beats: undefined };
  }
  return { beats };
}
