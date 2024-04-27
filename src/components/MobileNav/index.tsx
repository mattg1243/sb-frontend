import { Button, Row, Col, Input, InputRef, MenuProps, Dropdown } from 'antd';
import { CloseOutlined, HomeOutlined, SearchOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './MobileNav.module.css';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import { useEffect, useRef, useState } from 'react';
import { logoutUserReq } from '../../lib/axios';
import UploadBeatModal from '../BeatUploadModal';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface IMobileNavProps {
  testUserId?: string;
}

export default function MobileNav(props: IMobileNavProps) {
  const [currentSelection, setCurrentSelection] = useState<'Home' | 'Search' | 'Upload' | 'Profile'>('Home');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userId = getUserIdFromLocalStorage();
  const inputRef = useRef<InputRef>(null);
  const currentUserId = props.testUserId || getUserIdFromLocalStorage();
  let onBeatPage = false;

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
      key: 'account',
      label: (
        <Button type="ghost" href={`/app/account`} data-cy="mobile-account-menu-opt">
          Account
        </Button>
      ),
    },
    {
      key: 'subscribe',
      label: (
        <Button type="ghost" href={`/subscriptions`} data-cy="mobile-subscribe-menu-opt">
          Subscribe
        </Button>
      ),
    },
    {
      key: 'faq',
      label: (
        <Button type="ghost" href={`/FAQ`} data-cy="mobile-faq-menu-opt">
          FAQ
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

  const searchDivRef = useRef(null);
  useOutsideClick(searchDivRef, setSearchOpen);

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
    onBeatPage = window.location.pathname == '/app/beat';
  }, [location]);

  if (!onBeatPage) {
    return (
      <>
        <Row className={styles.container} justify="space-around">
          <Col span={6}>
            <Button
              onClick={() => {
                navigate('/app/dash');
                setCurrentSelection('Home');
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

          <Col span={6}>
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
          <Col span={6}>
            <UploadBeatModal
              btn={
                <Button
                  type="ghost"
                  className={styles.btn}
                  style={{ width: '100%' }}
                  onClick={() => setUploadModalOpen(true)}
                  data-cy="upload-btn"
                >
                  <UploadOutlined
                    style={{ fontSize: '24px', color: 'white', opacity: currentSelection == 'Upload' ? 1 : 0.5 }}
                  />
                </Button>
              }
              isOpenParent={uploadModalOpen}
              setIsOpenParent={setUploadModalOpen}
            />
          </Col>
          <Col span={6}>
            <Dropdown
              menu={{ items: currentUserId ? userMenuItems : undefined }}
              onOpenChange={() => {
                currentUserId ? setUserMenuOpen(!userMenuOpen) : navigate('/login');
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
            <div ref={searchDivRef}>
              <Input
                type="search"
                placeholder="Search"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setSearchOpen(false);
                    navigate(`/app/search?query=${searchQuery}`);
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
                value={searchQuery as string}
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
            </div>
          </Col>
        </Row>
        <UploadBeatModal />
      </>
    );
  } else {
    return <></>;
  }
}
