import { Button, Tooltip } from "antd"
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons"
import { useState, useRef, useEffect } from "react";
import styles from './PlaybackButtons.module.css';

interface IPlaybackButtonsProps {
  trackTitle: string, 
  trackArtist: string,
  trackSrcUrl: string,
}

export default function PlaybackButtons(props: IPlaybackButtonsProps) {
  const { trackTitle, trackArtist, trackSrcUrl } = props;
  
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const audio = useRef<HTMLAudioElement>();

  const play = () => {
    if (!audio.current) {
      console.log('no audio ref detected');
      return;
    } else {
      setIsPlaying(true);
      audio.current.play();
    }
  }

  const pause = () => {
    if (!audio.current) {
      console.log('no audio ref detected');
      return;
    } else {
      setIsPlaying(false);
      audio.current.pause();
    }
  }
  useEffect(() => {
    audio.current = new Audio(trackSrcUrl);
    audio.current.play();
  }, [trackSrcUrl])

  useEffect(() => {
    return () => {
      if (!audio.current) {
        console.log('no audio ref detected on cleanup');
        return;
      } else {
        audio.current.pause();
      }
    }
  }, [trackSrcUrl])

  return (
    <Tooltip title={`${trackTitle} - ${trackArtist}`} placement="topLeft">
      <Button 
        onClick={isPlaying ? pause : play} 
        type="ghost" 
        className={styles.playbackbutton} 
        icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />} 
      />
    </Tooltip>
  )
}