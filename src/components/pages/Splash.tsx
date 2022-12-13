import { Content, Header } from 'antd/lib/layout/layout';
import { Layout, Row, Col, Button } from 'antd';
import logo from '../../assets/logo_four_squares.png';
import { useNavigate } from 'react-router-dom';
import InfoPanel1 from '../InfoPanel1';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <Layout style={{ padding: '2rem' }}>
      <Header style={{ background: 'var(--primary)', fontSize: '2rem', marginTop: '1rem' }}>Sweatshop Beats</Header>
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
            <Row gutter={10} style={{ paddingLeft: '4rem', paddingTop: '2rem' }}>
              <Col span={8}>
                <Button
                  shape="round"
                  size="large"
                  style={{ width: '200px', height: '65px', fontWeight: 'bold' }}
                  onClick={() => {
                    navigate('/register');
                  }}
                >
                  Sign Up
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  shape="round"
                  style={{ width: '200px', height: '65px', fontWeight: 'bold' }}
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  Login
                </Button>
              </Col>
            </Row>
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
