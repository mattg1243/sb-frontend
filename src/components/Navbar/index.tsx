import { useEffect, useRef, useState } from 'react';
import { Header } from "antd/es/layout/layout";
import { Button, Menu, Image, Avatar, Dropdown, MenuProps, Input, Space } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import UploadBeatModal from "../BeatUploadModal";
import logo from '../../assets/orangelogo.png';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { logoutUserReq, getUserAvatarReq } from '../../lib/axios';
import { cdnHostname } from '../../config/routing';

export default function Navbar() {

  const currentUserId = getUserIdFromLocalStorage();

  const logoutUser = async () => {
    try {
      const logoutUserRes = await logoutUserReq();
      localStorage.removeItem('sb-user');
      console.log(logoutUserRes);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Button type='ghost' href={`/user/?id=${currentUserId}`}>
          Profile
        </Button>
      ),
    },
    {
      key: 'logout',
      label: (
        <Button type='ghost' style={{ color: 'white' }} onClick={() => { logoutUser(); }}>
          Logout
        </Button>
      ),
    },
  ];

  const navigate = useNavigate();

  const avatarUrlRef = useRef();

  useEffect(() => {
    if (currentUserId) {
      getUserAvatarReq(currentUserId)
        .then((res) => {avatarUrlRef.current = res.data})
        .catch(err => console.error(err))
    }
  })

  return (
      <Header style={{ width: '100%', margin: 0, top: 100, background: 'black' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ background: 'black', marginBottom: '3rem', width: '100%' }}
        >
          <Menu.Item>
            <Image height='50px' src={logo} preview={false} onClick={() => { navigate('/dash') }}/>
          </Menu.Item>
          <Menu.Item key="upload">
            <UploadBeatModal />
          </Menu.Item>
          <Menu.Item key="beats">
            <Button type='ghost' onClick={() => { navigate('/beats') }} style={{ color: 'white' }}>Beats</Button>
          </Menu.Item>
          <Menu.Item key="settings">
            <Button type='ghost' onClick={() => { navigate('/settings') }} style={{ color: 'white' }}>Settings</Button>
          </Menu.Item>
          <Menu.Item key="about">
            <Button type='ghost' onClick={() => { navigate('/about') }} style={{ color: 'white' }}>About</Button>
          </Menu.Item>
          <Menu.Item key="profile" style={{ marginLeft: 'auto', padding: '0 2vw' }}>
          <Space size={62}>
            <Input type='text' style={{ borderRadius: '40px', width: '15vw' }} placeholder='Search' suffix={<SearchOutlined />} />
            <Dropdown menu={{ items: userMenuItems }} placement='bottom' overlayStyle={{ color: 'blue', fontSize: '2rem' }} arrow={true} >
              <Avatar 
                size={48} 
                src={`${cdnHostname}/${avatarUrlRef}`}
                style={{ border: 'solid 3px', borderColor: 'var(--primary)', backgroundColor: 'black' }} 
                onClick={() => { navigate(`/user/?id=${currentUserId}`); }}
              />
            </Dropdown>
          </Space>
          </Menu.Item>
        </Menu>
      </Header>
  )
}