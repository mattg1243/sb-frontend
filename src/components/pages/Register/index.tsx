import { Button, Form, Input, Layout, Checkbox, Spin, Switch, Space, Tooltip, DatePicker } from 'antd';
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
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const emailRe = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

export default function Register(): JSX.Element {
  const [email, setEmail] = useState<string | undefined>('');
  // TODO: change artistname globally across the frontend to username
  const [artistName, setArtistName] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setConfirmPassword] = useState<string>('');
  const [buttonColor, setButtonColor] = useState<'#D3D3D3' | 'black'>('#D3D3D3');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [paidAcct, setPaidAcct] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>({ status: 'none', message: '' });

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
          setAlert({ status: 'success', message: 'Account created succesfully, you may now login' });
          localStorage.setItem('sb-user', JSON.stringify(response.data.user));
          setIsLoading(false);
          if (paidAcct) {
            navigate('/subscriptions');
          } else {
            navigate('/verify-email');
          }
        }
      } catch (err: any) {
        console.log('message from server: ', err.response.data.message);
        setAlert({ status: 'error', message: err.response.data.message });
        setIsLoading(false);
        console.error(err);
      }
    } else {
      // passwords dont match, display error
      setAlert({
        status: 'error',
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
  }, [password, passwordConfirm, agreedToTerms, email, artistName]);

  return (
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
            />
          </Form.Item>

          <Form.Item
            style={{ justifySelf: 'center' }}
            name="username"
            rules={[{ required: true, message: 'Please input your username' }]}
          >
            <Input className={styles.input} placeholder="Username" onChange={(e) => setArtistName(e.target.value)} />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              className={styles.input}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="confirm password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              className={styles.input}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="date of birth" style={{ marginTop: '-1vh' }}>
            <p>Date of Birth</p>
            <DatePicker
              format={'YYYY/MM/DD'}
              onChange={(date, dateStr) => {
                setDateOfBirth(dateStr);
              }}
              placeholder="Date Of Birth"
            />
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
                Paid Account
                <Switch
                  className={styles.paidSwitch}
                  style={{ background: paidAcct ? 'black' : 'grey', margin: '1vh' }}
                  onChange={() => {
                    setPaidAcct(!paidAcct);
                  }}
                />
                <span style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                  <Tooltip title="If you want to upload your beats and not purchase any, a free account is perfect for you!">
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
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
            <CustomAlert status={alert.status} message={alert.message} />
            <h3 className={styles.alreadyAccount}>
              Already have an account? <a href="/login">Login</a>
            </h3>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
