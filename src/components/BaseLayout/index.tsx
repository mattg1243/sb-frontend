import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import Navbar from '../Navbar';
import styles from './BaseLayout.module.css';
import SiteFooter from '../SiteFooter';
import MobileNav from '../MobileNav';
import PlaybackButtons from '../PlaybackButtons';
// redux

const isMobile = window.innerWidth < 480;

export default function BaseLayout() {
  return (
    <>
      <Layout className={styles.layout} data-cy="layout">
        <Navbar data-cy="navbar" />
        <Content className={styles.content} data-cy="content">
          <Outlet />
          {isMobile ? null : <PlaybackButtons />}
        </Content>
        {isMobile ? <MobileNav /> : <SiteFooter />}
      </Layout>
    </>
  );
}
