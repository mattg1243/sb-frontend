import { Content } from 'antd/lib/layout/layout';
import { Layout, Button } from 'antd';
import { useEffect, useState } from 'react';
import { resendVerificationEmailReq } from '../../../lib/axios';
import { useNavigate } from 'react-router-dom';
import gatewayUrl from '../../../config/routing';
import axios from 'axios';
import styles from './VerifyEmail.module.css';
import logo from '../../../assets/orangelogo.png';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';

export default function VerifyEmail() {
  // const userId = getUserIdFromLocalStorage();
  // const email = getUserEmailFromLocalStorage();
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');
  const userId = queryParams.get('user') || getUserIdFromLocalStorage();
  const email = queryParams.get('email');

  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
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
    // no verification code but userId from login
    if (!code && userId) {
      axios
        .get(`${gatewayUrl}/user/verify-email?user=${userId}`)
        .then(() => {
          navigate('/app/dash');
        })
        .catch((err) => console.error(err));
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
      <Content data-cy="verify-email-cont">
        <>
          <div className={styles.container}>
            <img src={logo} alt="Logo" className={styles.logo}></img>
            <h1 className={styles.Header} data-cy="verify-email-instruct">
              Click the link in your email to verify your account
            </h1>
            <h3 className={styles.subHeader}>If you can't find the verification email, check your spam folder.</h3>
            <Button
              className={styles.button}
              onClick={() => {
                resendEmail();
              }}
              data-cy="resend-email-btn"
            >
              Resend email
            </Button>
            <h3 className={styles.subHeader}>
              <strong>
                If you aren't automatically redirected after verifying your email,{' '}
                <a href="/login" data-cy="verify-email-login-link">
                  click here
                </a>
              </strong>
            </h3>
          </div>
        </>
      </Content>
    </Layout>
  );
}
