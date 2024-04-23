import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Avatar, Row, Space, Col, Button, Modal, Image, Progress, Statistic, Divider } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DashRow from '../../DashRow';
import useGetBeats, { IUseGetBeatsOptions } from '../../../hooks/useGetBeats';
import { imgCdnHostName } from '../../../config/routing';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import LoadingPage from '../Loading';
import { User } from '../../../types/user';
import UserEditModal from '../../UserEditModal';
import { AlertObj } from '../../../types/alerts';
import { getFollowersReq, getFollowingReq, getUserReq, updateAvatarReq } from '../../../lib/axios';
import UploadButton from '../../UploadButton';
import CustomAlert from '../../CustomAlert';
import defaultAvatar from '../../../assets/default_avatar_white.png';
import styles from './Profile.module.css';
import FollowButton from '../../FollowButton';
import { useDispatch, useSelector } from 'react-redux';
import { playback } from '../../../reducers/playbackReducer';
import type { Beat } from '../../../types';
import { RootState } from '../../../store';
import { selectBeats } from '../../../reducers/searchReducer';
import PlaybackButtons from '../../PlaybackButtons';
import { UserMetadata } from '../../../lib/helmet';

const isMobile = window.innerWidth < 480;

export default function Profile() {
  const searchParams = useSearchParams()[0];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const [userInfo, setUserInfo] = useState<User | null>();
  const [followers, setFollowers] = useState<Array<string>>();
  const [following, setFollowing] = useState<Array<string>>();
  const [newAvatar, setNewAvatar] = useState<File | Blob>();
  const [newAvatarModalOpen, setNewAvatarModalOpen] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>();

  const userId = searchParams.get('id') || '';
  const isCurrentUser = userId === getUserIdFromLocalStorage();

  const getBeatsOptions: IUseGetBeatsOptions = {
    userId: userId as string,
  };
  const { beats } = useGetBeats(getBeatsOptions);
  const dispatch = useDispatch();
  const beatsFromSearch = useSelector<RootState, Beat[] | null>((state) => selectBeats(state));
  // this could probably be optimized to run async
  useEffect(() => {
    getUserReq(userId)
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    getFollowersReq(userId)
      .then((res) => {
        setFollowers(res.data.followers);
      })
      .catch((err) => {
        console.error(err);
      });
    getFollowingReq(userId)
      .then((res) => setFollowing(res.data.following))
      .then(() => setIsLoading(false))
      .catch((err) => console.error(err));
  }, [userId]);

  const updateAvatar = async () => {
    if (newAvatar) {
      setUpdateIsLoading(true);
      const newAvatarForm = new FormData();
      newAvatarForm.append('newAvatar', newAvatar);
      const updateAvatarRes = await updateAvatarReq(newAvatarForm, setUploadProgress);
      console.log(updateAvatarRes);
      if (updateAvatarRes.status === 200) {
        setNewAvatarModalOpen(false);
        window.location.reload();
      } else {
        setAlert({
          type: 'error',
          message: updateAvatarRes.data.message || 'Error occured while updating your profile picture.',
        });
      }
      setUpdateIsLoading(false);
    } else {
      console.log('No new avatar attached.');
      setAlert({ type: 'warning', message: 'No new profile picture attached' });
    }
  };

  const handleCancelModal = () => {
    setNewAvatarModalOpen(false);
    setNewAvatar(undefined);
  };

  useEffect(() => {
    if (beatsFromSearch) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  });

  return isLoading || !userInfo ? (
    <LoadingPage />
  ) : (
    <>
      <UserMetadata
        artistName={userInfo.artistName}
        imgSrc={`${imgCdnHostName}/fit-in/400x400/${userInfo.avatar}`}
        url={window.location.href}
      />
      <Row className={styles['profile-info-row']}>
        <Space direction="horizontal" className={styles['profile-info-space']}>
          <Space direction="vertical" style={{ textAlign: 'center' }}>
            {isCurrentUser ? (
              <>
                <div className={styles.container}>
                  <Avatar
                    src={`${imgCdnHostName}/fit-in/400x400/${userInfo.avatar}`}
                    onClick={() => {
                      setNewAvatarModalOpen(true);
                    }}
                    className={styles.useravatar}
                    size={isMobile ? 140 : 256}
                    icon={userInfo.avatar ? undefined : <UserOutlined style={{ color: 'white', fontSize: '12vh' }} />}
                  />
                  <div
                    onClick={() => {
                      setNewAvatarModalOpen(true);
                    }}
                    className={styles.middle}
                  >
                    <div className={styles.texto}></div>
                  </div>
                </div>
                {isMobile ? (
                  <>
                    <UserEditModal user={userInfo} setUserInfo={setUserInfo} />
                    <h1 className={styles.username}>{userInfo.artistName}</h1>
                  </>
                ) : null}
                <Modal
                  key="Update Profile Picture"
                  open={newAvatarModalOpen}
                  onCancel={handleCancelModal}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}
                  footer={[
                    <Button onClick={handleCancelModal}>Cancel</Button>,
                    <Button
                      onClick={async () => {
                        await updateAvatar();
                      }}
                      style={{ background: 'var(--primary)' }}
                    >
                      Update
                    </Button>,
                  ]}
                >
                  <div style={{ padding: '3rem' }}>
                    <UploadButton
                      allowedFileType="image/*"
                      label="New Profile Pic"
                      disabled={updateIsLoading}
                      sideIcon={<UserOutlined />}
                      uploadStateSetter={setNewAvatar}
                      alertSetter={setAlert}
                    />
                    {newAvatar ? <CheckCircleOutlined style={{ margin: '0 1rem', fontSize: '1rem' }} /> : null}
                    {updateIsLoading ? <Progress percent={uploadProgress as number} /> : null}
                    {alert ? <CustomAlert message={alert.message} type={alert.type} /> : null}
                  </div>
                </Modal>
                {isMobile ? null : <UserEditModal user={userInfo} setUserInfo={setUserInfo} />}
              </>
            ) : (
              <div className={styles.container}>
                <Avatar
                  src={
                    <Image
                      src={`${imgCdnHostName}/fit-in/400x400/${userInfo.avatar}`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = defaultAvatar;
                      }}
                      preview={false}
                    />
                  }
                  className={styles.useravatar}
                  size={isMobile ? 140 : 256}
                />
                {isMobile ? (
                  <>
                    <h1 className={styles.username}>{userInfo.artistName}</h1>
                    <p className={styles.bio}>{userInfo.bio}</p>
                  </>
                ) : null}
                <FollowButton currentUser={getUserIdFromLocalStorage() as string} viewedUser={userId} />
              </div>
            )}
          </Space>
          {isMobile ? null : (
            <>
              <Col className={styles['text-col']}>
                <h1 className={styles.username}>{userInfo.artistName}</h1>
                <p className={styles.bio}>{userInfo.bio}</p>
                <p className={styles.bio} style={{ fontSize: '.8vw' }}>
                  Member since{' '}
                  {new Date(userInfo.created_at).toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <Space
                  direction="horizontal"
                  style={{ margin: '0rem 1rem', textAlign: 'start', justifyContent: 'center' }}
                >
                  <a className={styles.link} href={userInfo.socialLink} target="_blank">
                    {userInfo.socialLink}
                  </a>
                </Space>
              </Col>
              <Row className={styles.followers} gutter={isMobile ? 12 : 96}>
                <Col span={10}>
                  <Statistic title="Followers" value={followers ? followers.length : '0'} />
                </Col>
                <Col span={10}>
                  <Statistic title="Following" value={following ? following.length : '0'} />
                </Col>
              </Row>
            </>
          )}
        </Space>
      </Row>
      <Divider style={{ margin: '10px' }} />
      <PlaybackButtons />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className={styles.beats}
      >
        {beats && !isSearching ? (
          beats.map((beat) => (
            <DashRow
              beat={beat}
              onClick={() => {
                dispatch(playback(beat));
              }}
              buttonType={isCurrentUser ? 'edit' : 'download'}
            />
          ))
        ) : !beats ? (
          <h3>This user hasn't uploaded any beats yet.</h3>
        ) : null}
      </div>
    </>
  );
}
