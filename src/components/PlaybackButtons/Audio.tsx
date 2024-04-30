import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { playPause } from '../../reducers/playbackReducer';

interface IAudioProps {
  src: string;
  playPauseStatus: 'playing' | 'loading' | 'paused';
  onTimeUpdate: (currentTime: number) => void;
  onDurationUpdate: (time: number) => void;
  onPlayPauseStatusChange: (status: 'playing' | 'paused') => void;
  onLoadingChange: (loading: boolean) => void;
}

const isMobile = window.innerWidth < 480;

export default function Audio(props: IAudioProps) {
  const { src, playPauseStatus, onTimeUpdate, onDurationUpdate, onPlayPauseStatusChange, onLoadingChange } = props;

  const dispatch = useDispatch();

  const audioRef = useRef<HTMLAudioElement>(null);
  const onBeatPage = window.location.pathname === '/app/beat' ? true : false;

  const handlePlay = useCallback(() => {
    if (audioRef.current) {
      if (isMobile) {
        audioRef.current.load();
      }
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
    onLoadingChange(true);
    dispatch(playPause('loading'));
  }, [onPlayPauseStatusChange]);

  const handleCanPlay = useCallback(() => {
    onLoadingChange(false);
    if (onBeatPage) {
      dispatch(playPause('paused'));
    } else {
      dispatch(playPause('playing'));
    }
  }, [onPlayPauseStatusChange]);

  const handlePlaying = useCallback(() => {
    if (audioRef.current) {
      onPlayPauseStatusChange('playing');
    }
  }, []);

  const handleDurationUpdate = useCallback(() => {
    if (audioRef.current) {
      onDurationUpdate(audioRef.current.duration);
    }
  }, [onDurationUpdate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadstart', handleLoadStart);
      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('loadedmetadata', handleDurationUpdate);

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
      };
    }
  }, [src, handleTimeUpdate, handleLoadStart, handleCanPlay, handlePlay, handlePause]);

  useEffect(() => {
    if (playPauseStatus === 'paused') {
      handlePause();
    } else if (playPauseStatus === 'playing') {
      handlePlay();
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
    }
  }, [src]);

  return isMobile ? (
    <audio preload="metadata" ref={audioRef}>
      <source src={src} type="audio/mpeg" id="audio-source" />
      <p>no supported source found</p>
    </audio>
  ) : (
    <audio preload="metadata" style={{ display: 'none' }} src={src} ref={audioRef} />
  );
}
