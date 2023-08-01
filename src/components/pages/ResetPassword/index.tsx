import { Button, Form, Input, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import { changePasswordReq } from '../../../lib/axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState<string>();
  const [confirmNewPassowrd, setConfirmNewPassword] = useState<string>();

  const navigate = useNavigate();

  const [searchParams, setSeachParams] = useSearchParams();
  const userEmail = searchParams.get('email');
  const token = searchParams.get('token');

  const changePassword = async () => {
    if (newPassword === confirmNewPassowrd) {
      try {
        const res = await changePasswordReq(userEmail as string, token as string, newPassword as string);
        console.log(res);
        navigate('/login');
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('passwords dont match');
    }
  };

  useEffect(() => {
    console.log(token);
  });

  return (
    <>
      <Layout style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', height: '50vh' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', height: '100vh' }}>
          <Form style={{ height: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 'auto' }}>
            <Form.Item label="New Password">
              <Input
                type="password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item label="Confirm New Password">
              <Input
                type="password"
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                }}
              />
            </Form.Item>
            <Button
              onClick={() => {
                changePassword();
              }}
              disabled={newPassword !== confirmNewPassowrd}
            >
              Save Password
            </Button>
          </Form>
        </Content>
      </Layout>
    </>
  );
}
