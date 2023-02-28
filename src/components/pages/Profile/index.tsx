import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout, Avatar, Row, Space, Col, Button, Modal, Image, Progress } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { UserOutlined, YoutubeFilled, AppleFilled, TwitterCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import DashRow from '../../DashRow';
import useGetBeats from '../../../hooks/useGetBeats';
import { Beat } from '../../../types';
import { cdnHostname } from '../../../config/routing';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import LoadingPage from '../Loading';
import Navbar from '../../Navbar';
import { User } from '../../../types/user';
import UserEditModal from '../../UserEditModal';
import { AlertObj } from '../../../types/alerts';
import { getUserReq, updateAvatarReq } from '../../../lib/axios';
import UploadButton from '../../UploadButton';
import CustomAlert from '../../CustomAlert';
import PlaybackButtons from '../../PlaybackButtons';
import defaultAvatar from '../../../assets/default_avatar_white.png';
import styles from './Profile.module.css';

export default function Profile() {
  const searchParams = useSearchParams()[0];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const [trackPlaying, setTrackPlaying] = useState<Beat>();
  const [userInfo, setUserInfo] = useState<User | null>();
  const [newAvatar, setNewAvatar] = useState<File>();
  const [newAvatarModalOpen, setNewAvatarModalOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>();

  const userId = searchParams.get('id') || '';
  const isCurrentUser = userId === getUserIdFromLocalStorage();
  const { beats } = useGetBeats(userId);

  useEffect(() => {
    getUserReq(userId)
      .then((res) => {
        setUserInfo(res.data);
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
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
          status: 'error',
          message: updateAvatarRes.data.message || 'Error occured while updating your profile picture.',
        });
      }
      setUpdateIsLoading(false);
    } else {
      console.log('No new avatar attached.');
      setAlert({ status: 'warning', message: 'No new profile picture attached' });
    }
  };

  const handleCancelModal = () => {
    setNewAvatarModalOpen(false);
    setNewAvatar(undefined);
  };

  return isLoading || !userInfo ? (
    <LoadingPage />
  ) : (
    <>
      <Row style={{ margin: '5rem 5rem', width: '77%' }}>
        <Space direction="horizontal" style={{ alignContent: 'flex-start' }}>
          <Space direction="vertical" style={{ textAlign: 'center' }}>
            {isCurrentUser ? (
              <>
                <div className={styles.container}>
                  <Avatar
                    src={`${cdnHostname}/${userInfo.avatar}`}
                    onClick={() => {
                      setNewAvatarModalOpen(true);
                    }}
                    className={styles.useravatar}
                  />
                  <div
                    onClick={() => {
                      setNewAvatarModalOpen(true);
                    }}
                    className={styles.middle}
                  >
                    <div className={styles.texto}>+</div>
                  </div>
                </div>
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
                    />
                    {newAvatar ? <CheckCircleOutlined style={{ margin: '0 1rem', fontSize: '1rem' }} /> : null}
                    {updateIsLoading ? <Progress percent={uploadProgress as number} /> : null}
                    {alert ? <CustomAlert message={alert.message} status={alert.status} /> : null}
                  </div>
                </Modal>
                <UserEditModal user={userInfo} setUserInfo={setUserInfo} />
              </>
            ) : (
              <>
                <Avatar
                  src={
                    <Image
                      src={`${cdnHostname}/${userInfo.avatar}`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = defaultAvatar;
                      }}
                      preview={false}
                    />
                  }
                  className={styles.useravatar}
                  size={256}
                />
                <Button type="ghost" style={{ border: 'solid', margin: '5px' }}>
                  Follow
                </Button>
              </>
            )}
          </Space>
          <Col style={{ margin: '0rem 5rem', textAlign: 'start' }}>
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
            <Space direction="horizontal" style={{ margin: '0rem 1rem', textAlign: 'start', justifyContent: 'center' }}>
              <YoutubeFilled
                style={{ fontSize: '1.5rem' }}
                onClick={() => {
                  window.open(
                    userInfo.linkedSocials.youtube
                      ? `https://www.youtube.com/@${userInfo.linkedSocials.youtube}`
                      : 'https://www.youtube.com'
                  );
                }}
              />
              <TwitterCircleFilled
                style={{ fontSize: '1.5rem' }}
                onClick={() => {
                  window.open(
                    userInfo.linkedSocials.youtube
                      ? `https://www.twitter.com/${userInfo.linkedSocials.twitter}`
                      : 'https://www.twitter.com'
                  );
                }}
              />
              <AppleFilled
                style={{ fontSize: '1.5rem' }}
                onClick={() => {
                  window.open(
                    userInfo.linkedSocials.appleMusic ? userInfo.linkedSocials.appleMusic : 'https://music.apple.com/'
                  );
                }}
              />
            </Space>
          </Col>
        </Space>
      </Row>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {beats ? (
          beats.map((beat) => (
            <DashRow
              beat={beat}
              onClick={() => {
                setTrackPlaying(beat);
              }}
              editable={isCurrentUser}
            />
          ))
        ) : (
          <h3>This user hasn't uploaded any beats yet.</h3>
        )}
        {trackPlaying ? (
          <PlaybackButtons
            trackTitle={trackPlaying ? trackPlaying.title : ''}
            trackArtist={trackPlaying ? trackPlaying.artistName : ''}
            trackSrcUrl={trackPlaying ? `${cdnHostname}/${trackPlaying.audioKey}` : ''}
          />
        ) : null}
      </div>
    </>
  );
}
