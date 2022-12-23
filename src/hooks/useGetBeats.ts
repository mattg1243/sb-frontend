import { useState, useEffect } from 'react';
import type { Beat } from "../types";
import { getAllBeatsReq } from '../lib/axios';

interface IUseGetBeatsReturn {
  beats: Array<Beat> | undefined,
}

export default function useGetBeats(): IUseGetBeatsReturn {

  const [beats, setBeats] = useState<Array<Beat>>();

  useEffect(() => {
    getAllBeatsReq()
      .then((res) => { setBeats(res.data)});
  }, [])

  return { beats };
}