import { Image, Button, Col, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Beat } from '../types/beat';
import { cdnHostname } from '../config/routing';

interface IBeatRowProps {
  beat: Beat,
  onClick: Function,
}

export default function DashRow(props: IBeatRowProps): JSX.Element {
  const { beat, onClick } = props;
  
  return (
        <Row style={{ width: '80%', maxWidth: '1400px', textAlign: 'center', margin: '15px' }}>
          <Button type='ghost' size='large'>
            <PlusOutlined />
          </Button>
          <Col span={12} >
            <Row style={{ alignItems: 'center' }}>
              <Image src={`${cdnHostname}/${beat.artworkKey}`} alt="album artwork" width={125} height={125}/>
              <h3 onClick={() => {onClick()}} style={{ cursor: 'pointer', margin: '15px' }}>{beat.title} - {beat.artistName}</h3>
            </Row>
          </Col>
          <Col span={2}></Col>
          <Col span={6} style={{ justifyItems: 'center', alignItems: 'end' }}>
            <Row style={{ height: '100%', alignItems: 'center', justifyContent: 'end' }}>
              <p>{beat.genreTags[0]} | {beat.tempo} BPM | {beat.key}</p>
            </Row>
          </Col>
        </Row>
  );
}
