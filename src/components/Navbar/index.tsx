import { useEffect, useState } from 'react';
import { Header } from 'antd/es/layout/layout';
import { Button, Menu, Image, Avatar, Dropdown, MenuProps, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UploadBeatModal from '../BeatUploadModal';
import logo from '../../assets/orangelogo.png';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { logoutUserReq, getUserAvatarReq, getCreditBalanceReq } from '../../lib/axios';
import { imgCdnHostName } from '../../config/routing';
import styles from './Navbar.module.css';
import { ensureLoggedIn } from '../../utils/auth';
import SearchInput from './SearchInput';

export default function Navbar() {
  const [avatarUrl, setAvatarUrl] = useState();
  const [creditBalance, setCreditBalance] = useState<number>(0);
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
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={async () => {
            try {
              await ensureLoggedIn();
              navigate(`/app/user/?id=${currentUserId}`);
            } catch (err) {
              console.error(err);
            }
          }}
        >
          Profile
        </Button>
      ),
    },
    {
      key: 'account',
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={async () => {
            try {
              await ensureLoggedIn();
              navigate('/app/account');
            } catch (err) {
              console.error(err);
            }
          }}
        >
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
      getCreditBalanceReq()
        .then((res) => {
          setCreditBalance(res.data.creditBalance);
        })
        .catch((err) => console.error(err));
    }
  }, [currentUserId]);

  return (
    <Header className={styles['header']}>
      <Menu theme="dark" mode="horizontal" style={{ background: 'black', marginBottom: '3rem', width: '100%' }}>
        <Menu.Item className={styles['menu-item']}>
          <Image
            width="45px"
            src={logo}
            preview={false}
            className={`dashNav`}
            onClick={() => {
              navigate('/app/dash');
            }}
          />
        </Menu.Item>
        {window.location.pathname === '/' ? (
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
        ) : (
          <Menu.Item key="upload">
            <UploadBeatModal />
          </Menu.Item>
        )}
        <Menu.Item>
          <Button type="ghost" onClick={() => navigate('/subscriptions')} style={{ color: 'white' }}>
            Subscribe
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button type="ghost" onClick={() => navigate('/FAQ')} style={{ color: 'white' }}>
            FAQ
          </Button>
        </Menu.Item>
        <Menu.Item key="profile" style={{ marginLeft: 'auto', padding: '0 2vw' }} className={styles['menu-item']}>
          <Space size={62}>
            <SearchInput />
            {window.location.pathname !== '/' ? (
              <>
                <div className={styles['end-div']}>
                  <p className={styles['credit-balance']}>{creditBalance}</p>
                  <p>credits</p>
                </div>
                <Dropdown
                  menu={{
                    items: currentUserId
                      ? userMenuItems
                      : [
                          {
                            key: 'login',
                            label: (
                              <Button
                                type="ghost"
                                style={{ color: 'white' }}
                                onClick={() => {
                                  navigate('/login');
                                }}
                              >
                                Login
                              </Button>
                            ),
                          },
                        ],
                  }}
                  placement="bottom"
                  overlayStyle={{ color: 'blue', fontSize: '2rem' }}
                  arrow={true}
                >
                  <Avatar
                    size={48}
                    src={avatarUrl ? `${imgCdnHostName}/fit-in/125x125/${avatarUrl}` : undefined}
                    style={{ border: 'solid 3px', borderColor: 'var(--primary)', backgroundColor: 'black' }}
                    icon={avatarUrl ? undefined : <UserOutlined style={{ color: 'white', fontSize: '2vh' }} />}
                    className="avatar"
                    onClick={() => {
                      currentUserId ? navigate(`/app/user/?id=${currentUserId}`) : navigate('/login');
                    }}
                  />
                </Dropdown>
              </>
            ) : null}
          </Space>
        </Menu.Item>
      </Menu>
    </Header>
  );
}
