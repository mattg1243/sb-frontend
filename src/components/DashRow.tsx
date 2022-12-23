import { Card, Space, Image, Button } from 'antd';
import logo from '../assets/logo_four_squares.png';
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
    <div>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space direction="horizontal">
          <Button type='ghost' size='large'>
            <PlusOutlined />
          </Button>
          <Image src={`${cdnHostname}/${beat.artworkKey}`} alt="album artwork" width="8rem" />
          <Space direction="vertical" size="small" style={{ display: 'flex' }}>
            <Card style={{ background: 'var(--primary', border: 'none' }}>
              <Space direction="horizontal" align="start">
                <Space direction="vertical">
                  <h3 onClick={() => {onClick()}} style={{ cursor: 'pointer' }}>{beat.title}</h3>
                </Space>
                <Space align="end" />
                <p>{beat.genreTags[0]} | {beat.tempo} BPM</p>
              </Space>
            </Card>
          </Space>
        </Space>
      </Space>
    </div>
  );
}
