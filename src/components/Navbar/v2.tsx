import { useEffect, useRef } from 'react';
import { Header } from 'antd/es/layout/layout';
import { Button, Menu, Image, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/orangelogo.png';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { getUserAvatarReq } from '../../lib/axios';

export default function Navbar() {
  const currentUserId = getUserIdFromLocalStorage();

  const navigate = useNavigate();

  const avatarUrlRef = useRef();

  useEffect(() => {
    if (currentUserId) {
      getUserAvatarReq(currentUserId)
        .then((res) => {
          avatarUrlRef.current = res.data;
        })
        .catch((err) => console.error(err));
    }
  });

  return (
    <Header style={{ width: '100%', margin: 0, top: 100, background: 'black' }}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ background: 'black', marginBottom: '3rem', width: '100%', flex: 'auto' }}
      >
        <Menu.Item>
          <Image
            height="45px"
            src={logo}
            preview={false}
            onClick={() => {
              navigate('/app/dash');
            }}
          />
        </Menu.Item>
        <Menu.Item key="about">
          <Button
            type="ghost"
            onClick={() => {
              navigate('/app/about');
            }}
            style={{ color: 'white' }}
          >
            About
          </Button>
        </Menu.Item>
        <Menu.Item style={{ marginLeft: 'auto' }}>
          <Input type="text" style={{ borderRadius: '40px' }} placeholder="Search" suffix={<SearchOutlined />} />
        </Menu.Item>
      </Menu>
    </Header>
  );
}
