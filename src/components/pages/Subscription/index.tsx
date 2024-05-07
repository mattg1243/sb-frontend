import styles from './Subscription.module.css';
import { Content } from 'antd/lib/layout/layout';
import { Row, Layout, Menu, Image } from 'antd';
import axios from 'axios';
import gatewayUrl from '../../../config/routing';
import { useNavigate } from 'react-router-dom';
import { getStripeCustIdFromLocalStorage } from '../../../utils/localStorageParser';
import BasicCard from './BasicCard';
import StdCard from './StdCard';
import PremCard from './PremCard';
import Bottom from './Bottom';
import Navbar from '../../Navbar/v2';
import logo from '../../../assets/orangelogo.png';
import { Header } from 'antd/es/layout/layout';

// TDOD make a seperate SubscriptionCard component that takes price, name, and product description as props
export default function Subscription() {
  const navigate = useNavigate();

  const customerId = getStripeCustIdFromLocalStorage();

  const checkoutSubscription = async (subTier: 'basic' | 'std' | 'prem') => {
    try {
      const res = await axios.post(
        `${gatewayUrl}/user/create-subscription`,
        { subTier, customerId },
        { withCredentials: true }
      );
      if (res.data.checkoutUrl) {
        window.location = res.data.checkoutUrl;
      }
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      {window.innerWidth > 480 ? (
        <Navbar />
      ) : (
        <Row
          style={{
            width: '100%',
            margin: 0,
            top: 0,
            height: '75px',
            background: 'black',
            position: 'absolute',
            zIndex: 1000,
            boxShadow: '0px 5px rgb(232, 162, 21)',
          }}
          justify="center"
        >
          <Image
            height="75px"
            width="65px"
            src={logo}
            preview={false}
            onClick={() => {
              navigate('/app/dash');
            }}
          />
        </Row>
        // <Header style={{ width: '100%', margin: 0, top: 100, background: 'black', position: 'fixed' }}>
        //   <Menu theme="dark" mode="horizontal">
        //     <Menu.Item>
        //       <Image
        //         height="45px"
        //         src={logo}
        //         preview={false}
        //         onClick={() => {
        //           navigate('/app/dash');
        //         }}
        //       />
        //     </Menu.Item>
        //   </Menu>
        // </Header>
      )}
      <Content className={styles.content}>
        <h1 className={styles.headie}>Choose the subsciption that's right for you.</h1>
        <Row className={styles.subTiers}>
          <BasicCard checkoutFn={checkoutSubscription} />
          <StdCard checkoutFn={checkoutSubscription} />
          <PremCard checkoutFn={checkoutSubscription} />
        </Row>
        <p style={{ fontSize: 'max(16px, 1vw)', padding: '1.25vh', marginTop: '8vh', textAlign: 'center' }}>
          If you have a referral code, you may enter it after your purchase is successful
        </p>
        <a className={styles.skip} href="javascript:history.back()">
          Skip for now
        </a>
        <Bottom />
      </Content>
    </Layout>
  );
}
