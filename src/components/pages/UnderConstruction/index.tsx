import styles from './UnderConstruction.module.css';
import { Content } from 'antd/lib/layout/layout';
import orangelogo from '../../../assets/orangelogo.png';

export default function UnderConstruction() {
  return (
    <Content className={styles.content}>
      <h1 className={styles.headie}>This page is under construction :(</h1>
      <img src={orangelogo} alt="logo" className={styles.logo} />
    </Content>
  );
}
