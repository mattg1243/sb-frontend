import { Tooltip } from 'antd';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import styles from './PlaybackButtons.module.css';
import { useSelector } from 'react-redux';
import type { Beat } from '../../types';
import { cdnHostname } from '../../config/routing';

export default function PlaybackButtons() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  // get beatPlaying from redux store
  const beatPlaying = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );
  // save the data needed to stream the beat and display infor
  const trackTitle = beatPlaying ? beatPlaying.title : '';
  const trackArtist = beatPlaying ? beatPlaying.artistName : '';
  const trackSrcUrl = beatPlaying ? `${cdnHostname}/${beatPlaying.audioKey}` : '';

  const audio = useRef<HTMLAudioElement>();

  const play = () => {
    if (!audio.current) {
      console.log('no audio ref detected');
      return;
    } else {
      setIsPlaying(true);
      audio.current.play();
    }
  };

  const pause = () => {
    if (!audio.current) {
      console.log('no audio ref detected');
      return;
    } else {
      setIsPlaying(false);
      audio.current.pause();
    }
  };
  useEffect(() => {
    console.log('Track from redux : ', beatPlaying?.title);
    if (beatPlaying) {
      audio.current = new Audio(trackSrcUrl);
      audio.current.play();
      setIsPlaying(true);
    } else {
      console.log('No beat found for useSelector hook call');
    }
  }, [beatPlaying]);

  useEffect(() => {
    return () => {
      if (!audio.current) {
        // console.log('no audio ref detected on cleanup');
        return;
      } else {
        audio.current.pause();
      }
    };
  }, [beatPlaying]);

  return beatPlaying ? (
    <>
      <Tooltip title={`${trackTitle} - ${trackArtist}`} placement="topLeft">
        <button
          onClick={isPlaying ? pause : play}
          className={styles.playbackbutton}
          style={{ animationDuration: '0s !important' }}
        >
          {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
        </button>
      </Tooltip>
    </>
  ) : null;
}
