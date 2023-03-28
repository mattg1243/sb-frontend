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

type RecAlgos = 'Following' | 'Recommended';

export default function Dashboard() {
  const [trackPlaying, setTrackPlaying] = useState<Beat>();
  const [recAlgo, setRecAlgo] = useState<RecAlgos>('Recommended');

  const { beats } = useGetBeats();

  const algoOptions: MenuProps['items'] = [
    {
      key: 'Recommended',
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            if (recAlgo !== 'Recommended') {
              setRecAlgo('Recommended');
            }
          }}
        >
          Recommended
        </Button>
      ),
    },
    {
      key: 'Following',
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            if (recAlgo !== 'Following') {
              setRecAlgo('Following');
            }
          }}
        >
          Following
        </Button>
      ),
    },
  ];

  return (
    <div data-testid="dashboard" style={{ width: '100%' }}>
      <h2 className={styles['for-you-text']}>For you:</h2>
      <Dropdown menu={{ items: algoOptions }}>
        <Button type="ghost" className={styles['algo-btn']}>
          {recAlgo}
          <DownOutlined />
        </Button>
      </Dropdown>
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
