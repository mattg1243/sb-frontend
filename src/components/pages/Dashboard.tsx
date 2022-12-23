import { Content } from 'antd/lib/layout/layout';
import DashRow from '../DashRow';
import { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import PlayBackBar from '../PlaybackBar';
import useGetBeats from '../../hooks/useGetBeats';
import { Spin } from 'antd';
import { cdnHostname } from '../../config/routing';

export default function Dashboard() {
  // TODO: this should hold the actual beat obj to play or null when none are playing
  const [trackPlaying, setTrackPlaying] = useState<string>();

  const { beats } = useGetBeats();

  return (
    <>
      <Navbar />
        <Content style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
          { beats ? beats.map((beat) => {
            return <DashRow beat={beat}  onClick={()=>{setTrackPlaying(`${cdnHostname}/${beat.audioKey}`)}} />;
          }): <Spin />}
        </Content>
        <PlayBackBar 
          trackTitle="Devil in a New Dress" 
          trackArtist='Kanye West' 
          trackSrcUrl={trackPlaying ? trackPlaying: ''}
          isShown={trackPlaying !== undefined}
        />
    </>
  );
}
