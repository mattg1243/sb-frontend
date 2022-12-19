import { Layout } from 'antd';
import React from 'react';

type BaseLayoutProps = { childComp: () => JSX.Element };

const { Header, Footer, Sider, Content } = Layout;

export default function BaseLayout(props: BaseLayoutProps) {
  const { childComp: Component } = props;

  return (
    <Layout style={{ width: '100%', height: '100%' }}>
        <Component />
    </Layout>
  );
}
