import DashRow from '../../DashRow';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useGetBeats, { IUseGetBeatsOptions } from '../../../hooks/useGetBeats';
import { Spin, Tooltip } from 'antd';
import styles from './Dashboard.module.css';
import RecAlgoMenu from '../../RecAlgoMenu';
import type { RecAlgos } from '../../RecAlgoMenu';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import { useDispatch, useSelector } from 'react-redux';
import { playback } from '../../../reducers/playbackReducer';
import { Beat, User } from '../../../types';
import { CloseOutlined } from '@ant-design/icons';
import SearchFilter, { type SearchFilterOptions } from '../../SearchFilter';
import {
  selectBeats,
  selectIsSearching,
  selectUsers,
  searching as searchingReducer,
  beats as beatsSearchReducer,
  users as usersSearchReducer,
  selectSearchQuery,
  searchFilters,
  selectSearchIsLoading,
} from '../../../reducers/searchReducer';
import { notification as notificationReducer } from '../../../reducers/notificationReducer';
import { matchSorter } from 'match-sorter';
import { RootState } from '../../../store';
import UserRow from '../../UserRow';
import SearchBeatFilter, { SearchBeatFilterOptions } from '../../SearchBeatFilter';
import InfiniteScroll from 'react-infinite-scroll-component';
import gatewayUrl from '../../../config/routing';

export default function Dashboard() {
  const [currentAlgo, setCurrentAlgo] = useState<RecAlgos>('Recommended');
  const [currentSearchFilter, setCurrentSearchFilter] = useState<SearchFilterOptions>('Beats');
  const [currentSearchBeatFilter, setCurrentSearchBeatFilter] = useState<SearchBeatFilterOptions | null>({});
  const [allFromSearch, setAllFromSeach] = useState<Array<Beat | User>>([]);
  const [sortedAllFromSearch, setSortedAllFromSearch] = useState<Array<Beat | User>>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [moreBeatsToLoad, setMoreBeatsToLoad] = useState<boolean>(true);
  // const [isSearching, setIsSearching] = useState<boolean>();

  const userId = getUserIdFromLocalStorage();
  const isMobile = window.innerWidth < 480;
  const beatsPerPage = isMobile ? 12 : window.innerWidth < 770 ? 5 : 8;

  const dispatch = useDispatch();

  const getBeatOptions: IUseGetBeatsOptions = {
    userId: currentAlgo === 'Following' ? (userId as string) : undefined,
    following: currentAlgo == 'Following' ? true : false,
    take: beatsPerPage,
    skip: 0,
  };

  const { beats, isLoading } = useGetBeats(getBeatOptions);

  const beatsFromSearch = useSelector<RootState, Beat[] | null>((state) => selectBeats(state));
  const usersFromSearch = useSelector<RootState, User[] | null>((state) => selectUsers(state));
  const searchQuery = useSelector<RootState, string | null>((state) => selectSearchQuery(state));
  const isSearching = useSelector<RootState, boolean>((state) => selectIsSearching(state));
  const searchIsLoading = useSelector<RootState, boolean>((state) => selectSearchIsLoading(state));
  // const usersFromSearch = useSelector<{ users}>

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

  useEffect(() => {
    const allResults: (User | Beat)[] = [];
    if (beatsFromSearch) {
      allResults.push(...beatsFromSearch);
    }
    if (usersFromSearch) {
      allResults.push(...usersFromSearch);
    }
    setSortedAllFromSearch(
      matchSorter(allResults, searchQuery as string, {
        keys: ['title', 'artistName'],
      })
    );
    console.log('query: ', searchQuery);
    console.log('sorted: ', sortedAllFromSearch);
    console.log('all: ', allResults);
  }, [beatsFromSearch, usersFromSearch]);

  // check if being redirect after successful subscription purchase
  useEffect(() => {
    const subSuccessRedirect = new URLSearchParams(window.location.search).get('sub-success');
    if (subSuccessRedirect) {
      dispatch(notificationReducer({ type: 'success', message: 'Your subscription is now live!' }));
    } else {
      return;
    }
  }, []);

  return (
    <div data-testid="dashboard" style={{ width: '100vw' }}>
      <div>
        <h2 className={styles['for-you-text']}>{isSearching ? 'Search results' : 'For you'}</h2>
        {isSearching ? (
          <div style={{ position: 'fixed', top: '13vh' }}>
            {!isMobile ? (
              <>
                <SearchFilter
                  currentSearchFilter={currentSearchFilter}
                  setCurrentSearchFilter={setCurrentSearchFilter}
                />
                <Tooltip title="Exit search">
                  <button
                    onClick={() => {
                      dispatch(searchingReducer(false));
                      dispatch(searchFilters(null));
                      dispatch(beatsSearchReducer(null));
                      dispatch(usersSearchReducer(null));
                      setCurrentSearchBeatFilter(null);
                    }}
                    className={styles['exit-search-btn']}
                    style={{ animationDuration: '0s !important' }}
                  >
                    <CloseOutlined />
                  </button>
                </Tooltip>
              </>
            ) : null}
          </div>
        ) : (
          <RecAlgoMenu currentAlgo={currentAlgo} setCurrentAlgo={setCurrentAlgo} />
        )}
      </div>
      {isSearching && !isMobile ? <></> : null}
      {!isMobile ? (
        <SearchBeatFilter
          currentSearchBeatFilter={currentSearchBeatFilter}
          setCurrentSearchBeatFilter={setCurrentSearchBeatFilter}
        />
      ) : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
          overflowX: 'hidden',
        }}
        id="scroll-div"
      >
        <InfiniteScroll
          dataLength={beats?.length || 8}
          next={fetchMoreBeats}
          hasMore={moreBeatsToLoad}
          height="100vh"
          style={{
            paddingBottom: '5vh',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: isMobile ? '0' : '-20vw',
            overflowX: 'hidden',
          }}
          scrollThreshold={0.8}
          loader={<h4 style={{ marginLeft: isMobile ? '0' : '-26vw' }}>Loading beats...</h4>}
          endMessage={<p style={{ marginLeft: isMobile ? '0' : '-26vw' }}>You've seen all the beats!</p>}
          className={styles['beats-container']}
          data-cy="beats-container"
        >
          {isSearching && beatsFromSearch !== null && currentSearchFilter === 'Beats' ? (
            <>
              {beatsFromSearch.map((beat) => {
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
              })}
            </>
          ) : null}
          {isSearching && usersFromSearch !== null && currentSearchFilter === 'Users' ? (
            <>
              {usersFromSearch.map((user) => {
                return <UserRow user={user} />;
              })}
            </>
          ) : null}
          {isSearching && allFromSearch !== null && currentSearchFilter === 'All' ? (
            <>
              {sortedAllFromSearch.map((result) => {
                if ('creditsToSpend' in result) {
                  return <UserRow user={result as User} />;
                } else {
                  return (
                    <DashRow
                      beat={result as Beat}
                      onClick={() => {
                        dispatch(playback(result as Beat));
                      }}
                      buttonType="license"
                    />
                  );
                }
              })}
            </>
          ) : null}
          {/* display no beats found message when searching beats */}
          {(isSearching && beatsFromSearch === null && !searchIsLoading) ||
          (beatsFromSearch?.length === 0 && currentSearchFilter === 'Beats' && !searchIsLoading) ? (
            <h3 style={{ marginTop: '10vh' }}>No beats match that search :(</h3>
          ) : null}
          {/* no users found message when searching users */}
          {(isSearching && currentSearchFilter == 'Users') ||
          (currentSearchFilter == 'All' && usersFromSearch === null) ||
          (usersFromSearch?.length === 0 && currentSearchFilter === 'Users' && !searchIsLoading) ? (
            <h3 style={{ marginTop: '10vh' }}>No users match that search :(</h3>
          ) : null}
          {/* nothing found when searching all */}
          {(isSearching && usersFromSearch === null && beatsFromSearch === null && !searchIsLoading) ||
          (usersFromSearch?.length === 0 && beatsFromSearch?.length === 0 && currentSearchFilter === 'All') ? (
            <h3 style={{ marginTop: '10vh' }}>Nothing matches that search :(</h3>
          ) : null}
          {/* search is loading */}
          {beats && !isSearching ? (
            // <InfiniteScroll
            // dataLength={beats.length}
            // next={fetchMoreBeats}
            // hasMore={true}
            // height={'70vh'}
            // loader={<h4>Loading beats...</h4>}
            // endMessage={<p>You've seen all the beats!</p>}
            // >

            beats.map((beat) => {
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
          ) : isLoading || searchIsLoading ? (
            <>
              <Spin size="large" tip="Loading beats..." spinning={true} style={{ marginTop: '35vh' }} />
              <p>Loading beats...</p>
            </>
          ) : null}
        </InfiniteScroll>
      </div>
    </div>
  );
}
