import { Col, Image, Row, Statistic } from 'antd';
import BeatEditModal from '../BeatEditModal';
import { Beat } from '../../types/beat';
import { cdnHostname } from '../../config/routing';
import artworkLoading from '../../assets/artwork_loading.jpg';
import { useState, useEffect } from 'react';
import playIcon from '../../assets/play_black.png';
import pauseIcon from '../../assets/pause_black.png';
import { DownloadOutlined, HeartFilled, HeartOutlined, PlayCircleOutlined } from '@ant-design/icons';
import styles from './DashRow.module.css';
import BeatDownloadModal from '../BeatDownloadModal';
import { useDispatch, useSelector } from 'react-redux';
import { playback } from '../../reducers/playbackReducer';
import { getUserLikesBeatReq, likeBeatReq, unlikeBeatReq } from '../../lib/axios';
import Icon from '@ant-design/icons/lib/components/Icon';

interface IBeatRowProps {
  beat: Beat;
  onClick: React.MouseEventHandler<HTMLHeadingElement>;
  buttonType: 'edit' | 'download';
}

const isMobile: boolean = window.innerWidth < 480;

// function to generate random number for likes count display
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default function DashRow(props: IBeatRowProps): JSX.Element {
  const { beat, onClick, buttonType } = props;

  const [artistNameColor, setArtistNameColor] = useState<'black' | 'blue'>('black');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>();
  const [likesCount, setLikesCount] = useState<number>(beat.likesCount);
  const [streamsCount, setStreamsCount] = useState<string>();
  const [downloadCount, setDownloadCount] = useState<string>();

  useEffect(() => {
    getUserLikesBeatReq(beat._id)
      .then((res) => setLiked(res.data))
      .catch((err) => console.log(err));

    setStreamsCount(randomNumber(1000, 100000).toLocaleString());
    setDownloadCount(randomNumber(100, 1000).toLocaleString());
  }, []);

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

  const likeBeat = async () => {
    setLiked(true);
    setLikesCount(likesCount + 1);
    try {
      const res = await likeBeatReq(beat._id);
      console.log(res);
      setLikesCount(likesCount + 1);
    } catch (err) {
      console.log(err);
      setLiked(false);
      setLikesCount(likesCount - 1);
    }
  };

  const unlikeBeat = async () => {
    setLiked(false);
    setLikesCount(likesCount - 1);
    try {
      const res = await unlikeBeatReq(beat._id);
      console.log(res);
      setLiked(false);
      setLikesCount(likesCount - 1);
    } catch (err) {
      console.log(err);
      setLiked(true);
      setLikesCount(likesCount + 1);
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
            <div style={{ display: 'flex', alignSelf: 'flex-start', marginLeft: '3vw', flexDirection: 'row' }}>
              <div style={{ paddingRight: '1vw' }}>
                <PlayCircleOutlined style={{ paddingRight: '.5vw' }} />
                {streamsCount}
              </div>
              |
              <div style={{ paddingLeft: '.5vw' }}>
                <DownloadOutlined style={{ paddingRight: '.5vw', paddingLeft: '.5vw' }} />
                {downloadCount}
              </div>
            </div>
          </div>
        </Row>
        <div style={{ alignItems: 'flex-end', marginRight: '25vw' }}>
          <Col>
            {liked ? <HeartFilled onClick={() => unlikeBeat()} /> : <HeartOutlined onClick={() => likeBeat()} />}
            <Statistic title="Likes" value={likesCount} valueStyle={{ fontSize: '1.5vh' }} />
          </Col>
        </div>
      </Row>
      {isMobile ? (
        <audio preload="auto" style={{ display: 'none' }} id={`audio-player-${beat.audioKey}`}>
          <source src={`${cdnHostname}/${beat.audioKey}`} type="audio/mpeg" />
        </audio>
      ) : null}
    </>
  );
}
