import DashRow from '../../DashRow';
import { useState } from 'react';
import useGetBeats from '../../../hooks/useGetBeats';
import { Spin } from 'antd';
import styles from './Dashboard.module.css';
import RecAlgoMenu from '../../RecAlgoMenu';
import type { RecAlgos } from '../../RecAlgoMenu';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import { useDispatch } from 'react-redux';
import { playback } from '../../../reducers/playbackReducer';

export default function Dashboard() {
  const [currentAlgo, setCurrentAlgo] = useState<RecAlgos>('Recommended');

  const userId = getUserIdFromLocalStorage();

  const dispatch = useDispatch();

  const { beats, isLoading } = useGetBeats(
    currentAlgo === 'Following' ? (userId as string) : undefined,
    currentAlgo == 'Following' ? true : false
  );

  return (
    <div data-testid="dashboard" style={{ width: '100%' }}>
      <h2 className={styles['for-you-text']}>For you:</h2>
      <RecAlgoMenu currentAlgo={currentAlgo} setCurrentAlgo={setCurrentAlgo} />
      <div className={styles['beats-container']}>
        {beats ? (
          beats.map((beat) => {
            return (
              <DashRow
                beat={beat}
                onClick={() => {
                  dispatch(playback(beat));
                }}
                buttonType="download"
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
