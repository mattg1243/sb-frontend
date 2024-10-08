import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { playback, playPause } from '../../reducers/playbackReducer';
import { addStreamReq } from '../../lib/axios';
import ReactGA from 'react-ga4';

interface IAudioProps {
  src: string;
  playPauseStatus: 'playing' | 'paused';
  onTimeUpdate: (currentTime: number) => void;
  seekTime: number;
  onDurationUpdate: (time: number) => void;
  onPlayPauseStatusChange: (status: 'playing' | 'paused') => void;
  onLoadingChange: (loading: boolean) => void;
  beatId: string;
}

const isMobile = window.innerWidth < 480;

export default function Audio(props: IAudioProps) {
  const {
    src,
    playPauseStatus,
    onTimeUpdate,
    seekTime,
    onDurationUpdate,
    onPlayPauseStatusChange,
    onLoadingChange,
    beatId,
  } = props;

  const dispatch = useDispatch();

  const audioRef = useRef<HTMLAudioElement>(null);
  const onBeatPage = window.location.pathname === '/app/beat' ? true : false;
  let streamTimeout: NodeJS.Timeout;
  let countedStream = false;

  const handlePlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      onTimeUpdate(audioRef.current.currentTime);
    }
  }, [onTimeUpdate]);

  const handleLoadStart = useCallback(() => {
    if (audioRef.current) {
      onLoadingChange(true);
      dispatch(playPause('loading'));
    }
  }, [onPlayPauseStatusChange]);

  const handleCanPlay = useCallback(() => {
    onLoadingChange(false);
    if (onBeatPage) {
      dispatch(playPause('paused'));
    } else {
      onPlayPauseStatusChange('playing');
      dispatch(playPause('playing'));
    }
  }, [onPlayPauseStatusChange]);

  const handlePlaying = useCallback(() => {
    if (audioRef.current) {
      onLoadingChange(false);
      if (!countedStream) {
        streamTimeout = setTimeout(() => {
          addStreamReq(beatId)
            .then((res) => {
              console.log(res);
              countedStream = true;
            })
            .then(() => {
              ReactGA.event('beat_stream', { beat_id: beatId });
            })
            .catch((err) => console.error(err));
        }, 1);
      }
    }
  }, [beatId]);

  const handleDurationUpdate = useCallback(() => {
    if (audioRef.current) {
      onDurationUpdate(audioRef.current.duration);
      console.log(audioRef.current.duration);
    }
  }, [onDurationUpdate]);

  const handleSeeking = useCallback(() => {
    if (audioRef.current) {
      onLoadingChange(true);
    }
  }, [onLoadingChange]);

  const handleSeeked = useCallback(() => {
    if (audioRef.current) {
      onLoadingChange(false);
    }
  }, [onLoadingChange]);

  const handleEnded = useCallback(() => {
    if (audioRef.current) {
      onTimeUpdate(0);
      onDurationUpdate(audioRef.current.duration);
      onPlayPauseStatusChange('paused');
    }
  }, [onTimeUpdate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadstart', handleLoadStart);
      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('loadedmetadata', handleDurationUpdate);
      audioRef.current.addEventListener('playing', handlePlaying);
      audioRef.current.addEventListener('seeking', handleSeeking);
      audioRef.current.addEventListener('seeked', handleSeeked);
      audioRef.current.addEventListener('ended', handleEnded);

      if (playPauseStatus === 'playing') {
        handlePlay();
      } else if (playPauseStatus === 'paused') {
        handlePause();
      }

      return () => {
        audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current?.removeEventListener('loadstart', handleLoadStart);
        audioRef.current?.removeEventListener('canplay', handleCanPlay);
        audioRef.current?.removeEventListener('loadedmetadata', handleDurationUpdate);
        audioRef.current?.removeEventListener('playing', handlePlaying);
        audioRef.current?.removeEventListener('seeking', handleSeeking);
        audioRef.current?.removeEventListener('seeked', handleSeeked);
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [src, handleTimeUpdate, handleLoadStart, handleCanPlay, handlePlay, handlePause]);

  useEffect(() => {
    if (audioRef.current) {
      if (!audioRef.current.paused && playPauseStatus === 'paused') {
        handlePause();
      } else if (audioRef.current.paused && playPauseStatus === 'playing') {
        handlePlay();
      }
    }
  }, [playPauseStatus]);

  useEffect(() => {
    if (audioRef.current) {
      if (isMobile) {
        const sourceEl = document.getElementById('audio-source') as HTMLSourceElement;
        if (!sourceEl) {
          console.log('no source el found');
          return;
        }
        sourceEl.src = src;
        sourceEl.type = 'audio/mpeg';
      } else {
        audioRef.current.src = src;
      }
      audioRef.current.load();
      if (!onBeatPage) {
        audioRef.current
          .play()
          .then(() => console.log('playing new audio...'))
          .catch((err) => console.error(err));
      }
    }
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      console.log('time set from prop');
    }
  }, [seekTime]);

  return isMobile ? (
    <audio preload="metadata" ref={audioRef}>
      <source src={src} type="audio/mpeg" id="audio-source" />
      <p>no supported source found</p>
    </audio>
  ) : (
    <audio preload="metadata" style={{ display: 'none' }} src={src} ref={audioRef} />
  );
}
