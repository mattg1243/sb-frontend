import { Header } from "antd/es/layout/layout";
import { Button, Menu, Image, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import UploadBeatModal from "../UploadBeatModal";
import logo from '../../assets/logo_four_squares.png';
import { UserOutlined } from "@ant-design/icons";

export default function Navbar() {

  const navigate = useNavigate();

  return (
      <Header style={{ width: '100%', margin: 0, top: 100, background: 'black' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ background: 'black', marginBottom: '3rem', width: '100%' }}
        >
          <Menu.Item>
            <Image height='50px' src={logo} preview={false} onClick={() => { navigate('/') }}/>
          </Menu.Item>
          <Menu.Item key="upload">
            <UploadBeatModal />
          </Menu.Item>
          <Menu.Item key="beats">
            <Button type='ghost' onClick={() => { navigate('/beats') }} style={{ color: 'white' }}>Beats</Button>
          </Menu.Item>
          <Menu.Item key="settings">
            <Button type='ghost' onClick={() => { navigate('/settings') }} style={{ color: 'white' }}>Settings</Button>
          </Menu.Item>
          <Menu.Item key="about">
            <Button type='ghost' onClick={() => { navigate('/about') }} style={{ color: 'white' }}>About</Button>
          </Menu.Item>
          <Menu.Item key="profile" style={{ marginLeft: 'auto' }}>
            <Avatar size={48} icon={<UserOutlined style={{ fontSize: '1.5rem' }} />} style={{ border: 'solid 3px', borderColor: 'var(--primary)' }} onClick={() => { navigate('/user')}}/>
          </Menu.Item>
        </Menu>
      </Header>
  )
}