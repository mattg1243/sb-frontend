import { Content, Header } from 'antd/lib/layout/layout';
import { Layout, Row, Col, Button, Space } from 'antd';
import orangelogo from '../../../assets/orangelogo.png';
import { useNavigate } from 'react-router-dom';
import Infopanel1 from '../../InfoPanel1';
import Infopanel2 from '../../InfoPanel2';
import Infopanel3 from '../../InfoPanel3';
                
import styles from './Splash.module.css';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Row gutter={0} className={styles.row}>
		  <div className={styles.container}>
            <img src={orangelogo} alt="Orange Music Entertainment Logo" style={{ width:'40vw', height: 'auto'}}/>
            <div className={styles.orangetext}>
              <p style={{fontSize: '8vw', margin: '0vw', letterSpacing: '0.5vw'}}>SWEATSHOP BEATS</p>
			  <p style={{fontSize: '2.1vw', paddingLeft: '18vw', margin: '0vw', letterSpacing: '0.25vw'}}>THE WORLD'S FIRST BEAT SUBSCRIPTION SITE</p>
			  <Space size='large' className={styles.buttonspace}>
                <Button
                  shape="round"
                  size="large"
				  style={{ width: '16vw', height: '3.75vw', fontWeight: 'bold', fontSize: '1.2vw' }}
                  onClick={() => {
                    navigate('/register');
                  }}>
                  Sign Up
                </Button>
                <Button
                  shape="round"
				  size="large"
				  style={{ width: '16vw', height: '3.75vw', fontWeight: 'bold', fontSize: '1.2vw' }}
                  onClick={() => {
                    navigate('/login');
                  }}>
                  Login
                </Button>
              </Space>
            </div>
		  </div>
        </Row>
	  <Infopanel1 />
	  <Infopanel2 />
	  <Infopanel3 />
      </Content>
    </Layout>
  );
}