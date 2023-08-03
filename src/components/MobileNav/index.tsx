import axios from 'axios';
import { Button, Menu, Row, Col, Modal, Input, InputRef, MenuProps, Dropdown } from 'antd';
import { CloseOutlined, HomeOutlined, SearchOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './MobileNav.module.css';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { Ref, useEffect, useRef, useState } from 'react';
import { logoutUserReq } from '../../lib/axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  searchQuery,
  selectSearchQuery,
  searchIsLoading,
  searching,
  selectIsSearching,
} from '../../reducers/searchReducer';
import { beats } from '../../reducers/searchReducer';
import { RootState } from '../../store';
import gatewayUrl from '../../config/routing';

export default function MobileNav() {
  const [currentSelection, setCurrentSelection] = useState<'Home' | 'Search' | 'Settings' | 'Profile'>('Home');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const userId = getUserIdFromLocalStorage();
  const inputRef = useRef<InputRef>(null);

  const dispatch = useDispatch();

  const searchQueryState = useSelector<RootState, string | null>((state) => selectSearchQuery(state));
  const isSearching = useSelector<RootState, boolean>((state) => selectIsSearching(state));

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

  // TODO when mobile accont page is done, the desktop and mobeil navbars can share this obj
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Button type="ghost" href={`/app/user/?id=${userId}`} data-cy="mobile-profile-menu-opt">
          Profile
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
          data-cy="mobile-logout-menu-opt"
        >
          Logout
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (currentSelection === 'Search') {
      setSearchOpen(true);
    } else {
      setSearchOpen(false);
    }
  }, [currentSelection]);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    let searchUrl = `${gatewayUrl}/beats/search?`;
    if (searchQueryState) {
      dispatch(searching(true));
      if (!searchUrl.endsWith('?')) {
        searchUrl += '&';
      }
      searchUrl += `search=${searchQueryState}`;
      axios
        .get(searchUrl)
        .then((res) => {
          dispatch(beats(res.data.beats));
        })
        .then(() => {
          dispatch(searchIsLoading(false));
        });
    } else {
      dispatch(searching(false));
    }
  }, [searchQueryState]);

  return (
    <>
      <Row className={styles.container} justify="space-around">
        <Col span={8}>
          <Button
            onClick={() => {
              navigate('/app/dash');
              setCurrentSelection('Home');
              if (isSearching) {
                dispatch(searching(false));
              }
            }}
            type="ghost"
            className={styles.btn}
            style={{ width: '100%' }}
            data-cy="home-btn"
          >
            <HomeOutlined
              style={{ fontSize: '24px', color: 'white', opacity: currentSelection == 'Home' ? 1 : 0.5 }}
              data-cy="home-icon"
            />
          </Button>
        </Col>

        <Col span={8}>
          <Button
            onClick={() => {
              console.log('search featrure in progress');
              if (currentSelection !== 'Search') setCurrentSelection('Search');
              else setSearchOpen(!searchOpen);
            }}
            type="ghost"
            className={styles.btn}
            style={{ width: '100%' }}
            data-cy="search-btn"
          >
            <SearchOutlined
              className={styles.icon}
              style={{ fontSize: '24px', color: 'white', opacity: currentSelection == 'Search' ? 1 : 0.5 }}
              data-cy="search-icon"
            />
          </Button>
        </Col>
        <Col span={8}>
          <Dropdown
            menu={{ items: userMenuItems }}
            onOpenChange={() => {
              setUserMenuOpen(!userMenuOpen);
            }}
          >
            <Button
              onClick={() => {
                setCurrentSelection('Profile');
                if (userMenuOpen) {
                  navigate(`/app/user/?id=${userId}`);
                }
              }}
              type="ghost"
              className={styles.btn}
              style={{ width: '100%' }}
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
          </Dropdown>
        </Col>
      </Row>
      <Row style={{ position: 'absolute', width: '100vw' }} justify="center">
        <Col span={18}>
          <Input
            type="search"
            placeholder="Search"
            onChange={(e) => {
              dispatch(searchQuery(e.target.value));
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setSearchOpen(false);
              }
            }}
            prefix={
              <CloseOutlined
                onClick={() => {
                  setSearchOpen(false);
                }}
                data-cy="mobile-search-bar-close"
              />
            }
            suffix={<SearchOutlined />}
            autoFocus
            value={searchQueryState as string}
            style={{
              top: '20vh',
              boxShadow: '0 0 0 max(100vh, 100vw) rgba(0, 0, 0, .3)',
              borderRadius: '40px',
              height: '5vh',
              outlineColor: 'var(--primary)',
              fontSize: '17px',
            }}
            className={searchOpen ? styles['search-bar-visible'] : styles['search-bar-hidden']}
            ref={inputRef}
            data-cy="mobile-search-bar"
          />
        </Col>
      </Row>
    </>
  );
}
