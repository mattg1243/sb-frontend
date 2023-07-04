import { Tooltip } from 'antd';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import styles from './PlaybackButtons.module.css';
import { useSelector } from 'react-redux';
import type { Beat } from '../../types';
import { cdnHostname } from '../../config/routing';
import { addStreamReq } from '../../lib/axios';

interface IPlyabackButtonsProps {
  testBeatPlaying?: Beat;
}

export default function PlaybackButtons(props: IPlyabackButtonsProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  let beatPlaying: Beat | null;
  // get beatPlaying from redux store
  const beatPlayingFromState = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );
  // check if being test
  if (props.testBeatPlaying) {
    beatPlaying = props.testBeatPlaying;
  } else {
    beatPlaying = beatPlayingFromState;
  }
  // save the data needed to stream the beat and display infor
  const trackTitle = beatPlaying ? beatPlaying.title : '';
  const trackArtist = beatPlaying ? beatPlaying.artistName : '';
  const trackSrcUrl = beatPlaying ? `${cdnHostname}/${beatPlaying.audioKey}` : '';

  const audio = useRef<HTMLAudioElement>();
  let streamTimeout: NodeJS.Timeout;

  const play = async () => {
    if (!audio.current) {
      console.log('no audio ref detected');
      return;
    } else if (audio.current.paused && !isPlaying) {
      return audio.current.play();
    }
  };

  const pause = () => {
    if (!audio.current) {
      console.log('no audio ref detected');
      return;
    } else if (!audio.current.paused && isPlaying) {
      audio.current.pause();
    }
  };
  useEffect(() => {
    if (beatPlaying) {
      audio.current = new Audio(trackSrcUrl);
      audio.current.onplaying = () => {
        setIsPlaying(true);
        streamTimeout = setTimeout(() => {
          addStreamReq(beatPlaying?._id as string)
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        }, 20000);
      };
      audio.current.onpause = () => {
        setIsPlaying(false);
        clearTimeout(streamTimeout);
      };
      audio.current.play();
      // wait 20seconds before registering as stream
    }
  }, [beatPlaying]);

  useEffect(() => {
    return () => {
      if (!audio.current) {
        console.log('no audio ref detected on cleanup');
        return;
      } else {
        audio.current.pause();
      }
    };
  }, [beatPlaying]);

  return beatPlaying ? (
    <>
      <Tooltip title={`${trackTitle} - ${trackArtist}`} placement="topLeft" id="playback-info">
        <button
          onClick={isPlaying ? pause : play}
          className={styles.playbackbutton}
          style={{ animationDuration: '0s !important' }}
          data-cy="playback-btn"
        >
          {isPlaying ? <PauseOutlined data-cy="pause-icon" /> : <CaretRightOutlined data-cy="play-icon" />}
        </button>
      </Tooltip>
    </>
  ) : null;
}
