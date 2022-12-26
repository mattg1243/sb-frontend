import { Content } from 'antd/lib/layout/layout';
import DashRow from '../DashRow';
import { useState } from 'react';
import Navbar from '../Navbar';
import PlayBackBar from '../PlaybackBar';
import useGetBeats from '../../hooks/useGetBeats';
import { Spin } from 'antd';
import { cdnHostname } from '../../config/routing';
import { Beat } from '../../types/beat';

export default function Dashboard() {
  // TODO: this should hold the actual beat obj to play or null when none are playing
  const [trackPlaying, setTrackPlaying] = useState<Beat>();

  const { beats } = useGetBeats();

  return (
    <>
      <Navbar />
        <Content style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '10px' }}>
          { beats ? beats.map((beat) => {
            return <DashRow beat={beat}  onClick={()=>{setTrackPlaying(beat)}} />;
          }): <Spin  size='large' style={{ color: 'black' }} tip='Loading beats...'/>}
        </Content>
        <PlayBackBar 
          trackTitle={trackPlaying ? trackPlaying.title: ''} 
          trackArtist={trackPlaying ? trackPlaying.artistName: ''} 
          trackSrcUrl={trackPlaying ? `${cdnHostname}/${trackPlaying.audioKey}`: ''}
          isShown={trackPlaying !== undefined}
        />
    </>
  );
}
