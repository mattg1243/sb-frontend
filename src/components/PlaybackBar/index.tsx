import { Button, Drawer } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';
import ReactAudioPlayer from 'react-audio-player';
import { useState } from 'react';

interface IPlayBackBarProps {
  trackTitle: string;
  trackArtist: string;
  trackSrcUrl: string;
  isShown: boolean;
}

export default function PlayBackBar(props: IPlayBackBarProps) {
  const { trackTitle, trackArtist, trackSrcUrl, isShown } = props;

  const [isShownState, setIsShownState] = useState<boolean>(isShown);

  return (
    <div style={{ height: '200px' }} className="container-playback">
      <Button
        style={{ position: 'fixed', bottom: '0', background: 'var(--primary)', borderColor: 'black' }}
        onClick={() => {
          setIsShownState(!isShownState);
        }}
      >
        <CaretUpOutlined size={5} />
      </Button>
      <Drawer
        placement="bottom"
        closable={true}
        onClose={() => {
          setIsShownState(false);
        }}
        open={isShownState}
        mask={false}
        height="200px"
        style={{
          textAlign: 'center',
          color: 'white',
        }}
      >
        <p>{trackTitle}</p>
        <p>{trackArtist}</p>
        <ReactAudioPlayer
          src={trackSrcUrl}
          style={{ color: 'white', background: 'white' }}
          controls={true}
          autoPlay={true}
          controlsList="nodownload"
        />
      </Drawer>{' '}
      :
    </div>
  );
}
