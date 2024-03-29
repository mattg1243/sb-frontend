import { Content, Header } from 'antd/lib/layout/layout';
import { Layout, Row, Col, Button, Space } from 'antd';
import Navbar from '../../Navbar';
import styles from './Contact.module.css';
import logo from '../../../assets/orangelogo.png';

export default function Contact() {
  return (
    <Layout>
      <Navbar />
      <Content>
        <div className={styles.container}>
          <div>
            <p className={styles.text}>Support or general inquiries:</p>
            <p className={styles.link}>
              <a href="mailto:info@orangemusicent.com">info@orangemusicent.com</a>
            </p>
            <p className={styles.text}>Business inquiries:</p>
            <p className={styles.link}>
              <a href="mailto:montanabrown@orangemusicent.com">montanabrown@orangemusicent.com</a>
            </p>
            <h3 className={styles.FAQ}>
              <a className={styles.linkFAQ} href="/FAQ">
                Frequently asked questions
              </a>
            </h3>
          </div>
          <div className={styles.logoContainer}>
            <img src={logo} alt="Logo" className={styles.logo}></img>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
