import { Row, Col } from 'antd';
import styles from './Infopanel2.module.css';
import moneygraph from '../../assets/moneygraph.png';

export default function InfoPanel1() {
  return (
    <Row gutter={0} className={styles.row}>
      <Col span={12}>
        <h1 className={styles.header1}>Creators recieve 50% of all revenue generated from subscriptions.*</h1>
        <p className={styles.paragraph1}>The more credits artists spend on your beats, the more you get paid.</p>
        <h5>*See FAQ for more details</h5>
      </Col>
      <Col span={12}>
        <img className={styles.moneygraph} src={moneygraph} alt="visual.png" />
      </Col>
    </Row>
  );
}
