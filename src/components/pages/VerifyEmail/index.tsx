import { Content } from 'antd/lib/layout/layout';
import { Layout } from 'antd';
import { useEffect } from 'react';
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
    if (code) {
      axios
        .get(`${gatewayUrl}/verify-email?code=${code}&user=${userId}&email=${email}`)
        .then((res) => {
          if (res.status == 200) {
            navigate('/login');
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
            <h1>Click the link in your email to verify your account</h1>
            <button
              className={styles.button}
              onClick={() => {
                resendEmail();
              }}
            >
              Resend email
            </button>
            <img src={logo} alt="Logo" className={styles.logo}></img>
          </div>
        </>
      </Content>
    </Layout>
  );
}
