import { Footer } from 'antd/es/layout/layout';
import ReactAudioPlayer from 'react-audio-player';

interface IPlayBackBarProps {
  trackTitle: string, 
  trackArtist: string,
  trackSrcUrl: string,
  isShown: boolean,
}

export default function PlayBackBar(props: IPlayBackBarProps) {

  const {trackTitle, trackArtist, trackSrcUrl, isShown } = props;

  return (
    <>
    {
    isShown ? 
    <Footer 
      style={{ 
          position: 'fixed', 
          left: 0, 
          bottom: 0, 
          width: '100%', 
          textAlign: 'center', 
          background: 'black', 
          color: 'white' 
        }}
        >
      <p>{trackTitle}</p>
      <p>{trackArtist}</p>
      <ReactAudioPlayer 
        src={trackSrcUrl}
        style={{ color: 'white', background: 'white'}} 
        controls={true}
        autoPlay={true}
        controlsList='nodownload'
      />
    </Footer> :
    null
    }
    </>
  )
}