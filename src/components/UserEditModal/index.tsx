import { useState } from "react";
import type { User } from "../../types";
import { Button, Modal, Form, Input, Space, Select } from "antd";
import axios from "axios";
import { AppleOutlined, InstagramOutlined, SoundOutlined, TwitterOutlined, YoutubeOutlined } from "@ant-design/icons";
import { ILinkedSocials } from '../../types/user';
import gatewayUrl from "../../config/routing";

interface IUserEditModal {
  user: User,
  setUserInfo: Function
}

export default function UserEditModal(props: IUserEditModal) {
  const { user, setUserInfo } = props;
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [artistName, setArtistName] = useState<string>(user.artistName);
  const [bio, setBio] = useState<string>(user.bio);
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
    const data = {
      ...user,
      artistName,
      bio,
      linkedSocials: {
        twitter,
        youtube,
        appleMusic
      },
      
    }
    try {
      const response = await axios.post(`${gatewayUrl}/user/update`, data, { 
        headers: { 'Content-Type': 'application/json', },
        withCredentials: true,
      });
      console.log('updated user info:\n', response.data);
      setUserInfo(data);
    } catch (err) {
      console.error(err);
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
        <Button key='save' type='primary' onClick={updateUserInfo} >Save Changes</Button>
        ]}
      >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item label='Artist Name' name='artist-name'>
          <Input defaultValue={user.artistName } onChange={(e) => { setArtistName(e.target.value)}} />
        </Form.Item>
        <Form.Item label='Bio' name='bio'>
          <TextArea rows={4} spellCheck={false} defaultValue={user.bio} maxLength={140} showCount={true} onChange={(e) => {setBio(e.target.value)}} />
        </Form.Item>
        <Form.Item label='Socials' name='tempo' tooltip='You can display up to 3 social media links on your profile page.'>
          <Space direction="vertical" size='large'>
            {/* <Select 
              placeholder="Genre Tags"
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
            <Input defaultValue={twitter} onChange={(e) => { setTwitter(e.target.value) }} addonAfter={socialInputIcons['Twitter']}/>
            <Input defaultValue={youtube} onChange={(e) => { setYouTube(e.target.value) }} addonAfter={socialInputIcons['YouTube']}/>
            <Input defaultValue={appleMusic} onChange={(e) => { setAppleMusic(e.target.value) }} addonAfter={socialInputIcons['Apple Music']}/>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
    </>
  )
}