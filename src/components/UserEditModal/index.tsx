import { useState } from 'react';
import type { User } from '../../types';
import { Button, Modal, Form, Input, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { updateUserReq } from '../../lib/axios';
import { AlertObj } from '../../types/alerts';
import CustomAlert from '../CustomAlert';
import styles from './UserEditModal.module.css';
import { AxiosError } from 'axios';
import { ensureLoggedIn } from '../../utils/auth';
import ReactGA from 'react-ga4';

interface IUserEditModal {
  user: User;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null | undefined>>;
}

const isMobile = window.innerWidth < 480;

export default function UserEditModal(props: IUserEditModal) {
  const { user, setUserInfo } = props;
  const avatar = user.avatar;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>();
  const [bio, setBio] = useState<string>(user.bio);
  const [socialLink, setSocialLink] = useState<string>(user.socialLink);
  // TODO: put this into the axios lib file
  const updateUserInfo = async () => {
    setIsLoading(true);
    const data = {
      ...user,
      bio,
      avatar,
      socialLink,
    };
    try {
      const response = await updateUserReq(data);
      setUserInfo(data);
      if (response.status === 200) {
        setIsOpen(false);
        ReactGA.event('user_update', { user_id: user._id });
        window.location.reload();
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data.message) {
        setAlert({ type: 'error', message: err.response.data.message });
      } else {
        setAlert({ type: 'error', message: 'There was an error updating your user profile' });
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const { TextArea } = Input;

  return (
    <>
      {isMobile ? (
        <EditOutlined
          onClick={async () => {
            try {
              await ensureLoggedIn();
              setIsOpen(true);
            } catch (err) {
              console.error(err);
            }
          }}
          style={{ fontSize: '3vh' }}
        />
      ) : (
        <Button
          type="ghost"
          onClick={async () => {
            try {
              await ensureLoggedIn();
              setIsOpen(true);
            } catch (err) {
              console.error(err);
            }
          }}
          className={styles.btn}
        >
          Edit Profile
        </Button>
      )}
      <Modal
        open={isOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={updateUserInfo}
            style={{ background: 'var(--primary)', color: 'black' }}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Spin spinning={isLoading}>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" style={{ alignContent: 'center' }}>
            <Form.Item label="Bio" name="bio">
              <TextArea
                rows={4}
                spellCheck={false}
                defaultValue={user.bio}
                maxLength={140}
                showCount={true}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item label="Link" name="link" tooltip="Paste a link here.">
              <Input
                defaultValue={user.socialLink}
                maxLength={200}
                onChange={(e) => {
                  setSocialLink(e.target.value);
                }}
              />
            </Form.Item>
            {alert ? <CustomAlert type={alert.type} message={alert.message} /> : null}
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
