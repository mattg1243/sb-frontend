import { useState, useEffect } from 'react';
import type { Beat } from "../types";
import { getAllBeatsReq, getAllBeatsByUserReq } from '../lib/axios';

interface IUseGetBeatsReturn {
  beats: Array<Beat> | undefined,
}
// TODO: make this accept a query with user id for getting
// all beats created by a single artist
export default function useGetBeats(userId?: string): IUseGetBeatsReturn {

  const [beats, setBeats] = useState<Array<Beat>>();

  useEffect(() => {
    if (!userId) {
      getAllBeatsReq()
      .then((res) => { setBeats(res.data); });
    } else {
      getAllBeatsByUserReq(userId)
        .then((res) => { setBeats(res.data); });
    }
  }, [userId])

  return { beats };
}