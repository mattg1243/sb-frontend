import { Content } from 'antd/lib/layout/layout';
import { useState, useEffect } from 'react';
import { Row, Avatar, Button, Col, Spin } from 'antd';
import styles from './Account.module.css';
import { Divider } from 'antd';
import { FaStripe } from 'react-icons/fa';
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

export default function AccountPage() {
  // TODO: create a hook so that the trackPlaying state and playbackButton
  // can work across page changes
  // const [trackPlaying, setTrackPlaying] = useState<Beat | undefined>();
  const [creditsBalance, setCreditsBalance] = useState<number>();
  const [subBtnLoading, setSubBtnLoading] = useState<boolean>(false);
  const [connectBtnLoading, setConnectBtnLoading] = useState<boolean>(false);

  const customerId = getStripeCustIdFromLocalStorage();
  const userId = getUserIdFromLocalStorage();
  const subTier = getUserSubTierFromLocalStorage();

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${gatewayUrl}/user/credits-balance`, { withCredentials: true }).then((res) => {
      setCreditsBalance(res.data.creditBalance);
    });
  }, []);

  const getBeatOptions: IUseGetBeatsOptions = {
    userId: userId as string,
    following: false,
    licensed: true,
    take: 3,
    skip: 0,
  };

  const { beats, isLoading: beatsLoading } = useGetBeats(getBeatOptions);

  const openStripePortal = async () => {
    if (!customerId) {
      console.error('No customer id detected while attempting to create a portal session');
      return;
    }
    try {
      const res = await axios.get(`${gatewayUrl}/user/customer-portal?customerId=${customerId}`);
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
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1 className={`${styles.heading} heading`}>My Account</h1>
      <div style={{ width: '75%', marginBottom: '20px' }}>
        {/* <p>Credits: {creditsBalance}</p>
        <Button
          onClick={async () => {
            await addCredits();
          }}
        >
          Add 10 Credits
        </Button> */}
        <Divider className={`${styles.divider} divider`}>
          <h2>Credits</h2>
        </Divider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ fontSize: '2vh' }}>{creditsBalance}</p>
            <h3>Balance</h3>
          </div>
          <div>
            <p style={{ fontSize: '2vh' }}>9</p>
            <h3>Acquired</h3>
          </div>
        </div>
        <div className="chartcont">
          {/* <Bar
            data={data}
            height={400}
            width={600}
            indexBy={'month'}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'dark2' }}
          /> */}
        </div>
        <Divider className={`${styles.divider} divider`}>
          <h2>Licensed Beats</h2>
        </Divider>
        <div className={styles['beats-container']}>
          {/* beats have loaded and len > 0 */}
          {beats && !beatsLoading
            ? beats.map((beat) => {
                return <DashRow beat={beat} buttonType="download" onClick={() => console.log('row clicked')} />;
              })
            : null}
          {/* user has no licensed beats */}
          {!beats && !beatsLoading ? <p>You haven't licensed any beats yet :(</p> : null}
          {/* licensed beats are loading */}
          {beatsLoading ? <Spin /> : null}
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
          <Row style={{ justifyContent: 'space-evenly' }}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <Avatar
                src="https://d3fulr0i8qqtgb.cloudfront.net/images/f8fbe7320ae08929cc577e7ff18e15ee"
                className={styles.useravatar}
                onClick={() => {
                  navigate('/app/user/?id=127a79a2-bcc9-4e9e-8e46-6284f57e7420');
                }}
              />
              <p>Matt G</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <Avatar
                src="https://d3fulr0i8qqtgb.cloudfront.net/images/4c1fd8d0142d1f7133adda163c5a6689"
                className={styles.useravatar}
                onClick={() => {
                  navigate('/app/user/?id=c690083b-4597-478a-9e15-68c61789807c');
                }}
              />
              <p>Montana Brown</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <Avatar
                src="https://d3fulr0i8qqtgb.cloudfront.net/images/8b46e8da307f8904904a63c3bc9a22c7"
                className={styles.useravatar}
                onClick={() => {
                  navigate('/app/user/?id=7ab81fa8-c40d-42ee-b3f5-01765617a2a2');
                }}
              />
              <p>Dak</p>
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
            marginBottom: '5vh',
          }}
        >
          <Col>
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
            {/* this button needs to be its own component that checks wether or not a user 
        already set up their stripe conneced and behaves accordingly */}
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
          </Col>
        </div>
      </div>
    </>
  );
}
