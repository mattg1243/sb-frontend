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
      {buttonType === 'edit' ? (
        <BeatEditModal beat={beat} />
      ) : (
        <BeatDownloadModal title={beat.title} artistName={beat.artistName} cdnKey={beat.audioKey} />
      )}
      <Col span={12}>
        <Row style={{ alignItems: 'center' }}>
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
            width={125}
            height={125}
            onClick={(e) => {
              onClick(e);
            }}
            className={styles.artwork}
          />
          <h3
            onClick={(e) => {
              onClick(e);
            }}
            className={styles.title}
          >
            {beat.title} -{' '}
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
            </a>
          </h3>
        </Row>
      </Col>
      <Col span={2}></Col>
      <Col span={6} style={{ justifyItems: 'center', alignItems: 'end' }}>
        <Row className={styles['info-row']}>
          <h4 className={styles['info-text']}>
            {beat.genreTags[0]} | {beat.tempo} BPM | {beat.key}
            {displayFlatOrSharp(beat.flatOrSharp)} {beat.majorOrMinor}
          </h4>
        </Row>
      </Col>
    </Row>
  );
}
