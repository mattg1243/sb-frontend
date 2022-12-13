import { Button, Form, Input, Alert, Switch } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { Content } from 'antd/lib/layout/layout';
import logo from '../../assets/logo_four_squares.png';
import type { AlertStateObj } from './Login';
import { useNavigate } from 'react-router-dom';

export default function Register(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setConfirmPassword] = useState<string>('');
  const [acctType, setAcctType] = useState<'artist' | 'producer'>('artist');
  const [alert, setAlert] = useState<AlertStateObj | null>(null);

  const navigate = useNavigate();

  const sendRegisterRequest = async () => {
    if (password === passwordConfirm) {
      try {
        const response = await axios.post('http://localhost:3001/api/auth/register', {
          email,
          username,
          password,
          acctType,
        });
        console.log(response);
        setAlert({ status: 'success', message: 'Account created succesfully, you may now login' });
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate(`/dash/${response.data.user._id}`);
      } catch (err) {
        console.error(err);
      }
    } else {
      // passwords dont match, display error
      setAlert({ status: 'error', message: `Passwords don't match, please try again.` });
    }
  };

  const changeAcctType = () => {
    if (acctType === 'artist') {
      setAcctType('producer');
    } else {
      setAcctType('artist');
    }
  };

  return (
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
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            className="round-white-input"
            placeholder="Username"
            style={{ width: '600px', height: '50px', borderRadius: '40px' }}
            onChange={(e) => setUsername(e.target.value)}
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

        <span style={{ display: 'inline-flex', padding: '1rem', marginLeft: '2rem' }}>
          <h3>Artist</h3>
          <Switch
            style={{ backgroundColor: 'black', margin: '0 1rem 0 1rem', justifySelf: 'center' }}
            onChange={() => changeAcctType()}
          />
          <h3>Producer</h3>
        </span>

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
      {alert ? (
        <Alert message={alert.message} type={alert.status} showIcon style={{ width: '50%', margin: 'auto' }} />
      ) : null}
    </Content>
  );
}
