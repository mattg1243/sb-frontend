import { Content } from 'antd/lib/layout/layout';
import { Layout, Button } from 'antd';
import { useEffect, useState } from 'react';
import { resendVerificationEmailReq } from '../../../lib/axios';
import { getUserEmailFromLocalStorage, getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import { useNavigate } from 'react-router-dom';
import gatewayUrl from '../../../config/routing';
import axios from 'axios';
import styles from './VerifyEmail.module.css';
import logo from '../../../assets/orangelogo.png';

export default function VerifyEmail() {
  const userId = getUserIdFromLocalStorage();
  const email = getUserEmailFromLocalStorage();
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');

  const navigate = useNavigate();

  useEffect(() => {
    // check if on mobile safari
    const redir = new URLSearchParams().get('redir');
    const safariAgent = navigator.userAgent.indexOf('Safari') > -1;
    const isMobile = window.innerWidth < 480;
    if (safariAgent && isMobile && !redir) {
      window.open(window.location.href + '&redir=true', '_system');
    } else if (code) {
      axios
        .get(`${gatewayUrl}/user/verify-email?code=${code}&user=${userId}&email=${email}`)
        .then(() => {
          {
            window.location.href = '/login';
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });

  const resendEmail = async () => {
    try {
      const res = await resendVerificationEmailReq(userId || '123');
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <Content>
        <>
          <div className={styles.container}>
            <h1 className={styles.Header}>Click the link in your email to verify your account</h1>
            <h3 className={styles.subHeader}>If you can't find the verification email, check your spam folder.</h3>
            <Button
              className={styles.button}
              onClick={() => {
                resendEmail();
              }}
            >
              Resend email
            </Button>
            <img src={logo} alt="Logo" className={styles.logo}></img>
          </div>
        </>
      </Content>
    </Layout>
  );
}
