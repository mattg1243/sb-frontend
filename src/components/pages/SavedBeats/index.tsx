import { IUseGetBeatsOptions } from '../../../hooks/useGetBeats';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import styles from './SavedBeats.module.css';
import BeatContainer from '../../BeatContainer';

export default function SavedBeatsPage() {
  const userId = getUserIdFromLocalStorage();

  const getBeatsOptions: IUseGetBeatsOptions = {
    userId: userId as string,
    following: false,
    saved: true,
  };

  return (
    <div style={{ width: '100%' }}>
      <h2 className={styles.heading}>Saved Beats</h2>
      <BeatContainer options={getBeatsOptions} />
    </div>
  );
}
