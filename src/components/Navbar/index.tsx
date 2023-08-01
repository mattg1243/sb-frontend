import { useEffect, useState } from 'react';
import { Header } from 'antd/es/layout/layout';
import { Button, Menu, Image, Avatar, Dropdown, MenuProps, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UploadBeatModal from '../BeatUploadModal';
import logo from '../../assets/orangelogo.png';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { logoutUserReq, getUserAvatarReq } from '../../lib/axios';
import axios from 'axios';
import gatewayUrl, { cdnHostname } from '../../config/routing';
import styles from './Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  beats,
  searching,
  users,
  searchQuery,
  selectSearchBeatFilters,
  ISearchBeatFilters,
  selectSearchQuery,
  searchFilters,
  searchIsLoading,
} from '../../reducers/searchReducer';
import { RootState } from '../../store';

export default function Navbar() {
  const [avatarUrl, setAvatarUrl] = useState();
  const currentUserId = getUserIdFromLocalStorage();

  const onProfilePage = window.location.pathname.includes('/app/user');

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
  const dispatch = useDispatch();

  const searchBeatFiltersState = useSelector<RootState, ISearchBeatFilters | null>((state) =>
    selectSearchBeatFilters(state)
  );
  const searchQueryState = useSelector<RootState, string | null>((state) => selectSearchQuery(state));

  useEffect(() => {
    if (currentUserId) {
      getUserAvatarReq(currentUserId)
        .then((res) => {
          setAvatarUrl(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [currentUserId]);

  useEffect(() => {
    let searchUrl = `${gatewayUrl}/beats/search?`;
    if (searchQueryState) {
      if (!searchUrl.endsWith('?')) {
        searchUrl += '&';
      }
      searchUrl += `search=${searchQueryState}`;
    }
    if (searchBeatFiltersState) {
      dispatch(searching(true));
      dispatch(searchIsLoading(true));
      if (searchBeatFiltersState.genre) {
        if (!searchUrl.endsWith('?')) {
          searchUrl += '&';
        }
        searchUrl += `genre=${searchBeatFiltersState.genre}`;
      }
      if (searchBeatFiltersState.key) {
        if (!searchUrl.endsWith('?')) {
          searchUrl += '&';
        }
        searchUrl += `key=${searchBeatFiltersState.key}`;
      }
      axios
        .get(searchUrl)
        .then((res) => {
          dispatch(beats(res.data.beats));
        })
        .then(() => {
          dispatch(searchIsLoading(false));
        });
    }
  }, [searchBeatFiltersState, searchQueryState]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      dispatch(searching(false));
      dispatch(searchQuery(null));
      dispatch(searchFilters(null));
      dispatch(users(null));
      dispatch(beats(null));
    } else {
      try {
        dispatch(searching(true));
        dispatch(searchQuery(e.target.value));
        let beatSearchUrl = `${gatewayUrl}/beats/search?search=${e.target.value}`;
        const userSearchUrl = `${gatewayUrl}/user/search?search=${e.target.value}`;
        if (onProfilePage) {
          beatSearchUrl += `&artist=${currentUserId}`;
        }
        if (searchBeatFiltersState) {
          if (searchBeatFiltersState.genre) {
            beatSearchUrl += `&genre=${searchBeatFiltersState.genre}`;
          }
          if (searchBeatFiltersState.key) {
            beatSearchUrl += `&key=${searchBeatFiltersState.key}`;
          }
        }
        dispatch(searchIsLoading(true));
        const beatSearchResPromise = axios.get(beatSearchUrl);
        const userSearchResPromise = axios.get(userSearchUrl);
        const [beatSearchRes, userSearchRes] = await Promise.all([beatSearchResPromise, userSearchResPromise]);
        dispatch(beats(beatSearchRes.data.beats));
        dispatch(users(userSearchRes.data.users));
        dispatch(searchIsLoading(false));
        console.log(beatSearchRes.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Header
      style={{
        width: '100%',
        top: 0,
        background: 'black',
        position: 'fixed',
        zIndex: 1,
        boxShadow: '0px 5px rgb(232, 162, 21)',
      }}
    >
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
        <Menu.Item key="profile" style={{ marginLeft: 'auto', padding: '0 2vw' }} className={styles['menu-item']}>
          <Space size={62}>
            <Input
              type="text"
              style={{ borderRadius: '40px', width: '15vw' }}
              placeholder="Search"
              suffix={<SearchOutlined />}
              onChange={(e) => {
                handleSearchChange(e);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && window.location.pathname === '/') {
                  navigate('/app/dash');
                }
              }}
              value={searchQueryState as string}
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
                className="avatar"
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
