import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import RecAlgoMenu from '../../RecAlgoMenu';
import type { RecAlgos } from '../../RecAlgoMenu';
import PlaybackButtons from '../../PlaybackButtons';
import { useDispatch } from 'react-redux';
import { notification as notificationReducer } from '../../../reducers/notificationReducer';
import SubRefModal from '../../SubRefModal';
import BeatScroll from '../../BeatScroll';
import ReactGA from 'react-ga4';

export default function Dashboard() {
  const [currentAlgo, setCurrentAlgo] = useState<RecAlgos>('Recommended');
  const dispatch = useDispatch();

  // check if being redirect after successful subscription purchase
  useEffect(() => {
    const subSuccessRedirect = new URLSearchParams(window.location.search).get('sub-success');
    if (subSuccessRedirect) {
      ReactGA.event('user_sub_purchase');
      dispatch(notificationReducer({ type: 'success', message: 'Your subscription is now live!' }));
    } else {
      return;
    }
  }, []);

  return (
    <div data-testid="dashboard" style={{ width: '100vw' }}>
      <SubRefModal />
      <div>
        <h2 className={styles['for-you-text']}>For You</h2>
        <RecAlgoMenu currentAlgo={currentAlgo} setCurrentAlgo={setCurrentAlgo} />
      </div>
      <PlaybackButtons />
      <BeatScroll currentAlgo={currentAlgo} />
    </div>
  );
}
