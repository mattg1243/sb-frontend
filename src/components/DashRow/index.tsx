import { Image, Col, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BeatEditModal from '../BeatEditModal';
import { Beat } from '../../types/beat';
import { cdnHostname } from '../../config/routing';
import artworkLoading from '../../assets/artwork_loading.jpg';
import { useState } from 'react';
import playIcon from '../../assets/play_black.png';
import styles from './DashRow.module.css';
import BeatDownloadModal from '../BeatDownloadModal';

interface IBeatRowProps {
  beat: Beat;
  onClick: React.MouseEventHandler<HTMLHeadingElement>;
  buttonType: 'edit' | 'download';
}

const isMobile: boolean = window.innerWidth < 480;

export default function DashRow(props: IBeatRowProps): JSX.Element {
  const [artistNameColor, setArtistNameColor] = useState<'black' | 'blue'>('black');

  const { beat, onClick, buttonType } = props;

  const displayFlatOrSharp = (flatOrSharpStr: 'flat' | 'sharp' | '') => {
    if (flatOrSharpStr === '') {
      return flatOrSharpStr;
    } else if (flatOrSharpStr === 'sharp') {
      return '#';
    } else {
      return '♭';
    }
  };

  return (
    <Row className={styles['row-container']}>
      {isMobile ? null : buttonType === 'edit' ? (
        <BeatEditModal beat={beat} />
      ) : (
        <BeatDownloadModal title={beat.title} artistName={beat.artistName} cdnKey={beat.audioKey} />
      )}
      <Row style={{ alignItems: 'center', marginRight: 'auto', paddingLeft: '1vw' }}>
        <Image
          src={`${cdnHostname}/${beat.artworkKey}`}
          alt="album artwork"
          preview={{
            mask: <Image src={playIcon} preview={false} />,
          }}
          placeholder={<Image src={artworkLoading} width={125} height={125} />}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = artworkLoading;
          }}
          width={isMobile ? 75 : 125}
          height={isMobile ? 75 : 125}
          onClick={(e) => {
            onClick(e);
          }}
          className={styles.artwork}
        />
        <div className={styles['text-container']}>
          <h3
            onClick={(e) => {
              onClick(e);
            }}
            className={styles.title}
          >
            {beat.title}
          </h3>
          <h4 className={styles['info-text']}>
            <a
              style={{ color: artistNameColor }}
              onMouseOver={() => {
                setArtistNameColor('blue');
              }}
              onMouseLeave={() => {
                setArtistNameColor('black');
              }}
              href={`/app/user/?id=${beat.artistId}`}
            >
              {beat.artistName}
            </a>{' '}
            |{isMobile ? null : ` ${beat.genreTags[0]} |`} {beat.key}
            {displayFlatOrSharp(beat.flatOrSharp)} {beat.majorOrMinor} {isMobile ? null : `| ${beat.tempo} bpm`}
          </h4>
        </div>
      </Row>
    </Row>
  );
}
