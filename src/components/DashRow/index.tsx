import { Image, Button, Col, Row } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import BeatEditModal from '../BeatEditModal';
import { Beat } from '../../types/beat';
import { cdnHostname } from '../../config/routing';
import artworkLoading from '../../assets/artwork_loading.jpg';

interface IBeatRowProps {
  beat: Beat,
  onClick: Function,
  editable: boolean,
}

export default function DashRow(props: IBeatRowProps): JSX.Element {
  const { beat, onClick, editable } = props;
  
  const handleDownload = async () => {
    console.log('beat downloaded');
  }

  const handleEdit = () => {
    console.log('edit handled');
  }

  return (
        <Row style={{ width: '80%', maxWidth: '1400px', textAlign: 'center', alignItems: 'center', margin: '15px' }}>
          <Button type='ghost' size='large' style={{ height: '100px', width: '100px', alignContent: 'center' }} onClick={() => { editable ? handleEdit() : handleDownload() }} >
            { editable ? 
              <BeatEditModal beat={beat} />:
              <PlusOutlined style={{ fontSize: '2rem' }} /> 
            }
          </Button>
          <Col span={12} >
            <Row style={{ alignItems: 'center' }}>
              <Image 
                src={`${cdnHostname}/${beat.artworkKey}`} 
                alt="album artwork" 
                placeholder={
                  <Image src={artworkLoading} width={125} height={125} />
                }
                width={125} 
                height={125}
              />
              <h3 onClick={() => {onClick()}} style={{ cursor: 'pointer', margin: '25px' }}>{beat.title} - {beat.artistName}</h3>
            </Row>
          </Col>
          <Col span={2}></Col>
          <Col span={6} style={{ justifyItems: 'center', alignItems: 'end' }}>
            <Row style={{ height: '100%', alignItems: 'center', justifyContent: 'end' }}>
              <h4>{beat.genreTags[0]} | {beat.tempo} BPM | {beat.key}</h4>
            </Row>
          </Col>
        </Row>
  );
}
