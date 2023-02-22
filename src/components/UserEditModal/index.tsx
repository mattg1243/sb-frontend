import { useState } from "react";
import type { User } from "../../types";
import { Button, Modal, Form, Input, Space, Spin } from "antd";
import { AppleOutlined, InstagramOutlined, LinkOutlined, SoundOutlined, TwitterOutlined, YoutubeOutlined } from "@ant-design/icons";
import { ILinkedSocials } from '../../types/user';
import { updateUserReq } from '../../lib/axios';
import { AlertObj } from '../../types/alerts';
import CustomAlert from "../CustomAlert";

interface IUserEditModal {
  user: User,
  setUserInfo: Function
}

export default function UserEditModal(props: IUserEditModal) {
  const { user, setUserInfo } = props;
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertObj>();
  const [artistName, setArtistName] = useState<string>(user.artistName);
  const [bio, setBio] = useState<string>(user.bio);
  const [avatar, setAvatar] = useState<File | string>(user.avatar);
  // TODO: consolidate these into a single state variable
  const [twitter, setTwitter] = useState<string>(user.linkedSocials.twitter);
  const [youtube, setYouTube] = useState<string>(user.linkedSocials.youtube);
  const [instagram, setInstagram] = useState<string>(user.linkedSocials.instagram);
  const [spotify, setSpotify] = useState<string>(user.linkedSocials.spotify);
  const [appleMusic, setAppleMusic] = useState<string>(user.linkedSocials.appleMusic);
  const [soundcloud, setSoundcloud] = useState<string>(user.linkedSocials.soundcloud);
  const [linkedSocials, setLinkedSocials] = useState<ILinkedSocials>();
  // TODO: put this into the axios lib file
  const updateUserInfo = async () => {
    setIsLoading(true);
    const data = {
      ...user,
      artistName,
      bio,
      avatar,
      linkedSocials: {
        twitter,
        youtube,
        appleMusic,
        instagram,
        spotify, 
        soundcloud
      },
    }
    try {
      const response = await updateUserReq(data);
      setUserInfo(data);
      if (response.status === 200) { setIsOpen(false); window.location.reload(); };
    } catch (err) {
      console.error(err);
      setAlert({ status: 'error', message: 'There was an error updating your user profile.' });
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    setIsOpen(false);
  }

  const handleLinkedSocialsChange = (vals: any) => {
    setLinkedSocials(vals);
  }

  // const possibleLinkedSocials = ['Twitter', 'Instagram', 'Apple Music', 'Spotify', 'Soundcloud', 'YouTube'];
  // const linkedSocialOptions = possibleLinkedSocials.map((val) => ({ label: val, option: val}));
  const socialInputIcons = {
    'Twitter': <TwitterOutlined />,
    'Instagram': <InstagramOutlined />,
    'Apple Music': <AppleOutlined />,
    'Spotify': <SoundOutlined />,
    'Soundcloud': <SoundOutlined />,
    'YouTube': <YoutubeOutlined />,
  }

  const { TextArea } = Input;

  return (
    <>
      <Button type='ghost' style={{ border: 'solid', margin: '5px' }} onClick={() => { setIsOpen(true); }} >Edit Profile</Button>
      <Modal 
      open={isOpen}
      onCancel={handleCancel} 
      footer={[ 
        <Button key='cancel' onClick={handleCancel} >Cancel</Button>,
        <Button key='save' type='primary' onClick={updateUserInfo} style={{ background: 'var(--primary)', color: 'black' }} >Save Changes</Button>
        ]}
      >
      <Spin spinning={isLoading} >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ alignContent: 'center' }}
        >
          <Form.Item label='Artist Name' name='artist-name'>
            <Input defaultValue={user.artistName } onChange={(e) => { setArtistName(e.target.value)}} />
          </Form.Item>
          <Form.Item label='Bio' name='bio'>
            <TextArea rows={4} spellCheck={false} defaultValue={user.bio} maxLength={140} showCount={true} onChange={(e) => {setBio(e.target.value)}} />
          </Form.Item>
          <Form.Item label='Socials' name='socials' tooltip='Paste a link to your social media profiles here.'>
            <Space direction="vertical" size='large' style={{ width: '100%' }}>
              {/* <Select 
                placeholder="Linked Socials"
                options={linkedSocialOptions}
                defaultValue={linkedSocials}
                mode='multiple'
                maxTagCount={3}
                onChange={handleLinkedSocialsChange}
              />
              {possibleLinkedSocials ? possibleLinkedSocials.map((social) => {
                  return (<Input defaultValue={'Default value'} addonAfter={socialInputIcons['Twitter']}/>)
                }) :
                null
              } */}
              <Input defaultValue={twitter} onChange={(e) => { setTwitter(e.target.value) }} prefix={'@'} addonAfter={socialInputIcons['Twitter']}/>
              <Input defaultValue={youtube} onChange={(e) => { setYouTube(e.target.value) }} prefix={'@'} addonAfter={socialInputIcons['YouTube']}/>
              <Input defaultValue={appleMusic} onChange={(e) => { setAppleMusic(e.target.value) }} prefix={<LinkOutlined />} addonAfter={socialInputIcons['Apple Music']}/>
            </Space>
          </Form.Item>
          {alert ? <CustomAlert status={alert.status} message={alert.message} /> : null}
        </Form>
      </Spin>
    </Modal>
    </>
  )
}