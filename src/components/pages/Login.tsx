import { Alert, Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { Content } from 'antd/lib/layout/layout';
import logo from '../../assets/logo_four_squares.png';
import { useNavigate } from 'react-router-dom';
import { devHostNames, prodHostNames } from '../../config/microRoutes';
// this alert type should be shared
export type AlertStateObj = { status: 'success' | 'error' | 'warning'; message: string };

export default function Login(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alert, setAlert] = useState<AlertStateObj | null>(null);

  const navigate = useNavigate();

  const hostNames = process.env.NODE_ENV !== 'production' ? devHostNames: prodHostNames;

  const sendLoginRequest = async () => {
    const data = { email, password };
    try {
      const response = await axios.post(`${hostNames.gateway}/auth/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setAlert({ status: 'success', message: 'You are now logged in!' });
        navigate(`/dash`);
      }
    } catch (err: any) {
      console.error(err.message);
      let message: string;
      if (err.response.status === 401) {
        message = 'Invalid login credentials';
      } else {
        message = 'An error occured while logging in: ' + err.message;
      }
      setAlert({ status: 'error', message: message });
    }
  };

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendLoginRequest();
    }
  };

  return (
    <Content style={{ justifyContent: 'center', textAlign: 'center', marginTop: '5rem' }}>
      <img src={logo} alt="logo" width={200} style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '3.5rem' }}>Log in to your account</h1>
      <Form
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        wrapperCol={{ span: 16, offset: 4 }}
        labelCol={{ span: 16, offset: 4 }}
        autoComplete="off"
        style={{ justifyContent: 'center', width: '100%', marginTop: '2rem' }}
      >
        <Form.Item
          style={{ justifySelf: 'center' }}
          name="email"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          {/* this needs to be able to accept an email OR username */}
          <Input
            className="input-round"
            placeholder="Email"
            style={{ width: '600px', height: '50px', borderRadius: '40px' }}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => handleKeypress(e)}
          />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password
            className="round-white-input"
            placeholder="Password"
            style={{ width: '600px', height: '50px', borderRadius: '40px' }}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => handleKeypress(e)}
          />
        </Form.Item>

        <Form.Item name="forgotPassword" wrapperCol={{ offset: 4, span: 16 }}>
          <a href="/notImplementedYet">Forgot password?</a>
        </Form.Item>

        {/* ill implment this eventually 
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

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
              width: '300px',
              height: '80px',
            }}
            onClick={async () => {
              await sendLoginRequest();
            }}
          >
            Login
          </Button>
          <h3>Dont have an account?</h3>
          <a href="/register">Sign Up</a>
        </Form.Item>
      </Form>
      {alert ? (
        <Alert message={alert.message} type={alert.status} showIcon style={{ width: '50%', margin: 'auto' }} />
      ) : null}
    </Content>
  );
}
