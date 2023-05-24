import { Header } from 'antd/es/layout/layout';
import { Button, Menu } from 'antd';
import { HomeOutlined, SearchOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './MobileNav.module.css';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { useEffect, useState } from 'react';

export default function MobileNav() {
  const [currentSelection, setCurrentSelection] = useState<'Home' | 'Search' | 'Settings' | 'Profile'>('Home');

  const navigate = useNavigate();
  const userId = getUserIdFromLocalStorage();

  return (
    <>
      <span className={styles.container}>
        <Menu theme="dark" mode="horizontal" selectable={false} style={{ background: 'black' }} inlineCollapsed={false}>
          <Menu.Item>
            <Button
              onClick={() => {
                navigate('/app/dash');
                setCurrentSelection('Home');
              }}
              type="ghost"
              className={styles.btn}
              data-cy="home-btn"
            >
              <HomeOutlined
                style={{ fontSize: '24px', color: 'white', opacity: currentSelection == 'Home' ? 1 : 0.5 }}
                data-cy="home-icon"
              />
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              onClick={() => {
                console.log('search featrure in progress');
                setCurrentSelection('Search');
              }}
              type="ghost"
              className={styles.btn}
              data-cy="search-btn"
            >
              <SearchOutlined
                className={styles.icon}
                style={{ fontSize: '24px', color: 'white', opacity: currentSelection == 'Search' ? 1 : 0.5 }}
                data-cy="search-icon"
              />
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              onClick={() => {
                navigate('/app/settings');
                setCurrentSelection('Settings');
              }}
              type="ghost"
              className={styles.btn}
              data-cy="settings-btn"
            >
              <SettingOutlined
                style={{ fontSize: '24px', color: 'white', opacity: currentSelection == 'Settings' ? 1 : 0.5 }}
                data-cy="settings-icon"
              />
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              onClick={() => {
                navigate(`/app/user/?id=${userId}`);
                setCurrentSelection('Profile');
              }}
              type="ghost"
              className={styles.btn}
              data-cy="profile-btn"
            >
              <UserOutlined
                style={{
                  fontSize: '24px',
                  color: 'white',
                  opacity: currentSelection == 'Profile' ? 1 : 0.5,
                }}
                data-cy="profile-icon"
              />
            </Button>
          </Menu.Item>
        </Menu>
      </span>
    </>
  );
}
