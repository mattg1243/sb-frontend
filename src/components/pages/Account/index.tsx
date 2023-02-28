import { Column } from '@ant-design/plots';
import { Spin } from 'antd';
import styles from './Account.module.css';
import { Divider } from 'antd';
import DashRow from '../../DashRow';
import { useState } from 'react';
import { Beat } from '../../../types/beat';

export default function AccountPage() {
  // TODO: create a hook so that the trackPlaying state and playbackButton
  // can work across page changes
  const [trackPlaying, setTrackPlaying] = useState<Beat | undefined>();

  const data = [
    {
      month: 'Jan',
      rev: 152,
    },
    {
      month: 'Feb',
      rev: 232,
    },
    {
      month: 'March',
      rev: 78,
    },
    {
      month: 'April',
      rev: 280,
    },
    {
      month: 'May',
      rev: 153,
    },
    {
      month: 'June',
      rev: 200,
    },
  ];
  const config = {
    data,
    width: 800,
    height: 200,
    xField: 'month',
    yField: 'rev',
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    color: 'black',
  };

  return (
    <div style={{ width: '80%' }}>
      <h1 className={`${styles.heading} heading`}>My Account 🔨</h1>
      <Divider className={`${styles.divider} divider`}>
        <h3>Revenue by Month</h3>
      </Divider>
      <div className="chartcont">
        <Column {...config} className="revchart" data-cy="chart" />
      </div>
      <Divider className={`${styles.divider} divider`}>
        <h3>Downloaded Beats</h3>
      </Divider>
    </div>
  );
}
