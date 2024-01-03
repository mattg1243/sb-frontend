import styles from './Subscription.module.css';
import { Content } from 'antd/lib/layout/layout';
import { Row, Button, Layout } from 'antd';
import orangelogo from '../../../assets/orangelogo.png';
import axios from 'axios';
import gatewayUrl from '../../../config/routing';
import { useNavigate } from 'react-router-dom';
import { getStripeCustIdFromLocalStorage } from '../../../utils/localStorageParser';

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
      <Content className={styles.content}>
        <img src={orangelogo} alt="logo" className={styles.logo} />
        <h1 className={styles.headie}>Choose the subsciption that's right for you.</h1>
        <Row className={styles.subTiers}>
          <div className={styles.subRows}>
            <h2 className={styles.Text}>Basic</h2>
            <h4 className={styles.subText3}>3 credits per month</h4>
            <Button
              className={styles.buttons}
              onClick={() => {
                checkoutSubscription('basic');
              }}
            >
              $34.99/month
            </Button>
          </div>
          <div className={styles.subRows}>
            <h2 className={styles.Text}>Standard</h2>
            <h4 className={styles.subText}>5 credits per month</h4>
            <h4 className={styles.subText2}>1 credit = 1 beat of your choice</h4>
            <Button
              className={styles.buttons}
              onClick={() => {
                checkoutSubscription('std');
              }}
            >
              $54.99/month
            </Button>
          </div>
          <div className={styles.subRows}>
            <h2 className={styles.Text}>Premium</h2>
            <h4 className={styles.subText3}>9 credits per month</h4>
            <Button
              className={styles.buttons}
              onClick={() => {
                checkoutSubscription('prem');
              }}
            >
              $89.99/month
            </Button>
          </div>
        </Row>
        {window.innerWidth < 480 ? null : (
          <p style={{ fontSize: 'max(12px, 1vw)', padding: '1.25vh' }}>
            If you have a referral code, you may enter it after your purchase is successful
          </p>
        )}
        <a className={styles.skip} href="javascript:history.back()">
          Skip for now
        </a>
      </Content>
    </Layout>
  );
}
