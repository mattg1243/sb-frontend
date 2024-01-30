import { Row, Col } from 'antd';
import styles from './Infopanel1.module.css';
import piggybank from '../../assets/piggybank.png';

const isMobile = window.innerWidth < 480;

export default function InfoPanel1() {
  return (
    <Row gutter={0} className={styles.row}>
      <Col span={12}>
        <h1 className={styles.header1}>Stop spending $100 to license a single beat.</h1>
        {isMobile ? null : (
          <p className={styles.paragraph1}>
            For as low as $34.99/month, you can license and download multiple beats from professional producers.
          </p>
        )}
      </Col>
      <Col span={12}>
        <img className={styles.piggybank} src={piggybank} alt="visual.png" />
      </Col>
      {isMobile ? (
        <Row style={{ marginTop: '-10vh' }}>
          <p className={styles.paragraph1}>
            For as low as $34.99/month, you can license and download multiple beats from professional producers.
          </p>
        </Row>
      ) : null}
    </Row>
  );
}
