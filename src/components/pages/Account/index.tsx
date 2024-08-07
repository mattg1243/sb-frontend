import { Content } from 'antd/lib/layout/layout';
import { useState, useEffect } from 'react';
import { Row, Avatar, Button, Col, Spin, Tooltip, message } from 'antd';
import styles from './Account.module.css';
import { Divider } from 'antd';
import DashRow from '../../DashRow';
// import { useState } from 'react';
import axios from 'axios';
import gatewayUrl from '../../../config/routing';
import {
  getStripeCustIdFromLocalStorage,
  getUserIdFromLocalStorage,
  getUserSubTierFromLocalStorage,
} from '../../../utils/localStorageParser';
import useGetBeats, { IUseGetBeatsOptions } from '../../../hooks/useGetBeats';
import { useNavigate } from 'react-router-dom';
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer } from 'recharts';
import { getSubRefCodeReq } from '../../../lib/axios';
import PayPalConnectBtn from './PayPalConnectBtn';
import ReactGA from 'react-ga4';
import { Beat } from '../../../types';

export default function AccountPage() {
  // TODO: create a hook so that the trackPlaying state and playbackButton
  // can work across page changes
  // const [trackPlaying, setTrackPlaying] = useState<Beat | undefined>();
  const [creditsBalance, setCreditsBalance] = useState<number>();
  const [subBtnLoading, setSubBtnLoading] = useState<boolean>(false);
  const [connectBtnLoading, setConnectBtnLoading] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string>();
  // message API
  const [messageApi, contextHolder] = message.useMessage();

  const promoCopiedMsg = () => {
    messageApi.success('Promo code copied!');
  };

  const customerId = getStripeCustIdFromLocalStorage();
  const userId = getUserIdFromLocalStorage();
  const subTier = getUserSubTierFromLocalStorage();

  const isMobile = window.innerWidth < 480;

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${gatewayUrl}/user/credits-balance`, { withCredentials: true })
      .then((res) => {
        setCreditsBalance(res.data.creditBalance);
      })
      .catch((err) => console.error(err));
    getSubRefCodeReq()
      .then((res) => setReferralCode(res.data as string))
      .catch((err) => console.error(err));
  }, []);

  const getBeatOptions: IUseGetBeatsOptions = {
    userId: userId as string,
    following: false,
    take: 3,
    skip: 0,
  };

  const getLicensedBeatOptions: IUseGetBeatsOptions = {
    ...getBeatOptions,
    licensed: true,
  };

  const getSavedBeatOptions: IUseGetBeatsOptions = {
    ...getBeatOptions,
    saved: true,
  };

  const { beats: licensedBeats, isLoading: licensedBeatsLoading } = useGetBeats(getLicensedBeatOptions);
  const { beats: savedBeats, isLoading: savedBeatsLoading } = useGetBeats(getSavedBeatOptions);

  const openStripePortal = async () => {
    if (!customerId) {
      console.error('No customer id detected while attempting to create a portal session');
      return;
    }
    try {
      const res = await axios.get(`${gatewayUrl}/user/customer-portal?customerId=${customerId}`);
      ReactGA.event('user_paypal_connect', { user_id: userId });
      window.location = res.data.url;
    } catch (err) {
      console.error(err);
    }
  };

  const createStripeConnectAcct = async () => {
    try {
      const res = await axios.post(`${gatewayUrl}/user/create-stripe-connect-acct`, {}, { withCredentials: true });
      if (res.data.url) {
        window.location = res.data.url;
      }
      ReactGA.event('user_stripe_connect', { user_id: userId });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {contextHolder}
      <h1 className={`${styles.heading} heading`}>My Account</h1>
      <div className={styles.container}>
        {/* <p>Credits: {creditsBalance}</p>
        <Button
          onClick={async () => {
            await addCredits();
          }}
        >
          Add 10 Credits
        </Button> */}
        <Divider className={`${styles.divider} divider`}>
          <h2>Saved Beats</h2>
        </Divider>
        <div className={styles['beats-container']}>
          {/* beats have loaded and len > 0 */}
          {savedBeats && !savedBeatsLoading
            ? savedBeats.slice(0, 3).map((beat) => {
                return <DashRow beat={beat} buttonType="none" onClick={() => console.log('row clicked')} />;
              })
            : null}
          {/* user has no licensed beats */}
          {!savedBeats && !savedBeatsLoading ? <p>No saved beats found</p> : null}
          {/* licensed beats are loading */}
          {savedBeatsLoading ? <Spin /> : null}
          {/* <DashRow beat={testBeat} buttonType="download" onClick={() => console.log('row clicked')} />
          <DashRow beat={testBeat} buttonType="download" onClick={() => console.log('row clicked')} />
          <DashRow beat={testBeat} buttonType="download" onClick={() => console.log('row clicked')} /> */}
          <Button
            className={styles.btn}
            onClick={() => {
              navigate('/app/saved-beats');
            }}
          >
            View All
          </Button>
        </div>
        <Divider className={`${styles.divider} divider`}>
          <h2>Licensed Beats</h2>
        </Divider>
        <div className={styles['beats-container']}>
          {/* beats have loaded and len > 0 */}
          {licensedBeats && !licensedBeatsLoading
            ? licensedBeats.slice(0, 3).map((beat) => {
                return <DashRow beat={beat} buttonType="none" onClick={() => console.log('row clicked')} />;
              })
            : null}
          {/* user has no licensed beats */}
          {!licensedBeats && !licensedBeatsLoading ? <p>You haven't licensed any beats yet :(</p> : null}
          {/* licensed beats are loading */}
          {licensedBeatsLoading ? <Spin /> : null}
          {/* <DashRow beat={testBeat} buttonType="download" onClick={() => console.log('row clicked')} />
          <DashRow beat={testBeat} buttonType="download" onClick={() => console.log('row clicked')} />
          <DashRow beat={testBeat} buttonType="download" onClick={() => console.log('row clicked')} /> */}
          <Button
            className={styles.btn}
            onClick={() => {
              navigate('/app/licensed-beats');
            }}
          >
            View All
          </Button>
        </div>

        <Divider>
          <h2>Following</h2>
        </Divider>
        <div className={`${styles.following} following`}>
          <Row justify="space-evenly">
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
              <Avatar
                src="https://d3fulr0i8qqtgb.cloudfront.net/images/f8fbe7320ae08929cc577e7ff18e15ee"
                className={styles['following-avatar']}
                onClick={() => {
                  navigate('/app/user/?id=127a79a2-bcc9-4e9e-8e46-6284f57e7420');
                }}
              />
              <p className={styles['artist-name']}>Matt G</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
              <Avatar
                src="https://d3fulr0i8qqtgb.cloudfront.net/images/4c1fd8d0142d1f7133adda163c5a6689"
                className={styles['following-avatar']}
                onClick={() => {
                  navigate('/app/user/?id=c690083b-4597-478a-9e15-68c61789807c');
                }}
              />
              <p className={styles['artist-name']}>Montana Brown</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
              <Avatar
                src="https://d3fulr0i8qqtgb.cloudfront.net/images/8b46e8da307f8904904a63c3bc9a22c7"
                className={styles['following-avatar']}
                onClick={() => {
                  navigate('/app/user/?id=7ab81fa8-c40d-42ee-b3f5-01765617a2a2');
                }}
              />
              <p className={styles['artist-name']}>Dak</p>
            </div>
          </Row>
        </div>
        <Divider>
          <h2>Settings</h2>
        </Divider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '5vh',
            width: '100%',
          }}
        >
          <Col>
            <Row>
              <Button
                onClick={async () => {
                  setSubBtnLoading(true);
                  if (subTier) {
                    try {
                      await openStripePortal();
                    } catch (err) {
                      console.error(err);
                    }
                  } else {
                    navigate('/subscriptions');
                  }
                  setSubBtnLoading(false);
                }}
                className={styles.btn}
                loading={subBtnLoading}
              >
                {subTier ? 'Manage Subscription' : 'Purchase Subscription'}
              </Button>
            </Row>
            {/* this button needs to be its own component that checks wether or not a user 
        already set up their stripe conneced and behaves accordingly */}
            <Row>
              <Button
                onClick={async () => {
                  setConnectBtnLoading(true);
                  try {
                    await createStripeConnectAcct();
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setConnectBtnLoading(false);
                  }
                }}
                className={styles.btn}
                loading={connectBtnLoading}
              >
                Connect Stripe Payout
              </Button>
            </Row>
            <Row>
              <PayPalConnectBtn />
            </Row>
          </Col>
        </div>
        <Divider>
          <h2>Referral Code</h2>
        </Divider>
        <Col style={{ textAlign: 'center' }}>
          {referralCode ? (
            <Tooltip title="Click to copy">
              <div
                style={{ fontSize: '1.7vh' }}
                onClick={() => {
                  navigator.clipboard.writeText(referralCode);
                  promoCopiedMsg();
                }}
              >
                {referralCode}
              </div>
            </Tooltip>
          ) : (
            <Spin />
          )}
        </Col>
      </div>
    </>
  );
}
