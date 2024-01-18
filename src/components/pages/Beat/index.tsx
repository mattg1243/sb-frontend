import { useState, useEffect } from 'react';
import { Row, Image, Divider, Statistic, Spin, Tooltip } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { GiTreeBranch } from 'react-icons/gi';
import { FiShare } from 'react-icons/fi';
import type { Beat } from '../../../types';
import styles from './BeatPage.module.css';
import { beatCdnHostName, imgCdnHostName } from '../../../config/routing';
import artworkLoading from '../../../assets/artwork_loading.jpg';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getBeatReq, getUserLikesBeatReq, likeBeatReq, unlikeBeatReq } from '../../../lib/axios';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import { useDispatch } from 'react-redux';
import { notification } from '../../../reducers/notificationReducer';
import { playback } from '../../../reducers/playbackReducer';
import BeatDownloadModal from '../../BeatDownloadModal';
import { ensureLoggedIn } from '../../../utils/auth';

interface IBeatPageProps {
  testBeat?: Beat;
}

const isMobile: boolean = window.innerWidth < 1024;

export default function BeatPage(props?: IBeatPageProps) {
  const beatId = new URLSearchParams(window.location.search).get('id');
  const userId = getUserIdFromLocalStorage();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>();
  const [beat, setBeat] = useState<Beat>();
  const [likesCount, setLikesCount] = useState<number>();
  const [streamsCount, setStreamsCount] = useState<number>();

  const audio = document.getElementById(`audio-player-${beat?.audioStreamKey}`) as HTMLAudioElement;

  useEffect(() => {
    getBeatReq(beatId as string)
      .then((res) => {
        setBeat(res.data.beat);
        setLikesCount(res.data.beat.likesCount);
        setStreamsCount(res.data.beat.streamsCount);
      })
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
    getUserLikesBeatReq(beatId as string)
      .then((res) => {
        setLiked(res.data);
      })
      .catch((err) => console.error(err));
  }, [beatId]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(playback(beat || null));
    setIsPlaying(true);
  });

  // check if testing
  useEffect(() => {
    if (props?.testBeat) {
      setBeat(props.testBeat);
    }
  });

  /**
   * Sets the MediaSession metadata for display on mobile devices.
   */
  const setAudioMetadata = () => {
    if (beat) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: beat.title,
        artist: beat.artistName,
        artwork: [{ src: `${imgCdnHostName}/${beat.artworkKey}` }],
      });
    }
  };

  const stopAllAudio = () => {
    document.querySelectorAll('audio').forEach((el) => {
      el.pause();
      el.currentTime = 0;
    });
  };

  /**
   * This function handles beat playback for mobile and passes through the provided
   * function from the props if on desktop.
   * @param e - MouseEvent
   */
  const playBeat = () => {
    if (beat && !isPlaying) {
      setIsPlaying(true);
      dispatch(playback(beat));
    }
  };

  const pauseBeat = () => {
    if (beat && isPlaying) {
      setIsPlaying(false);
      audio.pause();
    }
  };

  const likeBeat = async () => {
    if (beat && typeof likesCount == 'number') {
      if (beat.artistId !== userId) {
        setLiked(true);
        try {
          await ensureLoggedIn();
          const res = await likeBeatReq(beat._id);
          setLikesCount(likesCount + 1);
          console.log(res);
        } catch (err) {
          setLiked(false);
          console.error(err);
        }
      }
    }
  };

  const unlikeBeat = async () => {
    setLiked(false);
    if (beat && likesCount) {
      try {
        await ensureLoggedIn();
        const res = await unlikeBeatReq(beat._id);
        setLikesCount(likesCount - 1);
        console.log(res);
      } catch (err) {
        setLiked(true);
        console.log(err);
      }
    }
  };

  const imgSize = isMobile ? 250 : 600;

  return (
    <>
      <div
        style={{
          height: '100%',
          width: isMobile ? '100%' : '50%',
          marginTop: '11vh',
          textAlign: 'center',
          justifyContent: 'center',
        }}
        cy-data="beat-page-cont"
      >
        {beat && !isLoading ? (
          <>
            <img
              src={`${imgCdnHostName}/fit-in/${imgSize}x${imgSize}/${beat.artworkKey}`}
              alt="album artwork"
              // onClick={() => {
              //   isPlaying ? pauseBeat() : playBeat();
              //   dispatch(playback(beat));
              // }}
              onError={({ currentTarget }) => {
                console.error('error loading img on beat page: \n', currentTarget);
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = artworkLoading;
              }}
              style={{ width: isMobile ? 250 : '37vh', height: isMobile ? 250 : '37vh' }}
              className={styles.artwork}
            />
            <h1 className={styles['beat-title']} data-cy="beat-page-title">
              {beat.title}
            </h1>
            <h3 data-cy="beat-page-artist">
              <a className={styles['beat-artist']} href={`/app/user/?id=${beat.artistId}`}>
                {beat.artistName}
              </a>
            </h3>
            <Divider />
            <Row style={{ justifyContent: 'space-evenly' }}>
              <div>
                <PlayCircleOutlined style={{ fontSize: '2.5vh', marginBottom: '10px' }} />
                <Statistic title="Streams" value={streamsCount} valueStyle={{ fontSize: '1.5vh' }} />
              </div>
              <div>
                {liked ? (
                  <HeartFilled
                    onClick={() => unlikeBeat()}
                    id="like-beat-btn"
                    style={{ fontSize: '2.5vh', marginBottom: '10px' }}
                    data-cy="beat-page-like-btn"
                  />
                ) : (
                  <HeartOutlined
                    onClick={() => likeBeat()}
                    id="unlike-beat-btn"
                    style={{ fontSize: '2.5vh', marginBottom: '10px' }}
                    data-cy="beat-page-unlike-btn"
                  />
                )}
                <Statistic
                  title="Likes"
                  value={likesCount}
                  valueStyle={{ fontSize: '1.5vh' }}
                  className="beat-like-count"
                />
              </div>
              <div>
                <GiTreeBranch style={{ fontSize: '3vh', marginBottom: '10px' }} />
                <Statistic
                  title="Stems"
                  value={beat.hasStems ? 'Available' : 'None :('}
                  valueStyle={{ fontSize: '1.5vh' }}
                />
              </div>
            </Row>
            <Divider />
            <Row style={{ justifyContent: 'space-evenly', marginTop: '4vh' }}>
              <div>
                <Tooltip title="Copy share link">
                  <FiShare
                    onClick={() => {
                      const url = location.href;
                      navigator.clipboard.writeText(url);
                      dispatch(notification({ type: 'success', message: 'Beat URL has been copied!' }));
                    }}
                    style={{ fontSize: '3vh' }}
                  />
                </Tooltip>
              </div>
              <div>
                <BeatDownloadModal
                  beatId={beat._id}
                  title={beat.title}
                  artistName={beat.artistName}
                  license={false}
                  tooltip={true}
                  btnStyle={{ fontSize: '3vh' }}
                />
              </div>
            </Row>
            {isMobile ? (
              <audio preload="metadata" style={{ display: 'none' }} id={`audio-player-${beat.audioStreamKey}`}>
                <source src={`${beatCdnHostName}/${beat.audioStreamKey}`} type="audio/mpeg" />
              </audio>
            ) : (
              <audio
                preload="metadata"
                style={{ display: 'none' }}
                id={`audio-player-${beat.audioStreamKey}`}
                src={`${beatCdnHostName}/${beat.audioStreamKey}`}
              />
            )}
          </>
        ) : null}
        {!beat && !isLoading ? <h1 style={{ marginTop: '25vh' }}>No beat found :(</h1> : null}
        {isLoading ? <Spin style={{ marginTop: '25vh' }} /> : null}
      </div>
      {/* <Row className={styles['beat-info-row']}>
        <Space direction="horizontal" className={styles['beat-info-space']}>
          <Space direction="vertical">
            <h1>{beat.title}</h1>
            <h5>by {beat.artistName}</h5>
          </Space>
        </Space>
      </Row> */}
    </>
  );
}
