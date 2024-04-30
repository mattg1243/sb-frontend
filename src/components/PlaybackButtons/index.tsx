import ReactGA from 'react-ga4';
import { Tooltip, Row, Col, FloatButton } from 'antd';
import { CaretRightOutlined, PauseOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './PlaybackButtons.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { Beat } from '../../types';
import { beatCdnHostName } from '../../config/routing';
import { addStreamReq } from '../../lib/axios';
import { playback, playPause } from '../../reducers/playbackReducer';
import { useLocation } from 'react-router-dom';
import Audio from './Audio';

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

const PlaybackButtons = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<string>();
  const [secondsPlayed, setSecondsPlayed] = useState<number>(0);
  const [minutesPlayed, setMinutesPlayed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [playPauseStatus, setPlayPauseStatus] = useState<'playing' | 'paused'>('paused');

  // get beatPlaying from redux store
  const beatPlayingFromState = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );

  const dispatch = useDispatch();
  const location = useLocation();

  let countedStream = false;

  // save the data needed to stream the beat and display infor
  const trackTitle = beatPlayingFromState ? beatPlayingFromState.title : '';
  const trackArtist = beatPlayingFromState ? beatPlayingFromState.artistName : '';

  let streamTimeout: NodeJS.Timeout;

  const onBeatPage = window.location.pathname === '/app/beat' ? true : false;

  const audioRef = useRef<HTMLAudioElement>(null);

  const stopAllAudio = () => {
    document.querySelectorAll('audio').forEach((el) => {
      el.pause();
      el.currentTime = 0;
    });
  };

  const play = () => {
    setPlayPauseStatus('playing');
    dispatch(playPause('playing'));
  };

  const pause = () => {
    setPlayPauseStatus('paused');
    dispatch(playPause('paused'));
  };

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    setMinutesPlayed(Math.floor(minutes));
    setSecondsPlayed(Math.floor(seconds));
  }, []);

  const handleDurationUpdate = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    setDuration(`${minutes}:${strPadLeft(seconds.toString(), '0', 2)}`);
  }, []);

  const handleSeek = useCallback((e: any) => {
    if (audioRef.current) {
      audioRef.current.currentTime = e.target.value;
      const minutes = Math.floor(audioRef.current.duration / 60);
      const seconds = Math.floor(audioRef.current.duration - minutes * 60);
      setMinutesPlayed(minutes);
      setSecondsPlayed(seconds);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(streamTimeout);
      setPlayPauseStatus('paused');
      setCurrentTime(0);
      stopAllAudio();
    };
  }, [location]);

  // playback button for all pages except beat page
  const playbackBtn = (
    <>
      <Tooltip
        title={
          <a
            href={`/app/beat?id=${beatPlayingFromState?._id}`}
            style={{ color: 'white' }}
          >{`${trackTitle} - ${trackArtist}`}</a>
        }
        placement="topLeft"
        id="playback-info"
      >
        <button
          onClick={playPauseStatus === 'playing' ? pause : play}
          className={styles.playbackbutton}
          style={{ animationDuration: '0s !important' }}
          data-cy="playback-btn"
          disabled={loading}
        >
          {loading ? (
            <LoadingOutlined height={32} width={32} />
          ) : playPauseStatus == 'playing' ? (
            <PauseOutlined height={32} width={32} data-cy="pause-icon" />
          ) : (
            <CaretRightOutlined height={32} width={32} data-cy="play-icon" />
          )}
        </button>
      </Tooltip>
      <Audio
        src={`${beatCdnHostName}/${beatPlayingFromState?.audioStreamKey}`}
        playPauseStatus={playPauseStatus}
        onPlayPauseStatusChange={setPlayPauseStatus}
        onLoadingChange={setLoading}
        onTimeUpdate={handleTimeUpdate}
        onDurationUpdate={handleDurationUpdate}
        beatId={beatPlayingFromState?._id as string}
      />
    </>
  );

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
          onClick={playPauseStatus == 'playing' ? pause : play}
          style={{ animationDuration: '0s !important' }}
          disabled={loading}
          className={styles['playbackbtn-bar']}
          data-cy="playback-btn"
        >
          {loading ? (
            <LoadingOutlined />
          ) : playPauseStatus == 'playing' ? (
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
            max={duration}
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
      <Audio
        src={`${beatCdnHostName}/${beatPlayingFromState?.audioStreamKey}`}
        playPauseStatus={playPauseStatus}
        onPlayPauseStatusChange={setPlayPauseStatus}
        onLoadingChange={setLoading}
        onTimeUpdate={handleTimeUpdate}
        onDurationUpdate={handleDurationUpdate}
        beatId={beatPlayingFromState?._id as string}
      />
    </Row>
  );

  // determine which type to render
  const toRender = onBeatPage ? playbackBar : playbackBtn;

  return beatPlayingFromState || onBeatPage ? toRender : null;
};

export default PlaybackButtons;
