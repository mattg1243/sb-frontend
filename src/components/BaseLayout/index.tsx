import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { Content, Footer } from 'antd/es/layout/layout';
import Navbar from '../Navbar';
import styles from './BaseLayout.module.css';
import SiteFooter from '../SiteFooter';
import MobileNav from '../MobileNav';
import PlaybackButtons from '../PlaybackButtons';
import Notification from '../Notification';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { INotificationProps } from '../Notification';
import { selectNotification } from '../../reducers/notificationReducer';
import { useEffect, useState } from 'react';
// redux

const isMobile = window.innerWidth < 480;

export default function BaseLayout() {
  const [displayFooter, setDisplayFooter] = useState<boolean>(true);

  const notificationFromStore = useSelector<RootState, INotificationProps | null>((state) => selectNotification(state));

  const location = useLocation();

  useEffect(() => {
    const onBeatPage = window.location.pathname == '/app/beat';
    if (onBeatPage) {
      setDisplayFooter(false);
    } else {
      setDisplayFooter(true);
    }
  }, [location]);

  return (
    <>
      <Layout className={styles.layout} data-cy="layout">
        <Navbar data-cy="navbar" />
        <Content className={styles.content} data-cy="content">
          {notificationFromStore ? <Notification {...notificationFromStore} /> : null}
          <Outlet />
          <PlaybackButtons />
          {!isMobile && displayFooter ? <SiteFooter /> : null}
        </Content>
        {isMobile && displayFooter ? <MobileNav /> : null}
      </Layout>
    </>
  );
}
