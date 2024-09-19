import { useState, useEffect, useRef } from 'react';
import { Row, Spin, Statistic, Tooltip } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { GiTreeBranch } from 'react-icons/gi';
import type { Beat } from '../../../types';
import styles from './BeatPage.module.css';
import { imgCdnHostName } from '../../../config/routing';
import artworkLoading from '../../../assets/artwork_loading.jpg';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getBeatReq, getSimilarBeats, getUserLikesBeatReq, likeBeatReq, unlikeBeatReq } from '../../../lib/axios';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import { useDispatch } from 'react-redux';
import { playback } from '../../../reducers/playbackReducer';
import BeatDownloadModal from '../../BeatDownloadModal';
import { ensureLoggedIn } from '../../../utils/auth';
import PlaybackButtons from '../../PlaybackButtons';
import { BeatMetadata } from '../../../lib/helmet';
import DashRow from '../../DashRow';
import { useLocation } from 'react-router-dom';
import LoadingPage from '../Loading';
import { BackButton, HomeButton, RefreshButton } from './Buttons';
import RandomButton from './RandomButton';
import SaveBeatButton from '../../SaveBeatButton';

interface IBeatPageProps {
  testBeat?: Beat;
}

const isMobile: boolean = window.innerWidth < 1024;

export default function BeatPage(props?: IBeatPageProps) {
  const location = useLocation();
  const dispatch = useDispatch();

  const userId = getUserIdFromLocalStorage();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [similarLoading, setSimilarLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>();
  const [beat, setBeat] = useState<Beat>();
  const [similarBeats, setSimilarBeats] = useState<Beat[]>();
  const [likesCount, setLikesCount] = useState<number>();
  const [streamsCount, setStreamsCount] = useState<number>();

  useEffect(() => {
    setIsLoading(true);
    setImgLoading(true);
    setSimilarLoading(true);
    const beatId = new URLSearchParams(window.location.search).get('id');
    getBeatReq(beatId as string)
      .then((res) => {
        setBeat(res.data.beat);
        dispatch(playback(res.data.beat));
        setLikesCount(res.data.beat.likesCount);
        setStreamsCount(res.data.beat.streamsCount);
      })
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
    getSimilarBeats(beatId as string)
      .then((res) => {
        setSimilarBeats(res.data.beats);
        setSimilarLoading(false);
        setIsLoading(false);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
    getUserLikesBeatReq(beatId as string)
      .then((res) => {
        setLiked(res.data);
      })
      .catch((err) => console.error(err));
  }, [location, location.search]);

  // check if testing
  useEffect(() => {
    if (props?.testBeat) {
      setBeat(props.testBeat);
    }
  });

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

  const imgSize = isMobile ? 220 : 600;
  const imgSrc = `${imgCdnHostName}/fit-in/${imgSize}x${imgSize}/${beat?.artworkKey}`;

  return (
    <>
      {isLoading || imgLoading ? <LoadingPage /> : null}
      <div
        cy-data="beat-page-cont"
        className={styles.container}
        style={{ display: isLoading || imgLoading ? 'none' : 'flex' }}
      >
        {beat ? (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
                marginTop: '40px',
              }}
            >
              <BeatMetadata
                title={beat.title}
                artistName={beat.artistName}
                imgSrc={imgSrc}
                url={window.location.href}
              />
              <BackButton />
              {isMobile ? (
                <HomeButton />
              ) : (
                <div style={{ position: 'fixed', top: '10vh', left: '120px' }}>
                  <RandomButton />
                </div>
              )}
              <img
                src={imgSrc}
                alt="album artwork"
                id="beat-artwork"
                // onClick={() => {
                //   isPlaying ? pauseBeat() : playBeat();
                //   dispatch(playback(beat));
                // }}
                onError={({ currentTarget }) => {
                  console.error('error loading img on beat page: \n', currentTarget);
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = artworkLoading;
                }}
                onLoadStart={() => setImgLoading(true)}
                onLoad={() => setImgLoading(false)}
                style={{
                  width: isMobile ? 300 : '33vh',
                  height: isMobile ? 300 : '33vh',
                  pointerEvents: 'none',
                  alignSelf: 'center',
                }}
                className={styles.artwork}
              />

              <h1 className={styles['beat-title']} data-cy="beat-page-title">
                {beat.title}
              </h1>

              <Row className={styles['stats-row']} style={{ justifyContent: 'center' }}>
                <h3 data-cy="beat-page-artist">
                  <a className={styles['beat-artist']} href={`/app/user/?id=${beat.artistId}`}>
                    {beat.artistName}
                  </a>
                </h3>
              </Row>
              {!isMobile ? (
                <Row className={styles['stats-row']}>
                  <BeatDownloadModal
                    artistName={beat.artistName}
                    beatId={beat._id}
                    title={beat.title}
                    onBeatPage={true}
                    license={true}
                    btnStyle={{ position: 'fixed' }}
                  />
                  <SaveBeatButton beatId={beat._id} display="button" />
                </Row>
              ) : null}
              <Row className={styles['stats-row']}>
                <div>
                  <PlayCircleOutlined style={{ fontSize: '1.5vh' }} />
                  <Statistic
                    title="Streams"
                    value={streamsCount}
                    style={{ fontSize: '1.5vh' }}
                    valueStyle={{ fontSize: '1.5vh' }}
                  />
                </div>
                <div>
                  {liked ? (
                    <HeartFilled
                      onClick={() => unlikeBeat()}
                      id="like-beat-btn"
                      style={{ fontSize: '2vh' }}
                      data-cy="beat-page-like-btn"
                    />
                  ) : (
                    <HeartOutlined
                      onClick={() => likeBeat()}
                      id="unlike-beat-btn"
                      style={{ fontSize: '2vh' }}
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
                  <GiTreeBranch style={{ fontSize: '2vh' }} />
                  <Statistic
                    title="Stems"
                    value={beat.hasStems ? 'Available' : 'None :('}
                    valueStyle={{ fontSize: '1.5vh' }}
                  />
                </div>
              </Row>
              {isMobile ? (
                <Row style={{ width: 'clamp(350px, 50vw, 400px)', margin: '5vh 0' }} justify="space-around">
                  <BeatDownloadModal
                    artistName={beat.artistName}
                    beatId={beat._id}
                    title={beat.title}
                    onBeatPage={true}
                    license={true}
                    btnStyle={{ position: 'fixed' }}
                  />
                  <SaveBeatButton beatId={beat._id} display="button" />
                </Row>
              ) : null}
              <Row style={{ justifyContent: 'space-evenly', marginTop: '20px', height: '50px' }}>
                {isMobile ? <RandomButton /> : null}
              </Row>
            </div>
            <div className={styles['suggested-container']}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3>Similar Beats</h3>
                <Tooltip title="Get more similar beats">
                  <RefreshButton beatId={beat._id} setSimilarBeats={setSimilarBeats} setLoading={setSimilarLoading} />
                </Tooltip>
              </div>
              {similarLoading ? <Spin style={{ height: '80vh', width: '100%' }} /> : null}
              {similarBeats
                ? similarBeats.map((beat) => (
                    <DashRow
                      beat={beat}
                      onClick={() => console.log('beat clicked')}
                      buttonType="none"
                      onBeatPage={true}
                    />
                  ))
                : null}
            </div>
          </>
        ) : null}
        {!beat && !isLoading ? <h1 style={{ marginTop: '25vh' }}>No beat found :(</h1> : null}
      </div>
      <PlaybackButtons />
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
