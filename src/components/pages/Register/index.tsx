import { Button, Form, Input, Layout, Checkbox } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { Content } from 'antd/lib/layout/layout';
import { AlertObj } from '../../../types';
import logo from '../../../assets/logo_four_squares.png';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../CustomAlert';
import gatewayUrl from '../../../config/routing';
import TermsAndConditions from '../../TermsAndAgreements';

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
      <Content style={{ justifyContent: 'center', textAlign: 'center', marginTop: '5rem' }}>
      <img src={logo} alt="logo" width={200} style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '3.5rem' }}>Create your free account</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          wrapperCol={{ span: 16, offset: 4 }}
          labelCol={{ span: 16, offset: 4 }}
          autoComplete="off"
          style={{ justifyContent: 'center', textAlign: 'center', width: '100%' }}
        >
          <Form.Item
            style={{ justifySelf: 'center' }}
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              className="round-white-input"
              placeholder="Email"
              style={{ width: '600px', height: '50px', borderRadius: '40px' }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            style={{ justifySelf: 'center' }}
            name="artistName"
            rules={[{ required: true, message: 'Please input your artist name!' }]}
          >
            <Input
              className="round-white-input"
              placeholder="Username"
              style={{ width: '600px', height: '50px', borderRadius: '40px' }}
              onChange={(e) => setArtistName(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              className="round-white-input"
              placeholder="Password"
              style={{ width: '600px', height: '50px', borderRadius: '40px' }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="confirm password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              className="round-white-input"
              placeholder="Confirm Password"
              style={{ width: '600px', height: '50px', borderRadius: '40px' }}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="terms and conditions">
            <Checkbox onChange={(e) => { setAgreedToTerms(e.target.checked) }}>I agree to the <TermsAndConditions /></Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button
              type="primary"
              shape="round"
              size="large"
              style={{
                fontSize: '2rem',
                margin: '1rem',
                background: 'black',
                borderColor: 'black',
                width: '400px',
                height: '80px',
              }}
              onClick={async () => {
                await sendRegisterRequest();
              }}
            >
              Sign Up
            </Button>
            <h3>Already have an account?</h3>
            <a href="/login">Login</a>
          </Form.Item>
        </Form>
        <CustomAlert status={alert.status} message={alert.message} />
      </Content>  
    </Layout>
  );
}
