import { Row, Col } from 'antd';
import styles from './Infopanel1.module.css';
import piggybank from '../../assets/piggybank.png';

export default function InfoPanel1() {
  return (
    <Row gutter={0} className={styles.row}>
      <Col span={12}>
        <h1 className={styles.header1}>Stop spending $300 to license a single beat.</h1>
        <p className={styles.paragraph1}>
          For as low as $19.99/month, you can license and download multiple beats from professional artists.
        </p>
      </Col>
      <Col span={12}>
        <img className={styles.piggybank} src={piggybank} alt="visual.png" />
      </Col>
    </Row>
  );
}
