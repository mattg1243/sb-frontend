import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { playPause } from '../../reducers/playbackReducer';

interface IAudioProps {
  src: string;
  playPauseStatus: 'playing' | 'loading' | 'paused';
  onTimeUpdate: (currentTime: number) => void;
  onPlayPauseStatusChange: (status: 'playing' | 'loading' | 'paused') => void;
}

const isMobile = window.innerWidth < 480;

export default function Audio(props: IAudioProps) {
  const { src, playPauseStatus, onTimeUpdate, onPlayPauseStatusChange } = props;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const audioRef = useRef<HTMLAudioElement>(null);
  const onBeatPage = window.location.pathname === '/app/beat' ? true : false;

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
    onPlayPauseStatusChange('loading');
    dispatch(playPause('loading'));
  }, [onPlayPauseStatusChange]);

  const handleCanPlay = useCallback(() => {
    if (onBeatPage) {
      onPlayPauseStatusChange('paused');
      dispatch(playPause('paused'));
    } else {
      onPlayPauseStatusChange('playing');
      dispatch(playPause('playing'));
    }
  }, [playPauseStatus, onPlayPauseStatusChange]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      // audioRef.current.addEventListener('loadstart', handleLoadStart);
      // audioRef.current.addEventListener('loadedmetadata', handleCanPlay);

      if (playPauseStatus === 'playing') {
        handlePlay();
      } else if (playPauseStatus === 'paused') {
        handlePause();
      }

      return () => {
        audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        // audioRef.current?.removeEventListener('loadstart', handleLoadStart);
        // audioRef.current?.removeEventListener('loadedmetadata', handleCanPlay);
      };
    }
  }, [src, handleTimeUpdate, handleLoadStart, handleCanPlay, handlePlay, handlePause]);

  useEffect(() => {
    if (playPauseStatus === 'paused') {
      handlePause();
    } else if (playPauseStatus === 'playing') {
      handlePlay;
    }
  }, [playPauseStatus]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = src;
    }
  }, [src]);

  return (
    <audio preload="metadata" style={{ display: 'none' }} ref={audioRef}>
      <source src={src} type="audio/mpeg" />
      <p>Your browser does not support the audio element.</p>
    </audio>
  );
}
