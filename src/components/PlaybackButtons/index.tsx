import { Tooltip, Spin } from 'antd';
import { CaretRightOutlined, PauseOutlined, LoadingOutlined } from '@ant-design/icons';
import { BsFillVolumeDownFill, BsVolumeMuteFill, BsVolumeUpFill } from 'react-icons/bs';
import { useState, useRef, useEffect } from 'react';
import styles from './PlaybackButtons.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { Beat } from '../../types';
import { cdnHostname } from '../../config/routing';
import { addStreamReq } from '../../lib/axios';
import { playback } from '../../reducers/playbackReducer';

interface IPlyabackButtonsProps {
  testBeatPlaying?: Beat;
}

/**
 * Util function for pretty printing minutes / seconds timestamp for playback.
 * @param string
 * @param pad
 * @param length
 * @returns
 */
const strPadLeft = (string: string, pad: string, length: number) => {
  return (new Array(length + 1).join(pad) + string).slice(-length);
};

export default function PlaybackButtons(props: IPlyabackButtonsProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<string>();
  const [volume, setVolume] = useState<number>(100);
  const [secondsPlayed, setSecondsPlayed] = useState<number>(0);
  const [minutesPlayed, setMinutesPlayed] = useState<number>(0);

  let beatPlaying: Beat | null;
  const currentBeatId = new URLSearchParams().get('id');
  // get beatPlaying from redux store
  const beatPlayingFromState = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );

  const dispatch = useDispatch();

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

  const handleTimeUpdate = () => {
    if (audio.current) {
      setCurrentTime(audio.current.currentTime);
      const minutes = Math.floor(audio.current.currentTime / 60);
      const seconds = Math.floor(audio.current.currentTime - minutes * 60);
      console.log('seconds: ', seconds, 'minutes: ', minutes);
      setMinutesPlayed(Math.floor(minutes));
      setSecondsPlayed(Math.floor(seconds));
    }
  };

  const handleSeek = (e: any) => {
    if (audio.current) {
      audio.current.currentTime = e.target.value;
      const minutes = Math.floor(audio.current.duration / 60);
      const seconds = Math.floor(audio.current.duration - minutes * 60);
      setMinutesPlayed(minutes);
      setSecondsPlayed(seconds);
    }
  };

  const stopAllAudio = () => {
    document.querySelectorAll('audio').forEach((el) => {
      el.pause();
      el.currentTime = 0;
    });
  };

  useEffect(() => {
    if (beatPlaying && currentBeatId !== beatPlaying._id) {
      setIsLoading(true);
      audio.current = document.getElementById(`audio-player-${beatPlaying.audioKey}`) as HTMLAudioElement;
      setCurrentTime(0);
      setIsLoading(false);
      audio.current.onloadedmetadata = () => {
        console.log('audio duration: ', audio.current?.duration);
        const minutes = Math.floor((audio.current?.duration as number) / 60);
        const seconds = Math.floor((audio.current?.duration as number) - minutes * 60);
        setDuration(`${minutes}:${strPadLeft(seconds.toString(), '0', 2)}`);
      };
      audio.current.ontimeupdate = handleTimeUpdate;
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
      audio.current.onplay = () => {
        setIsPlaying(true);
      };
      audio.current.onerror = () => {
        console.log('error loading audio file');
      };
      audio.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        audio.current?.pause();
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
        dispatch(playback(null));
        clearTimeout(streamTimeout);
        setCurrentTime(0);
        audio.current.pause();
      }
    };
  }, []);

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
      <Tooltip
        title={`${minutesPlayed.toString()}:${strPadLeft(secondsPlayed.toString(), '0', 2)} / ${duration}`}
        placement="top"
        overlayStyle={{ top: '87vh' }}
      >
        <input
          type="range"
          min={0}
          max={audio.current?.duration}
          step={0.01}
          value={currentTime}
          className={styles['seek-bar']}
          style={{ background: 'white' }}
          onChange={(e) => {
            handleSeek(e);
          }}
        />
      </Tooltip>
      {/* <BsVolumeUpFill className={styles['vol-icon']} /> */}
    </footer>
  );

  // determine which type to render
  const onBeatPage = window.location.pathname === '/app/beat' ? true : false;
  const toRender = onBeatPage ? playbackBar : playbackBtn;

  return onBeatPage && beatPlaying ? toRender : null;
}
