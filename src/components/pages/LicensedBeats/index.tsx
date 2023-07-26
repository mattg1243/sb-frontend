import { Spin } from 'antd';
import useGetBeats from '../../../hooks/useGetBeats';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import DashRow from '../../DashRow';
import styles from './LicensedBeatPage.module.css';

export default function LicensedBeatsPage() {
  const userId = getUserIdFromLocalStorage();
  const { beats, isLoading } = useGetBeats(userId, false, 100, true);

  return (
    <div style={{ width: '100%' }}>
      <h2 className={styles.heading}>Licensed Beats</h2>
      <div className={styles['beats-container']}>
        {/* beats have loaded and len > 0 */}
        {beats && !isLoading
          ? beats.map((beat) => {
              return <DashRow beat={beat} buttonType="download" onClick={() => console.log('row clicked')} />;
            })
          : null}
        {/* user has no licensed beats */}
        {!beats && !isLoading ? <p>You haven't licensed any beats yet :(</p> : null}
        {/* licensed beats are loading */}
        {isLoading ? <Spin /> : null}
      </div>
    </div>
  );
}
