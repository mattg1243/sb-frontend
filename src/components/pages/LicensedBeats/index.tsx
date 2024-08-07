import { IUseGetBeatsOptions } from '../../../hooks/useGetBeats';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import styles from './LicensedBeatPage.module.css';
import BeatContainer from '../../BeatContainer';

export default function LicensedBeatsPage() {
  const userId = getUserIdFromLocalStorage();

  const getBeatsOptions: IUseGetBeatsOptions = {
    userId: userId as string,
    following: false,
    take: 10,
    licensed: true,
  };

  return (
    <div style={{ width: '100%' }}>
      <h2 className={styles.heading}>Licensed Beats</h2>
      <BeatContainer options={getBeatsOptions} />
    </div>
  );
}
