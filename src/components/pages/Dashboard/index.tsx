import DashRow from '../../DashRow';
import { useState, useEffect } from 'react';
import useGetBeats from '../../../hooks/useGetBeats';
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
} from '../../../reducers/searchReducer';
import { notification as notificationReducer } from '../../../reducers/notificationReducer';
import { matchSorter } from 'match-sorter';
import { RootState } from '../../../store';
import UserRow from '../../UserRow';

export default function Dashboard() {
  const [currentAlgo, setCurrentAlgo] = useState<RecAlgos>('Recommended');
  const [currentSearchFilter, setCurrentSearchFilter] = useState<SearchFilterOptions>('Beats');
  const [allFromSearch, setAllFromSeach] = useState<Array<Beat | User>>([]);
  const [sortedAllFromSearch, setSortedAllFromSearch] = useState<Array<Beat | User>>([]);
  // const [isSearching, setIsSearching] = useState<boolean>();

  const userId = getUserIdFromLocalStorage();

  const dispatch = useDispatch();

  const { beats, isLoading } = useGetBeats(
    currentAlgo === 'Following' ? (userId as string) : undefined,
    currentAlgo == 'Following' ? true : false
  );

  const beatsFromSearch = useSelector<RootState, Beat[] | null>((state) => selectBeats(state));
  const usersFromSearch = useSelector<RootState, User[] | null>((state) => selectUsers(state));
  const searchQuery = useSelector<RootState, string | null>((state) => selectSearchQuery(state));
  const isSearching = useSelector<RootState, boolean>((state) => selectIsSearching(state));
  // const usersFromSearch = useSelector<{ users}>

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
    <div data-testid="dashboard" style={{ width: '100%' }}>
      <h2 className={styles['for-you-text']}>For you</h2>
      {isSearching ? (
        <SearchFilter currentSearchFilter={currentSearchFilter} setCurrentSearchFilter={setCurrentSearchFilter} />
      ) : (
        <RecAlgoMenu currentAlgo={currentAlgo} setCurrentAlgo={setCurrentAlgo} />
      )}
      {isSearching ? (
        <Tooltip title="Exit search">
          <button
            onClick={() => {
              dispatch(searchingReducer(false));
              dispatch(beatsSearchReducer(null));
              dispatch(usersSearchReducer(null));
            }}
            className={styles['exit-search-btn']}
            style={{ animationDuration: '0s !important' }}
          >
            <CloseOutlined />
          </button>
        </Tooltip>
      ) : null}
      <div className={styles['beats-container']} data-cy="beats-container">
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
        {(isSearching && beatsFromSearch === null) ||
        (beatsFromSearch?.length === 0 && currentSearchFilter === 'Beats') ? (
          <h3 style={{ marginTop: '10vh' }}>No beats match that search :(</h3>
        ) : null}
        {/* no users found message when searching users */}
        {(isSearching && usersFromSearch === null) ||
        (usersFromSearch?.length === 0 && currentSearchFilter === 'Users') ? (
          <h3 style={{ marginTop: '10vh' }}>No users match that search :(</h3>
        ) : null}
        {/* nothing found when searching all */}
        {(isSearching && usersFromSearch === null && beatsFromSearch === null) ||
        (usersFromSearch?.length === 0 && beatsFromSearch?.length === 0 && currentSearchFilter === 'All') ? (
          <h3 style={{ marginTop: '10vh' }}>Nothing matches that search :(</h3>
        ) : null}
        {beats && !isSearching ? (
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
        ) : (
          <Spin size="large" tip="Loading beats..." spinning={isLoading} />
        )}
      </div>
    </div>
  );
}
