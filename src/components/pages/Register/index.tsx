import { Button, Form, Input, Layout, Checkbox, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Content } from 'antd/lib/layout/layout';
import { AlertObj } from '../../../types';
import logo from '../../../assets/logo_four_squares.png';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../CustomAlert';
import gatewayUrl from '../../../config/routing';
import TermsAndConditions from '../../TermsAndAgreements';
import styles from './Register.module.css';

export default function Register(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  // TODO: change artistname globally across the frontend to username
  const [artistName, setArtistName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setConfirmPassword] = useState<string>('');
  const [buttonColor, setButtonColor] = useState<'#D3D3D3' | 'black'>('#D3D3D3');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>({status: 'none', message: ''});

  const navigate = useNavigate();

  const sendRegisterRequest = async () => {
    if (password === passwordConfirm && agreedToTerms && email !== undefined && artistName !== undefined) {
      setIsLoading(true);
      const data = { email, artistName, password };
      console.log(data);
      try {
        const response = await axios.post(`${gatewayUrl}/user/register`, data);
        console.log(response);
        if (response.status === 200) {
          setAlert({ status: 'success', message: 'Account created succesfully, you may now login' });
          localStorage.setItem('sb-user', JSON.stringify(response.data.user));
          setIsLoading(false);
          navigate('/dash');
        }
      } catch (err: any) {
        console.log('message from server: ', err.response.data.message)
        setAlert({ status: 'error', message: err.response.data.message });
        setIsLoading(false);
        console.error(err);
      }
    } else {
      // passwords dont match, display error
      setAlert({ status: 'error', message: 'Please fill out required fields and make sure you have reentered your passwords correctly.' });
    }
  };

  useEffect(() => {
    // this can be refined to make sure that each input is actually valid, not just holding some arbitrary user input
    if (password === passwordConfirm && agreedToTerms && email !== (undefined || '') && artistName !== (undefined || '')) {
      setButtonColor('black');
    } else {
      setButtonColor('#D3D3D3');
    }
  }, [password, passwordConfirm, agreedToTerms, email, artistName]);

  return (
    <Layout>
      <Content className={styles.content}>
      <img src={logo} alt="logo" width='150vw' style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2.5vw' }}>Create your free account</h1>
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
              onChange={(e) => setEmail(e.target.value)}
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
            />
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

          <Form.Item name="terms and conditions" className={styles['small-text']}>
            <Checkbox  onChange={(e) => { setAgreedToTerms(e.target.checked) }}>I agree to the <TermsAndConditions /></Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            {isLoading ? <Spin /> 
              :
                <Button
                type="primary"
                shape="round"
                size="large"
                style={{
                  fontSize: '1.5vw',
                  margin: '1rem',
                  backgroundColor: buttonColor,
                  borderColor: buttonColor,
                  width: '12vw',
                  height: '7vh',
                }}
                disabled={buttonColor === '#D3D3D3'}
                onClick={async () => {
                  await sendRegisterRequest();
                }}
              >
                Sign Up
              </Button> 
            }
            <CustomAlert status={alert.status} message={alert.message} />
            <h3>Already have an account?</h3>
            <a className={styles['small-text']} href="/login">Login</a>
          </Form.Item>
        </Form>
      </Content>  
    </Layout>
  );
}
