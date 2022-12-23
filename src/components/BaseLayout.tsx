import { Layout } from 'antd';

type BaseLayoutProps = { childComp: () => JSX.Element };

export default function BaseLayout(props: BaseLayoutProps) {
  const { childComp: Component } = props;

  return (
    <Layout style={{ width: '100%', height: '100%' }}>
        <Component />
    </Layout>
  );
}
