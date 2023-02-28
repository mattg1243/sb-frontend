import { Image, Col, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BeatEditModal from '../BeatEditModal';
import { Beat } from '../../types/beat';
import { cdnHostname } from '../../config/routing';
import artworkLoading from '../../assets/artwork_loading.jpg';
import { useState } from 'react';
import playIcon from '../../assets/play_black.png';
import styles from './DashRow.module.css';

interface IBeatRowProps {
  beat: Beat;
  onClick: React.MouseEventHandler<HTMLHeadingElement>;
  editable: boolean;
}

export default function DashRow(props: IBeatRowProps): JSX.Element {
  const [artistNameColor, setArtistNameColor] = useState<'black' | 'blue'>('black');

  const { beat, onClick, editable } = props;

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
      {editable ? <BeatEditModal beat={beat} /> : <PlusOutlined className={styles['download-button']} />}
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
              href={`/user/?id=${beat.artistId}`}
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
