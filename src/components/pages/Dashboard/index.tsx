import { Content } from 'antd/es/layout/layout';
import { Layout } from 'antd';
import DashRow from '../../DashRow';
import { useState } from 'react';
import Navbar from '../../Navbar';
import PlayBackBar from '../../PlaybackBar';
import useGetBeats from '../../../hooks/useGetBeats';
import { Spin } from 'antd';
import { cdnHostname } from '../../../config/routing';
import { Beat } from '../../../types/beat';
import PlaybackButtons from '../../PlaybackButtons/PlaybackButtons';

export default function Dashboard() {
  // TODO: this should hold the actual beat obj to play or null when none are playing
  const [trackPlaying, setTrackPlaying] = useState<Beat>();

  const { beats } = useGetBeats();

  return (
    <div data-testid='dashboard' style={{ width: '100%' }}>
      <Layout>
      <Navbar />
        <Content style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '10px' }}>
          <h2 style={{ alignSelf: 'flex-start', marginLeft: '14rem', fontSize: '3rem' }}>For you:</h2>
          { beats ? beats.map((beat) => {
            return <DashRow beat={beat}  onClick={()=>{setTrackPlaying(beat)}} editable={false} />;
          }): <Spin size='large' tip='Loading beats...'/>}
        </Content>
        {trackPlaying ?
        <PlaybackButtons 
          trackTitle={trackPlaying ? trackPlaying.title: ''} 
          trackArtist={trackPlaying ? trackPlaying.artistName: ''} 
          trackSrcUrl={trackPlaying ? `${cdnHostname}/${trackPlaying.audioKey}`: ''}
        /> : null}
        </Layout>
    </div>
  );
}
