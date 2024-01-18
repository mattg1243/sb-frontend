import { Layout, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import CustomAlert from '../CustomAlert';

export default function LoadingPage() {
  const [timedOut, setTimedOut] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setTimedOut(true);
    }, 10000);
  });

  return (
    <Layout
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        justifyContent: 'cetner',
        alignItems: 'center',
      }}
    >
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          justifyContent: 'cetner',
          alignItems: 'center',
        }}
      >
        <Spin tip={'Loading your page...'} size="large" style={{ color: 'black', marginTop: '25%' }} />
        {timedOut ? (
          <CustomAlert
            message="This page is taking a lot longer than it should to load. Please try again or contact support."
            type="error"
          />
        ) : null}
      </Content>
    </Layout>
  );
}
