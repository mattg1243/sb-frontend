import { Layout } from 'antd';
import Navbar from '../Navbar';
import { Content } from 'antd/es/layout/layout';

type BaseLayoutProps = { childComp: () => JSX.Element };

export default function BaseLayout(props: BaseLayoutProps) {
  const { childComp: Component } = props;

  return (
    <Layout style={{ width: '100%', height: '100%' }}>
        <Navbar />
        <Content style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '10px' }}>
          <Component />
        </Content>
    </Layout>
  );
}
