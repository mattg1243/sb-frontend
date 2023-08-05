import { Content } from 'antd/lib/layout/layout';
import { Layout, Row, Button, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import orangelogo from '../../../assets/orangelogo.png';
import { useNavigate } from 'react-router-dom';
import Infopanel1 from '../../InfoPanel1';
import Infopanel2 from '../../InfoPanel2';
import Infopanel3 from '../../InfoPanel3';
import SiteFooter from '../../SiteFooter';

import styles from './Splash.module.css';
import Navbar from '../../Navbar';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div id="splash-page">
      <Layout className={styles.layout}>
        <Navbar />
        <Content className={styles.content}>
          <Row gutter={0} className={styles.row}>
            <div className={styles.container}>
              <img src={orangelogo} alt="Orange Music Entertainment Logo" className={styles.logo} />
              <div className={styles.orangetext}>
                <p style={{ margin: '0vw', letterSpacing: '0.5vw', zIndex: '1' }} className={styles.title}>
                  SWEATSHOP BEATS
                </p>
                <p className={styles.subtitle}>THE WORLD'S FIRST BEAT SUBSCRIPTION SITE</p>
                <Space size="large" className={styles.buttonspace}>
                  <Button
                    shape="round"
                    /* Added class for button & removed size attr since edits in html supersede all CSS */
                    className={styles.logButton}
                    id="signup-btn"
                    onClick={() => {
                      navigate('/register');
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button
                    shape="round"
                    /* Added class for button & removed size attr since edits in html supersede all CSS */
                    className={styles.logButton}
                    id="login-btn"
                    onClick={() => {
                      navigate('/login');
                    }}
                  >
                    Login
                  </Button>
                </Space>
              </div>
            </div>
          </Row>
          <Infopanel1 />
          <Infopanel2 />
          <Infopanel3 />
          <SiteFooter />
        </Content>
      </Layout>
    </div>
  );
}
