import { Row, Col } from 'antd';
import logo from '../assets/logo_four_squares.png';

export default function InfoPanel1() {
  return (
    <Row gutter={100} style={{ width: '100%', maxWidth: '2000px', justifyContent: 'center' }}>
      <Col span={12}>
        <h1 style={{ fontSize: '4rem', paddingLeft: '4rem', maxWidth: '700px' }}>Creators recieve 50% of all revenue generate from subscriptions.</h1>
        <p style={{ marginTop: '1rem', fontSize: '2rem', paddingLeft: '4rem', maxWidth: '700px' }}>The more credits artists spend on your beats, the more you get paid.</p>
      </Col>
      <Col span={12}>
        <img src={logo} alt="logo" width={500} style={{ marginBottom: '1rem' }} />
      </Col>
    </Row>
  );
}
