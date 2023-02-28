import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import Navbar from '../Navbar';
import styles from './BaseLayout.module.css';

export default function BaseLayout() {
  return (
    <Layout className={styles.layout} data-cy="layout">
      <Navbar data-cy="navbar" />
      <Content className={styles.content} data-cy="content">
        <Outlet />
      </Content>
    </Layout>
  );
}
