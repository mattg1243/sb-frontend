import { Button, Form, Input, Layout, Checkbox } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { Content } from 'antd/lib/layout/layout';
import { AlertObj } from '../../../types';
import orangelogo from '../../../assets/orangelogo.png';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../CustomAlert';
import gatewayUrl from '../../../config/routing';
import TermsAndConditions from '../../TermsAndAgreements';
import styles from './Register.module.css';

export default function Register(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [artistName, setArtistName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setConfirmPassword] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>({status: 'none', message: ''});

  const navigate = useNavigate();

  const sendRegisterRequest = async () => {
    if (password === passwordConfirm && agreedToTerms && email !== undefined && artistName !== undefined) {
      const data = { email, artistName, password };
      console.log(data);
      try {
        const response = await axios.post(`${gatewayUrl}/user/register`, data);
        console.log(response);
        if (response.status === 200) {
          setAlert({ status: 'success', message: 'Account created succesfully, you may now login' });
          localStorage.setItem('sb-user', JSON.stringify(response.data.user));
          navigate('/dash');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // passwords dont match, display error
      setAlert({ status: 'error', message: 'Please fill out required fields and make sure you have reentered your passwords correctly.' });
    }
  };

  return (
    <Layout>
      <Content className={styles.content}>
      <img src={orangelogo} alt="logo" width='120vw' />
      <h1 style={{ fontSize: '2vw', marginTop: '0vh' }}>Create your free account</h1>
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
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              className={styles.input}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            style={{ justifySelf: 'center' }}
            name="artistName"
            rules={[{ required: true, message: 'Please input your artist name!' }]}
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
            <Button
              type="primary"
              shape="round"
              size="large"
              style={{
                fontSize: '1.5vw',
                background: 'black',
                borderColor: 'black',
                width: '12vw',
                height: '7vh',
              }}
              onClick={async () => {
                await sendRegisterRequest();
              }}
            >
              Sign Up
            </Button>
            <h3>Already have an account? <a href="/login">Login</a></h3>
          </Form.Item>
        </Form>
        <CustomAlert status={alert.status} message={alert.message} />
      </Content>  
    </Layout>
  );
}
