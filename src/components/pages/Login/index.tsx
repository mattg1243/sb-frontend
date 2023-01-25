import { Spin, Button, Form, Input, Layout } from 'antd';
import React, { useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import logo from '../../../assets/logo_four_squares.png';
import { useNavigate } from 'react-router-dom';
import { AlertObj } from '../../../types';
import CustomAlert from '../../CustomAlert';
import { loginUserReq } from '../../../lib/axios';
// this alert type should be shared

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
      <Content style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '100vh' }}>
        <img src={logo} alt="logo" width='150vw' style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5vw' }}>Log in to your account</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          wrapperCol={{ span: 16, offset: 4 }}
          labelCol={{ span: 16, offset: 4 }}
          autoComplete="off"
          style={{ justifyContent: 'center', width: '100%', marginTop: '1vh', height: '50vh' }}
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
              style={{ width: '33vw', maxWidth: '600px', height: '7vh', maxHeight: '50px', borderRadius: '40px' }}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => handleKeypress(e)}
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              className="round-white-input"
              placeholder="Password"
              style={{ width: '33vw', maxWidth: '600px', height: '7vh', maxHeight: '50px', borderRadius: '40px' }}
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
                margin: '1rem',
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
            <h3>Dont have an account?</h3>
            <a href="/register">Sign Up</a>
          </Form.Item>
        </Form>
        <CustomAlert status={alert.status} message={alert.message} />
      </Content>
    </Layout>
  );
}
