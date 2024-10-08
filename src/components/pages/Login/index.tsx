import { Spin, Button, Form, Input, Layout, Modal, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Content } from 'antd/lib/layout/layout';
import orangelogo from '../../../assets/orangelogo.png';
import { useNavigate } from 'react-router-dom';
import { AlertObj } from '../../../types';
import CustomAlert from '../../CustomAlert';
import { loginUserReq, resetPasswordReq } from '../../../lib/axios';
import styles from './Login.module.css';
import gatewayUrl from '../../../config/routing';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import ReactGA from 'react-ga4';

export default function Login(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [emailForReset, setEmailForReset] = useState<string>();
  const [resetSuccessful, setResetSuccessful] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>();

  const navigate = useNavigate();

  const goBack = new URLSearchParams(window.location.search).get('goBack');
  console.log('goBack = ', goBack);

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loginResponse = await loginUserReq({ email, password });
      console.log(loginResponse);
      if (loginResponse.status === 200 && loginResponse.data.user) {
        localStorage.setItem('sb-user', JSON.stringify(loginResponse.data.user));
        ReactGA.set({ userId: loginResponse.data.user?.id });
        if (goBack === 'true') {
          navigate(-1);
        } else {
          navigate('/app/dash');
        }
      } else {
        setAlert({ type: 'success', message: 'User successfully logged in' });
      }
    } catch (err: any) {
      console.error(err);
      if (err.response.status === 401) {
        setAlert({
          type: 'error',
          message: 'Invalid login credentials. Please try again (note usernames are case sensitive).',
        });
      } else if (err.response.status === 403) {
        localStorage.setItem('sb-user', JSON.stringify(err.response.data.user));
        navigate('/verify-email');
      } else {
        setAlert({ type: 'error', message: 'An error occured while logging again. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // TODO handle different responses and display alerts on the modal
  const handleResetPassword = async () => {
    try {
      const res = await resetPasswordReq(emailForReset as string);
      setResetSuccessful(true);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeypress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await loginUser(email, password);
    }
  };

  const checkForVerifyRedirect = () => {
    const verifyRedirect = new URLSearchParams(window.location.search).get('verified');
    if (verifyRedirect === 'true') {
      setAlert({ type: 'success', message: 'Your account has been verified! Please login to use the site.' });
    }
  };

  const checkIsLoggedIn = async (userId: string) => {
    setCheckingAuth(true);

    try {
      await axios.get(`${gatewayUrl}/auth?user=${userId}`, { withCredentials: true });
      navigate('/app/dash');
    } catch (err) {
      console.log(err);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    const userId = getUserIdFromLocalStorage();
    if (userId) {
      checkIsLoggedIn(userId);
    } else {
      checkForVerifyRedirect();
    }
  }, []);

  return (
    <Layout>
      <Content className={styles.content}>
        <img src={orangelogo} className={styles.logo} alt="logo" width="150vw" />
        <div className={styles['title-cont']}>
          <p className={styles.title}>Sweatshop Beats</p>
        </div>
        <h1 className={styles.loginText}>Log in to your account</h1>
        {!checkingAuth ? (
          <Form
            name="basic"
            layout="vertical"
            initialValues={{ remember: true }}
            autoComplete="off"
            className={styles.form}
          >
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email or username!' }]}>
              {/* this needs to be able to accept an email OR username */}
              <Input
                className={`${styles.input} emailinput`}
                style={{ fontSize: 'min(16px)' }}
                id="email-input"
                placeholder="Email or username"
                autoComplete="email"
                autoCapitalize="off"
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeypress(e)}
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password
                className={`${styles.input} passwordinput`}
                style={{ fontSize: 'min(16px)' }}
                placeholder="Password"
                autoComplete="password"
                autoCapitalize="off"
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => handleKeypress(e)}
                id="password-input"
              />
            </Form.Item>

            <Form.Item name="forgotPassword" className={styles.forgotPassword}>
              <a href="#" onClick={() => setResetPasswordModalOpen(true)}>
                Forgot password?
              </a>
            </Form.Item>

            {/* ill implment this eventually 
          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

            <Form.Item className={styles.buttonUnOffset}>
              {isLoading ? (
                <Spin size="large" className="spin" />
              ) : (
                <Button
                  type="primary"
                  shape="round"
                  /* Added logButton class for login button as inline styling supersedes CSS */
                  className={styles.logButton}
                  onClick={async () => {
                    await loginUser(email, password);
                  }}
                  id="login-btn"
                >
                  Login
                </Button>
              )}
              <CustomAlert type={alert?.type} message={alert?.message as string} />
              {goBack == 'true' ? (
                <CustomAlert type="warning" message="You must be logged in to access that feature" />
              ) : null}
              <h3 className={styles.noAccount} style={{ marginTop: '1vh' }}>
                Dont have an account? <a href="/register">Sign Up</a>
              </h3>
            </Form.Item>
          </Form>
        ) : (
          <Spin />
        )}
        <Modal open={resetPasswordModalOpen} onOk={() => handleResetPassword()} centered footer={null}>
          {resetSuccessful ? (
            <p>Please check your email for a password reset link</p>
          ) : (
            <>
              <Input
                placeholder="Email"
                style={{ width: '50%', marginRight: 'auto' }}
                onChange={(e) => setEmailForReset(e.target.value)}
              />
              <p>Please enter your email to reset your password.</p>
            </>
          )}
          <Divider />
          <Button>Cancel</Button>
          <Button
            style={{ marginLeft: '1rem', background: 'var(--primary)' }}
            onClick={() => (resetSuccessful ? setResetPasswordModalOpen(false) : handleResetPassword())}
          >
            Ok{resetSuccessful ? '✔️' : null}
          </Button>
        </Modal>
      </Content>
    </Layout>
  );
}
