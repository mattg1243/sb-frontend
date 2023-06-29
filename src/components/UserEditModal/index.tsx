import { useState } from 'react';
import type { User } from '../../types';
import { Button, Modal, Form, Input, Space, Spin } from 'antd';
import { EditOutlined, LinkOutlined } from '@ant-design/icons';
import { updateUserReq } from '../../lib/axios';
import { AlertObj } from '../../types/alerts';
import CustomAlert from '../CustomAlert';
import styles from './UserEditModal.module.css';

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
  const [link, setLink] = useState<string>(user.link);
  // TODO: put this into the axios lib file
  const updateUserInfo = async () => {
    setIsLoading(true);
    const data = {
      ...user,
      bio,
      avatar,
      link,
    };
    try {
      const response = await updateUserReq(data);
      setUserInfo(data);
      if (response.status === 200) {
        setIsOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setAlert({ status: 'error', message: 'There was an error updating your user profile.' });
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
          onClick={() => {
            setIsOpen(true);
          }}
          style={{ fontSize: '3vh' }}
        />
      ) : (
        <Button
          type="ghost"
          onClick={() => {
            setIsOpen(true);
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
                defaultValue={user.link}
                maxLength={200}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
              />
            </Form.Item>
            {alert ? <CustomAlert status={alert.status} message={alert.message} /> : null}
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
