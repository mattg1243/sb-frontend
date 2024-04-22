import { Button, Form, Input, Layout, Spin, Space, Col } from 'antd';
import { Input as ChakraInput, ChakraProvider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Content } from 'antd/lib/layout/layout';
import { AlertObj } from '../../../types';
import orangelogo from '../../../assets/orangelogo.png';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../CustomAlert';
import gatewayUrl from '../../../config/routing';
import TermsOfService from '../../TermsOfService';
import styles from './Register.module.css';
import { CheckCircleOutlined } from '@ant-design/icons';
import ReactGA from 'react-ga4';

const emailRe = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const isMobile = window.innerWidth < 480;

export default function Register(): JSX.Element {
  const [email, setEmail] = useState<string | undefined>('');
  // TODO: change artistname globally across the frontend to username
  const [artistName, setArtistName] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setConfirmPassword] = useState<string>('');
  const [buttonColor, setButtonColor] = useState<'#D3D3D3' | 'black'>('#D3D3D3');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>();

  const navigate = useNavigate();

  const sendRegisterRequest = async () => {
    if (password === passwordConfirm && agreedToTerms && email !== undefined && artistName !== undefined) {
      setIsLoading(true);
      const data = { email, artistName, dateOfBirth, password };
      console.log(data);
      try {
        const response = await axios.post(`${gatewayUrl}/user/register`, data);
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem('sb-user', JSON.stringify(response.data.user));
          setIsLoading(false);
          ReactGA.event({ category: 'User', action: 'Sign Up' });
          navigate('/verify-email');
        }
      } catch (err: any) {
        console.log('message from server: ', err.response.data.message);
        setAlert({ type: 'error', message: err.response.data.message });
        setIsLoading(false);
        console.error(err);
      }
    } else {
      // passwords dont match, display error
      setAlert({
        type: 'error',
        message: 'Please fill out required fields and make sure you have reentered your passwords correctly.',
      });
    }
  };

  useEffect(() => {
    // this can be refined to make sure that each input is actually valid, not just holding some arbitrary user input
    if (
      password === passwordConfirm &&
      agreedToTerms &&
      email !== (undefined || '') &&
      artistName !== (undefined || '') &&
      dateOfBirth !== ''
    ) {
      setButtonColor('black');
    } else {
      setButtonColor('#D3D3D3');
    }
  }, [password, passwordConfirm, agreedToTerms, email, artistName, dateOfBirth]);

  return (
    <ChakraProvider>
      <Layout>
        <Content className={styles.content}>
          <img src={orangelogo} alt="logo" className={styles.logo} width="120vw" />
          <h1 className={styles.headie}>Create your account</h1>
          <Form
            name="basic"
            layout="vertical"
            initialValues={{ remember: true }}
            wrapperCol={{ span: 16, offset: 4 }}
            labelCol={{ span: 16, offset: 4 }}
            autoComplete="off"
            className={styles.form}
          >
            <Form.Item
              style={{ justifySelf: 'center' }}
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input
                className={styles.input}
                placeholder="Email"
                onChange={(e) => {
                  if (emailRe.test(e.target.value)) {
                    setEmail(e.target.value);
                  } else {
                    setEmail(undefined);
                  }
                }}
                style={{ fontSize: 'min(16px)' }}
              />
            </Form.Item>
            <Form.Item
              style={{ justifySelf: 'center' }}
              name="username"
              rules={[{ required: true, message: 'Please input your username' }]}
            >
              <Input
                className={styles.input}
                placeholder="Username"
                onChange={(e) => setArtistName(e.target.value)}
                style={{ fontSize: 'min(16px)' }}
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password
                className={styles.input}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontSize: 'min(16px)' }}
              />
            </Form.Item>
            <Form.Item name="confirm password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password
                className={styles.input}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ fontSize: 'min(16px)' }}
              />
            </Form.Item>
            <Form.Item
              name="date of birth"
              style={{
                marginTop: '2vh',
                justifyContent: 'center',
                width: '100%',
                alignItems: 'center',
                textAlign: 'center',
                display: 'block !important',
              }}
            >
              <Col>
                <ChakraInput
                  type="date"
                  size="md"
                  placeholder="Date of Birth"
                  style={{
                    width: isMobile ? '50vw' : 'clamp(200px, 10vw, 600px)',
                    background: 'white',
                    color: 'black',
                    textAlign: 'center',
                  }}
                  className={styles['dob-picker']}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                  }}
                />
              </Col>
              {window.innerWidth > 480 ? <p>Date of Birth</p> : 'Date of Birth'}
            </Form.Item>

            <Form.Item name="terms and conditions" className={styles['small-text']}>
              Agree to the <TermsOfService setAgreedToTerms={setAgreedToTerms} />
              {agreedToTerms ? <CheckCircleOutlined style={{ marginLeft: '1rem', fontSize: '1.2vh' }} /> : null}
            </Form.Item>
            <Form.Item className={styles.buttonUnOffset} wrapperCol={{ offset: 4, span: 16 }}>
              {isLoading ? (
                <Spin />
              ) : (
                <Space style={{ display: 'block' }}>
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    className={styles.regButton}
                    style={{
                      backgroundColor: buttonColor,
                      borderColor: buttonColor,
                    }}
                    disabled={buttonColor === '#D3D3D3'}
                    onClick={async () => {
                      await sendRegisterRequest();
                    }}
                  >
                    Sign Up
                  </Button>
                </Space>
              )}
              <CustomAlert type={alert?.type} message={alert?.message as string} />
              <h3 className={styles.alreadyAccount}>
                Already have an account? <a href="/login">Login</a>
              </h3>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </ChakraProvider>
  );
}
