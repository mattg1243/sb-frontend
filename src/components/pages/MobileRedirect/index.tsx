import { Content, Header } from 'antd/lib/layout/layout';
import { Layout, Row, Col, Button, Space } from 'antd';
import styles from './MobileRedirect.module.css';
import orangelogo from '../../../assets/orangelogo.png';

export default function MobileRedirect() {
  return (
    <Layout>
      <Content>
        <header></header>
        <div className={styles.container}>
          <h1>Come back later!</h1>
          <p>This site is not yet functional on mobile.</p>
          <img src={orangelogo} alt="OrangeLogo" className={styles.orange} />
        </div>
      </Content>
    </Layout>
  );
}
