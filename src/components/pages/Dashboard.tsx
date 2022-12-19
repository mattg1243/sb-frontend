import { Content } from 'antd/lib/layout/layout';
import DashRow from '../DashRow';
import { useState } from 'react';
import Navbar from '../Navbar';
import PlayBackBar from '../PlaybackBar';

export default function Dashboard() {
  // TODO: this should hold the actual beat obj to play or null when none are playing
  const [trackPlaying, setTrackPlaying] = useState<boolean>(false);
  const [beats, getBeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const testClick = () => { console.log('click registered') }

  const topTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <>
      <Navbar />
        <Content style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {topTen.map((beat) => {
            return <DashRow beat={beat}  onClick={()=>{setTrackPlaying(true)}} />;
          })}
        </Content>
        <PlayBackBar 
          trackTitle="Devil in a New Dress" 
          trackArtist='Kanye West' 
          trackSrcUrl='https://d3fulr0i8qqtgb.cloudfront.net/beats/c5127337c7cf68db6697f6345663f4e7'
          isShown={trackPlaying}
        />
    </>
  );
}
