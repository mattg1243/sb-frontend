import { Row, Col } from 'antd';
import styles from './Infopanel2.module.css';
import moneygraph from '../../assets/moneygraph.png';

const isMobile = window.innerWidth < 480;

export default function InfoPanel2() {
  return (
    <Row gutter={0} className={styles.row}>
      <Col span={12}>
        <h1 className={styles.header1}>Creators recieve 50% of all revenue generated from subscriptions.*</h1>
        {isMobile ? null : (
          <>
            {' '}
            <p className={styles.paragraph1}>The more credits artists spend on your beats, the more you get paid.</p>
            <h5>
              *See <a href="/faq">FAQ</a> for more details
            </h5>
          </>
        )}
      </Col>
      <Col span={12}>
        <img className={styles.moneygraph} src={moneygraph} alt="visual.png" />
      </Col>
      {isMobile ? (
        <Row style={{ marginTop: '-10vh' }}>
          <p className={styles.paragraph1}>The more credits artists spend on your beats, the more you get paid.</p>
          <h5>
            *See <a href="/faq">FAQ</a> for more details
          </h5>
        </Row>
      ) : null}
    </Row>
  );
}
