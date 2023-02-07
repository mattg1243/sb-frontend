import { Spin, Button, Form, Input, Layout } from 'antd';
import React, { useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import orangelogo from '../../../assets/orangelogo.png';
import { useNavigate } from 'react-router-dom';
import { AlertObj } from '../../../types';
import CustomAlert from '../../CustomAlert';
import { loginUserReq } from '../../../lib/axios';
import styles from './Login.module.css';

export default function Login(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>({status: 'none', message: ''});

  const navigate = useNavigate();

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loginResponse = await loginUserReq({email, password});
      console.log(loginResponse);
      if (loginResponse.status === 200 && loginResponse.data.user) {
        localStorage.setItem('sb-user', JSON.stringify(loginResponse.data.user));
        navigate('/dash');
      } else {
        setAlert({ status: 'success', message: 'User successfully logged in' });
      }
    } 
    catch (err) {
      console.error(err);
      setAlert({ status: 'error', message: 'An error occured while logging again. Please try again.'});
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleKeypress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
     await loginUser(email, password);
    }
  };

  return (
    <Layout>
      <Content className={styles.content}>
        <img src={orangelogo} alt="logo" width='150vw' />
        <h1 style={{ fontSize: '2vw', marginTop: '1vh' }}>Log in to your account</h1>
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
            {/* this needs to be able to accept an email OR username */}
            <Input
              className={styles.input}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => handleKeypress(e)}
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              className={styles.input}
              placeholder="Password"
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
            {isLoading ? <Spin size='large' /> : <Button
              type="primary"
              shape="round"
              size="large"
              style={{
                fontSize: '1.5vw',
                background: 'black',
                borderColor: 'black',
                width: '17vw',
                maxWidth: '200px',
                height: '8vh',
                maxHeight: '75px'
              }}
              onClick={async () => {
                await loginUser(email, password);
              }}
            >
              Login
            </Button>}
            <h3>Dont have an account? <a href="/register">Sign Up</a></h3>
          </Form.Item>
        </Form>
        <CustomAlert status={alert.status} message={alert.message} />
      </Content>
    </Layout>
  );
}
