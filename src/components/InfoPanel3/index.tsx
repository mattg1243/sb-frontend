import { Row, Col } from 'antd';
import styles from './Infopanel3.module.css';
import moneyhands from '../../assets/moneyhands.png';

export default function InfoPanel1() {
  return (
    <Row gutter={0} className={styles.row}>
      <Col span={12}>
        <h1 className={styles.header1}>Collect royalties on your beat <em>forever</em>.</h1>
        <p className={styles.paragraph1}>When an artist licenses your beat through Sweatshop Beats, you are entitled to 3%-5% royalties <em>forever</em>.</p>
      </Col>
      <Col span={12}>
        <img className={styles.moneyhands} src={moneyhands} alt="visual.png"/>
      </Col>
    </Row>
  );
}
