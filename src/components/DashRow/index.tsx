import { Row, Statistic } from 'antd';
import BeatEditModal from '../BeatEditModal';
import { Beat } from '../../types/beat';
import { beatCdnHostName as cdnHostname } from '../../config/routing';
import { useState, useEffect } from 'react';
import { CheckOutlined, HeartFilled, HeartOutlined, PlayCircleOutlined } from '@ant-design/icons';
import styles from './DashRow.module.css';
import BeatDownloadModal from '../BeatDownloadModal';
import { useDispatch, useSelector } from 'react-redux';
import { playback } from '../../reducers/playbackReducer';
import { addStreamReq, getUserLikesBeatReq, likeBeatReq, unlikeBeatReq } from '../../lib/axios';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { useNavigate } from 'react-router-dom';
import { ensureLoggedIn } from '../../utils/auth';
import Artwork from './Artwork';

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

export default function DashRow(props: IBeatRowProps): JSX.Element {
  const { beat, onClick, buttonType } = props;

  const userId = getUserIdFromLocalStorage();

  const [artistNameColor, setArtistNameColor] = useState<'black' | 'blue'>('black');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackLoading, setPlaybackIsLoading] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>();
  const [likesCount, setLikesCount] = useState<number>(beat.likesCount);
  const [streamsCount, setStreamsCount] = useState<string>(beat.streamsCount.toLocaleString());
  const [downloadCount, setDownloadCount] = useState<string>();

  const beatPlayingFromState = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );

  const beatPlayPauseStatus = useSelector<
    { playPause: { status: 'playing' | 'loading' | 'paused' | null } },
    'playing' | 'loading' | 'paused' | null
  >((state) => state.playPause.status);

  useEffect(() => {
    if (beatPlayingFromState?._id !== beat._id) {
      setIsPlaying(false);
    } else {
      switch (beatPlayPauseStatus) {
        case 'loading':
          setPlaybackIsLoading(true);
          break;
        case 'paused':
          setIsPlaying(false);
          break;
        case 'playing':
          setIsPlaying(true);
          break;
        default:
          break;
      }
    }
  }, [beatPlayingFromState, beatPlayPauseStatus]);

  useEffect(() => {
    getUserLikesBeatReq(beat._id)
      .then((res) => {
        setLiked(res.data);
      })
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

  useEffect(() => {
    return () => {
      // dispatch(playback(null));
      setIsPlaying(false);
      const audio = document.getElementById(`audio-player-${beat.audioKey}`) as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * This function handles beat playback for mobile and passes through the provided
   * function from the props if on desktop.
   */
  const playBeat = async () => {
    // navigate(`/app/beat?id=${beat._id}`);
    setPlaybackIsLoading(true);
    dispatch(playback(beat));
    // select the corresponding hidden audio tag form the DOM
    const audio = document.getElementById(`audio-player-${beat.audioKey}`) as HTMLAudioElement;
    if (isPlaying) {
      setIsPlaying(false);
      if (!isMobile) audio.pause();
    } else if (!isPlaying) {
      setPlaybackIsLoading(true);
      if (!isMobile) await audio.play();
      setIsPlaying(true);
    }
    setPlaybackIsLoading(false);
  };

  const likeBeat = async () => {
    if (beat.artistId !== userId) {
      try {
        await ensureLoggedIn();
        setLiked(true);
        const res = await likeBeatReq(beat._id);
        setLikesCount(likesCount + 1);
        console.log(res);
      } catch (err) {
        setLiked(false);
        setLikesCount(likesCount - 1);
        console.error(err);
      }
    }
  };

  const unlikeBeat = async () => {
    try {
      await ensureLoggedIn();
      setLiked(false);
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
      <Row className={styles['row-container']} id={`dashrow-${beat._id}`}>
        {isMobile ? null : buttonType === 'edit' ? (
          <BeatEditModal beat={beat} />
        ) : buttonType === 'download' ? (
          <BeatDownloadModal beatId={beat._id} title={beat.title} artistName={beat.artistName} license={false} />
        ) : (
          <BeatDownloadModal beatId={beat._id} title={beat.title} artistName={beat.artistName} license={true} />
        )}
        <Row style={{ alignItems: 'center', marginRight: 'auto', paddingLeft: '1vw' }}>
          <Artwork
            beatId={beat._id}
            artworkKey={beat.artworkKey as string}
            isPlaying={isPlaying}
            isLoading={playbackLoading}
            onClick={playBeat}
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
              {beat.hasStems ? (
                <>
                  <div style={{ paddingLeft: '1vw', paddingRight: '1vw' }}>|</div>
                  <div>
                    Stems: <CheckOutlined />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Row>
        {isMobile ? null : (
          <div style={{ alignItems: 'flex-end', paddingRight: '12vw', left: '73vw' }} data-cy="beat-like-btn">
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
      <audio preload="auto" style={{ display: 'none' }} id={`audio-player-${beat.audioKey}`}>
        <source src={`${cdnHostname}/${beat.audioKey}`} type="audio/mpeg" />
      </audio>
    </>
  );
}
