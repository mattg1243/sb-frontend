import { useEffect, useState } from 'react';
import { Header } from 'antd/es/layout/layout';
import { Button, Menu, Image, Avatar, Dropdown, MenuProps, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UploadBeatModal from '../BeatUploadModal';
import logo from '../../assets/orangelogo.png';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { logoutUserReq, getUserAvatarReq } from '../../lib/axios';
import { cdnHostname } from '../../config/routing';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [avatarUrl, setAvatarUrl] = useState();
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
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Button type="ghost" href={`/app/user/?id=${currentUserId}`}>
          Profile
        </Button>
      ),
    },
    {
      key: 'account',
      label: (
        <Button type="ghost" style={{ color: 'white' }} href="/app/account">
          Account
        </Button>
      ),
    },
    {
      key: 'logout',
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            logoutUser();
          }}
        >
          Logout
        </Button>
      ),
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      getUserAvatarReq(currentUserId)
        .then((res) => {
          setAvatarUrl(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [currentUserId]);

  return (
    <Header style={{ width: '100%', margin: 0, top: 100, background: 'black' }}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ background: 'black', marginBottom: '3rem', width: '100%' }}
        selectable={false}
      >
        <Menu.Item className={styles['menu-item']}>
          <Image
            height="45px"
            src={logo}
            preview={false}
            onClick={() => {
              navigate('/app/dash');
            }}
          />
        </Menu.Item>
        <Menu.Item key="upload">
          <UploadBeatModal />
        </Menu.Item>
        <Menu.Item key="beats">
          <Button
            type="ghost"
            onClick={() => {
              navigate('/app/beats');
            }}
            style={{ color: 'white' }}
          >
            Beats
          </Button>
        </Menu.Item>
        <Menu.Item key="settings" className={styles['menu-item']}>
          <Button
            type="ghost"
            onClick={() => {
              navigate('/app/settings');
            }}
            style={{ color: 'white' }}
          >
            Settings
          </Button>
        </Menu.Item>
        <Menu.Item key="about" className={styles['menu-item']}>
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
        <Menu.Item key="profile" style={{ marginLeft: 'auto', padding: '0 2vw' }} className={styles['menu-item']}>
          <Space size={62}>
            <Input
              type="text"
              style={{ borderRadius: '40px', width: '15vw' }}
              placeholder="Search"
              suffix={<SearchOutlined />}
            />
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottom"
              overlayStyle={{ color: 'blue', fontSize: '2rem' }}
              arrow={true}
            >
              <Avatar
                size={48}
                src={`${cdnHostname}/${avatarUrl}`}
                style={{ border: 'solid 3px', borderColor: 'var(--primary)', backgroundColor: 'black' }}
                onClick={() => {
                  navigate(`/app/user/?id=${currentUserId}`);
                }}
              />
            </Dropdown>
          </Space>
        </Menu.Item>
      </Menu>
    </Header>
  );
}
