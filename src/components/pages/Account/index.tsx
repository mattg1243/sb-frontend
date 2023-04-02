import { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { Row, Avatar, Button } from 'antd';
import styles from './Account.module.css';
import { Divider } from 'antd';
import DashRow from '../../DashRow';
// import { useState } from 'react';
import { Beat } from '../../../types/beat';
import axios from 'axios';
import gatewayUrl from '../../../config/routing';

export default function AccountPage() {
  // TODO: create a hook so that the trackPlaying state and playbackButton
  // can work across page changes
  // const [trackPlaying, setTrackPlaying] = useState<Beat | undefined>();
  const [creditsBalance, setCreditsBalance] = useState<number>();

  useEffect(() => {
    axios.get(`${gatewayUrl}/user/credits-balance`, { withCredentials: true }).then((res) => {
      setCreditsBalance(res.data.creditBalance);
    });
  }, []);

  const data = [
    {
      month: 'Jan',
      Revenue: 152,
    },
    {
      month: 'Feb',
      Revenue: 232,
    },
    {
      month: 'March',
      Revenue: 78,
    },
    {
      month: 'April',
      Revenue: 280,
    },
    {
      month: 'May',
      Revenue: 153,
    },
    {
      month: 'June',
      Revenue: 200,
    },
  ];
  const chartConfig = {
    data,
    width: 800,
    height: 200,
    xField: 'month',
    yField: 'Revenue',
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    color: 'black',
  };

  // create a beat for testing
  const testBeat: Beat = JSON.parse(
    JSON.stringify({
      _id: '359dd4aa-8b2a-4196-9cf1-de4f991c55ba',
      created_at: '2023-01-21T08:40:50.590Z',
      updated_at: '2023-01-21T10:20:45.888Z',
      title: 'Thriller',
      artworkKey: 'images/1a29769b6c15669886384931327819de',
      audioKey: 'beats/aa0cf1e6703d60ba22be47546066ac44',
      artistId: 'c690083b-4597-478a-9e15-68c61789807c',
      artistName: 'Montana Brown',
      description: 'Hot ass beat clap',
      tempo: 116,
      key: 'A',
      flatOrSharp: '',
      majorOrMinor: 'major',
      genreTags: ['Hip-Hop & Rap', 'Funk', 'Pop'],
      otherTags: null,
      licensed: false,
    })
  );

  const addCredits = async () => {
    try {
      const res = await axios.post(`${gatewayUrl}/user/add-credits`, { creditsToAdd: 10 }, { withCredentials: true });
      console.log(res);
      setCreditsBalance(res.data.creditBalance);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: '80%', marginBottom: '20px' }}>
      <h1 className={`${styles.heading} heading`}>My Account 🔨</h1>
      <p>Credits: {creditsBalance}</p>
      <Button
        onClick={async () => {
          await addCredits();
        }}
      >
        +10 Credits
      </Button>
      <Divider className={`${styles.divider} divider`}>
        <h3>Revenue by Month</h3>
      </Divider>
      <div className="chartcont">
        <Column {...chartConfig} className="revchart" data-cy="chart" />
      </div>
      <Divider className={`${styles.divider} divider`}>
        <h3>Downloaded Beats</h3>
      </Divider>
      <div className={styles['beats-container']}>
        <DashRow beat={testBeat} buttonType="download" onClick={() => console.log('row clicked')} />
        <DashRow beat={testBeat} buttonType="download" onClick={() => console.log('row clicked')} />
        <DashRow beat={testBeat} buttonType="download" onClick={() => console.log('row clicked')} />
      </div>
      <Divider>
        <h3>Following</h3>
      </Divider>
      <div className={`${styles.following} following`}>
        <Row style={{ justifyContent: 'space-around' }}>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <Avatar
              size="large"
              shape="square"
              src="https://d3fulr0i8qqtgb.cloudfront.net/images/f8fbe7320ae08929cc577e7ff18e15ee"
              className={styles['following-avatar']}
            />
            <p>Matt G</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <Avatar
              size="large"
              shape="square"
              src="https://d3fulr0i8qqtgb.cloudfront.net/images/4c1fd8d0142d1f7133adda163c5a6689"
              className={styles['following-avatar']}
            />
            <p>Montana Brown</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <Avatar
              size="large"
              shape="square"
              src="https://d3fulr0i8qqtgb.cloudfront.net/images/8b46e8da307f8904904a63c3bc9a22c7"
              className={styles['following-avatar']}
            />
            <p>Dak</p>
          </div>
        </Row>
      </div>
    </div>
  );
}
