import { Content, Header } from 'antd/lib/layout/layout';
import { Layout, Row, Col, Button, Space } from 'antd';
import logo from '../../../assets/logo_four_squares.png';
import { useNavigate } from 'react-router-dom';
import InfoPanel1 from '../../InfoPanel1';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <Layout style={{ padding: '2rem' }}>
      <Content
        style={{
          marginTop: '10%',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Row gutter={150} style={{ height: '100vh', width: '100%', maxWidth: '2000px', justifyContent: 'center' }}>
          <Col span={12}>
            <h1 style={{ marginTop: '5rem', fontSize: '5rem', paddingLeft: '4rem', maxWidth: '700px' }}>
              The First Beat Subscription Site
            </h1>
            <Space size='large' style={{ paddingTop: '2rem', paddingLeft: '4rem' }}>
                <Button
                  shape="round"
                  size="large"
                  style={{ width: '10rem', height: '4rem', fontWeight: 'bold' }}
                  onClick={() => {
                    navigate('/register');
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  shape="round"
                  style={{ width: '10rem', height: '4rem', fontWeight: 'bold' }}
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  Login
                </Button>
            </Space>
          </Col>
          <Col span={12}>
            <img src={logo} alt="logo" width={600} style={{ marginBottom: '100%' }} />
          </Col>
        </Row>
        <InfoPanel1 />
      </Content>
    </Layout>
  );
}
