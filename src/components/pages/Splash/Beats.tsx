import { useEffect, useState, FC } from 'react';
import styles from './Splash.module.css';
import { Beat } from '../../../types';
import { imgCdnHostName } from '../../../config/routing';
import { getFeaturedBeatsReq } from '../../../lib/axios';

interface IBeatProps {
  beat: Beat;
}

const BeatRow: FC<IBeatProps> = ({ beat }) => (
  <div className={styles.beat}>
    <div className={styles.beatInfo}>
      <img src={`${imgCdnHostName}/${beat.artworkKey}`} alt={beat.title} className={styles.beatImg} />
      <div className={styles.beatDetails}>
        <div className={styles.beatTitle}>{beat.title}</div>
        <div className={styles.beatProd}>{beat.artistName}</div>
      </div>
    </div>
    <div className={styles.beatMeta}>
      <div className={styles.beatGenre}>{beat.genreTags[0]}</div>
      <div className={styles.beatArtist}>{beat.artistName}</div>
      <div className={styles.beatAdded}>{beat.created_at as string}</div>
    </div>
  </div>
);

export default function BeatsSection() {
  const [beats, setBeats] = useState<Beat[]>();

  useEffect(() => {
    getFeaturedBeatsReq()
      .then((res) => setBeats(res.data.beats))
      .catch((err) => console.error(err));
  }, []);

  return <>{beats ? beats.map((beat, index) => <BeatRow beat={beat} key={index} />) : null}</>;
}
