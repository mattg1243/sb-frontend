import { useEffect, useState } from 'react';
import { Header } from "antd/es/layout/layout";
import { Button, Menu, Image, Avatar, Dropdown, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import UploadBeatModal from "../BeatUploadModal";
import logo from '../../assets/logo_four_squares.png';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { logoutUserReq, getUserAvatarReq } from '../../lib/axios';
import { cdnHostname } from '../../config/routing';

export default function Navbar() {

  const currentUserId = getUserIdFromLocalStorage();
  let currentUserAvatar = '';

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

  useEffect(() => {
    if (currentUserId) {
      getUserAvatarReq(currentUserId)
        .then(res => console.log(res.data))
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
          <Menu.Item key="profile" style={{ marginLeft: 'auto' }}>
            <Dropdown menu={{ items: userMenuItems }} placement='bottom' overlayStyle={{ color: 'blue', fontSize: '2rem' }} arrow={true} >
              <Avatar 
                size={48} 
                src={`${cdnHostname}/${currentUserAvatar}`}
                style={{ border: 'solid 3px', borderColor: 'var(--primary)' }} 
                onClick={() => { navigate(`/user/?id=${currentUserId}`); }}
              />
            </Dropdown>
          </Menu.Item>
        </Menu>
      </Header>
  )
}