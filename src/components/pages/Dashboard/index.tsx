import DashRow from '../../DashRow';
import { useEffect, useState } from 'react';
import useGetBeats from '../../../hooks/useGetBeats';
import { Spin, Tooltip } from 'antd';
import styles from './Dashboard.module.css';
import RecAlgoMenu from '../../RecAlgoMenu';
import type { RecAlgos } from '../../RecAlgoMenu';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import { useDispatch, useSelector } from 'react-redux';
import { playback } from '../../../reducers/playbackReducer';
import { beats as beatsReducer } from '../../../reducers/beatsReducer';
import { Beat } from '../../../types';
import { CloseOutlined } from '@ant-design/icons';

export default function Dashboard() {
  const [currentAlgo, setCurrentAlgo] = useState<RecAlgos>('Recommended');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const userId = getUserIdFromLocalStorage();

  const dispatch = useDispatch();

  const { beats, isLoading } = useGetBeats(
    currentAlgo === 'Following' ? (userId as string) : undefined,
    currentAlgo == 'Following' ? true : false
  );

  const beatsFromSearch = useSelector<{ beats: { beats: Beat[] | null } }, Beat[] | null>((state) => state.beats.beats);

  useEffect(() => {
    if (beatsFromSearch) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  });

  return (
    <div data-testid="dashboard" style={{ width: '100%' }}>
      <h2 className={styles['for-you-text']}>For you</h2>
      <RecAlgoMenu currentAlgo={currentAlgo} setCurrentAlgo={setCurrentAlgo} />
      {isSearching ? (
        <Tooltip title="Exit search">
          <button
            onClick={() => {
              setIsSearching(false);
              dispatch(beatsReducer(null));
            }}
            className={styles['exit-search-btn']}
            style={{ animationDuration: '0s !important' }}
          >
            <CloseOutlined />
          </button>
        </Tooltip>
      ) : null}
      <div className={styles['beats-container']}>
        {isSearching && beatsFromSearch !== null ? (
          <>
            {beatsFromSearch.map((beat) => {
              return (
                <DashRow
                  beat={beat}
                  onClick={() => {
                    dispatch(playback(beat));
                  }}
                  buttonType="download"
                  key={beat._id}
                />
              );
            })}
          </>
        ) : null}
        {(isSearching && beatsFromSearch === null) || beatsFromSearch?.length === 0 ? (
          <h3 style={{ marginTop: '10vh' }}>No beats match that search :(</h3>
        ) : null}
        {beats && !isSearching ? (
          beats.map((beat) => {
            return (
              <DashRow
                beat={beat}
                onClick={() => {
                  dispatch(playback(beat));
                }}
                buttonType="download"
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
