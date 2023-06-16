import { Image, Row } from 'antd';
import BeatEditModal from '../BeatEditModal';
import { Beat } from '../../types/beat';
import { cdnHostname } from '../../config/routing';
import artworkLoading from '../../assets/artwork_loading.jpg';
import { useState } from 'react';
import playIcon from '../../assets/play_black.png';
import pauseIcon from '../../assets/pause_black.png';
import styles from './DashRow.module.css';
import BeatDownloadModal from '../BeatDownloadModal';
import { useDispatch, useSelector } from 'react-redux';
import { playback } from '../../reducers/playbackReducer';

interface IBeatRowProps {
  beat: Beat;
  onClick: React.MouseEventHandler<HTMLHeadingElement>;
  buttonType: 'edit' | 'download';
}

const isMobile: boolean = window.innerWidth < 480;

export default function DashRow(props: IBeatRowProps): JSX.Element {
  const [artistNameColor, setArtistNameColor] = useState<'black' | 'blue'>('black');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { beat, onClick, buttonType } = props;

  const dispatch = useDispatch();
  // TODO figure out why this has to be typed everytime its used
  const beatPlaying = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );

  const displayFlatOrSharp = (flatOrSharpStr: 'flat' | 'sharp' | '') => {
    if (flatOrSharpStr === '') {
      return flatOrSharpStr;
    } else if (flatOrSharpStr === 'sharp') {
      return '#';
    } else {
      return '♭';
    }
  };

  const stopAllAudio = () => {
    document.querySelectorAll('audio').forEach((el) => {
      el.pause();
      el.currentTime = 0;
    });
  };

  /**
   * Sets the MediaSession metadata for display on mobile devices.
   */
  const setAudioMetadata = () => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: beat.title,
      artist: beat.artistName,
      artwork: [{ src: `${cdnHostname}/${beat.artworkKey}` }],
    });
  };
  /**
   * This function handles beat playback for mobile and passes through the provided
   * function from the props if on desktop.
   * @param e - MouseEvent
   */
  const playBeat = (e: React.MouseEvent<HTMLHeadingElement | HTMLDivElement>) => {
    if (isMobile) {
      // select the corresponding hidden audio tag form the DOM
      const audio = document.getElementById(`audio-player-${beat.audioKey}`) as HTMLAudioElement;
      // another beat is playing, stop it and play this beat
      if (beatPlaying != beat) {
        // set the beat playing in redux store and component state
        stopAllAudio();
        dispatch(playback(beat));
        setAudioMetadata();
        setIsPlaying(true);
        // restart beat and play
        audio.currentTime = 0;
        audio.play();
      } else if (beatPlaying == beat && isPlaying) {
        setIsPlaying(false);
        audio.pause();
      } else if (beatPlaying == beat && !isPlaying) {
        dispatch(playback(beat));
        setIsPlaying(true);
        audio.play();
      }
    } else {
      onClick(e);
    }
  };

  return (
    <>
      <Row className={styles['row-container']}>
        {isMobile ? null : buttonType === 'edit' ? (
          <BeatEditModal beat={beat} />
        ) : (
          <BeatDownloadModal title={beat.title} artistName={beat.artistName} cdnKey={beat.audioKey} />
        )}
        <Row style={{ alignItems: 'center', marginRight: 'auto', paddingLeft: '1vw' }}>
          <Image
            src={`${cdnHostname}/${beat.artworkKey}`}
            alt="album artwork"
            preview={{
              mask: <Image src={isPlaying ? pauseIcon : playIcon} preview={false} />,
              visible: false,
            }}
            placeholder={<Image src={artworkLoading} width={isMobile ? 75 : 125} height={isMobile ? 75 : 125} />}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = artworkLoading;
            }}
            width={isMobile ? 75 : 125}
            height={isMobile ? 75 : 125}
            // onClick={(e) => {
            //   playBeat(e);
            // }}
            onClick={(e) => {
              playBeat(e);
            }}
            className={styles.artwork}
          />
          <div className={styles['text-container']}>
            <h3
              onClick={(e) => {
                playBeat(e);
              }}
              className={styles.title}
            >
              {beat.title}
            </h3>
            <h4 className={styles['info-text']}>
              <a
                style={{ color: artistNameColor }}
                onMouseOver={() => {
                  setArtistNameColor('blue');
                }}
                onMouseLeave={() => {
                  setArtistNameColor('black');
                }}
                href={`/app/user/?id=${beat.artistId}`}
              >
                {beat.artistName}
              </a>{' '}
              |{isMobile ? null : ` ${beat.genreTags[0]} |`} {beat.key}
              {displayFlatOrSharp(beat.flatOrSharp)} {beat.majorOrMinor} {isMobile ? null : `| ${beat.tempo} bpm`}
            </h4>
          </div>
        </Row>
      </Row>
      <audio preload="auto" style={{ display: 'none' }} id={`audio-player-${beat.audioKey}`}>
        <source src={`${cdnHostname}/${beat.audioKey}`} type="audio/mpeg" />
      </audio>
    </>
  );
}
