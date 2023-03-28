// import { Content } from 'antd/es/layout/layout';
// import { Layout } from 'antd';
import DashRow from '../../DashRow';
import { useState } from 'react';
// import Navbar from '../../Navbar';
import useGetBeats from '../../../hooks/useGetBeats';
import { Button, Dropdown, MenuProps, Spin } from 'antd';
import { cdnHostname } from '../../../config/routing';
import { Beat } from '../../../types/beat';
import PlaybackButtons from '../../PlaybackButtons';
import styles from './Dashboard.module.css';
import { DownOutlined } from '@ant-design/icons';
import RecAlgoMenu from '../../RecAlgoMenu';
import type { RecAlgos } from '../../RecAlgoMenu';

export default function Dashboard() {
  const [trackPlaying, setTrackPlaying] = useState<Beat>();
  const [currentAlgo, setCurrentAlgo] = useState<RecAlgos>('Recommended');

  const { beats } = useGetBeats();

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
                  setTrackPlaying(beat);
                }}
                buttonType="download"
              />
            );
          })
        ) : (
          <Spin size="large" tip="Loading beats..." />
        )}
      </div>
      {trackPlaying ? (
        <PlaybackButtons
          trackTitle={trackPlaying ? trackPlaying.title : ''}
          trackArtist={trackPlaying ? trackPlaying.artistName : ''}
          trackSrcUrl={trackPlaying ? `${cdnHostname}/${trackPlaying.audioKey}` : ''}
        />
      ) : null}
    </div>
  );
}
