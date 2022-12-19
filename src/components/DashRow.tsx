import { Card, Space, Image, Button } from 'antd';
import ReactAudioPlayer from 'react-audio-player';
import logo from '../assets/logo_four_squares.png';
import { PlusOutlined } from '@ant-design/icons';

interface IBeatRowProps {
  beat: any,
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
          <Image src={logo} alt="album artwork" width="8rem" />
          <Space direction="vertical" size="small" style={{ display: 'flex' }}>
            <Card style={{ background: 'var(--primary', border: 'none' }}>
              <Space direction="horizontal" align="start">
                <Space direction="vertical">
                  <h3 onClick={() => {onClick()}} style={{ cursor: 'pointer' }}>Devil in a New Dress - Kanye West</h3>
                </Space>
                <Space align="end" />
                <p>Hip-Hop & Rap | 145bpm</p>
              </Space>
            </Card>
          </Space>
        </Space>
      </Space>
    </div>
  );
}
