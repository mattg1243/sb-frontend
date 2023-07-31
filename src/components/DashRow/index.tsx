import { Image, Row, Statistic } from 'antd';
import BeatEditModal from '../BeatEditModal';
import { Beat } from '../../types/beat';
import { cdnHostname } from '../../config/routing';
import artworkLoading from '../../assets/artwork_loading.jpg';
import { useState, useEffect, createRef } from 'react';
import playIcon from '../../assets/play_black.png';
import pauseIcon from '../../assets/pause_black.png';
import { CheckOutlined, DownloadOutlined, HeartFilled, HeartOutlined, PlayCircleOutlined } from '@ant-design/icons';
import styles from './DashRow.module.css';
import BeatDownloadModal from '../BeatDownloadModal';
import { useDispatch, useSelector } from 'react-redux';
import { playback } from '../../reducers/playbackReducer';
import { addStreamReq, getUserLikesBeatReq, likeBeatReq, unlikeBeatReq } from '../../lib/axios';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { useNavigate } from 'react-router-dom';

interface IBeatRowProps {
  beat: Beat;
  onClick: React.MouseEventHandler<HTMLHeadingElement>;
  buttonType: 'edit' | 'license' | 'download';
}

// < 480px for mobile and < 1024px for tablet, combining the two for now
const isMobile: boolean = window.innerWidth < 1024;

// function to generate random number for likes count display
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const audioRef = createRef<HTMLAudioElement>();

export default function DashRow(props: IBeatRowProps): JSX.Element {
  const { beat, onClick, buttonType } = props;

  const userId = getUserIdFromLocalStorage();
  let streamTimeout: NodeJS.Timeout;
  const audio = document.getElementById(`audio-player-${beat.audioKey}`) as HTMLAudioElement;

  const [artistNameColor, setArtistNameColor] = useState<'black' | 'blue'>('black');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>();
  const [likesCount, setLikesCount] = useState<number>(beat.likesCount);
  const [streamsCount, setStreamsCount] = useState<string>(beat.streamsCount.toLocaleString());
  const [downloadCount, setDownloadCount] = useState<string>();

  useEffect(() => {
    getUserLikesBeatReq(beat._id)
      .then((res) => setLiked(res.data))
      .catch((err) => console.log(err));
    setDownloadCount(randomNumber(100, 1000).toLocaleString());
  }, []);
  // useEffect to track beat streaming on mobile
  useEffect(() => {
    if (isMobile && isPlaying) {
      setTimeout(() => {
        addStreamReq(beat._id)
          .then((res) => console.log(res))
          .then(() => setStreamsCount(streamsCount + 1))
          .catch((err) => console.error(err));
      }, 20000);
    }
  }, [isPlaying]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // TODO figure out why this has to be typed everytime its used
  const beatPlaying = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );

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

  // audio config
  if (audio) {
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      const minutes = currentTime / 60;
      const seconds = minutes > 0 ? currentTime % (minutes * 60) : currentTime;
      console.log('seconds: ', seconds, 'minutes: ', minutes);
    };
    audio.onplaying = () => {
      setIsPlaying(true);
      streamTimeout = setTimeout(() => {
        addStreamReq(beatPlaying?._id as string)
          .then((res) => console.log(res))
          .catch((err) => console.error(err));
      }, 20000);
    };
    audio.onpause = () => {
      setIsPlaying(false);
      clearTimeout(streamTimeout);
    };
    audio.onerror = () => {
      console.log('error loading audio file');
    };
  }
  /**
   * This function handles beat playback for mobile and passes through the provided
   * function from the props if on desktop.
   * @param e - MouseEvent
   */
  const playBeat = (e: React.MouseEvent<HTMLHeadingElement | HTMLDivElement>) => {
    if (!isMobile) {
      // select the corresponding hidden audio tag form the DOM

      // another beat is playing, stop it and play this beat
      if (beatPlaying != beat) {
        // set the beat playing in redux store and component state
        stopAllAudio();
        dispatch(playback(beat));
        setAudioMetadata();
        setIsPlaying(true);
        // restart beat and play
        audio.currentTime = 0;
        audio.pause();
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
    if (beat.artistId !== userId) {
      setLiked(true);
      try {
        const res = await likeBeatReq(beat._id);
        setLikesCount(likesCount + 1);
        console.log(res);
      } catch (err) {
        setLiked(false);
        console.error(err);
      }
    }
  };

  const unlikeBeat = async () => {
    setLiked(false);
    try {
      const res = await unlikeBeatReq(beat._id);
      setLikesCount(likesCount - 1);
      console.log(res);
    } catch (err) {
      setLiked(true);
      console.log(err);
    }
  };

  return (
    <>
      <Row className={styles['row-container']}>
        {isMobile ? null : buttonType === 'edit' ? (
          <BeatEditModal beat={beat} />
        ) : buttonType === 'download' ? (
          <BeatDownloadModal beatId={beat._id} title={beat.title} artistName={beat.artistName} license={false} />
        ) : (
          <BeatDownloadModal beatId={beat._id} title={beat.title} artistName={beat.artistName} license={true} />
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
            data-cy="beat-artwork"
          />
          <div className={styles['text-container']}>
            <h3
              onClick={() => {
                navigate(`/app/beat?id=${beat._id}`);
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
              |{isMobile ? null : ` ${beat.genreTags[0]} |`} {beat.key} {beat.majorOrMinor}{' '}
              {isMobile ? null : `| ${beat.tempo} bpm`}
            </h4>
            <div
              className={styles['info-text']}
              style={{ display: 'flex', alignSelf: 'flex-start', flexDirection: 'row' }}
            >
              <div>
                <PlayCircleOutlined style={{ paddingRight: '.5vw' }} />
                {streamsCount}
              </div>
              {isMobile ? null : <div style={{ paddingLeft: '1vw', paddingRight: '.5vw' }}>|</div>}
              <div>
                <DownloadOutlined style={{ paddingRight: '.5vw', paddingLeft: isMobile ? '15px' : '.5vw' }} />
                {downloadCount}
              </div>
              {}
              {beat.hasStems ? (
                <>
                  {isMobile ? null : <div style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>|</div>}
                  <div>
                    Stems: <CheckOutlined />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Row>
        {isMobile ? null : (
          <div style={{ alignItems: 'flex-end', paddingRight: '15vw' }} data-cy="beat-like-btn">
            {liked ? (
              <HeartFilled onClick={() => unlikeBeat()} id="like-beat-btn" />
            ) : (
              <HeartOutlined onClick={() => likeBeat()} id="unlike-beat-btn" />
            )}
            <Statistic
              title="Likes"
              value={likesCount}
              valueStyle={{ fontSize: '1.5vh' }}
              className="beat-like-count"
            />
          </div>
        )}
        {isMobile ? (
          <div
            className={styles.mobileLikes}
            style={{ alignItems: 'flex-end', paddingRight: '10vw' }}
            data-cy="beat-like-btn"
          >
            {liked ? <HeartFilled onClick={() => unlikeBeat()} /> : <HeartOutlined onClick={() => likeBeat()} />}
            <Statistic value={likesCount} valueStyle={{ display: 'none' }} />
          </div>
        ) : null}
      </Row>
      <audio preload="auto" autoPlay={false} style={{ display: 'none' }} id={`audio-player-${beat.audioKey}`}>
        <source src={`${cdnHostname}/${beat.audioKey}`} type="audio/mpeg" />
      </audio>
    </>
  );
}
