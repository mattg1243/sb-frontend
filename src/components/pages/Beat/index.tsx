import { useState, useEffect } from 'react';
import { Row, Image, Divider, Statistic, Spin } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { GiTreeBranch } from 'react-icons/gi';
import type { Beat } from '../../../types';
import styles from './BeatPage.module.css';
import { cdnHostname } from '../../../config/routing';
import artworkLoading from '../../../assets/artwork_loading.jpg';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getBeatReq, getUserLikesBeatReq, likeBeatReq, unlikeBeatReq } from '../../../lib/axios';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';

const isMobile: boolean = window.innerWidth < 1024;

export default function BeatPage() {
  const beatId = new URLSearchParams(window.location.search).get('id');
  const userId = getUserIdFromLocalStorage();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>();
  const [beat, setBeat] = useState<Beat>();
  const [likesCount, setLikesCount] = useState<number>();
  const [streamsCount, setStreamsCount] = useState<number>();

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

  const likeBeat = async () => {
    if (beat && likesCount) {
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
    }
  };

  const unlikeBeat = async () => {
    setLiked(false);
    if (beat && likesCount) {
      try {
        const res = await unlikeBeatReq(beat._id);
        setLikesCount(likesCount - 1);
        console.log(res);
      } catch (err) {
        setLiked(true);
        console.log(err);
      }
    }
  };

  return (
    <>
      <div style={{ height: '100%', width: '50%', marginTop: '17vh', textAlign: 'center' }}>
        {beat && !isLoading ? (
          <>
            <Image
              src={`${cdnHostname}/${beat.artworkKey}`}
              alt="album artwork"
              placeholder={<Image src={artworkLoading} width={isMobile ? 250 : 400} height={isMobile ? 250 : 400} />}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = artworkLoading;
              }}
              width={isMobile ? 250 : 400}
              height={isMobile ? 250 : 400}
              preview={{ visible: false }}
              className={styles.artwork}
            />
            <h1 style={{ marginTop: '3vh' }}>{beat.title}</h1>
            <h3>{beat.artistName}</h3>
            <Divider />
            <Row style={{ justifyContent: 'space-evenly' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'centers' }}>
                <PlayCircleOutlined style={{ fontSize: '2.5vh', marginBottom: '10px' }} />
                <Statistic title="Streams" value={streamsCount} valueStyle={{ fontSize: '1.5vh' }} />
              </div>
              <div>
                {liked ? (
                  <HeartFilled
                    onClick={() => unlikeBeat()}
                    id="like-beat-btn"
                    style={{ fontSize: '2.5vh', marginBottom: '10px' }}
                  />
                ) : (
                  <HeartOutlined
                    onClick={() => likeBeat()}
                    id="unlike-beat-btn"
                    style={{ fontSize: '2.5vh', marginBottom: '10px' }}
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
