import React from 'react';
import { Tooltip, Row, Col } from 'antd';
import { CaretRightOutlined, PauseOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import styles from './PlaybackButtons.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { Beat } from '../../types';
import { addStreamReq } from '../../lib/axios';
import { playback, playPause } from '../../reducers/playbackReducer';

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

const isMobile = window.innerWidth < 480;

export default function PlaybackButtons(props: IPlyabackButtonsProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<string>();
  const [secondsPlayed, setSecondsPlayed] = useState<number>(0);
  const [minutesPlayed, setMinutesPlayed] = useState<number>(0);

  let countedStream = false;

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

  const audio = useRef<HTMLAudioElement>();
  let streamTimeout: NodeJS.Timeout;

  const onBeatPage = window.location.pathname === '/app/beat' ? true : false;

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
      dispatch(playPause('loading'));
      stopAllAudio();
      audio.current = document.getElementById(`audio-player-${beatPlaying.audioKey}`) as HTMLAudioElement;
      setCurrentTime(0);
      if (!audio.current) {
        console.log('there was an error getting the audio element');
      } else {
        audio.current.onloadedmetadata = () => {
          const minutes = Math.floor((audio.current?.duration as number) / 60);
          const seconds = Math.floor((audio.current?.duration as number) - minutes * 60);
          setDuration(`${minutes}:${strPadLeft(seconds.toString(), '0', 2)}`);
        };
        audio.current.onloadeddata = () => {
          dispatch(playPause('playing'));
          setIsLoading(false);
        };
        audio.current.ontimeupdate = handleTimeUpdate;
        audio.current.onplaying = () => {
          setIsPlaying(true);
          dispatch(playPause('playing'));
          if (!countedStream) {
            streamTimeout = setTimeout(() => {
              addStreamReq(beatPlaying?._id as string)
                .then((res) => {
                  console.log(res);
                  countedStream = true;
                })
                .catch((err) => console.error(err));
            }, 1);
          }
        };
        audio.current.onpause = () => {
          setIsPlaying(false);
          dispatch(playPause('paused'));
          clearTimeout(streamTimeout);
        };
        audio.current.onplay = () => {
          setIsPlaying(true);
          dispatch(playPause('playing'));
          setIsLoading(false);
        };
        audio.current.onerror = () => {
          console.log('error loading audio file');
          dispatch(playPause(null));
          stopAllAudio();
        };
        audio.current.onended = () => {
          setIsPlaying(false);
          dispatch(playPause(null));
          setCurrentTime(0);
          dispatch(playback(null));
          audio.current?.pause();
        };

        if (!onBeatPage) {
          audio.current.play();
        }
      }
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
        stopAllAudio();
      }
    };
  }, []);

  // playback button for all pages except beat page
  const playbackBtn = !isMobile ? (
    <>
      <Tooltip
        title={
          <a href={`/app/beat?id=${beatPlaying?._id}`} style={{ color: 'white' }}>{`${trackTitle} - ${trackArtist}`}</a>
        }
        placement="topLeft"
        id="playback-info"
        style={{ position: 'relative' }}
      >
        <button
          onClick={isPlaying ? pause : play}
          className={styles.playbackbutton}
          style={{ animationDuration: '0s !important' }}
          data-cy="playback-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingOutlined />
          ) : isPlaying ? (
            <PauseOutlined data-cy="pause-icon" />
          ) : (
            <CaretRightOutlined data-cy="play-icon" />
          )}
        </button>
      </Tooltip>
    </>
  ) : null;

  // playback bar for beat page
  const playbackBar = (
    <Row
      style={{
        background: 'black',
        alignContent: 'center',
        width: '100vw',
        height: '9vh',
        bottom: '0',
        position: 'fixed',
        color: 'white',
      }}
      align="middle"
    >
      <Col span={4} offset={isMobile ? 0 : 4}>
        <button
          onClick={isPlaying ? pause : play}
          style={{ animationDuration: '0s !important' }}
          className={styles['playbackbtn-bar']}
          data-cy="playback-btn"
        >
          {isLoading ? (
            <LoadingOutlined />
          ) : isPlaying ? (
            <PauseOutlined data-cy="pause-icon" />
          ) : (
            <CaretRightOutlined data-cy="play-icon" />
          )}
        </button>
      </Col>
      <Col span={isMobile ? 18 : 12} offset={isMobile ? 2 : 0}>
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
            onChange={(e) => {
              handleSeek(e);
            }}
          />
        </Tooltip>
      </Col>
      {/* <BsVolumeUpFill className={styles['vol-icon']} /> */}
    </Row>
  );

  // determine which type to render
  const toRender = onBeatPage ? playbackBar : playbackBtn;

  return beatPlaying || onBeatPage ? toRender : null;
}

// export default React.memo(PlaybackButtons);
