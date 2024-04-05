import { Image } from 'antd';
import { imgCdnHostName } from '../../config/routing';
import { useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import type { Beat } from '../../types';
import styles from './DashRow.module.css';
import artworkLoading from '../../assets/artwork_loading.jpg';
import playIcon from '../../assets/play_black.png';
import pauseIcon from '../../assets/pause_black.png';

interface IArtworkProps {
  beatId: string;
  artworkKey: string;
  isPlaying: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export default function Artwork(props: IArtworkProps) {
  const { beatId, artworkKey, isPlaying, isLoading, onClick } = props;

  const isMobile = window.innerWidth < 480;
  const imgSize = isMobile ? 75 : 125;

  const artworkFallbacks = [`${imgCdnHostName}/${artworkKey}`, artworkLoading];
  let fallbackIndex = 0;

  // get beatPlaying from redux store
  const beatPlayingFromState = useSelector<{ playback: { trackPlaying: Beat | null } }, Beat | null>(
    (state) => state.playback.trackPlaying
  );

  const AudioPlayingAnimation = () => {
    return (
      <div className={styles['playing-animation']}>
        <span className={`${styles['playing__bar']} ${styles['playing__bar1']}`}></span>
        <span className={`${styles['playing__bar']} ${styles['playing__bar2']}`}></span>
        <span className={`${styles['playing__bar']} ${styles['playing__bar3']}`}></span>
      </div>
    );
  };

  return (
    <div className={styles['image-container']}>
      <Image
        src={`${imgCdnHostName}/fit-in/125x125/${artworkKey}` || `${imgCdnHostName}/${artworkKey}`}
        alt="album artwork"
        preview={{
          mask: <Image src={isPlaying ? pauseIcon : playIcon} preview={false} />,
          visible: false,
        }}
        placeholder={<Image src={artworkLoading} width={imgSize} height={imgSize} />}
        onError={({ currentTarget }) => {
          const next = artworkFallbacks[fallbackIndex];
          currentTarget.src = next;
          fallbackIndex++;
        }}
        width={imgSize}
        height={imgSize}
        // onClick={(e) => {
        //   playBeat(e);
        // }}
        onClick={() => {
          onClick();
        }}
        className={styles.artwork}
        data-cy="beat-artwork"
      />
      {isLoading ? <LoadingOutlined className={styles['playing-animation']} /> : null}
      {isPlaying && beatPlayingFromState?._id == beatId ? (
        <div className={styles['playing-animation']}>
          {/* Your overlay content here. This could be another React component or any JSX. */}
          <AudioPlayingAnimation />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
