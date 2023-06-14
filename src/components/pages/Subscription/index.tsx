import styles from './Subscription.module.css';
import { Content, Header } from 'antd/lib/layout/layout';
import { Row, Button, Input, Layout, Spin } from 'antd';
import orangelogo from '../../../assets/orangelogo.png';

export default function Subscription() {
  return (
    <Layout>
      <Content className={styles.content}>
        <img src={orangelogo} alt="logo" className={styles.logo} />
        <h1 className={styles.headie}>Choose the subsciption that's right for you.</h1>
        <Row className={styles.subTiers}>
          <div className={styles.subRows}>
            <h2 className={styles.Text}>Basic</h2>
            <h4 className={styles.subText}>3 credits per month</h4>
            <Button className={styles.buttons}>$24.99/month</Button>
          </div>
          <div className={styles.subRows}>
            <h2 className={styles.Text}>Standard</h2>
            <h4 className={styles.subText}>7 credits per month</h4>
            <Button className={styles.buttons}>$34.99/month</Button>
          </div>
          <div className={styles.subRows}>
            <h2 className={styles.Text}>Premium</h2>
            <h4 className={styles.subText}>12 credits per month</h4>
            <Button className={styles.buttons}>$59.99/month</Button>
          </div>
        </Row>
        <a className={styles.skip} href="./app/dash">
          Skip for now
        </a>
      </Content>
    </Layout>
  );
}
