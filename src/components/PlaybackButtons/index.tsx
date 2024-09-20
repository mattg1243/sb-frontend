import { Tooltip, Row, Col } from 'antd';
import { CaretRightOutlined, PauseOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './PlaybackButtons.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { Beat } from '../../types';
import { beatCdnHostName } from '../../config/routing';
import { playPause } from '../../reducers/playbackReducer';
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
  const [seekTime, setSeekTime] = useState<number>(0);
  const [duration, setDuration] = useState<string>();
  const [durationNum, setDurationNum] = useState<number>();
  const [secondsPlayed, setSecondsPlayed] = useState<number>(0);
  const [minutesPlayed, setMinutesPlayed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [playPauseStatus, setPlayPauseStatus] = useState<'playing' | 'paused'>('paused');

  // get beatPlaying from redux store
  const beatPlayingFromState = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );

  const dispatch = useDispatch();
  const location = useLocation();

  // save the data needed to stream the beat and display infor
  const trackTitle = beatPlayingFromState ? beatPlayingFromState.title : '';
  const trackArtist = beatPlayingFromState ? beatPlayingFromState.artistName : '';

  let streamTimeout: NodeJS.Timeout;

  const onBeatPage = window.location.pathname === '/app/beat' ? true : false;

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
    setDurationNum(time);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    setDuration(`${minutes}:${strPadLeft(seconds.toString(), '0', 2)}`);
  }, []);

  const handleSeek = useCallback((e: any) => {
    setSeekTime(Number(e.target.value));
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(streamTimeout);
      setPlayPauseStatus('paused');
      setCurrentTime(0);
      stopAllAudio();
    };
  }, [location]);

  useEffect(() => {
    console.log('duration updated: ', durationNum);
  }, [durationNum]);

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
            <LoadingOutlined
              height={32}
              width={32}
              style={{
                color: 'white',
                border: 'none !important',
                background: 'transparent',
                fontSize: '24px',
                marginTop: '14px',
              }}
            />
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
        seekTime={seekTime}
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
      <Col span={1} offset={isMobile ? 0 : 3}>
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
      <Col span={isMobile ? 14 : 12} offset={isMobile ? 4 : 4}>
        <input
          type="range"
          min={0}
          max={durationNum}
          step={0.01}
          value={currentTime}
          className={styles['seek-bar']}
          onChange={(e) => {
            handleSeek(e);
          }}
        />
      </Col>
      <p>
        {minutesPlayed.toString()}:{strPadLeft(secondsPlayed.toString(), '0', 2)} / {duration}
      </p>
      {/* <BsVolumeUpFill className={styles['vol-icon']} /> */}
      <Audio
        src={`${beatCdnHostName}/${beatPlayingFromState?.audioStreamKey}`}
        playPauseStatus={playPauseStatus}
        onPlayPauseStatusChange={setPlayPauseStatus}
        onLoadingChange={setLoading}
        onTimeUpdate={handleTimeUpdate}
        onDurationUpdate={handleDurationUpdate}
        seekTime={seekTime}
        beatId={beatPlayingFromState?._id as string}
      />
    </Row>
  );

  // determine which type to render
  const toRender = onBeatPage ? playbackBar : playbackBtn;

  return beatPlayingFromState || onBeatPage ? toRender : null;
};

export default PlaybackButtons;
