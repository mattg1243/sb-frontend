import InfiniteScroll from 'react-infinite-scroll-component';
import DashRow from '../DashRow';
import { UpOutlined, DownOutlined, DownloadOutlined } from '@ant-design/icons';
import { playback } from '../../reducers/playbackReducer';
import useGetBeats, { IUseGetBeatsOptions } from '../../hooks/useGetBeats';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import gatewayUrl from '../../config/routing';
import { RecAlgos } from '../RecAlgoMenu';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import type { Beat } from '../../types';
import styles from './BeatScroll.module.css';

interface IBeatScrollProps {
  currentAlgo: RecAlgos;
}

export default function BeatScroll(props: IBeatScrollProps) {
  const { currentAlgo } = props;

  const [pageNum, setPageNum] = useState<number>(1);
  const [moreBeatsToLoad, setMoreBeatsToLoad] = useState<boolean>(true);
  const [scrollBtnUp, setScrollBtnUp] = useState<boolean>(true);

  const dispatch = useDispatch();

  const userId = getUserIdFromLocalStorage();
  const isMobile = window.innerWidth < 480;
  const beatsPerPage = isMobile ? 12 : window.innerWidth < 770 ? 5 : 8;

  const getBeatOptions: IUseGetBeatsOptions = {
    userId: currentAlgo === 'Following' ? (userId as string) : undefined,
    following: currentAlgo == 'Following' ? true : false,
    take: beatsPerPage,
    skip: 0,
  };

  const { beats, isLoading } = useGetBeats(getBeatOptions);

  const fetchMoreBeats = async () => {
    try {
      const res = await axios.get(`${gatewayUrl}/beats/beats?skip=${pageNum * beatsPerPage}&take=${beatsPerPage}`);
      const beatsFromRes = res.data as Array<Beat>;
      if (beatsFromRes.length === 0) {
        setMoreBeatsToLoad(false);
      } else {
        beats?.push(...res.data);
        setPageNum(pageNum + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const beatPlayingFromState = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );

  useEffect(() => {
    return () => {
      dispatch(playback(null));
    };
  }, []);

  const playingBeatDashRow = document.getElementById(`dashrow-${beatPlayingFromState?._id}`);

  const handleScroll = () => {
    if (playingBeatDashRow) {
      const targetPos = playingBeatDashRow?.getBoundingClientRect().top;
      setScrollBtnUp(targetPos < window.innerHeight / 2);
    }
  };

  const scrollDiv = document.getElementsByClassName('scroll-div');
  scrollDiv?.item(0)?.addEventListener('scroll', handleScroll);

  const scrollToPlayingBeat = () => {
    if (beatPlayingFromState) {
      playingBeatDashRow?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // return user to the correct spot in the page on back navigation
  // const infiniteScrollRef = useRef<HTMLDivElement>(null);
  // let initialScrollPos = 0;

  // useEffect(() => {
  //   const scrollPosition = sessionStorage.getItem('for-you-scroll-pos');
  //   if (scrollPosition && infiniteScrollRef.current) {
  //     initialScrollPos = parseInt(scrollPosition, 10);
  //   }
  //   // set the scroll pos when page component is unmounted
  //   return () => {
  //     if (infiniteScrollRef.current) {
  //       sessionStorage.setItem('for-you-scroll-pos', infiniteScrollRef.current.scrollTop.toString());
  //     }
  //   };
  // }, []);

  return (
    <div
      style={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'auto',
      }}
      id="scrollableDiv"
    >
      {beatPlayingFromState && isMobile ? (
        <button className={styles['scroll-btn']} onClick={() => scrollToPlayingBeat()}>
          {scrollBtnUp ? <UpOutlined /> : <DownOutlined />}
        </button>
      ) : null}
      <InfiniteScroll
        dataLength={beats?.length || 8}
        next={fetchMoreBeats}
        hasMore={moreBeatsToLoad}
        style={{
          flexDirection: 'column',
          textAlign: 'start',
        }}
        scrollableTarget="scrollableDiv"
        scrollThreshold={0.8}
        loader={<h4>Loading beats...</h4>}
        endMessage={<p>You've seen all the beats!</p>}
        className={`${styles['beats-container']} scroll-div`}
        data-cy="beats-container"
      >
        {beats
          ? beats.map((beat) => {
              return (
                <DashRow
                  beat={beat}
                  onClick={() => {
                    dispatch(playback(beat));
                  }}
                  buttonType="license"
                  key={beat._id}
                />
              );
            })
          : null}
      </InfiniteScroll>
    </div>
  );
}
