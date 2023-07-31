import { Tooltip, Spin } from 'antd';
import { CaretRightOutlined, PauseOutlined, LoadingOutlined } from '@ant-design/icons';
import { BsFillVolumeDownFill, BsVolumeMuteFill, BsVolumeUpFill } from 'react-icons/bs';
import { useState, useRef, useEffect } from 'react';
import styles from './PlaybackButtons.module.css';
import { useSelector } from 'react-redux';
import type { Beat } from '../../types';
import { cdnHostname } from '../../config/routing';
import { addStreamReq } from '../../lib/axios';
import { error } from 'console';

interface IPlyabackButtonsProps {
  testBeatPlaying?: Beat;
}

export default function PlaybackButtons(props: IPlyabackButtonsProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>();
  const [volume, setVolume] = useState<number>(100);
  const [secondsPlayed, setSecondsPlayed] = useState<number>(0);
  const [minutesPlayed, setMinutesPlayed] = useState<number>(0);

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
  const audioEl = document.getElementById(`audio-player-${beatPlaying?.audioKey}`) as HTMLAudioElement;

  const play = async () => {
    if (!audioEl) {
      console.log('no audio ref detected');
      return;
    } else if (audioEl.paused && !isPlaying) {
      return audioEl.play();
    }
  };

  const pause = () => {
    if (!audioEl) {
      console.log('no audio ref detected');
      return;
    } else if (!audioEl.paused && isPlaying) {
      audioEl.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (audioEl) {
      setCurrentTime(audioEl.currentTime);
      const minutes = currentTime / 60;
      const seconds = minutes > 0 ? currentTime % (minutes * 60) : currentTime;
      console.log('seconds: ', seconds, 'minutes: ', minutes);
      setMinutesPlayed(Math.floor(minutes));
      setSecondsPlayed(Math.floor(seconds));
    }
  };

  const handleSeek = (e: any) => {
    if (audioEl) {
      audioEl.currentTime = e.target.value;
      const minutes = Math.floor(audioEl.currentTime / 60);
      const seconds = Math.floor(audioEl.currentTime % (minutes * 60));
      setMinutesPlayed(minutes);
      setSecondsPlayed(seconds);
    }
  };

  useEffect(() => {
    if (beatPlaying) {
      setIsLoading(true);

      audio.current = new Audio(trackSrcUrl);
      setIsLoading(false);
      audioEl.ontimeupdate = handleTimeUpdate;
      audioEl.onplaying = () => {
        setIsPlaying(true);
        streamTimeout = setTimeout(() => {
          addStreamReq(beatPlaying?._id as string)
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        }, 20000);
      };
      audioEl.onpause = () => {
        setIsPlaying(false);
        clearTimeout(streamTimeout);
      };
      audioEl.onerror = () => {
        console.log('error loading audio file');
      };
      audioEl.play();
      // wait 20seconds before registering as stream
    }
  }, [beatPlaying]);

  useEffect(() => {
    return () => {
      if (!audioEl) {
        console.log('no audio ref detected on cleanup');
        return;
      } else {
        audioEl.pause();
      }
    };
  }, [beatPlaying]);

  // playback button for all pages except beat page
  const playbackBtn = (
    <>
      {isLoading ? (
        <Spin indicator={<LoadingOutlined style={{ backgroundColor: 'black' }} />} />
      ) : (
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
      )}
    </>
  );

  // playback bar for beat page
  const playbackBar = (
    <footer
      style={{
        background: 'black',
        width: '100vw',
        height: '9vh',
        bottom: '0',
        paddingBottom: '20px',
        position: 'fixed',
        justifyContent: 'center',
        alignContent: 'center',
        color: 'white',
      }}
    >
      <button
        onClick={isPlaying ? pause : play}
        style={{ animationDuration: '0s !important' }}
        className={styles['playbackbtn-bar']}
        data-cy="playback-btn"
      >
        {isLoading ? <Spin indicator={<LoadingOutlined />} /> : null}
        {isPlaying ? <PauseOutlined data-cy="pause-icon" /> : <CaretRightOutlined data-cy="play-icon" />}
      </button>
      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={currentTime}
        className={styles['seek-bar']}
        style={{ background: 'var(--primary)' }}
        onChange={(e) => {
          handleSeek(e);
        }}
      />
      {/* <BsVolumeUpFill className={styles['vol-icon']} /> */}
    </footer>
  );

  // determine which type to render
  const onBeatPage = window.location.pathname === '/app/beat' ? true : false;
  const toRender = onBeatPage ? playbackBar : playbackBtn;

  return beatPlaying ? toRender : null;
}
