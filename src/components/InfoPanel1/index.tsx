import { Row, Col } from 'antd';
import logo from '../../assets/logo_four_squares.png';

export default function InfoPanel1() {
  return (
    <Row gutter={0} style={{ width: '100%', maxWidth: '2000px', justifyContent: 'center' }}>
      <Col span={12}>
        <h1 style={{ fontSize: '3.34vw', paddingLeft: '4rem', maxWidth: '570px' }}>Creators recieve 50% of all revenue generated from subscriptions.</h1>
        <p style={{ marginTop: '1rem', marginBottom: '230px', fontSize: '1.67vw', paddingLeft: '4rem', maxWidth: '570px' }}>The more credits artists spend on your beats, the more you get paid.</p>
      </Col>
      <Col span={12}>
        <img src={logo} alt="logo" width={500} style={{ marginBottom: '1rem', width: '30vw', height: 'auto' }} />
      </Col>
    </Row>
  );
}
