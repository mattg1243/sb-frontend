import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import Navbar from '../Navbar';
import styles from './BaseLayout.module.css';

export default function BaseLayout() {
  return (
    <Layout style={{ width: '100%', height: '100%' }}>
      <Navbar />
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}
