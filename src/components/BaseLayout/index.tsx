import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
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
// redux

const isMobile = window.innerWidth < 480;

export default function BaseLayout() {
  const notificationFromStore = useSelector<RootState, INotificationProps | null>((state) => selectNotification(state));

  return (
    <>
      <Layout className={styles.layout} data-cy="layout">
        <Navbar data-cy="navbar" />
        <Content className={styles.content} data-cy="content">
          {notificationFromStore ? <Notification {...notificationFromStore} /> : null}
          <Outlet />
          {isMobile ? null : <PlaybackButtons />}
        </Content>
        {isMobile ? <MobileNav /> : <SiteFooter />}
      </Layout>
    </>
  );
}
