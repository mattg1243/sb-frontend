import styles from './Subscription.module.css';
import { Content } from 'antd/lib/layout/layout';
import { Row, Button, Layout } from 'antd';
import orangelogo from '../../../assets/orangelogo.png';
import axios from 'axios';
import gatewayUrl from '../../../config/routing';
import { useNavigate } from 'react-router-dom';
import { getStripeCustIdFromLocalStorage } from '../../../utils/localStorageParser';
import BasicCard from './BasicCard';
import StdCard from './StdCard';
import PremCard from './PremCard';
import Bottom from './Bottom';
import Navbar from '../../Navbar/v2';

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
      <Navbar />
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
