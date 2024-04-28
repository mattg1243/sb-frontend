import DashRow from '../../DashRow';
import { useState, useEffect, useRef } from 'react';
import styles from './Dashboard.module.css';
import RecAlgoMenu from '../../RecAlgoMenu';
import type { RecAlgos } from '../../RecAlgoMenu';
import PlaybackButtons from '../../PlaybackButtons';
import { useDispatch, useSelector } from 'react-redux';
import { beatCdnHostName } from '../../../config/routing';
import { notification as notificationReducer } from '../../../reducers/notificationReducer';
import type { Beat } from '../../../types';
import SubRefModal from '../../SubRefModal';
import BeatScroll from '../../BeatScroll';
import ReactGA from 'react-ga4';

const isMobile = window.innerWidth < 480;

export default function Dashboard() {
  const [currentAlgo, setCurrentAlgo] = useState<RecAlgos>('Recommended');

  const beatPlayingFromState = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );

  const audio = useRef<HTMLAudioElement>(null);
  // const [isSearching, setIsSearching] = useState<boolean>();
  useEffect(() => {
    if (audio.current && beatPlayingFromState) {
      audio.current.src = `${beatCdnHostName}/${beatPlayingFromState.audioStreamKey}`;
      audio.current.id = `audio-player-${beatPlayingFromState.audioKey}`;
    } else {
      console.log('no audio');
    }
  }, [beatPlayingFromState]);
  const dispatch = useDispatch();

  // check if being redirect after successful subscription purchase
  useEffect(() => {
    const subSuccessRedirect = new URLSearchParams(window.location.search).get('sub-success');
    if (subSuccessRedirect) {
      ReactGA.event('user_sub_purchase');
      dispatch(notificationReducer({ type: 'success', message: 'Your subscription is now live!' }));
    } else {
      return;
    }
  }, []);

  return (
    <div data-testid="dashboard" style={{ width: '100vw' }}>
      <SubRefModal />
      <div>
        <h2 className={styles['for-you-text']}>For You</h2>
        <RecAlgoMenu currentAlgo={currentAlgo} setCurrentAlgo={setCurrentAlgo} />
      </div>
      {isMobile ? (
        <audio
          ref={audio}
          preload="metadata"
          style={{ display: 'none' }}
          id={`audio-player-${beatPlayingFromState?.audioKey}`}
        >
          <source src={`${beatCdnHostName}/${beatPlayingFromState?.audioStreamKey}`} type="audio/mpeg" />
        </audio>
      ) : (
        <audio
          ref={audio}
          preload="metadata"
          style={{ display: 'none' }}
          id={`audio-player-${beatPlayingFromState?.audioKey}`}
          src={`${beatCdnHostName}/${beatPlayingFromState?.audioStreamKey}`}
        />
      )}
      <PlaybackButtons audio={audio} />
      <BeatScroll currentAlgo={currentAlgo} />
    </div>
  );
}
