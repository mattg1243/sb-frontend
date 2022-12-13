import { Card, Space, Image } from 'antd';
import ReactAudioPlayer from 'react-audio-player';
import logo from '../assets/logo_four_squares.png';

export default function DashRow(props: { beat: any }): JSX.Element {
  const beat = props.beat;

  return (
    <div className="space-align-container">
      <Space direction="vertical" size="middle">
        <Space direction="horizontal">
          <Image src={logo} alt="album artwork" width="8rem" style={{ border: 'solid' }} />
          <Space direction="vertical" size="small" style={{ display: 'flex' }}>
            <Card style={{ background: 'var(--primary', borderRadius: '16px', borderColor: 'black', margin: '1rem' }}>
              <Space direction="horizontal" align="start">
                <Space direction="vertical">
                  <h3>Devil in a New Dress - Kanye West</h3>
                  <p>3:26</p>
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
